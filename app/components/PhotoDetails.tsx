type Props = {
  photographer: string
  src: string
}

export function PhotoDetails({ photographer, src }: Props) {
  return (
    <div style={{ width: '100%' }}>
      <h1 style={{
        fontFamily: `"Playfair Display", serif`,
        fontSize: 32,
        marginBottom: '.2rem'
      }}>{photographer}</h1>
      <p style={{
        marginBottom: '1rem'
      }}>by {photographer}</p>
      <img src={src} alt={photographer} style={{ borderRadius: 16, marginInline: 'auto' }} />
    </div >
  )
}
