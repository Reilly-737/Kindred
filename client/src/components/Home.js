import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";
import "./Home.css";

const Home = () => {
  const [newestArtworkPosts, setNewestArtworkPosts] = useState([]);
  const [newestDiscussionPosts, setNewestDiscussionPosts] = useState([]);
  const [newArtists, setNewArtists] = useState([]);

  useEffect(() => {
    const fetchNewestArtworkPosts = async () => {
      try {
        const response = await fetch("/artworks");
        if (response.ok) {
          const data = await response.json();
          setNewestArtworkPosts(sortByNewest(data));
        } else {
          console.error(
            "Failed to fetch newest artwork posts. Server returned:",
            response
          );
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
          setNewestDiscussionPosts(sortByNewest(data));
        } else {
          console.error(
            "Failed to fetch newest discussion posts. Server returned:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching newest discussion posts", error);
      }
    };

    const fetchNewestArtists = async () => {
      try {
        const response = await fetch("/newestArt");
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setNewArtists(data);
        } else {
          console.error(
            "Failed to fetch newest artists. Server returned:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching newest artists", error);
      }
    };

    fetchNewestArtworkPosts();
    fetchNewestDiscussionPosts();
    fetchNewestArtists();
  }, []);

  const sortByNewest = (posts) => {
    return posts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  };

  return (
    <div>
      <h1>Welcome to Kindred!</h1>
      <div className="home-container">
        <div>
          <h2>Our New Artists!</h2>
          <div className="artist-cards" style={{ fontSize: "5px" }}>
            {newArtists.map((artist) => (
              <ArtworkCard
                key={artist.id}
                artist={artist}
                username={artist.user.username}
                image={artist.image_url}
              />
            ))}
          </div>
        </div>

        <div>
          <h2> Latest Artwork</h2>
          <div className="artwork-cards">
            {newestArtworkPosts.map((artwork) => (
              <ArtworkCard
                key={artwork.artwork_id}
                image={artwork.image_url}
                username={artwork.user.username}
                title={artwork.title}
                id={artwork.artwork_id}
                tags={artwork.tags}
              />
            ))}
          </div>
        </div>

        <div>
          <h2>Latest Discussions</h2>
          <div className="discussion-cards">
            {newestDiscussionPosts.map((discussion) => (
              <PostCard
                key={discussion.post_id}
                id={discussion.post_id}
                username={discussion.user.username}
                {...discussion}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
