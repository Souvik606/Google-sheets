import { Nunito } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: "Sheets",
  description: "Absolutely not google sheets. 😊",
  icon: "/app-icons/favicon.ico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
