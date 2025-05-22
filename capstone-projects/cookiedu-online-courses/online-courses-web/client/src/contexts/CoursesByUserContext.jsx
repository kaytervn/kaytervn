import { createContext, useState } from "react";

export const CoursesByUserContext = createContext();

const CoursesByUserProvider = ({ children }) => {
  const [courses, setCourses] = useState({
    listCoursesByStudent: [],
    listCoursesByInstructor: [],
    totalPurchased: 0,
    totalRevenuePersonal: 0,
  });

  return (
    <CoursesByUserContext.Provider value={{ courses, setCourses }}>
      {children}
    </CoursesByUserContext.Provider>
  );
};

export default CoursesByUserProvider;
