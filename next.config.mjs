/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a fully static site in ./out — deploy free to Vercel, Netlify, GitHub Pages, etc.
  output: "export",
  images: {
    // Required for static export (no Next.js image optimization server).
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
