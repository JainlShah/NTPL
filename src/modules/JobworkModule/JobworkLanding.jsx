import React from 'react';
import { useNavigate } from 'react-router-dom';



const cardOptions = [
  { label: "Make New Jobwork", route: "/jobwork/new" },
  { label: "Jobwork Report", route: "/jobwork/report" },
  { label: "Final QC", route: "/jobwork/finalqc" },
  { label: "Process", route: "/jobwork/process" },
];

const JobworkLanding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#13366C] mt-12 mb-2">Jobwork</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] p-[50px] w-full max-w-3xl justify-items-center">
        {cardOptions.map((card) => (
          <button
            key={card.label}
            type="button"
            className="w-[15vw] h-[18vh] min-w-[250px] min-h-[150px] bg-[#13366C] text-white font-semibold text-2xl text-center flex flex-col items-center justify-center p-[50px] rounded-[10px] cursor-pointer transition-transform duration-200 m-[40px] shadow-[10px_4px_1px_rgba(203,220,247,0.1)] hover:bg-[#d3ddeb] hover:text-[#13366C] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#13366C]"
            onClick={() => navigate(card.route)}
            tabIndex={0}
            aria-label={card.label}
          >
            {card.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobworkLanding;
