import { createContext, useEffect } from "react";
import { useState } from "react";

const SlittingOperatorContext = createContext();

export const SlittingOperatorProvider = ({ children }) => {
    const [slittingOperator, setSlittingOperator] = useState(null);


    return (
        <SlittingOperatorContext.Provider value={{ slittingOperator, setSlittingOperator }}>
            {children}
        </SlittingOperatorContext.Provider>
    );
};

export default SlittingOperatorContext;