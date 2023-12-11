import { useState, useEffect } from "react";
import FormComp from "./Form";

const SearchForm = () => {
  const [tags, setTags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch the list of tags from the backend when the component mounts
    const fetchTags = async () => {
      try {
        const response = await fetch("/tags");
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        } else {
          console.error("Failed to fetch tags");
        }
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = async (searchData) => {
    try {
      const { searchTerm, selectedTag } = searchData;

      // Define the base URL for the search
      let searchUrl = "/search";

      // Check if a tag is selected
      if (selectedTag) {
        searchUrl += `?tag=${selectedTag}`;
      }

      // Check if a search term is provided
      if (searchTerm) {
        // If a tag is selected, append "&" to add the search term
        // If no tag is selected, use "?" to start the query parameters
        searchUrl += selectedTag
          ? `&search=${searchTerm}`
          : `?search=${searchTerm}`;
      }

      // Fetch search results based on the constructed URL
      const response = await fetch(searchUrl);

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error performing search", error);
    }
  };

  return (
    <div>
      <h1>Search Form</h1>
      <FormComp mode="search" onSubmit={handleSearch} tags={tags} />
      {/* Display search results or do something else with them */}
      <SearchResultsList results={searchResults} />
    </div>
  );
};

// Placeholder component to display search results
const SearchResultsList = ({ results }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            {/* Render each search result item as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchForm;
