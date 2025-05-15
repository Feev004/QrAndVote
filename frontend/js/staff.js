const users = [
    { id: 1, name_event: "Check-in", password: "1234" },
    { id: 2, name_event: "10-20 ปี", password: "5678" },
];

function renderUsers() {
    const tbody = document.getElementById("userTable");
    tbody.innerHTML = users.map((user, index) => `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${user.name_event}</td>
        <td class="text-center">
          <button class="btn btn-primary btn-sm" onclick="SelectEvent(${user.id})">เลือก</button>
        </td>
      </tr>
    `).join("");
}

function SelectEvent(userId) {
    const selectedUser = users.find(user => user.id === userId);
    if (!selectedUser) return;

    let passwordInput;
    do {
        passwordInput = prompt(`กรุณาใส่รหัสผ่านสำหรับ "${selectedUser.name_event}"`);
        if (passwordInput === null) {
            // ถ้ากดยกเลิก (Cancel) ให้หยุด
            alert("ยกเลิกการเลือก");
            return;
        } else if (passwordInput === selectedUser.password) {
            alert("รหัสผ่านถูกต้อง!");
            window.location.href = `staffChackUser.html?userId=${selectedUser.id}`;
            return;
        } else {
            alert("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่");
        }
    } while (true);
}

// เรียกครั้งแรก
renderUsers();
