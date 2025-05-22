const getLessonDocuments = async (lessonId) => {
  const res = await fetch("/api/documents/get-lesson-documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lessonId }),
  });
  const { documents } = await res.json();
  return documents;
};

const createDocument = async (formData) => {
  const res = await fetch("/api/documents/create-document", {
    method: "POST",
    headers: {
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const deleteDocument = async (_id) => {
  const res = await fetch(`/api/documents/delete-document/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

export { getLessonDocuments, createDocument, deleteDocument };
