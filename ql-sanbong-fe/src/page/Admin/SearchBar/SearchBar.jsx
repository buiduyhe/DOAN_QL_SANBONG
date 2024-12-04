import React from "react";
import "./SearchBar.scss"; // File SCSS cho SearchBar

const SearchBar = ({ searchTerm, setSearchTerm, searchField, setSearchField, searchLabel, searchOptions = [] }) => {
  // Đảm bảo searchOptions luôn là mảng, mặc định là mảng rỗng nếu không có giá trị
  return (
    <div className="filters">
      <div className="filter-item">
        <label htmlFor="searchField">{searchLabel}</label>
        <select
          id="searchField"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          {searchOptions.length > 0 ? (
            searchOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <option disabled>Không có tùy chọn</option>
          )}
        </select>
      </div>

      <div className="filter-item">
        <input
          type="text"
          placeholder={`Tìm kiếm ${searchLabel}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
