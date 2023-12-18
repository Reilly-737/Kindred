import React, { useState } from "react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import "./PostCard.css";

const PostCard = ({
  title,
  post_id,
  post_tags,
  body,
  username,
  user_id,
  currentUser,
  onDelete,
  onTitleUpdate, 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);

  const isCreator = currentUser === user_id;
 console.log(currentUser)
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

  return (
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
      <CommentSection post_id={post_id} currentUser={currentUser} />
      {isCreator && !isEditMode && (
        <div className="post-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
