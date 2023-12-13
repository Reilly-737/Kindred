import { Link } from "react-router-dom";

const ArtworkCard = ({ image, title, id, tags }) => {
  return (
    <Link to={`/artworks/${id}`} className="card-link">
      <div className="card">
        <img src={image} alt={title} />
        <div className="details">
          <h2>{title}</h2>
          <div className="hidden">
            <p>Tags: {tags ? tags.join(", ") : "No tags"}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkCard;
