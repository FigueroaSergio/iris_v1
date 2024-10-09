import cv from "@techstark/opencv-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type OpenCvContextType = {
  loading: boolean;
};

const OpenCvContext = createContext<OpenCvContextType>({ loading: false });

export const OpenCvContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    cv["onRuntimeInitialized"] = () => {
      setLoading(true);
    };
  }, []);
  return (
    <OpenCvContext.Provider value={{ loading }}>
      {children}
    </OpenCvContext.Provider>
  );
};

export const useOpenCv = () => {
  return useContext(OpenCvContext);
};
