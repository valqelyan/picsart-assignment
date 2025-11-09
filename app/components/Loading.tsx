import React, { type Ref } from "react";

type LoadingPhotoProps = {
  ref?: Ref<HTMLDivElement>;
};

export function LoadingPhoto({ ref }: LoadingPhotoProps) {
  return (
    <div className='p-2.5' ref={ref}>
      <div
        className='rounded-2xl w-full h-72 shimmer'
      />
    </div>
  );
}

