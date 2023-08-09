document.addEventListener("DOMContentLoaded", function () {
    const signInLink = document.querySelector(".signin a");

    if (signInLink) {
      signInLink.addEventListener("click", function () {
        window.location.href = "login";
      });
    }
  });