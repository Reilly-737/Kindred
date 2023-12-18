import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";
import { formatDate } from "./utils";

const UserProfile = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [artworks, setArtworks] = useState([]);
  const [discussionPosts, setDiscussionPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditBioMode, setIsEditBioMode] = useState(false);
  const [editableBio, setEditableBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);

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

    const updateArtworkTitle = (artworkId, newTitle) => {
      fetch(`/artworks/${artworkId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          setArtworks(
            artworks.map((artwork) =>
              artwork.artwork_id === artworkId
                ? { ...artwork, title: newTitle }
                : artwork
            )
          );
        })
        .catch((error) =>
          console.error("Error updating artwork title:", error)
        );
    };

    const updateDiscussionPostTitle = (postId, newTitle) => {
      fetch(`/discussion-posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          setDiscussionPosts(
            discussionPosts.map((post) =>
              post.post_id === postId ? { ...post, title: newTitle } : post
            )
          );
        })
        .catch((error) =>
          console.error("Error updating discussion post title:", error)
        );
    };

  const updateBio = () => {
    fetch(`/users/${currentUser}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bio: editableBio }),
    })
      .then((response) => response.json())
      .then((updatedUserInfo) => {
        setUserInfo(updatedUserInfo);
        setIsEditBioMode(false);
      })
      .catch((error) => console.error("Error updating bio:", error));
  };

  const updatePassword = () => {
    fetch(`/users/${currentUser}/updatePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Password update failed");
        }
        setNewPassword("");
        alert("Password updated successfully");
      })
      .catch((error) => console.error("Error updating password:", error));
  };

  const deleteUserProfile = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      fetch(`/users/${currentUser}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete profile");
          }
          navigate("/"); 
        })
        .catch((error) => console.error("Error deleting profile:", error));
    }
  };

  useEffect(() => {
    checkCurrentUser();
    if (currentUser === parseInt(user_id)) {
      fetchUserInfo();
      fetchArtworks();
      fetchDiscussionPosts();
    }
  }, [user_id, currentUser]);

  return (
    <div className="profile-container">
      <h2>{userInfo.username}'s Profile</h2>
      {isEditBioMode ? (
        <div>
          <textarea
            value={editableBio}
            onChange={(e) => setEditableBio(e.target.value)}
          />
          <button onClick={updateBio}>Save Bio</button>
        </div>
      ) : (
        <div>
          <p>{userInfo.bio}</p>
          {currentUser === parseInt(user_id) && (
            <button onClick={() => setIsEditBioMode(true)}>Edit Bio</button>
          )}
        </div>
      )}
      {currentUser === parseInt(user_id) && (
        <div>
          {isChangePasswordMode ? (
            <div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={updatePassword}>Change Password</button>
              <button onClick={() => setIsChangePasswordMode(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setIsChangePasswordMode(true)}>
              Change Password
            </button>
          )}
          <button onClick={deleteUserProfile}>Delete Profile</button>
        </div>
      )}
      <div>
        <div className="account-creation-date">
          Member since: {formatDate(userInfo.created_at)}{" "}
        </div>
        <h3>My Artworks</h3>
        <div className="artworks-container">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.artwork_id}
              {...artwork}
              image={artwork.image_url}
              username={artwork.user.username}
              user_id={artwork.user_id}
              currentUser={currentUser}
              onDelete={deleteArtwork}
              onEdit={updateArtworkTitle}
              onTitleUpdate={updateArtworkTitle}
              isProfileView={true}
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
              username={post.user.username}
              currentUser={currentUser}
              onDelete={deleteDiscussionPost}
              onEdit={updateDiscussionPostTitle}
              onTitleUpdate={updateDiscussionPostTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile

