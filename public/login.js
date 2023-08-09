document.addEventListener("DOMContentLoaded", function () {
    const registerBtn = document.getElementById("registerBtn");
  
    if (registerBtn) {
      registerBtn.addEventListener("click", function () {
        window.location.href = "register";
      });
    }
  });
  document.addEventListener("DOMContentLoaded", function () {
      const cancelBtn = document.querySelector(".cancelbtn");
  
      if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
          window.close();
        });
      }
    });