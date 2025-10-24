import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTkxa6C84Q5yYXdrezMAqk6xMgpZXSb4M",
  authDomain: "revnitex.firebaseapp.com",
  projectId: "revnitex",
  storageBucket: "revnitex.firebasestorage.app",
  messagingSenderId: "1078469124147",
  appId: "1:1078469124147:web:2cb80cdde5ffc0cb7c4346"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const authPage = document.getElementById("authPage");
const fuelTab = document.getElementById("fuelTab");
const tripTab = document.getElementById("tripTab");
const stationsTab = document.getElementById("stationsTab");
const profileTab = document.getElementById("profileTab");
const navBar = document.getElementById("navBar");
const greeting = document.getElementById("greeting");

// Auth actions
document.getElementById("registerBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth, email, password);
  alert("Account created!");
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authPage.classList.add("hidden");
    fuelTab.classList.remove("hidden");
    navBar.classList.remove("hidden");
    greeting.textContent = `Hi, ${user.email.split("@")[0]}!`;
  } else {
    authPage.classList.remove("hidden");
    fuelTab.classList.add("hidden");
    tripTab.classList.add("hidden");
    stationsTab.classList.add("hidden");
    profileTab.classList.add("hidden");
    navBar.classList.add("hidden");
    greeting.textContent = "";
  }
});

// Tabs
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".app-body").forEach((tab) => tab.classList.add("hidden"));
    document.getElementById(btn.dataset.tab).classList.remove("hidden");
  });
});

// Fuel calculator
document.getElementById("calcFuel").addEventListener("click", () => {
  const distance = parseFloat(document.getElementById("distance").value);
  const efficiency = parseFloat(document.getElementById("efficiency").value);
  const fuelType = document.getElementById("fuelType").value;

  const price = fuelType === "premium" ? 70 : 60;
  const liters = distance / efficiency;
  const cost = liters * price;

  const result = document.getElementById("fuelResult");
  result.innerHTML = `Estimated Fuel: ${liters.toFixed(2)}L<br>Total Cost: ₱${cost.toFixed(2)}`;
  result.classList.remove("hidden");
});

// Dark mode
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Live tracking map
let map, marker, watchID;
document.getElementById("getPosition").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    if (!map) {
      map = L.map("map").setView([latitude, longitude], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      marker = L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
    }

    // Start live tracking
    watchID = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      marker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude]);
    });
  });
});
// --- Dark Mode Toggle Fix ---
const darkToggle = document.getElementById("darkToggle");

// Load saved mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️";
}

// Toggle mode
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  darkToggle.textContent = isDark ? "☀️" : "🌙";
});