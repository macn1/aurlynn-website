import "@fontsource-variable/sora";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@/styles/globals.css";
import "@/styles/pages.css";
import { Shell } from "@/components/layout/Shell";
import { site } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F6F3EF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="js">
      <body className="min-h-screen overflow-x-clip">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
