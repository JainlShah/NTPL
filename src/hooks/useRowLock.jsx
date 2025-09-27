import { useEffect, useState, useCallback } from "react";
import socket from "../util/socket";
import { toast } from "react-hot-toast";

export const useRowLock = () => {
  const [lockedRows, setLockedRows] = useState({}); // { rowId: actionType }

  useEffect(() => {
    // Handle row state updates
    socket.on("updateRowState", ({ rowId, actionType, state }) => {
      setLockedRows((prev) => {
        const newState = { ...prev };
        if (state === "disabled") {
          newState[rowId] = actionType;
        } else {
          delete newState[rowId];
        }
        return newState;
      });
    });

    // Handle row locked notification
    socket.on("rowLocked", ({ rowId }) => {
      toast.error(`Row ${rowId} is locked`);
    });

    // Sync locked rows when connecting
    socket.on("syncLockedRows", (initialLockedRows) => {
      setLockedRows(initialLockedRows);
    });

    // Request locked rows data when the hook is initialized
    socket.emit("requestLockedRows");

    return () => {
      socket.off("updateRowState");
      socket.off("rowLocked");
      socket.off("syncLockedRows");
    };
  }, []);

  const lockRow = useCallback((rowId, actionType) => {
    socket.emit("selectRow", { rowId, actionType });
  }, []);

  const unlockRow = useCallback((rowId, actionType) => {
    socket.emit("resetRowState", { rowId, actionType });
  }, []);

  return { lockedRows, lockRow, unlockRow, socket };
};
