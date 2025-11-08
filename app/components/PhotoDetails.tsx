type Props = {
  photographer: string
  src: string
}

export function PhotoDetails({ photographer, src }: Props) {
  return (
    <div className="w-full">
      <h1
        className="mb-0.5 text-3xl font-playfair"
      >
        {photographer}
      </h1>
      <p className="mb-4">by {photographer}</p>
      <img
        src={src}
        alt={photographer}
        className="rounded-2xl mx-auto"
      />
    </div>
  )
}
