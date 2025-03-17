import { JetBrains_Mono, Montserrat } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
      <body
        className={`${geistSans.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
