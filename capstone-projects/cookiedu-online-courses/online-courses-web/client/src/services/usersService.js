//***********************************************SEND OTP************************** */

const checkOTPUser = async (email, otp) => {
  const res = await fetch("/api/users/otp-authentication", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  return data;
};

//***********************************************REGISTER USER************************** */

const registerUser = async (name, email, password, confirmPassword) => {
  if (!name || !email || !password || !confirmPassword) {
    throw Error("Please fill out all fields!");
  }

  if (password !== confirmPassword) {
    throw Error("Confirm password does not match, please re-enter!");
  }

  const res = await fetch("/api/users/register", {
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

  return data;
};

//***********************************************REGISTER INSSTRUCTOR************************** */

const registerInstructor = async (
  name,
  email,
  password,
  confirmPassword,
  role
) => {
  if (!name || !email || !password || !confirmPassword) {
    throw Error("Please fill all the fields");
  }

  if (password !== confirmPassword) {
    throw Error("Passwords do not match!");
  }

  const res = await fetch("/api/users/register/instructor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }
  return data;
};

//***********************************************LOGIN USER************************** */

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw Error("Please fill all the fields");
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
  localStorage.setItem("cartId", data.cartId);

  console.log("user:", localStorage.getItem("token", data.token));
  console.log("cart:", localStorage.getItem("cartId", data.token));
  return data;
};

//***********************************************LOGIN USER SOCIAL************************** */

const loginUserSocial = async () => {
  const res = await fetch(
    "http://online-courses-web.onrender.com/auth/login/success",
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);

  return data;
};

//***********************************************FORGOT PASSWORD USER************************** */
const checkEmailUser = async (email) => {
  if (!email) {
    throw Error("Please fill all the fields");
  }

  const res = await fetch("/api/users/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw Error(data.error);
  }
};

//***********************************************FORGOT PASSWORD USER************************** */
const resetPasswordUser = async (id, token, password) => {
  // if (!password || !confirmPassword) {
  //   throw Error("Please fill all the fields");
  // }

  // if (password !== confirmPassword) {
  //   throw Error("Passwords do not match!");
  // }

  const res = await fetch(`/api/users/reset-password/${id}/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  // Xử lý response ở đây nếu cần
  // const data = await res.json()
  // if(!res.ok) {
  //     throw Error(data.error)
  // }
};

//***********************************************REGISTER USER************************** */

const updateUserProfile = async (formData) => {
  try {
    console.log(formData.picture);

    const res = await fetch("/api/users/update-profile", {
      method: "PUT",
      body: formData,
      // crossDomain: true,
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update profile");
    }
  } catch (error) {
    throw Error(error.message);
  }
};

//***********************************************REGISTER USER************************** */

const changePassword = async (password, new_password, confirm_password) => {
  if (!password || !new_password || !confirm_password) {
    throw Error("Please fill all the fields");
  }
  if (new_password !== confirm_password) {
    throw Error("Passwords do not match!");
  }

  const res = await fetch("/api/users/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ password, new_password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data.error);
  }
};
//***********************************************GET USER************************** */
const getUser = async (token) => {
  const res = await fetch("/api/users/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${token}`,
    },
  });
  const { user } = await res.json();
  return user;
};

const getUserListByRole = async (role) => {
  const res = await fetch(`/api/users/get-list-users/${role}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  return data.users;
};

const changeUserStatus = async (id) => {
  const res = await fetch(`/api/users/change-user-status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bear ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  return data;
};

const getUserByOther = async (id) => {
  const res = await fetch(`/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { user } = await res.json();
  return user;
};

export {
  registerUser,
  registerInstructor,
  checkOTPUser,
  loginUser,
  loginUserSocial,
  checkEmailUser,
  resetPasswordUser,
  updateUserProfile,
  changePassword,
  getUser,
  getUserListByRole,
  changeUserStatus,
  getUserByOther,
};
