const createReview = async (courseId, reviewData) => {
  const response = await fetch(`/api/reviews/create_review/${courseId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({courseId, reviewData}),
  });
  const data = await response.json();
  return data;
};

const getMyReviewForCourse = async (courseId) => {
  const response = await fetch(
    `/api/reviews/get-my-review-for-course/${courseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    } 
  );

  const data = await response.json();
  return data;
};

export { createReview, getMyReviewForCourse };
