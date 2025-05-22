const searchUserCourses = async ({
  keyword,
  visibility,
  topic,
  page,
  sort,
}) => {
  const res = await fetch("/api/courses/search-user-courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ keyword, visibility, topic, page, sort }),
  });
  const data = await res.json();
  return data;
};

const searchCourses = async ({ keyword, topic, page, sort }) => {
  const res = await fetch("/api/courses/search-courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyword, topic, page, sort }),
  });
  const data = await res.json();
  return data;
};

const getCourse = async (_id) => {
  const res = await fetch(`/api/courses/get_course/${_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { course, reviews, averageStars } = await res.json();
  return { course, reviews, averageStars };
};

const getAllCourse = async () => {
  const res = await fetch("/api/courses/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

const getAllCourseAdmin = async () => {
  const res = await fetch("/api/courses/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { courses } = await res.json();
  return courses;
};

const changeCourseVisibility = async (id) => {
  const res = await fetch(`/api/courses/change-course-visibility/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

const changeCourseStatus = async (id) => {
  const res = await fetch(`/api/courses/change-course-status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

const createCourse = async (formData) => {
  const res = await fetch(`/api/courses/create-course`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const updateCourseIntro = async ({ _id, formData }) => {
  const res = await fetch(`/api/courses/update-course-intro/${_id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const deleteCourse = async (_id) => {
  const res = await fetch(`/api/courses/delete-course/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const getCoursesByInstructorId = async (userId) => {
  const res = await fetch(`/api/courses/get-courses-by-instructor/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const  courses  = await res.json();
  return courses;
};

const getCoursesByStudentId = async (userId) => {
  const res = await fetch(`/api/courses/get-courses-by-student/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const courses = await res.json();
  return courses;
};

export {
  searchUserCourses,
  getAllCourse,
  searchCourses,
  changeCourseVisibility,
  createCourse,
  getCourse,
  changeCourseStatus,
  getAllCourseAdmin,
  updateCourseIntro,
  deleteCourse,
  getCoursesByInstructorId,
  getCoursesByStudentId,
};
