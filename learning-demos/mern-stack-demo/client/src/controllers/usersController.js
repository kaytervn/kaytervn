const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Error("All fields are required!");
  }
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  return data;
};

const registerUser = async (name, email, password, confirmPassword) => {
  if (!name || !email || !password) {
    throw Error("All fields are required!");
  }
  if (confirmPassword != password) {
    throw Error("Passwords do not match!");
  }
  const res = await fetch("/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  localStorage.setItem("email", data.email);
  return data;
};

const mailSending = async (code, email) => {
  const res = await fetch(`/api/users/mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

const activateUser = async (code, email) => {
  const res = await fetch(`/api/users/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
  localStorage.setItem("email", data.email);
  localStorage.setItem("token", data.token);

  return data;
};

export { loginUser, registerUser, activateUser, mailSending };
