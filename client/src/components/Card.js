import { Link } from "react-router-dom";

const Card = ({ image, title, description, difficulty, id }) => {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="details">
        <h2>{title}</h2>
        <div className="hidden">
          <p>{description}</p>
          <p className="subtle">{difficulty}</p>
          <Link to={`/crafts/${id}`}>
            <button>Learn more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
