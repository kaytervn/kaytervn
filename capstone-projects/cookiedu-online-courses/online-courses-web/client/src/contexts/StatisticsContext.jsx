import { createContext, useState } from "react";

export const StatisticsContext = createContext();

const StatisticsProvider = ({ children }) => {
  const [statistics, setStatistics] = useState({
    listStatistics: [],
    totalRevenuePage: 0,
  });

  return (
    <StatisticsContext.Provider value={{ statistics, setStatistics }}>
      {children}
    </StatisticsContext.Provider>
  );
};

export default StatisticsProvider;
