import React from "react";
import "./commonTable.css";

const CommonYieldTable = ({ rows = [] }) => {
  return (
    <div className="yield-table-container">
      <table className="yield-table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Machine</th>
            <th>Job</th>
            <th>Width</th>
            <th>Weight</th>
            <th>Total Weight</th>
            <th>Scrap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, index) => {
            const jobCount = entry.jobs.length;
            return (
              <React.Fragment key={index}>
                {entry.jobs.map((job, jobIndex) => {
                  const hasMultipleWidths = job.widths.length > 1;
                  const hasMultipleWeights = job.weights.length > 1;
                  const maxLines = Math.max(
                    job.widths.length,
                    job.weights.length
                  );

                  return (
                    <tr key={jobIndex}>
                      {jobIndex === 0 && (
                        <>
                          <td rowSpan={jobCount}>{index + 1}</td>
                          <td rowSpan={jobCount}>{entry.machine}</td>
                        </>
                      )}
                      <td>{job.jobNumber}</td>
                      <td>
                        <div className="stacked-values">
                          {Array.from({ length: maxLines }).map((_, i) => (
                            <div key={i}>{job.widths[i] || ""}</div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="stacked-values">
                          {Array.from({ length: maxLines }).map((_, i) => (
                            <div key={i}>{job.weights[i] || ""}</div>
                          ))}
                        </div>
                      </td>
                      {jobIndex === 0 && (
                        <>
                          <td rowSpan={jobCount}>{entry.totalWeight}</td>
                          <td rowSpan={jobCount}>{entry.scrap}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CommonYieldTable;
