// src/logger.js
import log from "loglevel";

// Set log level based on the environment
log.setLevel(import.meta.env.VITE_NODE_MODE === "" ? "warn" : "debug");

// Function to check if a log entry is from today
const isToday = (dateString) => {
  const logDate = new Date(dateString);
  const today = new Date();

  return (
    logDate.getDate() === today.getDate() &&
    logDate.getMonth() === today.getMonth() &&
    logDate.getFullYear() === today.getFullYear()
  );
};

// Function to extract location information (filename and line number) from stack trace
const getLogLocation = () => {
  const stack = new Error().stack;
  const stackLines = stack.split("\n");

  // Look for the first relevant stack line that is not part of the logger itself
  let callerLine;
  for (let i = 2; i < stackLines.length; i++) {
    if (!stackLines[i].includes("logger.js")) {
      callerLine = stackLines[i];
      break;
    }
  }

  // Extract the filename and line number using regex
  const locationMatch =
    (callerLine && callerLine.match(/\((.*):(\d+):(\d+)\)/)) ||
    callerLine.match(/at\s+(.*):(\d+):(\d+)/);

  if (locationMatch) {
    const filePath = locationMatch[1].replace(/.*\/src\//, "src/"); // Strip everything before '/src/' to get the relative path
    return `${filePath}:${locationMatch[2]}`; // Format as 'filename:line'
  }

  return "unknown location";
};

// Function to save logs to localStorage, keeping only today's logs
const MAX_LOG_SIZE = 1 * 1024 * 1024; // 5MB in bytes

const getTotalLogSize = (logs) => {
  return new Blob([JSON.stringify(logs)]).size;
};

const saveLog = (level, message) => {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];

  // Filter to keep only today's logs
  const todaysLogs = logs.filter((log) => isToday(log.timestamp));

  // Add the new log entry
  todaysLogs.push({
    timestamp: new Date().toISOString(),
    level,
    message: message.join(" || "),
    location: getLogLocation(),
  });

  // Check if the total log size exceeds the maximum limit
  while (getTotalLogSize(todaysLogs) > MAX_LOG_SIZE) {
    // Remove the oldest log if the size exceeds the limit
    todaysLogs.shift();
  }

  // Save the updated logs back to localStorage
  localStorage.setItem("logs", JSON.stringify(todaysLogs));
};

// Preserve the original method factory
const originalFactory = log.methodFactory;

// Override the method factory to intercept log messages
log.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return (...args) => {
    saveLog(methodName, args); // Pass the arguments as an array to saveLog
    rawMethod(...args); // Call the original log method
  };
};

// Apply the new method factory
log.setLevel(log.getLevel());

export default log;
