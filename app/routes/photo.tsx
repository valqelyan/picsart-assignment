import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

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
      <h1 style={{
        fontFamily: `"Playfair Display", serif`,
        fontSize: 32,
        marginBottom: '.2rem'
      }}>{photo.photographer}</h1>
      <p style={{
        marginBottom: '1rem'
      }}>by {photo.photographer}</p>
      <img src={photo.src.large} alt={photo.photographer} style={{ borderRadius: 16 }} />
    </div>
  );
}
