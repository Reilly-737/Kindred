import React, { useState } from "react";
import "./ArtworkCard.css";
import { Link } from "react-router-dom";

const ArtworkCard = ({
  artwork_id,
  image,
  title,
  artwork_tags,
  username,
  user_id,
  currentUser,
  onDelete,
  onEdit, // You may not need this anymore if editing is done inline
  onTitleUpdate, // New prop for handling title update
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState(title);

  const isCreator = currentUser === user_id;

  const handleDelete = () => {
    onDelete(artwork_id);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    onTitleUpdate(artwork_id, editableTitle); 
    setIsEditMode(false);
  };

  const handleTitleChange = (e) => {
    setEditableTitle(e.target.value);
  };

  return (
    <div className="artwork-card">
      {image && <img src={image} alt={title} className="artwork-image" />}
      <div className="artwork-username">Artist: {username}</div>
      <div className="details">
        {isEditMode ? (
          <div>
            <input
              type="text"
              value={editableTitle}
              onChange={handleTitleChange}
            />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <>
            <h2>{title}</h2>
            {isCreator && (
              <div>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}
          </>
        )}
        <div className="tags">
          Tags:{" "}
          {artwork_tags && artwork_tags.length > 0
            ? artwork_tags.map((artworkTag) => artworkTag.tag.title).join(", ")
            : "missing tags"}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
