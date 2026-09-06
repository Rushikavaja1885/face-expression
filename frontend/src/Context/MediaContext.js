import React, { createContext } from "react";
import MediaUtils from "../Utils/mediaUtils";

export const MediaContext = createContext(null);

export const MediaProvider = ({ children }) => {
  const mediaValue = MediaUtils();

  return (
    <MediaContext.Provider value={mediaValue}>{children}</MediaContext.Provider>
  );
};
