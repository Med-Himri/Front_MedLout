/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Old admin URLs → new admin pages
  async redirects() {
    return [
      { source: "/dashboard/catalogue", destination: "/dashboard/produits", permanent: true },
      { source: "/dashboard/ajouter-produit", destination: "/dashboard/produits/nouveau", permanent: true },
      { source: "/dashboard/ajouter-produit-ia", destination: "/dashboard/produits/ia", permanent: true },
      { source: "/dashboard/modifier-produit/:id", destination: "/dashboard/produits/:id", permanent: true },
    ];
  },
};

module.exports = nextConfig;
