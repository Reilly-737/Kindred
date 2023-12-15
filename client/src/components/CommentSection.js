import React, { useState, useEffect } from "react";
import moment from "moment";


const CommentSection = ({ postId, user, discussionPost }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
     console.log("Fetching comments for post:", postId);
    const fetchComments = async () => {
      if (showComments) {
        try {
          const response = await fetch(`/discussion-post/comments/${postId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch comments for post ${postId}`);
          }
          const data = await response.json();
          setComments(data.comments);
        } catch (error) {
          console.error("Failed to fetch comments", error);
        }
      }
    };
    fetchComments();
  }, [postId, showComments]);
  const handlePostComment = async () => {
    try {
      const response = await fetch("/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, post_id: postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      setComments(
        comments.filter((comment) => comment.comment_id !== commentId)
      );
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-secondary mt-3"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      {showComments && (
        <>
          <h2 className="mt-4">Comments</h2>
          <div className="list-group">
            {comments.length > 0 ? (
              comments
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((comment) => (
                  <div key={comment.comment_id} className="list-group-item">
                    <p className="mb-1">
                      <strong>{comment.user.username}:</strong>{" "}
                      {comment.content}
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
                ))
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
          </div>
          <div className="mt-4">
            <textarea
              className="form-control"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handlePostComment}
            >
             Enter
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
