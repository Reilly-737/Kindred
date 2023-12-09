import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const SearchFilter = ({ searchTerm, newSearch }) => {
  return (
    <div>
      <form>
        <TextField
          id="search-bar"
          className="text"
          onInput={newSearch}
          label="Search crafts"
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fill: "#2a2438" }} />
        </IconButton>
      </form>
    </div>
  );
};

export default SearchFilter;
