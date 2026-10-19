import Link from "next/link";

const sections = [
  {
    t: "১. আমরা কী তথ্য সংগ্রহ করি",
    b: "অ্যাকাউন্ট খোলার সময় আপনার নাম, Gmail ঠিকানা, মোবাইল নম্বর ও পাসওয়ার্ড (এনক্রিপ্ট করে) সংরক্ষণ করি। Google দিয়ে লগইন করলে Google থেকে আপনার নাম, ইমেইল ও প্রোফাইল ছবি পাই — শুধু লগইনের জন্য। ডিপোজিট রিকোয়েস্টে টাকার পরিমাণ, পেমেন্ট মাধ্যম, সেন্ডার নম্বর ও ট্রানজেকশন আইডি সংরক্ষণ করি।",
  },
  {
    t: "২. তথ্য কীভাবে ব্যবহার করি",
    b: "আপনার তথ্য শুধু এই কাজে ব্যবহার হয়: অ্যাকাউন্ট যাচাই (OTP), লগইন, ডিপোজিট রিকোয়েস্ট প্রসেস, রেফারেল হিসাব ও অ্যাকাউন্ট সাপোর্ট। অন্য কোনো কাজে ব্যবহার করি না।",
  },
  {
    t: "৩. তথ্য কোথায় থাকে",
    b: "আপনার তথ্য নিরাপদে Google-এর সার্ভারে (Google Sheets ও Apps Script) সংরক্ষিত থাকে। পাসওয়ার্ড কখনোই খোলা অবস্থায় রাখা হয় না।",
  },
  {
    t: "৪. তৃতীয় পক্ষের সাথে শেয়ার",
    b: "আপনার ব্যক্তিগত তথ্য আমরা কারো কাছে বিক্রি করি না, ভাড়া দিই না। আইনগত বাধ্যবাধকতা ছাড়া তৃতীয় পক্ষের সাথে শেয়ার করা হয় না।",
  },
  {
    t: "৫. আপনার অধিকার",
    b: "আপনি চাইলে আপনার অ্যাকাউন্টের তথ্য দেখতে, সংশোধন করতে বা অ্যাকাউন্ট মুছে ফেলতে অনুরোধ করতে পারেন — নিচের ইমেইলে যোগাযোগ করুন।",
  },
  {
    t: "৬. যোগাযোগ",
    b: "গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্নে: merajhosenbayzid@gmail.com",
  },
];

export const metadata = {
  title: "প্রাইভেসি পলিসি — টাস্ক রিওয়ার্ড",
  description: "টাস্ক রিওয়ার্ডের গোপনীয়তা নীতি।",
};

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center">
        <span className="inline-flex w-16 h-16 btn-gradient rounded-[1.5rem] text-4xl items-center justify-center mx-auto shadow-lg shadow-rose/30">
          🔒
        </span>
        <h1 className="mt-4 text-3xl font-bold text-white">প্রাইভেসি পলিসি</h1>
        <p className="text-mist mt-1 text-sm">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>
      </div>

      <div className="mt-8 space-y-4">
        {sections.map((s) => (
          <div key={s.t} className="glass rounded-[1.5rem] p-6">
            <h2 className="font-bold text-white">{s.t}</h2>
            <p className="text-mist text-sm mt-2 leading-relaxed">{s.b}</p>
          </div>
        ))}
      </div>

      <p className="text-center mt-8 text-sm text-mist">
        <Link href="/" className="text-peach font-bold">← হোমে ফিরুন</Link>
      </p>
    </div>
  );
}
