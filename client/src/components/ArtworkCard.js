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
  onEdit,
}) => {
  const isCreator = currentUser === user_id;

  const handleDelete = () => {
    onDelete(artwork_id);
  };

  const handleEdit = () => {
    onEdit(artwork_id);
  };

  return (
    <div className="artwork-card">
      {image && <img src={image} alt={title} className="artwork-image" />}
      <div className="artwork-username">Artist: {username}</div>
      <div className="details">
        <h2>{title}</h2>
        <div className="tags">
          Tags:{" "}
          {artwork_tags && artwork_tags.length > 0
            ? artwork_tags.map((artworkTag) => artworkTag.tag.title).join(", ")
            : "missing tags"}
        </div>
        {isCreator && (
          <div>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;
