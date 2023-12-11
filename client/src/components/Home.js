import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";

const Home = () => {
  const [newestArtworkPosts, setNewestArtworkPosts] = useState([]);
  const [newestDiscussionPosts, setNewestDiscussionPosts] = useState([]);
  const [newArtists, setNewArtists] = useState([]);
  const { setAlertMessage, handleSnackType } = useOutletContext();

  useEffect(() => {
    // Fetch the newest artwork posts
    const fetchNewestArtworkPosts = async () => {
      try {
        const response = await fetch("/artworks"); // Adjust the endpoint based on your backend routes
        if (response.ok) {
          const data = await response.json();
          setNewestArtworkPosts(data);
        } else {
          console.error("Failed to fetch newest artwork posts");
        }
      } catch (error) {
        console.error("Error fetching newest artwork posts", error);
      }
    };

    // Fetch the newest discussion posts
    const fetchNewestDiscussionPosts = async () => {
      try {
        const response = await fetch("/discussion-posts"); // Adjust the endpoint based on your backend routes
        if (response.ok) {
          const data = await response.json();
          setNewestDiscussionPosts(data);
        } else {
          console.error("Failed to fetch newest discussion posts");
        }
      } catch (error) {
        console.error("Error fetching newest discussion posts", error);
      }
    };

    // Fetch the newest artists (adjust endpoint based on backend implementation)
    const fetchNewestArtworks = async () => {
      try {
        const response = await fetch("/newestArt"); // Adjust the endpoint based on your backend routes
        if (response.ok) {
          const data = await response.json();
          setNewestArtworkPosts(data);
        } else {
          console.error("Failed to fetch newest artworks");
        }
      } catch (error) {
        console.error("Error fetching newest artworks", error);
      }
    };

    fetchNewestArtworkPosts();
    fetchNewestDiscussionPosts();
    fetchNewestArtworks();
  }, []);

  return (
    <div>
      <h1>Welcome to Kindred!</h1>

      <div>
        <h2>Our New Artists!</h2>
        <div className="artist-cards">
          {newArtists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <img src={artist.profileImage} alt={artist.username} />
              <p>{artist.username}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Artwork</h2>
        <ul>
          {newestArtworkPosts.map((artwork) => (
            <li key={artwork.artwork_id}>{artwork.title}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Discussions</h2>
        <ul>
          {newestDiscussionPosts.map((discussion) => (
            <li key={discussion.post_id}>{discussion.title}</li>
          ))}
        </ul>
      </div>
      </div>
  );
};

export default Home;
