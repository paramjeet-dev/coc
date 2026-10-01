import { redirect } from "next/navigation";

export default async function PlayerIndexRedirect({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  redirect(`/player/${tag}/legends`);
}
