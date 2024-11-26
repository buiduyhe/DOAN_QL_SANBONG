import React from "react";
import "./SearchBar.scss"; // File SCSS cho SearchBar

const SearchBar = ({ searchTerm, setSearchTerm, searchField, setSearchField, searchLabel, searchOptions, onSearch }) => {
  return (
    <div className="filters">
      <div className="filter-item">
        <label htmlFor="searchField">{"Tìm Kiếm"}</label>
        <select
          id="searchField"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          {searchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <input
          type="text"
          placeholder={`Tìm kiếm ${searchLabel}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
