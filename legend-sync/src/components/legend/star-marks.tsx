/** Stars drawn as small diamonds, the same shape as the Legend Sync logo mark. */
export function StarMarks({ stars }: { stars: number }) {
  return (
    <span role="img" aria-label={`${stars} of 3 stars`} className="inline-flex items-center gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden
          className={`size-2.5 rotate-45 rounded-[2px] ${
            n <= stars ? "bg-gold-400" : "bg-ink-700"
          }`}
        />
      ))}
    </span>
  );
}
