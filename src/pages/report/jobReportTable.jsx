import React from "react";
import "./JobReportTable.css";

const JobReportTable = ({ rolls = [], onRowClick }) => {
  return (
    <div className="job-report-container">
      <table className="job-report-table">
        <thead>
          <tr>
            <th>Width (mm)</th>
            <th>Thickness (mm)</th>
            <th>Process Weight</th>
            <th>Roll No</th>
            <th>Net Weight</th>
            <th>Coil Number</th>
            <th>Cut Weight</th>
            <th>Cust Scrap</th>
          </tr>
        </thead>
        <tbody>
          {rolls.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.rollData.map((roll, rollIndex) => (
                <tr
                  key={roll.rollNumber}
                  className="coil-row"
                  style={{
                    background: groupIndex % 2 === 0 ? "#f0f0f0" : "#d7e5f3",
                    cursor: "pointer",
                  }}
                  onClick={() => onRowClick?.(group)}
                >
                  {rollIndex === 0 && (
                    <>
                      <td rowSpan={group.rollData.length}>{group.width}</td>
                      <td rowSpan={group.rollData.length}>{group.thickness}</td>
                      <td rowSpan={group.rollData.length}>
                        {group.processWeight}
                      </td>
                    </>
                  )}
                  <td>{roll.rollNumber}</td>
                  <td>{roll.netWeight}</td>
                  <td>{roll.coilNumber}</td>
                  <td>{roll.cutWeight}</td>
                  <td>{roll.custScrap}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={8} style={{ padding: 0 }}>
                  <hr style={{ border: "1px solid #ccc", margin: 0 }} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobReportTable;
