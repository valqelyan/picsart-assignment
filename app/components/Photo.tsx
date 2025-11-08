import { useState, useEffect, useRef, useLayoutEffect } from "react";

type Props = {
  children?: React.ReactNode;
  alt: string;
  src: string;
  smallSrc: string;
  width?: number | string;
  height?: number | string;
  color?: string;
};

export function Photo({ children, alt, src, smallSrc, width, height, color }: Props) {
  return (
    <div
      style={{
        position: "relative",
        padding: 10,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          objectFit: "cover",
          backgroundColor: color,
          borderRadius: '16px',
          height: '100%',
          width: '100%',
        }}
        width={width}
        height={height}
      />
      {children}
    </div>
  );
}


