import React, { useState } from "react";

const ComparisonForm = ({ onCompare }) => {
  const [searchTerm, onSearchTermChange] = useState("");

  const [formData, setFormData] = useState({
    search_term: "",
    filter: "",
    topN: 3,
    comparisonWebsites: ["Amazon", "Flipkart", "Snapdeal", "Alibaba"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updatedWebsites = checked
      ? [...formData.comparisonWebsites, name]
      : formData.comparisonWebsites.filter((site) => site !== name);
    setFormData({ ...formData, comparisonWebsites: updatedWebsites });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.search_term = searchTerm;
    onCompare(formData);
  };

  return (
    <div id="products" className="flex items-center justify-center w-full">
      <div className="flex flex-col items-center justify-start w-full gap-20 p-10 md:p-20">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center justify-center w-full gap-4">
            <input
              type="text"
              id="searchTerm"
              name="search_term"
              placeholder="Enter Search Term"
              required
              maxLength="20"
              onChange={(e) => onSearchTermChange(e.target.value)}
              value={searchTerm}
              className="bg-transparent border border-white rounded-full focus:border-lightGreen focus:ring-0"
            />
          </div>

          <label htmlFor="filter">Filter:</label>
          <select
            id="filter"
            name="filter"
            onChange={handleChange}
            value={formData.filter}
            className="bg-transparent border border-white rounded-full focus:border-lightGreen focus:ring-0"
          >
            <option value="none">None</option>
            <option value="highestPrice">Highest Price</option>
            <option value="lowestPrice">Lowest Price</option>
            <option value="highestRating">Highest Rating</option>
          </select>

          <label htmlFor="topN">Top N:</label>
          <input
            type="number"
            id="topN"
            name="topN"
            min="1"
            onChange={handleChange}
            value={formData.topN}
            className="bg-transparent border border-white rounded-full focus:border-lightGreen focus:ring-0"
          />

          <div>
            <label>Comparison Websites:</label>
            {["Amazon", "Flipkart", "Snapdeal", "Alibaba"].map((website) => (
              <div key={website} className="flex items-center">
                <input
                  type="checkbox"
                  name={website}
                  checked={formData.comparisonWebsites.includes(website)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span>{website}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="px-6 py-2 mb-4 rounded-full bg-lightGreen"
            >
              Search Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComparisonForm;