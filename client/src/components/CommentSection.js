import React, { useState, useEffect } from "react";
import moment from "moment";

const CommentSection = ({ post_id, currentUser}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
 console.log(currentUser);
  useEffect(() => {
    const fetchComments = async () => {
      if (showComments) {
        try {
          const response = await fetch(`/discussion-post/${post_id}/comments`);
          if (!response.ok) {
            throw new Error(`Failed to fetch comments for post ${post_id}`);
          }
          const data = await response.json();
          setComments(data.comments);
        } catch (error) {
          console.error("Failed to fetch comments", error);
        }
      }
    };

    fetchComments();
  }, [post_id, showComments]);

   const handlePostComment = async () => {
     if (!currentUser) {
       console.error("No user logged in");
       return;
     }
     try {
       const response = await fetch(`/discussion-post/${post_id}/comments`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           content: newComment,
           user_id: currentUser.user_id,
         }),
       });
       if (!response.ok) {
         throw new Error("Failed to post comment");
       }
       const newCommentData = await response.json();
       setComments([...comments, newCommentData]);
       setNewComment("");
     } catch (error) {
       console.error("Error posting comment:", error);
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
        console.error("Error deleting comment:", error);
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
            comments.map((comment) => (
              <div key={comment.comment_id} className="list-group-item">
                <p className="mb-1">
                  <strong>{comment.user?.username}:</strong> {comment.content}
                </p>
                <small>{moment(comment.created_at).fromNow()}</small>
                {currentUser === comment.user_id && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteComment(comment.comment_id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
        </div>

        <div className="input-group mt-4">
          <textarea
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={handlePostComment}>
              Post Comment
            </button>
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default CommentSection;
