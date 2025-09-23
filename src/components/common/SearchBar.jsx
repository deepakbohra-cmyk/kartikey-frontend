import React from "react";
import { Search } from "lucide-react";

function SearchBar({ searchQuery, onSearch, placeholder="Enter GID", onKeyDown }) {
  return (
    <div className="w-full max-w-2xl"> 
      <div className="relative rounded-md shadow-md ">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={onKeyDown}
          className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder || "Search..."}
        />
      </div>
    </div>
  );
}

export default SearchBar;
