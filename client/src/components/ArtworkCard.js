import { Link } from "react-router-dom";
import "./ArtworkCard.css";

const ArtworkCard = ({ image, title, tags, username }) => {
   console.log("Username in ArtworkCard:", username);
  return (
      <div className="artwork-card">
        {image && <img src={image} alt={title} className="artwork-image" />}
        <div className="artwork-username">Artist: {username}</div>
        <div className="details">
          <h2>{title}</h2>
          <div className="hidden">
            <p>Tags: {tags ? tags.join(", ") : "No tags"}</p>
          </div>
        </div>
      </div>

  );
};

export default ArtworkCard;