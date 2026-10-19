/**
 * TaskReward Backend — Google Apps Script
 * Real backend for https://task-reward-site.onrender.com
 *
 * Sheets (auto-created): Users, Deposits, OTPs
 * - OTP registration via Gmail (sent from the script owner's Gmail)
 * - Password + Google Sign-In login
 * - Deposit requests with admin approve/reject
 *
 * SETUP: paste this whole file into script.google.com → save →
 * run setupOnce() once (authorize) → Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone) → copy the /exec URL.
 */

// ================= CONFIG — edit if needed =================
var CONFIG = {
  ADMIN_EMAIL: "merajhosenbayzid@gmail.com", // Admin (your Gmail)
  GOOGLE_CLIENT_ID: "688604361585-lnb0dmbl5jc6ona8avhnub6094gmitf0.apps.googleusercontent.com", // Google Cloud OAuth Client ID
  TOKEN_SECRET: "tr-secret-change-to-random-2026", // change this to a long random string
  ACTIVATION_AMOUNT: 100,   // account activates on this deposit amount (or more)
  ACTIVATION_DAYS: 7,       // stays active for this many days
  REFERRER_BONUS_PCT: 5,    // referrer bonus %
  OTP_EXPIRY_MIN: 5,         // OTP expiry (minutes)
  OTP_MAX_ATTEMPTS: 5,       // wrong-attempt limit
  OTP_LOCK_MIN: 15,          // lockout time (minutes)
  OTP_RESEND_SEC: 60,        // resend cooldown (seconds)
  TOKEN_DAYS: 30,            // login session lifetime (days)
};
// ==============================================================

var SHEETS = {
  Users: ["email", "name", "phone", "passHash", "googleId", "emailVerified",
          "referralCode", "referredBy", "balance", "activeUntil",
          "createdAt", "sessionToken", "tokenExpiry"],
  Deposits: ["requestId", "email", "name", "amount", "method", "senderNo",
             "trxId", "status", "createdAt", "decidedAt", "decidedBy",
             "rejectReason"],
  OTPs: ["email", "otpHash", "expiresAt", "attempts", "used",
         "lastSentAt", "lockedUntil", "name", "phone", "passHash", "referral"],
};

// ---------- utilities ----------

function sha256hex(s) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ("0" + ((b < 0 ? b + 256 : b).toString(16))).slice(-2); }).join("");
}

function getSS() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SPREADSHEET_ID");
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create("TaskReward DB");
    props.setProperty("SPREADSHEET_ID", ss.getId());
  }
  return ss;
}

function getSheet(name) {
  var ss = getSS();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(SHEETS[name]);
  }
  return sh;
}

function findRow(sh, colIdx1Based, value) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var vals = sh.getRange(2, colIdx1Based, last - 1, 1).getValues();
  var v = String(value).toLowerCase();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).toLowerCase() === v) return i + 2;
  }
  return -1;
}

function rowToObj(sh, row) {
  var headers = SHEETS[sh.getName()];
  var vals = sh.getRange(row, 1, 1, headers.length).getValues()[0];
  var o = {};
  for (var i = 0; i < headers.length; i++) o[headers[i]] = vals[i];
  return o;
}

function publicUser(u) {
  return {
    email: u.email, name: u.name, phone: u.phone,
    emailVerified: u.emailVerified === true || u.emailVerified === "TRUE",
    referralCode: u.referralCode, referredBy: u.referredBy,
    balance: Number(u.balance) || 0,
    activeUntil: Number(u.activeUntil) || 0,
    createdAt: u.createdAt,
  };
}

