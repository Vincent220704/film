import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ----- REGISTER -----
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Đăng ký thành công!");
                window.location.href = "login.html";
            })
            .catch(err => alert(err.message));
    });
}

// ----- LOGIN -----
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Đăng nhập thành công!");
                window.location.href = "../index.html";
            })
            .catch(err => alert(err.message));
    });
}

// ----- RESET PASSWORD -----
const resetForm = document.getElementById("reset-form");
if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;

        sendPasswordResetEmail(auth, email)
            .then(() => alert("Email khôi phục mật khẩu đã được gửi!"))
            .catch(err => alert(err.message));
    });
}

// ----- GOOGLE SIGN-IN -----
const googleBtn = document.getElementById("google-login");
if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                alert(`Đăng nhập Google thành công! Chào ${user.displayName}`);
                window.location.href = "../index.html";
            })
            .catch((err) => {
                console.error(err);
                alert(err.message);
            });
    });
}
