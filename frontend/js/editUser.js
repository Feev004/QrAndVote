const apiUrl = "https://desired-monthly-griffon.ngrok-free.app/api/users";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// ตรวจสอบว่า login ผ่านหรือยัง
const useridCookie = getCookie("cookie_userid");
const expiry = new Date(getCookie("cookie_date_end"));
const now = new Date();

if (!useridCookie || now > expiry) {
  // ยังไม่ login หรือหมดอายุ
  Swal.fire("Session expired", "Please login again", "warning").then(() => {
    window.location.href = "index.html";
  });
}

// Load and display users
async function loadUsers() {
  try {
    const currentUserId = getCookie("cookie_userid");

    const response = await axios.get(apiUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const users = response.data;
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "";

    const user = users.find(u => u.id === currentUserId);

    if (user && user.permmission === "user") {
      userTable.innerHTML = `
        <tr>
          <td class="text-center">1</td>
          <td class="text-left">${user.name}</td>
          <td class="text-left">${user.email}</td>
          <td class="text-center"><button class="btn btn-warning btn-sm text-center" onclick="editUser('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.age}', '${user.role}', '${user.recommend}', '${user.feature}', '${user.comments}', '${user.permmission}')">Edit</button></td>
        </tr>
      `;
    } else {
      Swal.fire("Access Denied", "Only users with permission 'user' can view this page.", "error").then(() => {
        window.location.href = "index.html";
      });
    }

  } catch (error) {
    console.error("Axios error:", error);
    Swal.fire("Error", "Failed to load user data", "error");
  }
}


// Handle form submission (Create/Update)
document.getElementById("userForm").onsubmit = async (e) => {
  e.preventDefault();

  const id = document.getElementById("userId").value;
  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    age: parseInt(document.getElementById("age").value),
    role: document.getElementById("role").value,
    recommend: document.getElementById("recommend").value,
    feature: document.getElementById("feature").value,
    comments: document.getElementById("comments").value,
  };

  try {
    if (id) {
      await axios.put(`${apiUrl}/byuser/${id}`, userData);
      //alert("Update Successful!");
      Swal.fire({
        title: "Update Successful!",
        icon: "success",
        draggable: true,
      });
    } else {
      await axios.post(apiUrl, userData);
      //alert("User Created Successfully!");
      Swal.fire({
        title: "User Created Successfully!",
        icon: "success",
        draggable: true,
      });
    }

    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    loadUsers();
  } catch (error) {
    //alert(error.response?.data?.error || 'Request failed');

    Swal.fire({
      title: error.response?.data?.error || "Request failed",
      icon: "success",
      draggable: true,
    });
  }
};

// Edit user data
function editUser(id, name, email, password, age, role, recommend, feature, comments, permmission) {
  document.getElementById("userId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("password").value = password; // Clear password field
  document.getElementById("age").value = age; // Clear age field
  document.getElementById("role").value = role;
  document.getElementById("recommend").value = recommend; // Clear recommend field
  document.getElementById("feature").value = feature; // Clear feature field
  document.getElementById("comments").value = comments; // Clear comments field
  document.getElementById("permmission").value = permmission; // Clear permmission field
}

// Delete user
async function deleteAPI() {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    loadUsers();
  } catch (error) {
    console.error(error);
  }
}

async function deleteUser(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteAPI();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

// Initial load
loadUsers();
