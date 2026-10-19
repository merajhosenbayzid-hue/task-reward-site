import "./globals.css";
import Chrome from "../components/Chrome";

export const metadata = {
  title: "Task Reward — Work, Refer, Earn Rewards",
  description: "Task and reward website",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-night text-ink min-h-screen flex flex-col">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
