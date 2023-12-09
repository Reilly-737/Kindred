import { Link } from "react-router-dom";

const PostCard = ({ title, id, tags, body }) => {
  return (
    <div className="card">
      <div className="details">
        <h2>{title}</h2>
        <div className="hidden">
          <p>Tags: {tags.join(", ")}</p>
          <p>{body}</p>
          <Link to={`/discussion-posts/${id}`}>
            <button>Read Post</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
