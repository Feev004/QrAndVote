document.addEventListener("DOMContentLoaded", () => {
  const scanner = new Html5Qrcode("scanner");
  const clearButton = document.getElementById("clearButton");
  const loginButton = document.getElementById("login");
  const resultInput = document.getElementById("resultInput");

  let isScanning = false;
  loginButton.disabled = true;

  function startScanner() {
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          resultInput.value = decodedText;
          loginButton.disabled = false;
          scanner
            .stop()
            .then(() => {
              isScanning = false;
            })
            .catch((err) => {
              console.error("Error stopping scanner:", err);
            });
        },
        (errorMessage) => {
          console.warn(errorMessage);
        }
      )
      .then(() => {
        isScanning = true;
      })
      .catch((err) => {
        console.error("Error starting scanner:", err);
        isScanning = false;
      });
  }

  startScanner();

  clearButton.addEventListener("click", () => {
    resultInput.value = "";
    loginButton.disabled = true;
    if (!isScanning) {
      startScanner();
    }
  });

  loginButton.addEventListener("click", () => {
    const result = resultInput.value.trim();
    let missingFields = [];

    if (!result) missingFields.push("QR Code");

    if (missingFields.length > 0) {
      alert(`กรุณากรอกข้อมูลให้ครบ:\n- ${missingFields.join("\n- ")}`);
    } else {
      alert("บันทึกสำเร็จ");
      resultInput.value = "";
      loginButton.disabled = true;
      if (!isScanning) {
        startScanner();
      }
      // สามารถเพิ่มโค้ดส่งข้อมูลไปเก็บต่อได้
    }
  });
});
