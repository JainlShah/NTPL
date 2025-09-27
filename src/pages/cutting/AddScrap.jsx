import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/addScrap.css";
import useScrap from "../../hooks/useScrap"; // Import the hook
import animationData from "../../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";

const AddScrap = () => {
  const [formData, setFormData] = useState({
    thickness: "",
    weight: "",
    materialType: "",
    scrapType: "",
  });

  const { loading, error, addScraps } = useScrap(); // Access the addScraps method from the hook
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Prevent negative values for weight
    if (name === "weight" && Number(value) < 0) {
      toast.error("Weight cannot be negative");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form data
    if (
      !formData.thickness ||
      !formData.weight ||
      !formData.materialType ||
      !formData.scrapType
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    const data = {
      thickness: Number(formData.thickness),
      weight: Number(formData.weight),
      materialType: formData.materialType,
      scrapType: formData.scrapType,
    };
    await addScraps(data);
    navigate(-1);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-header">Add Scrap</h2>
        <form className="add-scrap-form" onSubmit={handleSubmit}>
          <div className="popup-body">
            <label className="required">
              <div className="flex">
                Add Thickness (mm)<p>*</p>
              </div>
            </label>
            <select
              name="thickness"
              value={formData.thickness}
              onChange={handleInputChange}
              required
            >
              <option>Choose thickness</option>
              <option value="0.23">0.23</option>
              <option value="0.25">0.25</option>
              <option value="0.27">0.27</option>
              <option value="0.30">0.30</option>
            </select>
            <label className="required">
              <div className="flex">
                Add Weight (kg)<p>*</p>
              </div>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Add here"
              required
              min="0"
              step="0.1" // Allows only numbers with one decimal place
            />
            <label className="required">
              <div className="flex">
                Select Material Type<p>*</p>
              </div>
            </label>
            <select
              name="materialType"
              value={formData.materialType}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose material type</option>
              <option value="crgo">CRGO</option>
              <option value="crno">CRNO</option>
            </select>

            {/* <label className="required">Select Type of Scrap</label> */}
            <label className="required">
              <div className="flex">
                Select Type of Scrap<p>*</p>
              </div>
            </label>
            <select
              name="scrapType"
              value={formData.scrapType}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose type</option>
              <option value="startRoll">Start Roll</option>
              <option value="triangle">Triangle</option>
              <option value="punch">Punch</option>
              <option value="endRoll">End Roll</option>
              <option value="extra">Extra</option>
            </select>
          </div>

          <div className="action-container">
            <button className="close-button" onClick={handleClose}>
              Close
            </button>
            <button className="submit-button" disabled={loading}>
              Submit
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>

      {/* Only show loading animation if loading is true */}
      {loading && (
        <div className="loading-overlay">
          <div style={{ width: 300, height: 300 }}>
            <Player
              autoplay
              loop
              speed={2}
              src={animationData}
              style={{ width: "80%", height: "80%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddScrap;