function isGmail(email) {
  return /^[^\s@]+@gmail\.com$/i.test(String(email || "").trim());
}
function isBdPhone(phone) {
  return /^01[3-9]\d{8}$/.test(String(phone || "").trim());
}
function genReferralCode() {
  var sh = getSheet("Users");
  var code;
  do {
    code = "TR" + Math.floor(100000 + Math.random() * 900000);
  } while (findRow(sh, 7, code) !== -1);
  return code;
}
function genRequestId() {
  return "DR" + Date.now().toString(36).toUpperCase() +
    Math.floor(Math.random() * 1296).toString(36).toUpperCase();
}
function issueToken(email) {
  var token = sha256hex(email + "|" + Date.now() + "|" + Math.random() + "|" + CONFIG.TOKEN_SECRET);
  var sh = getSheet("Users");
  var r = findRow(sh, 1, email);
  if (r !== -1) {
    sh.getRange(r, 12).setValue(token);
    sh.getRange(r, 13).setValue(Date.now() + CONFIG.TOKEN_DAYS * 86400000);
  }
  return token;
}
function getUserByToken(token) {
  if (!token) return null;
  var sh = getSheet("Users");
  var r = findRow(sh, 12, token);
  if (r === -1) return null;
  var u = rowToObj(sh, r);
  if (Date.now() > Number(u.tokenExpiry)) return null;
  u._row = r;
  return u;
}
function requireAdmin(token) {
  var u = getUserByToken(token);
  if (!u) return { ok: false, error: "Login required." };
  if (String(u.email).toLowerCase() !== CONFIG.ADMIN_EMAIL.toLowerCase())
    return { ok: false, error: "Admin access required." };
  return { ok: true, user: u };
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("TaskReward API running ✅")
    .setMimeType(ContentService.MimeType.TEXT);
}

// one-time: creates sheets, prints spreadsheet URL in logs
function setupOnce() {
  getSheet("Users"); getSheet("Deposits"); getSheet("OTPs");
  Logger.log("Spreadsheet: " + getSS().getUrl());
}

// ---------- OTP ----------

function sendOtpEmail(email, name, otp) {
  var subject = "Task Reward — Email Verification Code";
  var body = "Hello " + name + ",\n\n" +
    "Your OTP code to verify your Task Reward account:\n\n" +
    "    " + otp + "\n\n" +
    "This code is valid for " + CONFIG.OTP_EXPIRY_MIN + " minutes.\n" +
    "Do not share this code with anyone.\n\n" +
    "— Task Reward Team";
  GmailApp.sendEmail(email, subject, body);
}

function actionRequestOtp(d) {
  var name = String(d.name || "").trim();
  var email = String(d.email || "").trim().toLowerCase();
  var phone = String(d.phone || "").trim();
  var password = String(d.password || "");
  var referral = String(d.referral || "").trim().toUpperCase();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!isGmail(email)) return { ok: false, error: "Only Gmail addresses are accepted (@gmail.com)." };
  if (!isBdPhone(phone)) return { ok: false, error: "A valid BD mobile number is required (01XXXXXXXXX)." };
  if (!password || password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  var ush = getSheet("Users");
  if (findRow(ush, 1, email) !== -1)
    return { ok: false, error: "An account with this Gmail already exists — please log in." };
  if (findRow(ush, 3, phone) !== -1)
    return { ok: false, error: "An account with this mobile number already exists." };
  if (referral && findRow(ush, 7, referral) === -1)
    return { ok: false, error: "Invalid referral code." };

  var osh = getSheet("OTPs");
  var r = findRow(osh, 1, email);
  var now = Date.now();
  if (r !== -1) {
    var o = rowToObj(osh, r);
    if (Number(o.lockedUntil) > now)
      return { ok: false, error: "Too many wrong attempts — try again later." };
    if (now - Number(o.lastSentAt) < CONFIG.OTP_RESEND_SEC * 1000)
      return { ok: false, error: "Code already sent — try again after 1 minute." };
  }

  var otp = String(Math.floor(100000 + Math.random() * 900000));
  var row = [email, sha256hex("otp$" + otp), now + CONFIG.OTP_EXPIRY_MIN * 60000,
             0, false, now, 0, name, phone, sha256hex("tr$" + password), referral];
  if (r !== -1) osh.getRange(r, 1, 1, row.length).setValues([row]);
  else osh.appendRow(row);

  try {
    sendOtpEmail(email, name, otp);
  } catch (e) {
    return { ok: false, error: "Could not send the email — try again later." };
  }
  return { ok: true, message: "A 6-digit code has been sent to your Gmail." };
}

