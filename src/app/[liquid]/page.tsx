import { Header } from "@/components/header";

export default async function Page({
  params,
}: {
  params: Promise<{ liquid: string }>;
}) {
  const { liquid } = await params;
  console.log("this is " + liquid);

  return (
    <main className="bg-background">
      <Header />
      {liquid} Page
    </main>
  );
}
