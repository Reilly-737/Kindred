import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";

const ViewOne = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/discussion-posts/${post_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Post Data:", data); 
        setPost(data.discussion_post);
      })
      .catch((error) => console.error("Error:", error));
  }, [post_id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <PostCard
        title={post.title}
        id={post.post_id}
        body={post.body}
        username={post.username}
        post_tags={post.post_tags}
      />
      
    </div>
  );
};

export default ViewOne;
