import { redirect } from 'next/navigation';

export default async function ProductEnglishRedirect({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/producto/${id}`);
}
