import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";

const UserProfile = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [artworks, setArtworks] = useState([]);
  const [discussionPosts, setDiscussionPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkCurrentUser();
    if (currentUser === parseInt(user_id)) {
      fetchUserInfo();
      fetchArtworks();
      fetchDiscussionPosts();
    }
  }, [user_id, currentUser]);

  const checkCurrentUser = () => {
    fetch("/check_session")
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data.user_id);
      });
  };

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

  const deleteArtwork = (artworkId) => {
    if (currentUser === parseInt(user_id)) {
      fetch(`/artworks/${artworkId}`, { method: "DELETE" })
        .then(() => {
          setArtworks(
            artworks.filter((artwork) => artwork.artwork_id !== artworkId)
          );
        })
        .catch((error) => console.error("Error deleting artwork:", error));
    }
  };

  const editArtwork = (artwork_id) => {
    navigate(`/edit-artwork/${artwork_id}`);
  };

   const deleteDiscussionPost = (post_id) => {
     if (currentUser === parseInt(user_id)) {
       fetch(`/discussion-posts/${post_id}`, { method: "DELETE" })
         .then(() => {
           setDiscussionPosts(
             discussionPosts.filter((post) => post.post_id !== post_id)
           );
         })
         .catch((error) => {
           console.error("Error deleting discussion post:", error);
           alert("Failed to delete post. Check console for errors.");
         });
     }
   };
    const editDiscussionPost = (post_id) => {
      navigate(`/edit-discussion-post/${post_id}`);
    };

  return (
    <div className="profile-container">
      <h2>{userInfo.username}'s Profile</h2>
      <div>
        <h3>My Artworks</h3>
        <div className="artworks-container">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.artwork_id}
              {...artwork}
              user_id={artwork.user_id}
              currentUser={currentUser}
              onDelete={deleteArtwork}
              onEdit={editArtwork}
            />
          ))}
        </div>
      </div>
      <div>
        <h3>My Discussion Posts</h3>
        <div className="discussion-posts-container">
          {discussionPosts.map((post) => (
            <PostCard
              key={post.post_id}
              {...post}
              currentUser={currentUser}
              onDelete={deleteDiscussionPost}
              onEdit={editDiscussionPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
