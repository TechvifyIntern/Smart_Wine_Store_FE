import { notFound } from "next/navigation";
import PageClient from "./PageClient";

const ALLOWED_LIQUIDS = ["Wine", "Whisky"];

export default async function Page({
  params,
}: {
  params: Promise<{ liquid: string }>;
}) {
  const { liquid } = await params;

  if (!ALLOWED_LIQUIDS.includes(liquid)) {
    notFound(); // Hàm này sẽ render trang not-found.tsx của bạn
  }

  return <PageClient liquid={liquid} />;
}
