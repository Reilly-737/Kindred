import React, { useState, useEffect } from "react";
import ArtworkCard from "./ArtworkCard";
import PostCard from "./PostCard";

const SearchForm = () => {
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch("/tags")
      .then((response) => response.json())
      .then((data) => {
        setTags(data);
        console.log("Fetched Tags:", data); // Correct placement of console.log
      })
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchUrl = `/search?query=${searchTerm}${
      selectedTag ? `&tag=${selectedTag}` : ""
    }`;
    
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data)
      })
        .catch((error) => console.error("Error performing search:", error)); 
  };
  
  return (
    <div>
      <h1>Search Form</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Select Tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.title}>{tag.title}</option> 
          ))}
        </select>
        <button type="submit">Search</button>
      </form>
      <SearchResultsList results={searchResults} />
    </div>
  );
};

const SearchResultsList = ({ results }) => {
  console.log("Search results:", results);
  return (
    <div>
      <h2>Search Results</h2>
      {results.artworks &&
        results.artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.artwork_id}
            image={artwork.image_url}
            title={artwork.title}
            id={artwork.artwork_id}
            username={artwork.user.username} 
            tags={artwork.tag} 
          />
        ))}
      {results.users &&
        results.users.map((user) => (
          <div key={user.user_id}>
            <h3>{user.username}</h3>
          </div>
        ))}
      {results.discussion_posts &&
        results.discussion_posts.map((post) => (
          <PostCard key={post.post_id} id={post.post_id} {...post} />
        ))}
    </div>
  );
};

export default SearchForm;