import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
const inter = Inter({ subsets: ["latin"] });
import SessionWrapper from "@/components/SessionWrapper.js";

export const metadata = {
  title: "Get Me A Chai - Fund your projects with chai",
  description: "This website is a crowdfunding platform for chai creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white">
        <SessionWrapper>
          <Navbar />
          <div className="min-h-[89vh] bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white">
            {children}
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
