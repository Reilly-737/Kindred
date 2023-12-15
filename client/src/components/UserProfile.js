import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";

const UserProfile = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [artworks, setArtworks] = useState([]);
  const [discussionPosts, setDiscussionPosts] = useState([]);

  useEffect(() => {
    fetchUserInfo();
    fetchArtworks();
    fetchDiscussionPosts();
  }, [user_id]);

  const fetchUserInfo = () => {
    fetch(`/users/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setUserInfo(data);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const fetchArtworks = () => {
    fetch("/artworks")
      .then((response) => response.json())
      .then((data) => {
        const userArtworks = data.filter(
          (artwork) => artwork.user_id === parseInt(user_id)
        );
        setArtworks(userArtworks);
      })
      .catch((error) => console.error("Error fetching artworks:", error));
  };

  const fetchDiscussionPosts = () => {
    fetch("/discussion-posts")
      .then((response) => response.json())
      .then((data) => {
        const userPosts = data.filter(
          (post) => post.user_id === parseInt(user_id)
        );
        setDiscussionPosts(userPosts);
      })
      .catch((error) =>
        console.error("Error fetching discussion posts:", error)
      );
  };

  return (
    <div className="profile-container">
      <h2>{userInfo.username}'s Profile</h2>
      <div>
        <h3>My Artworks</h3>
        <div className="artworks-container">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.artwork_id} {...artwork} />
          ))}
        </div>
      </div>
      <div>
        <h3>My Discussion Posts</h3>
        <div className="discussion-posts-container">
          {discussionPosts.map((post) => (
            <PostCard key={post.post_id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
