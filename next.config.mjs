/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    // Batas upload gambar aplikasi adalah 2 MB (lib/uploads.js). Batas bawaan Server Actions hanya 1 MB,
    // jadi dinaikkan sedikit di atas 2 MB agar pesan validasi kita yang tampil, bukan error teknis.
    serverActions: { bodySizeLimit: "3mb" },
    viewTransition: true,
  },
};

export default nextConfig;