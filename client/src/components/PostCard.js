import React from "react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import "./PostCard.css";

const PostCard = ({ title, id, tags, body, username, user }) => {
  console.log("Post ID:", id);
  return (
    <div className="post-card-container">
      <div className="post-username">Artist: {username}</div>
      <Link to={`/posts/${id}`} className="post-link">
        <div className="post-card">
          <div className="post-details">
            <h2>{title}</h2>
            <div className="post-tags">
              Tags: {tags ? tags.join(", ") : "No tags"}
            </div>
            <div className="post-body">{body}</div>
          </div>
        </div>
      </Link>
      <CommentSection postId={id} user={user} />
    </div>
  );
};

export default PostCard;
