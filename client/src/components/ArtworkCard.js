import { Link } from "react-router-dom";
import "./ArtworkCard.css";

const ArtworkCard = ({ image, title, artwork_tags, username }) => {
  console.log("Artwork Tags:", artwork_tags);
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
      </div>
    </div>
  );
};

export default ArtworkCard;