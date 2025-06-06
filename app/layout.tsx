import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School dashboard",
  description: "School dashboard by Kacper Bajer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-primary-background text-white text-sm`}
      >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          draggable
          pauseOnHover
          theme="dark"
        />
        {children}
      </body>
    </html>
  );
}
