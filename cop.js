// Modified
let copDataBase = JSON.parse(localStorage.getItem("copDataBase")) || [];

const agreebtn = document.getElementById("agree");
const submitBtn = document.getElementById("submitbtn");

// Enable submit button only when the checkbox is checked
if (agreebtn && submitBtn) {
    agreebtn.addEventListener("change", () => {
        submitBtn.disabled = !agreebtn.checked;
    });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const firstName = document.getElementById("firstname").value.trim();
        const lastName = document.getElementById("lastname").value.trim();
        const tell = document.getElementById("tell").value.trim();
        const referee = document.getElementById("referee").value.trim();
        const userName = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const formFeedBack = document.getElementById("formfeedback");
        const now = new Date();

        if (password.length < 8) {
            document.getElementById("passwordtxt").innerText = "Password must be at least 8 characters";
            return;
        }

        let check = copDataBase.some((profile) => profile.username === userName);
        if (check) {
            formFeedBack.innerHTML = "User already has an account! Please login.";
            setTimeout(() => { formFeedBack.innerHTML = ""; }, 1500);
            signupForm.reset();
            return;
        } else {
            const profile = {
                firstname: firstName,
                lastname: lastName,
                tell: tell,
                referee: referee,
                username: userName,
                password: password,
                wallet: { 
                    january: 0, february: 0, march: 0, april: 0, may: 0, june: 0, 
                    july: 0, august: 0, september: 0, october: 0, november: 0, december: 0 
                },
                dateOfReg: now.toDateString()
            };

            copDataBase.push(profile);
            localStorage.setItem("copDataBase", JSON.stringify(copDataBase));
        }

        formFeedBack.innerHTML = "Signup successful! Redirecting to login...";
        setTimeout(() => {
            window.location.href = "index.html"; // Redirect to login page (modify if needed)
        }, 2000); // Redirect after 2 seconds

        signupForm.reset();
    });
}


// Handle Login
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userName = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        const isUserValid = copDataBase.some(
            (profile) => profile.username.toLowerCase() === userName && profile.password === password
        );

        if (isUserValid) {
            document.getElementById("logintxt").textContent = `Welcome ${userName}`;
            createDashboard(userName, password);
            dashboard.classList.remove("hidden");  // Show dashboard
            loginForm.classList.add("hidden");  // Hide login form

            // **Fix: Save user session to localStorage**
            localStorage.setItem("loggedInUser", userName);
        } else {
            let newDiv = document.createElement("h3");
            loginForm.appendChild(newDiv);
            newDiv.textContent = "User not found. Please sign up.";
            setTimeout(() => { newDiv.innerHTML = ""; }, 1500);
            loginForm.reset();
        }
    });
}

// function to keep you logged in on refresh



function checkUserSession() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        createDashboard(loggedInUser, getUserPassword(loggedInUser));
        dashboard.classList.remove("hidden");  // Show dashboard
        loginForm.classList.add("hidden");  // Hide login form
    }
}

// **Call this function on page load**
window.onload = checkUserSession;


function getUserPassword(userName) {
    let userProfiles = JSON.parse(localStorage.getItem("copDataBase"));
    let userProfile = userProfiles.find(profile => profile.username.toLowerCase() === userName);
    return userProfile ? userProfile.password : "";
}



function getUserPassword(userName) {
    let userProfiles = JSON.parse(localStorage.getItem("copDataBase"));
    let userProfile = userProfiles.find(profile => profile.username.toLowerCase() === userName);
    return userProfile ? userProfile.password : "";
}



function logout() {
    localStorage.removeItem("loggedInUser"); // Remove session
    window.location.reload(); // Reload page to show login form
}

