import React from "react";
const Chip = ({ label, color }) => {
    return (
      <span
        style={{
          backgroundColor: color,
          color: "#fff",
          borderRadius: "24px",
          padding: "5px 10px",
          fontSize: "12px",
          display: "inline-block",
          textAlign: "center",
          minWidth: "60px",
        }}
      >
        {label}
      </span>
    );
  };
  export default Chip;
  