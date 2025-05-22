import { createContext, useState } from "react";

export const StatisticsInstructorContext = createContext();

const StatisticsInstructorProvider = ({ children }) => {
  const [statisticsInstructor, setStatisticsInstructor] = useState({
    listStatistics: [],
    totalRevenueInstructor: 0,
  });

  return (
    <StatisticsInstructorContext.Provider
      value={{ statisticsInstructor, setStatisticsInstructor }}
    >
      {children}
    </StatisticsInstructorContext.Provider>
  );
};

export default StatisticsInstructorProvider;
