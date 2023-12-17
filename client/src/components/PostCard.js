import React from "react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import "./PostCard.css";

const PostCard = ({ title, id, post_tags, body, username, user }) => {
  console.log("Post Tags in PostCard:", post_tags);
  return (
    <div className="post-card-container">
      <div className="post-username">Artist: {username}</div>
      <div className="post-card">
        <div className="post-details">
          <h2>{title}</h2>
          <div className="post-tags">
            Tags:{" "}
            {post_tags.length > 0
              ? post_tags.map((tag) => tag.tag.title).join(", ")
              : "No tags"}
          </div>
          <div className="post-body">{body}</div>
        </div>
        <Link to={`/posts/${id}`} className="view-details-link">
          View Details
        </Link>
      </div>
      <CommentSection postId={id} user={user} />
    </div>
  );
};

export default PostCard;
