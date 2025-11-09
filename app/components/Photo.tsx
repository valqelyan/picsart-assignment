import { cn } from "../utils/cn";

type Props = {
  children?: React.ReactNode
  loading?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement> // HTMLFigureElement does not exists idk

export function Photo({ children, loading, className, ...rest }: Props) {
  return (
    <figure
      className={cn('relative p-2.5 h-full', className)}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <div
        aria-label="Loading content"
        className='rounded-2xl w-full h-full shimmer' />
        : children}
    </figure>
  );
}
