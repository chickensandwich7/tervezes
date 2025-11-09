import "~/styles/globals.css";
//import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
//import { ThemeProvider } from "../components/ui/theme-provider";
//import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "A7LD4W szakdoga",
  description: "kétoldali projekt menedzsment",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body>
        {/* <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider> */}

        {children}
      </body>
    </html>
  );
}