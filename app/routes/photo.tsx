import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { PhotoDetails } from "~/components/PhotoDetails";

const PEXELS_API_KEY = "pdrmAIgN3EAQTZ7zrnWiLdXhQ2pcuIQUSj3pYQKWQaJ4Nd6p84SnjNZa";

async function fetchPhotoById(photoId) {
  const res = await fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch photo");
  return res.json();
}

export default function ImagePage() {
  const { photoId } = useParams();

  const { data: photo, isLoading, error } = useQuery({
    queryKey: ["photo", photoId],
    queryFn: () => fetchPhotoById(photoId),
    enabled: !!photoId,
  });

  if (isLoading) return <div>Loading photo...</div>;
  if (error) return <div>Error loading photo</div>;

  return (
    <div style={{ maxWidth: '600px', width: '100%', paddingInline: '1rem', alignItems: 'flex-start', marginTop: '1rem', marginInline: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Link to='/' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronLeft size={22} />
        Back
      </Link>

      <PhotoDetails
        photographer={photo.photographer}
        src={photo.src.large}
      />
    </div>
  );
}