function actionVerifyOtp(d) {
  var email = String(d.email || "").trim().toLowerCase();
  var otp = String(d.otp || "").trim();
  var osh = getSheet("OTPs");
  var r = findRow(osh, 1, email);
  if (r === -1) return { ok: false, error: "Click 'Verify Email' first." };
  var o = rowToObj(osh, r);
  var now = Date.now();
  if (o.used === true || o.used === "TRUE")
    return { ok: false, error: "This code has already been used — request a new one." };
  if (Number(o.lockedUntil) > now)
    return { ok: false, error: "Too many wrong attempts — try again later." };
  if (now > Number(o.expiresAt))
    return { ok: false, error: "Code expired — request a new code." };

  if (sha256hex("otp$" + otp) !== String(o.otpHash)) {
    var attempts = Number(o.attempts) + 1;
    osh.getRange(r, 4).setValue(attempts);
    if (attempts >= CONFIG.OTP_MAX_ATTEMPTS) {
      osh.getRange(r, 7).setValue(now + CONFIG.OTP_LOCK_MIN * 60000);
      return { ok: false, error: "Too many wrong attempts — try again after 15 minutes." };
    }
    return { ok: false, error: "Wrong verification code." };
  }

  // OTP correct — create the account (mark used FIRST so it can't be reused)
  osh.getRange(r, 5).setValue(true);
  var ush = getSheet("Users");
  if (findRow(ush, 1, email) !== -1)
    return { ok: false, error: "An account with this Gmail already exists — please log in." };
  var code = genReferralCode();
  ush.appendRow([email, o.name, o.phone, o.passHash, "", true, code,
                 o.referral || "", 0, 0,
                 Utilities.formatDate(new Date(), "Asia/Dhaka", "dd/MM/yyyy"), "", 0]);
  var token = issueToken(email);
  return { ok: true, token: token, user: publicUser(rowToObj(ush, findRow(ush, 1, email))) };
}

// ---------- auth ----------

function actionLogin(d) {
  var email = String(d.email || "").trim().toLowerCase();
  var password = String(d.password || "");
  var sh = getSheet("Users");
  var r = findRow(sh, 1, email);
  if (r === -1) return { ok: false, error: "No account found with this Gmail." };
  var u = rowToObj(sh, r);
  if (u.passHash && sha256hex("tr$" + password) !== String(u.passHash))
    return { ok: false, error: "Incorrect password." };
  if (!u.passHash && !u.googleId)
    return { ok: false, error: "Incorrect password." };
  var token = issueToken(email);
  return { ok: true, token: token, user: publicUser(rowToObj(sh, r)) };
}

function verifyGoogleToken(idToken) {
  if (CONFIG.GOOGLE_CLIENT_ID.indexOf("PASTE_") === 0)
    return { ok: false, error: "Google Client ID is not configured on the server." };
  var resp = UrlFetchApp.fetch(
    "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken),
    { muteHttpExceptions: true });
  if (resp.getResponseCode() !== 200) return { ok: false, error: "Google verification failed." };
  var info = JSON.parse(resp.getContentText());
  if (info.aud !== CONFIG.GOOGLE_CLIENT_ID)
    return { ok: false, error: "Google verification failed." };
  if (info.email_verified !== "true")
    return { ok: false, error: "Google email is not verified." };
  return { ok: true, email: String(info.email).toLowerCase(), name: info.name || "", googleId: info.sub };
}

function actionGoogleLogin(d) {
  var v = verifyGoogleToken(String(d.idToken || ""));
  if (!v.ok) return v;
  var sh = getSheet("Users");
  var r = findRow(sh, 1, v.email);
  if (r === -1) {
    // new account via Google — verified email, NOT active (deposit needed)
    var code = genReferralCode();
    sh.appendRow([v.email, v.name || v.email.split("@")[0], "", "",
                  v.googleId, true, code, "", 0, 0,
                  Utilities.formatDate(new Date(), "Asia/Dhaka", "dd/MM/yyyy"), "", 0]);
    r = findRow(sh, 1, v.email);
  } else {
    var u = rowToObj(sh, r);
    if (!u.googleId) sh.getRange(r, 5).setValue(v.googleId);
    if (!(u.emailVerified === true || u.emailVerified === "TRUE"))
      sh.getRange(r, 6).setValue(true);
  }
  var token = issueToken(v.email);
  return { ok: true, token: token, user: publicUser(rowToObj(sh, findRow(sh, 1, v.email))) };
}

function actionGetMe(d) {
  var u = getUserByToken(d.token);
  if (!u) return { ok: false, error: "Session expired — please log in again." };
  return { ok: true, user: publicUser(u) };
}

function actionLogout(d) {
  var u = getUserByToken(d.token);
  if (u) {
    var sh = getSheet("Users");
    sh.getRange(u._row, 12).setValue("");
    sh.getRange(u._row, 13).setValue(0);
  }
  return { ok: true };
}

