import SlittingOperatorContext from "../context/SlittingOperatorProvider";
import { useContext } from "react";

const useSlittingOperatorHook = () => {
    const context = useContext(SlittingOperatorContext);
    if(!context) {
        throw new Error("useSlittingOperatorProvider must be used within a SlittingOperatorProvider");
    }
    return context;
};

export default useSlittingOperatorHook;