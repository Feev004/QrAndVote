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

// Handle form submission (Create/Update)
document.getElementById("userForm").onsubmit = async (e) => {
  e.preventDefault();

  // ดึงค่าจาก input แล้ว trim
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value.trim();
  // const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value.trim();
  const recommend = document.getElementById("recommend").value.trim();
  const feature = document.getElementById("feature").value.trim();
  const comments = document.getElementById("comments").value.trim();

  // เช็กว่ามีฟิลด์ไหนว่างบ้าง
  if (!name || !email /*|| !password*/ || !age || !role || !recommend || !feature || !comments) {
    Swal.fire({
      title: "กรอกข้อมูลไม่ครบ",
      text: "กรุณากรอกทุกช่องก่อนกดบันทึก",
      icon: "warning",
    });
    return; // ไม่ทำต่อ
  }

  const id = document.getElementById("userId").value;

  const userData = {
    name,
    email,
    // password,
    age: parseInt(age),
    role,
    recommend,
    feature,
    comments,
  };

  try {
    if (id) {
      await axios.put(`${apiUrl}/${id}`, userData);
      Swal.fire({ title: "Update Successful!", icon: "success" });
    } else {
      await axios.post(apiUrl, userData);
      Swal.fire({ title: "User Created Successfully!", icon: "success" });
    }

    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
  } catch (error) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด!",
      text: error.response?.data?.error || "ไม่สามารถบันทึกข้อมูลได้",
      icon: "error",
    });
  }
};
