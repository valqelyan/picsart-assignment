import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { PhotoDetails } from "~/components/PhotoDetails";
import { usePhotoQuery } from "~/hooks/usePhotoQuery";

export default function ImagePage() {
  const { photoId } = useParams();

  const { data: photo, isLoading, error } = usePhotoQuery(photoId ?? '');
  const navigate = useNavigate()

  // Using  manual navigate(-1) because Link can't prevent scroll reset via preventScrollReset unfortunately
  const onBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  if (isLoading) return <div>Loading photo...</div>;
  if (error) return <div>Error loading photo</div>;

  return (
    <div
      className='w-full max-w-[600px] px-4 items-start mt-4 flex flex-col mx-auto'
    >
      <button onClick={onBack} className='inline-flex items-center justify-center' aria-label="Go back">
        <ChevronLeft size={22} />
        Back
      </button>

      <PhotoDetails
        photographer={photo.photographer}
        src={photo.src.large}
      />
    </div>
  );
}
