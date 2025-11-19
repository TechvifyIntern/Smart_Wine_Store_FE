import PageClient from "./PageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ liquid: string }>;
}) {
  const { liquid } = await params;

  return <PageClient liquid={liquid} />;
}
