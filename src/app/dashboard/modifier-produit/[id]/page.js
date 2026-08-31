import EditProductCMS from "./EditProductCMS";

export const metadata = {
  title: "Modifier une Pièce | Dashboard Medlout Auto",
  robots: { index: false, follow: false },
};

export default async function Page({ params }) {
  const { id } = await params;
  return <EditProductCMS productId={id} />;
}
