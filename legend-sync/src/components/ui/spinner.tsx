import { cn } from "cn";
import { Pattern } from "@/components/examples/c-spinner-10";

type Props = { label?: string; size?: "sm" | "md" | "lg"; className?: string };

const SIZE = {
  sm: "scale-75",
  md: "",
  lg: "scale-125",
} as const;

/** Animated loading dots (reui c-spinner-10) with an accessible status role. */
export function Spinner({ label = "Loading", size = "md", className }: Props) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center motion-reduce:[&_span]:animate-none", SIZE[size], className)}
    >
      <Pattern />
      <span className="sr-only">{label}</span>
    </span>
  );
}
