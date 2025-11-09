import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { PhotoDetails } from "~/components/PhotoDetails";
import { usePhotoQuery } from "~/hooks/usePhotoQuery";

export default function ImagePage() {
  const { photoId } = useParams();

  const { data: photo, isLoading, isError } = usePhotoQuery(photoId ?? '');
  const navigate = useNavigate()

  // Using  manual navigate(-1) because Link can't prevent scroll reset via preventScrollReset unfortunately
  const onBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  if (isError) {
    return (<h2 className='text-4xl p-5 font-playfair text-center text-[#999]'>
      Something went wrong. Please try again.
    </h2>)
  }

  return (
    <div
      className='w-full max-w-[600px] px-4 items-start mt-4 flex flex-col mx-auto'
    >
      <button onClick={onBack} className='inline-flex items-center justify-center' aria-label="Go back">
        <ChevronLeft size={22} />
        Back
      </button>

      <PhotoDetails
        className='mt-4'
        photographer={photo?.photographer}
        src={photo?.src?.large}
        loading={isLoading}
      />
    </div>
  );
}
