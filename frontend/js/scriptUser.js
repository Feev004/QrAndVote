// const apiUrl = "https://desired-monthly-griffon.ngrok-free.app/api/users";
const apiUrl = "http://192.168.21.118:5000/api/users";

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
    const currentUserId = getCookie("cookie_userid"); // ดึง user id ของคนที่ login

    const response = await axios.get(apiUrl, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    const users = response.data;
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "";

    const user = users.find(u => u.id === currentUserId); // หา user ที่ตรงกับ cookie
    if (!user) {
      Swal.fire("User not found", "กรุณา login ใหม่", "warning");
      return;
    }

    // แสดงแค่คนเดียว
    userTable.innerHTML += `
      <tr>
        <td class="text-center">1</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td class="text-center">${user.age}</td>
        <td>${user.role}</td>
        <td>${user.recommend}</td>
        <td>${user.feature}</td>
        <td>${user.comments}</td>
      </tr>
    `;

  } catch (error) {
    console.error("Axios error:", error);
  }
}

// Delete user
async function deleteAPI(id) {
  try {
    await axios.delete(`${apiUrl}/${id}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    loadUsers(); // โหลดข้อมูลใหม่หลังลบ
  } catch (error) {
    console.error("Delete error:", error);
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
      deleteAPI(id); // ✅ ส่ง id เข้าไปตรงนี้
      Swal.fire("Deleted!", "User has been deleted.", "success");
    }
  });
}

// Initial load
loadUsers();

