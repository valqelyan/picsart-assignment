type Props = {
  children?: React.ReactNode;
  alt: string;
  src: string;
  width?: number | string;
  height?: number | string;
  color?: string;
};

export function Photo({ children, alt, src, width, height, color }: Props) {
  return (
    <div
      className="relative p-2.5 h-full"
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
    </div>
  );
}
