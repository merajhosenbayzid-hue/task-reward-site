import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Background from "../components/Background";

export const metadata = {
  title: "টাস্ক রিওয়ার্ড — কাজ করুন, পুরস্কার জিতুন",
  description: "বাংলা টাস্ক ও রিওয়ার্ড ওয়েবসাইট",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-night text-ink min-h-screen flex flex-col">
        <Background />
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-28 pb-4 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
