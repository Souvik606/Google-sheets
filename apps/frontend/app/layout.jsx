import { JetBrains_Mono, Nunito } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--jetbrains-mono",
});

export const metadata = {
  title: "Sheets",
  description: "Absolutely not google sheets. 😊",
  icons: {
    icon: "/app-icons/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetBrainsMono.variable}>
      <body className={`${nunito.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
