import React, { useState, useEffect } from "react";
import moment from "moment";
import PostCard from "./PostCard";

const CommentSection = ({ postId, user, discussionPost }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments for the discussion post
        const response = await fetch(
          `http://127.0.0.1:5555/discussion-posts/${postId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch comments for post ${postId}`);
        }

        const { comments } = await response.json();
        setComments(comments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    try {
      // Post a new comment
      const response = await fetch("http://127.0.0.1:5555/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment, post_id: postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const postedComment = await response.json();
      setComments((prevComments) => [...prevComments, postedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const commentToDelete = comments.find(
        (comment) => comment.comment_id === commentId
      );

      // Check if the user deleting the comment is the one who posted it
      if (commentToDelete && commentToDelete.user_id === user.user_id) {
        // Delete the comment
        const response = await fetch(
          `http://127.0.0.1:5555/comments/${commentId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete comment");
        }

        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId)
        );
      } else {
        console.error("You do not have permission to delete this comment");
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="container mt-4">
      {/* Display discussion post information using DiscussionPostCard */}
      <PostCard
        title={discussionPost.title}
        id={discussionPost.post_id}
        tags={discussionPost.tags}
        body={discussionPost.body}
      />

      <h2 className="mt-4">Comments</h2>
      <div className="list-group">
        {comments
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((comment) => (
            <div key={comment.comment_id} className="list-group-item">
              <p className="mb-1">
                <strong>{comment.user.username}:</strong> {comment.content}
              </p>
              <small>{moment(comment.created_at).fromNow()}</small>
              {comment.user_id === user.user_id && (
                <button
                  className="btn btn-sm btn-danger ml-2"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  Delete Comment
                </button>
              )}
            </div>
          ))}
      </div>
      <div className="mt-4">
        <textarea
          className="form-control"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button className="btn btn-primary mt-2" onClick={handlePostComment}>
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
