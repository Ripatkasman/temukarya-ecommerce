import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata = {
  title: {
    default: "TemuKarya | Tempat Karya Lokal Bertemu Kepercayaan",
    template: "%s | TemuKarya",
  },
  description:
    "Jelajahi produk unik dari pelaku usaha lokal dan kreator independen di TemuKarya.",
  icons: { icon: "/brand/logo-mark.svg" },
};

export const viewport = {
  themeColor: "#174B3A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-btn focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
