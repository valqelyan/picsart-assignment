import { Masonry, MasonryColumn } from "./Masonry"

export function LoadingPhoto({ ref }) {
  return (
    <div style={{ padding: 10 }} ref={ref}>
      <div style={{
        borderRadius: 16,
        backgroundColor: '#101931',
        height: 300,
        width: '100%'
      }} />
    </div>
  )

}

const fakePhotos = [{ "width": 2736, "height": 3648 }, { "width": 4000, "height": 6000 }, { "width": 4000, "height": 6000 }, { "width": 1969, "height": 2954 }, { "width": 3376, "height": 6000 }, { "width": 3305, "height": 4958 }, { "width": 7952, "height": 5304 }, { "width": 2198, "height": 4000 }, { "width": 4000, "height": 6000 }, { "width": 2656, "height": 3984 }, { "width": 2457, "height": 3071 }, { "width": 5766, "height": 8675 }, { "width": 2463, "height": 4000 }, { "width": 3648, "height": 5472 }, { "width": 3547, "height": 5321 }]

export function Loading() {
  return 'Loading...'
  // return (
  //   <Masonry photos={fakePhotos}>
  //     {(photoColumns, columns) => photoColumns.map((columnPhotos, index) => (
  //       <MasonryColumn key={index} photos={columnPhotos} onLazy={() => { }}>
  //         {columnPhotos.map(photo => (
  //           <LoadingPhoto key={photo.id} />
  //         ))}
  //       </MasonryColumn>
  //     ))}
  //   </Masonry>
  // )
}