// Function to Create Dashboard
function createDashboard(userName, password) {
    let providedUserName = userName.toLowerCase();
    let userProfiles = JSON.parse(localStorage.getItem("copDataBase"));
    let userProfile = userProfiles.find(
        (profile) => profile.username.toLowerCase() === providedUserName && profile.password === password
    );

    const dashboardLeft = document.getElementById("dashboard-left");
    const dashboardMid = document.getElementById("dashboard-mid");
    const dashboardRight = document.getElementById("dashboard-right");

    dashboardLeft.innerHTML = `
        <div style="margin-top:10px">
            <img src="${userProfile.image ? userProfile.image : "./images/profileicon.png"}" 
                 alt="" class="dashboard-image" style="margin-bottom:20px"/>
        </div>
        <input type="file" id="profile-image" accept="image/*" style="display:none;">
        <button onclick="document.getElementById('profile-image').click()" class="transparentBtn">Update Pics</button>
    `;

    dashboardMid.innerHTML = `
        <p>First name: ${userProfile.firstname}</p>
        <p>Last name: ${userProfile.lastname}</p>
        <p>Phone: ${userProfile.tell}</p>
        <p>Referee: ${userProfile.referee}</p>
        <p>Date of Registration: ${userProfile.dateOfReg}</p>
    `;

    let walletBalanceAmount = walletBalance(providedUserName);
    dashboardRight.innerHTML = `
        <p>Wallet Balance: &#8358;${walletBalanceAmount}</p>
        <button id="paywallet" onClick="paywallet()" class="transparentBtn">Credit Wallet</button>
        <button id="logout-btn" onClick="logout()" class="transparentBtn" style="margin-top: 10px; background-color: red; color: white;">Logout</button>
    `;

    document.getElementById("profile-image").addEventListener("change", () => {
        handleAddImage(providedUserName);
    });

    dashboard.classList.remove("hidden"); // Ensure dashboard is visible
}

// Function to Calculate Wallet Balance
function walletBalance(userName) {
    let userProfiles = JSON.parse(localStorage.getItem("copDataBase"));
    let userProfile = userProfiles.find((profile) => profile.username.toLowerCase() === userName);
    let balance = Object.values(userProfile.wallet).reduce((sum, value) => sum + value, 0);
    return balance;
}

// Functions for Wallet Modal
const Modal = document.getElementById("wallet-modal");
Modal.classList.add("hidden"); // Hide modal by default

function paywallet() {
    Modal.classList.remove("hidden"); // Show modal
}

function closeModal() {
    Modal.classList.add("hidden"); // Hide modal
}
function sendMoni() {
    const userName = document.getElementById("username").value.trim().toLowerCase();
    const selectedSumDiv = document.getElementById("selectedsum");
    let selectedSum = parseInt(selectedSumDiv.textContent, 10);

    if (selectedSum <= 0) {
        document.getElementById("invalidamount").textContent = "Amount cannot be 0 or less";
        setTimeout(() => { document.getElementById("invalidamount").textContent = ""; }, 1000);
        return;
    }

    let userProfiles = JSON.parse(localStorage.getItem("copDataBase"));
    let userProfile = userProfiles.find(profile => profile.username.toLowerCase() === userName);
    let currentMonth = new Date().toLocaleString("default", { month: "long" }).toLowerCase();

    if (userProfile && userProfile.wallet[currentMonth] !== undefined) {
        userProfile.wallet[currentMonth] += selectedSum;
        localStorage.setItem("copDataBase", JSON.stringify(userProfiles));

        alert("Money added successfully");

        // **Fix: Refresh wallet balance on dashboard**
        updateWalletBalance(userName);

        // Reset selected sum
        selectedSumDiv.textContent = "0";
    }
}

// Function to Append Selected Amount
function appendAmount(amount) {
    document.getElementById("selectedsum").textContent = amount;
}

function appendAmountFromInput() {
    const input = document.getElementById("otheramount");
    const amount = parseInt(input.value, 10);
    if (!isNaN(amount) && amount >= 0) {
        document.getElementById("selectedsum").textContent = amount;
    } else {
        document.getElementById("invalidamount").textContent = "Invalid amount selected";
        setTimeout(() => { document.getElementById("invalidamount").textContent = ""; }, 1000);
        input.value = "";
    }
}



function updateWalletBalance(userName) {
    let userProfiles = JSON.parse(localStorage.getItem("copDataBase"));
    let userProfile = userProfiles.find(profile => profile.username.toLowerCase() === userName);

    if (userProfile) {
        let balance = walletBalance(userName);
        document.getElementById("dashboard-right").innerHTML = `
            <p>Wallet Balance: &#8358;${balance}</p>
            <button id="paywallet" onClick="paywallet()" class="transparentBtn">Credit Wallet</button>
        `;
    }
}