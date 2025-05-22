const getLessonComments = async (lessonId) => {
  const res = await fetch("/api/comments/get-lesson-comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lessonId }),
  });
  const { comments } = await res.json();
  return comments;
};

const createComment = async ({ lessonId, content }) => {
  const res = await fetch("/api/comments/create-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ lessonId, content }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

export { createComment, getLessonComments };
