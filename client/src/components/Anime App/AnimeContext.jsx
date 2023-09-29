import React, { createContext, useState } from 'react';

export const AnimeContext = createContext();

export const AnimeProvider = ({ children }) => {
  const [currentlyWatching, setCurrentlyWatching] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [planToWatch, setPlanToWatch] = useState([]);
  const [notification, setNotification] = useState(null);


  return (
    <AnimeContext.Provider value={{ currentlyWatching, setCurrentlyWatching, completed, setCompleted, planToWatch, setPlanToWatch, notification, setNotification }}>
      {children}
    </AnimeContext.Provider>
  );
};
