import React, { useEffect, useState } from "react";
import "../styles/pagination.css";
import log from "../components/logger.jsx";

const Pagination = ({
  itemsPerPage,
  currentPage,
  totalItems,
  loading,
  handlePageChange,
}) => {
  // const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5;

  const handlePageClick = (page) => {
    // setCurrentPage(page);
    handlePageChange(page);
    log.info(`Page clicked: ${page}`);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageClick(pageNumber);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  // Calculate the range of pages to be displayed
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageClick(i)}
        className={`pagination-button ${i === currentPage ? "active" : ""}`}
      >
        {i}
      </button>
    );
  }

  // Calculate item range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container">
      <button
        className="pagination-button"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {startPage > 1 && (
        <>
          <button
            className="pagination-button"
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          {startPage > 2 && <span className="pagination-dots">...</span>}
        </>
      )}
      {pages}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="pagination-dots">...</span>
          )}
          <button
            className="pagination-button"
            onClick={() => handlePageClick(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        className="pagination-button"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <div className="pagination-jump">
        <input
          type="number"
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          placeholder="Jump to page"
          className="pagination-input"
        />
        <button className="pagination-button" onClick={handleJumpToPage}>
          Go
        </button>
      </div>
      <div className="pagination-range">
        Showing items {startItem} to {endItem} of {totalItems}
      </div>
    </div>
  );
};

export default Pagination;
