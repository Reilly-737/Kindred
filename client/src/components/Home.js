import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import ArtworkCard from "./ArtworkCard"; 
import PostCard from "./PostCard"; 
const Home = () => {
  const [newestArtworkPosts, setNewestArtworkPosts] = useState([]);
  const [newestDiscussionPosts, setNewestDiscussionPosts] = useState([]);
  const [newArtists, setNewArtists] = useState([]);
  const { setAlertMessage, handleSnackType } = useOutletContext();
//REDO CHECK ROUTES AND ADJUST LOGIC GROSS 
  useEffect(() => {
    const fetchNewestArtworkPosts = async () => {
      try {
        const response = await fetch("/artworks");
        if (response.ok) {
          const data = await response.json();
          setNewestArtworkPosts(data);
        } else {
          console.error("Failed to fetch newest artwork posts. Server returned:", response);
        }
      } catch (error) {
        console.error("Error fetching newest artwork posts", error);
      }
    };
    const fetchNewestDiscussionPosts = async () => {
      try {
        const response = await fetch("/discussion-posts");
        if (response.ok) {
          const data = await response.json();
          setNewestDiscussionPosts(data);
        } else {
          console.error("Failed to fetch newest discussion posts. Server returned:", response);
        }
      } catch (error) {
        console.error("Error fetching newest discussion posts", error);
      }
    };
    //  const fetchNewestPosts = async () => {
    //    try {
    //      const response = await fetch("/newestPosts");
    //      if (response.ok) {
    //        const data = await response.json();
    //        // Assuming each post has a unique identifier, use that as the key
    //        const postsById = Object.fromEntries(
    //          data.map((post) => [post.post_id, post])
    //        );

    //        // Sort the posts by their creation date
    //        const sortedPosts = Object.values(postsById).sort(
    //          (a, b) => new Date(b.created_at) - new Date(a.created_at)
    //        );

    //        setNewestPosts(sortedPosts);
    //      } else {
    //        console.error(
    //          "Failed to fetch newest posts. Server returned:",
    //          response
    //        );
    //      }
    //    } catch (error) {
    //      console.error("Error fetching newest posts", error);
    //    }
    //  };
    const fetchNewestArtists = async () => {
      try {
        const response = await fetch("/newestArt");
        if (response.ok) {
          const data = await response.json();
          setNewArtists(data);
        } else {
          console.error("Failed to fetch newest artists. Server returned:", response);
        }
      } catch (error) {
        console.error("Error fetching newest artists", error);
      }
    };

    fetchNewestArtworkPosts();
    fetchNewestDiscussionPosts();
    fetchNewestArtists();
  }, []);

   return (
     <div>
       <h1>Welcome to Kindred!</h1>
       <div>
         <h2>Our New Artists!</h2>
         <div className="artist-cards">
           {newArtists.map((artist) => (
             <ArtworkCard key={artist.id} artist={artist} />
           ))}
         </div>
       </div>
       <div>
         <h2>Artwork</h2>
         <div className="artwork-cards">
           {newestArtworkPosts.map((artwork) => (
             <ArtworkCard 
             key={artwork.artwork_id}
             image={artwork.image_url} 
             title={artwork.title}
             id={artwork.artwork_id}
             tags={artwork.tags}
             />
           ))}
         </div>
       </div>
       <div>
         <h2>Discussions</h2>
         <div className="discussion-cards">
           {newestDiscussionPosts.map((discussion) => (
             <PostCard key={discussion.post_id} discussion={discussion} />
           ))}
         </div>
       </div>
     </div>
   );
};

export default Home;