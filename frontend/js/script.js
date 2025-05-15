document.addEventListener("DOMContentLoaded", () => {
    const scanner = new Html5Qrcode("scanner");
    const clearButton = document.getElementById("clearButton");
    const loginButton = document.getElementById("login");

    let isScanning = false;

    loginButton.disabled = true; // Disable login button initially

    function startScanner() {
        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                resultInput.value = decodedText;
                loginButton.disabled = false; // Enable login button
                scanner.stop().then(() => {
                    isScanning = false;
                    console.log("Scanner stopped after scan");
                }).catch((err) => {
                    console.error("Error stopping scanner after scan:", err);
                });
            },
            (errorMessage) => {
                console.warn(errorMessage);
            }
        ).then(() => {
            isScanning = true;
        }).catch((err) => {
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
        const result = resultInput.value;
        if (result) {
            window.location.href = `staff.html?data=${encodeURIComponent(result)}`;
        } else {
            alert("กรุณาสแกน QR Code ก่อน");
        }
    });
});