// ---------- referrals ----------

function actionReferralInfo(d) {
  var u = getUserByToken(d.token);
  if (!u) return { ok: false, error: "Session expired — please log in again." };
  var sh = getSheet("Users");
  var last = sh.getLastRow();
  var total = 0, active = 0;
  var list = [];
  if (last >= 2) {
    var vals = sh.getRange(2, 1, last - 1, 13).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (String(vals[i][7]) === String(u.referralCode)) {
        total++;
        var isA = Number(vals[i][9]) > Date.now();
        if (isA) active++;
        list.push({ name: vals[i][1], active: isA });
      }
    }
  }
  return { ok: true, referralCode: u.referralCode, total: total, active: active, list: list };
}

// ---------- deposits ----------

function actionRequestDeposit(d) {
  var u = getUserByToken(d.token);
  if (!u) return { ok: false, error: "Session expired — please log in again." };
  var amount = Math.floor(Number(d.amount));
  var method = String(d.method || "").trim();
  var senderNo = String(d.senderNo || "").trim();
  var trxId = String(d.trxId || "").trim().toUpperCase();

  if (!amount || amount <= 0) return { ok: false, error: "Enter a valid amount." };
  if (["বিকাশ", "নগদ", "রকেট", "bKash", "Nagad", "Rocket"].indexOf(method) === -1)
    return { ok: false, error: "Select a payment method." };
  if (!isBdPhone(senderNo)) return { ok: false, error: "Enter a valid mobile number (01XXXXXXXXX)." };
  if (!trxId) return { ok: false, error: "Enter the transaction ID." };

  var sh = getSheet("Deposits");
  var last = sh.getLastRow();
  if (last >= 2) {
    var vals = sh.getRange(2, 1, last - 1, 12).getValues();
    for (var i = 0; i < vals.length; i++) {
      // duplicate TrxID (pending or approved) — rejected ones may be retried
      if (String(vals[i][6]).toUpperCase() === trxId && vals[i][7] !== "rejected")
        return { ok: false, error: "This transaction ID has already been used." };
      // same user already has a pending request
      if (String(vals[i][1]).toLowerCase() === String(u.email).toLowerCase() && vals[i][7] === "pending")
        return { ok: false, error: "You already have a pending request." };
    }
  }

  var requestId = genRequestId();
  sh.appendRow([requestId, u.email, u.name, amount, method, senderNo, trxId,
                "pending", Utilities.formatDate(new Date(), "Asia/Dhaka", "dd/MM/yyyy HH:mm"),
                "", "", ""]);
  return { ok: true, requestId: requestId,
           message: "Deposit request sent — balance will be added after admin approval." };
}

function actionMyDeposits(d) {
  var u = getUserByToken(d.token);
  if (!u) return { ok: false, error: "Session expired — please log in again." };
  var sh = getSheet("Deposits");
  var last = sh.getLastRow();
  var list = [];
  if (last >= 2) {
    var vals = sh.getRange(2, 1, last - 1, 12).getValues();
    for (var i = vals.length - 1; i >= 0; i--) {
      if (String(vals[i][1]).toLowerCase() === String(u.email).toLowerCase()) {
        list.push({ requestId: vals[i][0], amount: vals[i][3], method: vals[i][4],
                    trxId: vals[i][6], status: vals[i][7], createdAt: vals[i][8],
                    decidedAt: vals[i][9], rejectReason: vals[i][11] });
      }
    }
  }
  return { ok: true, deposits: list };
}

function actionAdminDeposits(d) {
  var a = requireAdmin(d.token);
  if (!a.ok) return a;
  var sh = getSheet("Deposits");
  var last = sh.getLastRow();
  var list = [];
  if (last >= 2) {
    var vals = sh.getRange(2, 1, last - 1, 12).getValues();
    for (var i = vals.length - 1; i >= 0; i--) {
      if (!d.status || d.status === "all" || vals[i][7] === d.status) {
        list.push({ requestId: vals[i][0], email: vals[i][1], name: vals[i][2],
                    amount: vals[i][3], method: vals[i][4], senderNo: vals[i][5],
                    trxId: vals[i][6], status: vals[i][7], createdAt: vals[i][8],
                    decidedAt: vals[i][9], decidedBy: vals[i][10], rejectReason: vals[i][11] });
      }
    }
  }
  return { ok: true, deposits: list };
}

