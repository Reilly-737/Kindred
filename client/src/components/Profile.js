import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useParams, Link } from "react-router-dom";

const Profile = () => {
  const { user_id: id = "" } = useParams();
  const { user, updateUser, setAlertMessage, handleSnackType} =
    useOutletContext();
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [discussionPosts, setDiscussionPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.id !== Number(id)) {
        navigate("/");
        handleSnackType("error");
        setAlertMessage("Error: Unauthorized access");
      }
      fetch(`/users/${id}`)
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error("Error fetching user data");
          }
        })
        .then(setUserInfo)
        .catch((err) => {
          handleSnackType("error");
          setAlertMessage(err.message);
        });
      fetch(`/artworks/user/${id}`)
        .then((resp) => resp.json())
        .then(setArtworks)
        .catch((err) => {
          handleSnackType("error");
          setAlertMessage(err.message);
        });
      fetch(`/discussion-posts/user/${id}`)
        .then((resp) => resp.json())
        .then(setDiscussionPosts)
        .catch((err) => {
          handleSnackType("error");
          setAlertMessage(err.message);
        });
    }
  }, [user, id, navigate, handleSnackType, setAlertMessage]);
  const deleteArtwork = (artworkId) => {
    fetch(`/artworks/${artworkId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          handleSnackType("success");
          setAlertMessage("Artwork deleted successfully!");
          setArtworks(
            artworks.filter((artwork) => artwork.artwork_id !== artworkId)
          );
        } else {
          handleSnackType("error");
          setAlertMessage("Failed to delete artwork.");
        }
      })
      .catch((error) => {
        handleSnackType("error");
        setAlertMessage(error.message || "Error deleting artwork");
      });
  };
  const deleteDiscussionPost = (postId) => {
    fetch(`/discussion-posts/${postId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          handleSnackType("success");
          setAlertMessage("Discussion post deleted successfully!");
          setDiscussionPosts(
            discussionPosts.filter((post) => post.post_id !== postId)
          );
        } else {
          handleSnackType("error");
          setAlertMessage("Failed to delete discussion post.");
        }
      })
      .catch((error) => {
        handleSnackType("error");
        setAlertMessage(error.message || "Error deleting discussion post");
      });
  };

  const deleteProfile = () => {
    if (!user) {
      return;
    }

    fetch(`/users/${user.id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          handleSnackType("success");
          setAlertMessage("Profile has been deleted! Sad to see you go!");
          navigate("/");
          updateUser(null);
        } else {
          handleSnackType("error");
          setAlertMessage("Failed to delete profile.");
        }
      })
      .catch((error) => {
        handleSnackType("error");
        setAlertMessage(error.message || "Error deleting profile");
      });
  };

  const toggleEdit = () => {
    setEditing(!isEditing);
  };

  const saveChanges = () => {
    const userId = user.user_id;

    const requestBody = {};
    if (newBio) {
      requestBody.bio = newBio;
    }
    if (newPassword) {
      requestBody.password = newPassword;
    }

    fetch(`/users/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          handleSnackType("success");
          setAlertMessage("Profile updated successfully!");
          setEditing(false);
        } else {
          response.json().then((errorData) => {
            handleSnackType("error");
            setAlertMessage(errorData.message || "Failed to update profile.");
          });
        }
      })
      .catch((error) => {
        handleSnackType("error");
        setAlertMessage("An error occurred while updating profile.");
      });
  };

  return (
    <div>
      {user && (
        <div className="main">
          <h2>{userInfo.username}'s Profile</h2>
          {isEditing ? (
            <div>
              <label>Bio:</label>
              <input
                type="text"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={saveChanges}>Save Changes</button>
            </div>
          ) : (
            <div>
              <p>Username: {userInfo.username}</p>
              <p>Bio: {userInfo.bio}</p>
            </div>
          )}
          <div className="buttons">
            {isEditing ? (
              <button onClick={toggleEdit}>Cancel</button>
            ) : (
              <button onClick={toggleEdit}>Edit Profile</button>
            )}
            <button onClick={deleteProfile}>Delete Profile</button>
          </div>

          <div>
            <h3>Artworks</h3>
            <ul>
              {artworks.map((artwork) => (
                <li key={artwork.artwork_id}>
                  {artwork.title}{" "}
                  <button onClick={() => deleteArtwork(artwork.artwork_id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Discussion Posts</h3>
            <ul>
              {discussionPosts.map((post) => (
                <li key={post.post_id}>
                  {post.title}{" "}
                  <button onClick={() => deleteDiscussionPost(post.post_id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};


export default Profile;
