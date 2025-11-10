import { cn } from "~/utils/cn";

type Props = {
  photographer: string
  src: string
  loading?: boolean
  className?: string
};

export function PhotoDetails({ loading, className, photographer, src }: Props) {
  return (
    <div
      className={cn("w-full", className)}
      aria-busy={loading}
      role="region"
      aria-label={`Photo details for ${photographer}`}
      aria-live={loading ? "polite" : undefined}
    >
      {!loading ? (
        <h1 className="mb-0.5 text-3xl font-playfair">{photographer}</h1>
      ) : null}
      {!loading ? <p className="mb-4">by {photographer}</p> : null}
      {loading ? (
        <div
          className="shimmer w-11/12 mx-auto h-96 rounded-2xl"
          aria-label="Loading photo details"
          role="status"
        />
      ) : (
        <img
          src={src}
          alt={photographer}
          className="rounded-2xl mx-auto"
          fetchPriority="high"
        />
      )}
    </div>
  );
}
