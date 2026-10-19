// Official support / community channels.
// To enable a channel, set its url and enabled:true below.
// Only channels with enabled:true AND a real url are rendered in the footer.
// Never invent fake links — leave url:"" until the real account exists.

function glyph(children, filled = true) {
  return function Icon() {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.8}
        strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    );
  };
}

const FacebookIcon = glyph(<path d="M13.5 21v-7h2.6l.5-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.4V4.8c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8.2v3h2.5v7h2.8z" />);
const YouTubeIcon = glyph(<>
  <rect x="2" y="5.5" width="20" height="13" rx="4" />
  <path d="M10.3 9.6v4.8L14.8 12z" fill="#070716" stroke="none" />
</>, false);
const InstagramIcon = glyph(<>
  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
  <circle cx="12" cy="12" r="4" />
  <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" stroke="none" />
</>, false);
const TelegramIcon = glyph(<path d="M21.5 4.5L3.2 11.3l6.1 2.1 2.3 6.9 4.1-4.2 5.8 2.1zM8.6 12.6l9.7-6.3-7.6 8.1z" />);
const WhatsAppIcon = glyph(<>
  <path d="M12 3.5a8.5 8.5 0 00-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1012 3.5z" />
  <path d="M9 8.8c.3-.7.7-.7 1 0l.6 1.4c.2.4 0 .8-.3 1.1l-.5.5c.5 1.2 1.4 2.1 2.6 2.6l.5-.5c.3-.3.7-.5 1.1-.3l1.4.6c.7.3.7.7 0 1-2.5 1.2-6.3-2.6-5.1-5.1z" fill="currentColor" stroke="none" />
</>, false);
const MessengerIcon = glyph(<path d="M12 3.5A8.5 8.5 0 003.6 12c0 2.6 1.2 4.9 3 6.4V21l2.7-1.5c.8.3 1.7.4 2.7.4a8.5 8.5 0 000-17zM8.8 12.6l2.2-3.4c.3-.4.9-.4 1.1 0l1.6 2.5 2-2.9-2.9 4.5c-.3.4-.9.4-1.1 0z" />);
const LinkedInIcon = glyph(<>
  <circle cx="7.2" cy="7.2" r="2.6" />
  <rect x="4.6" y="11" width="5.2" height="9.5" rx="1" />
  <path d="M13.5 20.5v-9.5h3.4v1.6c.7-1.1 1.9-1.8 3.4-1.8 2.4 0 4 1.6 4 4.4v5.3h-3.5v-4.9c0-1.3-.5-2.1-1.7-2.1-1.1 0-1.8.8-1.8 2.1v4.9z" />
</>);
const XIcon = glyph(<path d="M4.5 4.5l15 15M19.5 4.5l-15 15" />, false);
const DiscordIcon = glyph(<>
  <path d="M5.5 6h13a2 2 0 012 2v6.5a4 4 0 01-4 4l-2.3-1.9h-4.4L7.5 18.5a4 4 0 01-4-4V8a2 2 0 012-2z" />
  <circle cx="9.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
  <circle cx="14.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
</>, false);
const RedditIcon = glyph(<>
  <circle cx="12" cy="13.5" r="6" />
  <circle cx="9.7" cy="12.5" r="1.1" fill="#070716" stroke="none" />
  <circle cx="14.3" cy="12.5" r="1.1" fill="#070716" stroke="none" />
  <path d="M9.5 16c1.6 1 3.4 1 5 0" />
  <path d="M12 7.5V4.8M12 4.8L15.5 3.5" />
  <circle cx="16.5" cy="3.2" r="1.2" />
</>, false);
const TikTokIcon = glyph(<path d="M14.5 4v9.8a3.9 3.9 0 11-3.9-3.9c.3 0 .7 0 1 .1V7.6a7.3 7.3 0 00-1-.1 7.3 7.3 0 107.3 7.3V9.7c1 .8 2.3 1.2 3.6 1.2V7.5c-2 0-3.6-1.4-4-3.5z" />);

export const SOCIALS = [
  { id: "facebook", label: "Facebook", url: "", enabled: false, Icon: FacebookIcon },
  { id: "youtube", label: "YouTube", url: "", enabled: false, Icon: YouTubeIcon },
  { id: "instagram", label: "Instagram", url: "", enabled: false, Icon: InstagramIcon },
  { id: "telegram", label: "Telegram", url: "", enabled: false, Icon: TelegramIcon },
  { id: "whatsapp", label: "WhatsApp", url: "", enabled: false, Icon: WhatsAppIcon },
  { id: "messenger", label: "Messenger", url: "", enabled: false, Icon: MessengerIcon },
  { id: "linkedin", label: "LinkedIn", url: "", enabled: false, Icon: LinkedInIcon },
  { id: "x", label: "X", url: "", enabled: false, Icon: XIcon },
  { id: "discord", label: "Discord", url: "", enabled: false, Icon: DiscordIcon },
  { id: "reddit", label: "Reddit", url: "", enabled: false, Icon: RedditIcon },
  { id: "tiktok", label: "TikTok", url: "", enabled: false, Icon: TikTokIcon },
];
