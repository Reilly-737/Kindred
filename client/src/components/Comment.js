import React, { useState } from "react";
import DiscussionPostCard from "./DiscussionPostCard";
import { postComment, deleteComment } from "./api"; // Import your API functions

const CombinedDiscussionPost = ({ post }) => {
  const [newComment, setNewComment] = useState("");

  const handlePostComment = async () => {
    try {
      // Call your API function to post a new comment
      await postComment(post.post_id, newComment);
      // Clear the input field after posting
      setNewComment("");
      // You might want to refresh the comments list here
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Call your API function to delete the comment
      await deleteComment(commentId);
      // You might want to refresh the comments list here
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <DiscussionPostCard
        title={post.title}
        id={post.post_id}
        tags={post.tags}
        body={post.body}
      />

      <h3>Comments</h3>
      {/* Render comments here */}
      {post.comments.map((comment) => (
        <div key={comment.comment_id}>
          <p>{comment.content}</p>
          <p>Comment by: {comment.user.username}</p>
          {/* Add a delete button */}
          <button onClick={() => handleDeleteComment(comment.comment_id)}>
            Delete Comment
          </button>
        </div>
      ))}

      {/* Allow the user to add a new comment */}
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handlePostComment}>Post Comment</button>
      </div>
    </div>
  );
};

export default CombinedDiscussionPost;
