const BASE_URL = "http://localhost:3000";

// parse JSON from response data
// async function handleJsonResponse(response) {
//   const data = await response.json();
//   if (!response.ok) {
//     const error = new Error(data?.errorMessage || "Request failed");
//     error.status = response.status;
//     error.data = data;
//     throw error;
//   }
//   return data;
// }

// User registration request
export async function registerUser(payload) {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return {
    status: response.status,
    ...data,
  };
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

// Login request
export async function loginUser(credentials) {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  return {
    status: response.status,
    ...data,
  };
}

// OTP verification request
export async function verifyOtp(payload) {
  const response = await fetch(`${BASE_URL}/users/verify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  return {
    status: response.status,
    ...data,
  };
}

// Fetch lessons list
export async function fetchLessons() {
  const response = await fetch(`${BASE_URL}/lessons`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  const data = await response.json();

  return {
    status: response.status,
    ...data,
  };
}

export async function searchLessons(keyword, page = 1, limit = 10) {
  const params = new URLSearchParams({
    keyword,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`${BASE_URL}/lessons/search?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await response.json();
  return { status: response.status, ...data };
}


// Fetch a single user profile by id
export async function fetchUserProfile(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await response.json();
  return { status: response.status, ...data };
}

// Update a user profile (settings page)
export async function updateUserProfile(userId, payload) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { status: response.status, ...data };
};

//delete user
export async function deleteUser(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    }
  });

  const data = await response.json();
  return { status: response.status, ...data };
}