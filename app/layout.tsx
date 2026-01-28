import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "고구마마켓 - 중고거래",
  description: "우리 동네 중고 직거래 마켓",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 antialiased">
        <Header />
        <main className="mx-auto max-w-screen-md pb-20 pt-14">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
