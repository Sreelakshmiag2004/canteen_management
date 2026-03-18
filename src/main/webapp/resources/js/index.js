document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------
       SHOW / HIDE PASSWORD TOGGLE
    ----------------------------*/
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPassword');

    if (passwordInput && showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', () => {
            passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
        });
    }

    /* ---------------------------
       DISPLAY LOGIN ERROR MESSAGE
    ----------------------------*/
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "true") {
        const errorBox = document.getElementById("loginError");
        if (errorBox) {
            errorBox.innerText = "Invalid username or password!";
        }
    }

});



