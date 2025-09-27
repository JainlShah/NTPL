// import React from "react";
// import QRCode from "react-qr-code";

// const Demo = ({ closeModal, className }) => {
//   const cards = [
//     { id: 1, name: "Card 1", content: "This is the content of Card 1." },
//     { id: 2, name: "Card 2", content: "This is the content of Card 2." },
//     { id: 3, name: "Card 3", content: "This is the content of Card 3." },
//     { id: 4, name: "Card 4", content: "This is the content of Card 4." },
//   ];

//   // Function to handle printing
//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div
//       className="slitting-form-container"
//       style={{ padding: "20px", textAlign: "center" }}
//     >
//       {/* <h1>Scanned Cards</h1> */}
//       {/* Section to be printed */}
//       <div
//         id="print-section"
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "20px",
//           justifyContent: "center",
//         }}
//       >
//         {cards.map((card) => (
//           <div
//             key={card.id}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "10px",
//               padding: "20px",
//               width: "300px",
//               height: "300px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               pageBreakAfter: "always",
//             }}
//             className="print-card"
//           >
//             <h2>{card.name}</h2>
//             <p>{card.content}</p>
//             {/* QR Code for the card content */}
//             <div style={{ marginTop: "20px" }}>
//               <QRCode
//                 value={card.content}
//                 size={120}
//                 bgColor="#ffffff"
//                 fgColor="black"
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Print button */}
//       <button
//         onClick={handlePrint}
//         style={{
//           padding: "10px 20px",
//           marginTop: "20px",
//           cursor: "pointer",
//           borderRadius: "5px",
//           background: "#007bff",
//           color: "#fff",
//           border: "none",
//           fontSize: "16px",
//         }}
//       >
//         Print All Cards
//       </button>
//       <button
//         onClick={closeModal}
//         style={{
//           padding: "10px 20px",
//           cursor: "pointer",
//           borderRadius: "5px",
//           background: "#dc3545",
//           color: "#fff",
//           border: "none",
//           fontSize: "16px",
//         }}
//       >
//         Close
//       </button>
//       {/* Print-specific styling */}
//       <style>
//         {`
//           @media print {
//             #print-section {

//               display: flex;
//               align-items: center;
//               flex-direction: column;
//               justify-content: center;

//             }
//             .print-card {
//             border: "1px solid red";
//               border-radius: "10px";
//               width: "300px",
//               height: "700px",
//               page-break-after: always;
//             }
//             button {
//               display: none;
//             }

//             nav, .navbar, .header ,h1,footer,{
//               display: none !important;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default Demo;

import React from "react";
import QRCode from "react-qr-code";

const ScannedCardsPrinter = () => {
  const cards = [
    { id: 1, name: "Card 1", content: "This is the content of Card 1." },
    { id: 2, name: "Card 2", content: "This is the content of Card 2." },
    { id: 3, name: "Card 3", content: "This is the content of Card 3." },
    { id: 4, name: "Card 4", content: "This is the content of Card 4." },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Scanned Cards</h1>

      <div
        id="print-section"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              width: "300px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              pageBreakAfter: "always",
              height: "500px", // Default height for cards
            }}
            className="print-card"
          >
            <h2>{card.name}</h2>
            <p>{card.content}</p>
            <div style={{ marginTop: "20px" }}>
              <QRCode
                value={card.content}
                size={120}
                bgColor="#ffffff"
                fgColor="black"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handlePrint}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer",
          borderRadius: "5px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          fontSize: "16px",
        }}
      >
        Print All Cards
      </button>

      <style>
        {`
          @media print {
            #print-section {
              display: block;
              align-items: center;
              flex-direction: column;
              justify-content: center;

            }
            .print-card {
              page-break-after: always; /* Ensure each card is on a new page */
              height: 700px; /* Adjust height for printed cards */
              width: 500px; /* Adjust width for printed cards */
              padding: 20px;
              box-shadow: none; /* Remove shadow for printing */
            }
            button {
              display: none; /* Hide buttons during printing */
            }
            nav, .navbar, .header ,h1 {
              display: none !important; /* Hide unwanted elements */
            }
          }
        `}
      </style>
    </div>
  );
};

export default ScannedCardsPrinter;
