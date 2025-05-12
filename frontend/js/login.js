const apiUrl = "http://192.168.21.118:5000/api/users";

// ✅ ตรวจว่ามี loginForm ไหม ก่อนจะผูก event
const loginForm = document.getElementById("loginForm");

function setLoginCookies(userId, email, expiryDate) {
  document.cookie = `cookie_userid=${userId}; expires=${expiryDate.toUTCString()}; path=/`;
  // document.cookie = `cookie_email=${email}; expires=${expiryDate.toUTCString()}; path=/`;
  document.cookie = `cookie_date_end=${expiryDate.toISOString()}; expires=${expiryDate.toUTCString()}; path=/`;
}


if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const inputUsername = document.getElementById("username").value.trim();
    const inputPassword = document.getElementById("password").value.trim();

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      const users = response.data;

      const foundUser = users.find(
        (user) => 
          user.email === inputUsername && 
          user.password === inputPassword && 
          (user.permmission === "user" || user.permmission === "admin" || user.permmission === "un_user")
      );

      console.log("Found user:", foundUser);

      if (foundUser) {
        const role = foundUser.permmission;
        const now = new Date();
        const expireDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 วัน
      
        setLoginCookies(foundUser.id, foundUser.email, expireDate);
      
        if(role === "un_user"){
          window.location.href = "unUserShowData.html";
        } else if (role === "user") {
          window.location.href = "userShowData.html";
        } else if (role === "admin") {
          window.location.href = "showdata.html";
        } else {
          Swal.fire("Login Failed", `Unrecognized role: "${foundUser.permmission}"`, "error");
        }
      } else {
        Swal.fire("Login Failed", `"Invalid username or password or permmission"`, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
    
  });
}


// // Initial load
// loadUsers();
