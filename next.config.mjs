/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Batas upload gambar aplikasi adalah 2 MB (lib/uploads.js). Batas bawaan Server Actions hanya 1 MB,
    // jadi dinaikkan sedikit di atas 2 MB agar pesan validasi kita yang tampil, bukan error teknis.
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
