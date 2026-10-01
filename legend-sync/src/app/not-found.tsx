import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg pt-20">
      <h1 className="text-2xl font-semibold tracking-tight">Nothing here</h1>
      <p className="mt-3 text-ink-300">That page does not exist. Search for a player to get started.</p>
      <Link href="/player" className="mt-6 inline-block text-gold-300 underline underline-offset-4">
        Find a player
      </Link>
    </div>
  );
}