function actionAdminDecide(d) {
  var a = requireAdmin(d.token);
  if (!a.ok) return a;
  var requestId = String(d.requestId || "").trim();
  var decision = String(d.decision || "").trim(); // approve | reject
  var reason = String(d.reason || "").trim();
  if (decision !== "approve" && decision !== "reject")
    return { ok: false, error: "Invalid decision." };
  if (decision === "reject" && !reason)
    return { ok: false, error: "Please write a rejection reason." };

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var dsh = getSheet("Deposits");
    var r = findRow(dsh, 1, requestId);
    if (r === -1) return { ok: false, error: "Request not found." };
    var dep = rowToObj(dsh, r);
    if (dep.status !== "pending")
  return { ok: false, error: "This request has already been " +
        (dep.status === "approved" ? "approved" : "rejected") + "." };

    var nowStr = Utilities.formatDate(new Date(), "Asia/Dhaka", "dd/MM/yyyy HH:mm");
    if (decision === "approve") {
      var ush = getSheet("Users");
      var ur = findRow(ush, 1, dep.email);
      if (ur === -1) return { ok: false, error: "User not found." };
      var uu = rowToObj(ush, ur);
      var amount = Number(dep.amount) || 0;
      // credit balance
      ush.getRange(ur, 9).setValue((Number(uu.balance) || 0) + amount);
      // activation per rules
      if (amount >= CONFIG.ACTIVATION_AMOUNT) {
        var base = Math.max(Date.now(), Number(uu.activeUntil) || 0);
        ush.getRange(ur, 10).setValue(base + CONFIG.ACTIVATION_DAYS * 86400000);
      }
      // referrer bonus 5%
      if (uu.referredBy) {
        var rr = findRow(ush, 7, uu.referredBy);
        if (rr !== -1) {
          var ref = rowToObj(ush, rr);
          ush.getRange(rr, 9).setValue((Number(ref.balance) || 0) +
            Math.round(amount * CONFIG.REFERRER_BONUS_PCT / 100));
        }
      }
      dsh.getRange(r, 8).setValue("approved");
      dsh.getRange(r, 10).setValue(nowStr);
      dsh.getRange(r, 11).setValue(a.user.email);
    } else {
      dsh.getRange(r, 8).setValue("rejected");
      dsh.getRange(r, 10).setValue(nowStr);
      dsh.getRange(r, 11).setValue(a.user.email);
      dsh.getRange(r, 12).setValue(reason);
    }
    return { ok: true, decision: decision };
  } finally {
    lock.releaseLock();
  }
}

function actionAdminUsers(d) {
  var a = requireAdmin(d.token);
  if (!a.ok) return a;
  var sh = getSheet("Users");
  var last = sh.getLastRow();
  var list = [];
  if (last >= 2) {
    var vals = sh.getRange(2, 1, last - 1, 13).getValues();
    for (var i = vals.length - 1; i >= 0; i--) {
      list.push({ name: vals[i][1], email: vals[i][0], phone: vals[i][2],
                  balance: Number(vals[i][8]) || 0,
                  referralCode: vals[i][6],
                  active: Number(vals[i][9]) > Date.now(),
                  emailVerified: vals[i][5] === true || vals[i][5] === "TRUE",
                  createdAt: vals[i][10] });
    }
  }
  return { ok: true, users: list };
}

// ---------- router ----------

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var action = String(d.action || "");
    var out;
    switch (action) {
      case "requestOtp": out = actionRequestOtp(d); break;
      case "verifyOtp": out = actionVerifyOtp(d); break;
      case "login": out = actionLogin(d); break;
      case "googleLogin": out = actionGoogleLogin(d); break;
      case "getMe": out = actionGetMe(d); break;
      case "logout": out = actionLogout(d); break;
      case "referralInfo": out = actionReferralInfo(d); break;
      case "requestDeposit": out = actionRequestDeposit(d); break;
      case "myDeposits": out = actionMyDeposits(d); break;
      case "adminDeposits": out = actionAdminDeposits(d); break;
      case "adminDecide": out = actionAdminDecide(d); break;
      case "adminUsers": out = actionAdminUsers(d); break;
      default: out = { ok: false, error: "Unknown action." };
    }
    return json(out);
  } catch (err) {
    return json({ ok: false, error: "Server error — try again later." });
  }
}
