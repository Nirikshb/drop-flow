import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { IssueTracker } from "./_components/issue-tracker";
import "./figmadesign.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assets",
  description: "Browse the assets uploaded to your Dropflow projects.",
};

export default function FigmaDesignPage() {
  return (
    <div className={`${inter.variable} ${dmSans.variable}`}>
      <IssueTracker />
    </div>
  );
}
