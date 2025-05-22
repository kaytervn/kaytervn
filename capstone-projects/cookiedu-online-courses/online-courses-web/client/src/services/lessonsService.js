const getCourseLessons = async (courseId) => {
  const res = await fetch("/api/lessons/get-course-lessons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseId }),
  });
  const { lessons } = await res.json();
  return lessons;
};

const createLesson = async ({ courseId, title, description }) => {
  const res = await fetch("/api/lessons/create-lesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ courseId, title, description }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const updateLesson = async ({ _id, title, description }) => {
  const res = await fetch(`/api/lessons/update-lesson/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ title, description }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const deleteLesson = async (_id) => {
  const res = await fetch(`/api/lessons/delete-lesson/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const getLesson = async (_id) => {
  const res = await fetch(`/api/lessons/get-lesson/${_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const { lesson } = await res.json();
  return lesson;
};

export {
  getCourseLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
};
