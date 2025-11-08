import { cn } from "../utils/cn";

type Props = {
  children?: React.ReactNode;
  alt: string;
  src: string;
  width?: number | string;
  height?: number | string;
  color?: string;
} & React.HTMLAttributes<HTMLDivElement>; // HTMLFigureElement does not exists idk

export function Photo({ children, alt, src, width, className, height, color, ...rest }: Props) {
  return (
    <figure
      className={cn('relative p-2.5 h-full', className)}
      {...rest}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover rounded-2xl w-full h-full"
        width={width}
        height={height}
        style={color ? { backgroundColor: color } : undefined}
      />
      {children}
    </figure>
  );
}
