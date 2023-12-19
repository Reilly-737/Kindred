import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import "./PostCard.css";
import { useUser } from "./UserContext";
import { StyleContext } from "../contextstyle/StyleContext";

const PostCard = ({
  title,
  post_id,
  post_tags,
  body,
  username,
  user_id,
  onDelete,
  onTitleUpdate,
  isOnHomePage,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);
  const { theme } = useContext(StyleContext);
  const { currentUser } = useUser();
  const isCreator = currentUser && currentUser.user_id === user_id;

  const handleDelete = () => {
    onDelete(post_id);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    onTitleUpdate(post_id, editableTitle);
  };

  const handleTitleChange = (e) => {
    setEditableTitle(e.target.value);
  };
  const showEditDeleteButtons = !isOnHomePage && isCreator && !isEditMode;

  return (
    <div style={{ background: theme.background, color: theme.primaryColor }}>
      <div className="post-card-container">
        <div className="post-username">Artist: {username}</div>
        <div className="post-card">
          {isEditMode ? (
            <div className="post-details">
              <input
                type="text"
                value={editableTitle}
                onChange={handleTitleChange}
              />
              <button onClick={handleSave}>Save</button>
            </div>
          ) : (
            <div className="post-details">
              <h2>{title}</h2>
              <div className="post-tags">
                Tags:{" "}
                {post_tags && post_tags.length > 0
                  ? post_tags.map((tag) => tag.tag.title).join(", ")
                  : "No tags"}
              </div>
              <div className="post-body">{body}</div>
            </div>
          )}
          {!isEditMode && (
            <Link to={`/posts/${post_id}`} className="view-details-link">
              View Details
            </Link>
          )}
        </div>
        {showEditDeleteButtons && (
          <div className="post-actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
        <CommentSection post_id={post_id} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PostCard;
