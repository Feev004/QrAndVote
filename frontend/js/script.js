document.addEventListener("DOMContentLoaded", () => {
    const scanner = new Html5Qrcode("scanner");
    const resultInput = document.getElementById("result");
    // const startButton = document.getElementById("startButton");
    // const stopButton = document.getElementById("stopButton");
    const clearButton = document.getElementById("clearButton");
    const loginButton = document.getElementById("login");

    let isScanning = false;

    // Disable login button initially
    loginButton.disabled = true;

    // Function to start scanner
    function startScanner() {
        if (!isScanning) {
            scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 400 },
                (decodedText) => {
                    resultInput.value = decodedText;
                    loginButton.disabled = false;

                    // Optional: Auto stop after scan
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
            });
        }
    }

    // // Start Button
    // startButton.addEventListener("click", () => {
    //     startScanner();
    // });

    // // Stop Button
    // stopButton.addEventListener("click", () => {
    //     if (isScanning) {
    //         scanner.stop().then(() => {
    //             isScanning = false;
    //         }).catch((err) => {
    //             console.error("Error stopping scanner:", err);
    //         });
    //     }
    // });

    // Clear Button
    clearButton.addEventListener("click", () => {
        resultInput.value = "";
        loginButton.disabled = true;
        if (!isScanning) {
            startScanner();
        }
    });

    // Login Button
    loginButton.addEventListener("click", () => {
        const result = resultInput.value;
        if (result) {
            window.location.href = `staff.html?data=${encodeURIComponent(result)}`;
        } else {
            alert("กรุณาสแกน QR Code ก่อน");
        }
    });

    // Auto start scanner on load (optional)
    startScanner();
});
