import { /*useParams*/ useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Snippet {
  id: string;
  title: string;
  code: string;
  tags: string[];
  language: string;
  createdAt: any; //Timestamp;
}

export default function EditSnippet() {
  //const { snippetId } = useParams();
  const [searchParams] = useSearchParams();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const snippetParam = searchParams.get("snippet");
    if (snippetParam) {
      try {
        const decodedSnippet = JSON.parse(decodeURIComponent(snippetParam));
        setSnippet(decodedSnippet);
        // Redirect to NewSnippet page with snippet data
        navigate(`/NewSnippet?snippet=${encodeURIComponent(JSON.stringify(decodedSnippet))}`);
      } catch (error) {
        console.error("Error parsing snippet:", error);
      }
    }
  }, [searchParams, navigate]);

  if (!snippet) {
    return (
      <div>
        <h1>Edit Snippet</h1>
        <p>No snippet data found.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Snippet</h1>
      <p>Editing snippet: {snippet.title}</p>
      {/* Add your edit snippet form and logic here */}
      {/* You can access snippet data like this: */}
      {/* <p>Title: {snippet.title}</p> */}
      {/* <p>Code: {snippet.code}</p> */}
    </div>
  );
}
