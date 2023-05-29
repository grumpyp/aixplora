import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Intelligent File Analysis | Unleash the Power of GPT",
  description:
    "Discover our cutting-edge desktop application that leverages the power of ChatGPT to revolutionize file analysis. Upload your files, and our AI-driven system will intelligently analyze them, providing accurate responses to your questions. Gain valuable insights, make informed decisions, and unlock the full potential of your data. Try our intelligent file analysis solution today and experience the future of AI-powered analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
