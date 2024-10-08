import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/themeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { NextUIProvider } from "@nextui-org/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Musica NextGen Music",
  description: "Made with 💖 ",
  icons: {
    icon: 'public\favicon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} min-h-screen overflow-x-hidden `}>
        <NextUIProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              color="hsl(253 91% 58%)"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px hsl(253 91% 58%),0 0 15px hsl(253 91% 58%)"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
        <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={1600}
              showAtBottom={false}
            />
            {/* <NextTopLoader /> */}
            {children}
            <Toaster />
            <ToastContainer />
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
