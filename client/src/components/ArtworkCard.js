import { Link } from "react-router-dom";

const ArtworkCard = ({ image, title, id, tags }) => {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="details">
        <h2>{title}</h2>
        <div className="hidden">
          <p>Tags: {tags.join(", ")}</p>
          <Link to={`/artworks/${id}`}>
            <button>View Artwork</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
