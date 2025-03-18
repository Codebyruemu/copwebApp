
let copDataBase= JSON.parse(localStorage.getItem("copDataBase")) || [];

const agreebtn=document.getElementById("agree")
const submitBtn=document.getElementById("submitbtn")


    //returns a boolen value for submitBtn.disabled now it is true because it is
    //not clicked but when clicked the value becomes true
    if (agreebtn && submitBtn) {
        agreebtn.addEventListener('change', () => {
            // Returns a boolean value for submitBtn.disabled
            submitBtn.disabled = !agreebtn.checked;
        });
    }

const signupForm = document.getElementById("signupForm");

if(signupForm){
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName=document.getElementById("firstname").value.trim();
        const lastName=document.getElementById("lastname").value.trim();
        const tell=document.getElementById("tell").value.trim();
        const referee=document.getElementById("referee").value.trim();
        const userName=document.getElementById('username').value.trim()
        const password=document.getElementById("password").value.trim();
        const formFeedBack=document.getElementById('formfeedback')
        const now= new Date()
        if(password.length<8){
            document.getElementById("passwordtxt").innerText="Password must be at least 8 characters";
            return;
        }
        //var check=copDataBase.forEach((profile)=>profile.username===userName)
        let check=copDataBase.some((profile)=>profile.username===userName)
        if(check){
            formFeedBack.innerHTML='user have an account! Please login.'
            setTimeout(()=>{
                formFeedBack.innerHTML=''
            }, 1500)
            signupForm.reset()
            
            return;
        }
        else{
            const profile={
              firstname:firstName,
              lastname:lastName,
              tell:tell,
              referee:referee,
              username:userName,
              password:password,
              wallet:{january:0,febuary:0,march:0,april:0,may:0,june:0,july:0,
                august:0,september:0,october:0,november:0,december:0},
              dateOfReg:now.toDateString()

              }
            copDataBase.push(profile)
            localStorage.setItem('copDataBase', JSON.stringify(copDataBase))
            }
            

            //show this text after the information as been saved to local storage
            formFeedBack.innerHTML='signup successful'
            //set time out i.e after this time the innerhtml of the div should be empty
            setTimeout(()=>{

                formFeedBack.innerHTML=''

            }, 2000)

            
            signupForm.reset()
        }

        
    )
}

// on login
const dashboard = document.getElementById('dashboard');
const loginForm=document.getElementById('loginForm');

if(loginForm){
    loginForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        const userName=document.getElementById('username').value.trim().toLowerCase()
        const password=document.getElementById('password').value.trim().toLowerCase()

        //this will work. one line statement after the fat arrow function does not 
        //require an explicit return syntax but when you introduce a curly brace
        //then an explicit return syntax is needed
        const isUserValid=copDataBase.some((profile)=> 
            profile.username.toLowerCase()===userName && profile.password===password)
        if(isUserValid){
            document.getElementById("logintxt").textContent=`welcome ${userName}`
            createDashboard(userName,password)
            // showDashboard()
            dashboard.classList.remove('hidden')
            loginForm.classList.add('hidden')
              
            
        }else{
            newDiv=document.createElement('h3')
            loginForm.appendChild(newDiv)
            newDiv.textContent='user not found please sign up'
            setTimeout(()=>{newDiv.innerHTML=''},1500)
            loginForm.reset()

        }  
        
    })
}

//function that creates the dashboard   
function createDashboard(userName,password){
    let providedUserName=userName.toLowerCase()
    let providedPassword=password
    const dashboard=document.getElementById('dashboard')
    const dashboardRight=document.getElementById('dashboard-right')
    const dashboardMid=document.getElementById('dashboard-mid')
    const dashboardLeft=document.getElementById('dashboard-left')
    
    let userProfiles=JSON.parse(localStorage.getItem('copDataBase'))
    let userProfile=userProfiles.find((profile)=> 
        profile.username.toLowerCase()===providedUserName && profile.password===providedPassword)
    
    dashboardLeft.innerHTML="";
    dashboardLeft.innerHTML=`
    <div style="margin-top:10px">
    <img src="${userProfile.image? userProfile.image: "./images/profileicon.png"}" alt="" class="dashboard-image" style="margin-bottom:20px"/>
    </div>
    <div>
    <input type="file" id="profile-image" accept="image/*" style="display:none;">
    </div>
    <button onclick="document.getElementById('profile-image').click()" class="transparentBtn">Update Pics</button>
    `;

    dashboardMid.innerHTML="";
    dashboardMid.innerHTML=`
    <p>First name:    ${userProfile.firstname}</>
    <p>Last name:     ${userProfile.lastname}</>
    <p>Phone_no:     ${userProfile.tell}</>
    <p>Referee:      ${userProfile.referee}</>
    <p>Date_of_reg:  ${userProfile.dateOfReg}</>
    `
    let thisUserWalletBal=walletBalance(providedUserName,providedPassword);
    dashboardRight.innerHTML="";
    dashboardRight.innerHTML=`
    <p>Wallet Balance:</p>
    <p>&#8358;${thisUserWalletBal}</p>
    <button id="paywallet" onClick="paywallet()" class="transparentBtn">credit wallet</button>
    `;
    // Add event listener to the file input element
    const imageInput = document.getElementById("profile-image");
    imageInput.addEventListener('change', () => {
        handleAddImage(providedUserName);
    });
    dashboard.style.border="0.5px solid #cecece"

}
//supporting function after loggin

// Function to add image to user profile

function addImageToUserProfile(userName, imageFile) {
    const reader = new FileReader();
    reader.onload = () => {
        const image = reader.result;
        // Retrieve the existing user profiles from local storage
        let copDataBase = JSON.parse(localStorage.getItem("copDataBase"));
        // Find the user profile by userId
        let userProfile = copDataBase.find(profile => 
            profile.username.toLowerCase() === userName.toLowerCase());
        if (userProfile) {
            // Add or update the image for the specific user
            userProfile.image = image;
            // Save the updated user profiles back to local storage
            localStorage.setItem("copDataBase", JSON.stringify(copDataBase));
            alert("Image added to user profile successfully!");
        } else {
            alert("User profile not found!");
        }
    };
    reader.readAsDataURL(imageFile);
}

// Function to handle adding image when logged in

function handleAddImage(providedUserName) {
    const userName = providedUserName; // Replace with the actual user ID
    const imageInput = document.getElementById("profile-image");
    if (imageInput.files.length > 0) {
        const imageFile = imageInput.files[0];
        addImageToUserProfile(userName, imageFile);
    } else {
        alert("Please select an image file.");
    }
}

//function that calculates the wallet balance when logged in and this is called in the dashboard function
function walletBalance(userName,password){
    let providedUserName=userName.toLowerCase()
    let providedPassword=password
    let userProfiles=JSON.parse(localStorage.getItem('copDataBase'))
    let userProfile=userProfiles.find((profile)=> 
        profile.username.toLowerCase()===providedUserName && profile.password===providedPassword)
    let walletBalance=0
    for(let month in userProfile.wallet){
        walletBalance+= userProfile.wallet[month]
    }
    return walletBalance
}



//function to send money to wallet triggered by send btn in modal
function sendMoni(){
    const userName=document.getElementById('username').value.trim().toLowerCase()
    const password=document.getElementById('password').value.trim().toLowerCase()
    const selectedSumDiv=document.getElementById("selectedsum")
    const amountCheck=document.getElementById("invalidamount")
    let selectedSum=selectedSumDiv.textContent
    if(selectedSum<=0){
        amountCheck.innerHTML='Amount cannot be 0 or less'
        //set time out i.e after this time the innerhtml of the div should be empty
        setTimeout(()=>{

            amountCheck.innerHTML=''

        }, 1000)
        return;
    }else{
        let userProfiles=JSON.parse(localStorage.getItem('copDataBase'))
        console.log(userProfiles)
        console.log(userName+' '+password)
        let userProfile=userProfiles.find((profile)=> 
                        profile.username.toLowerCase()===userName 
                        && profile.password===password )
        console.log(userProfile)
        let currentMonth= new Date().getMonth()
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName=monthNames[currentMonth]
        Object.keys(userProfile.wallet).forEach(key=>{
            if(key.toLowerCase()===monthName.toLowerCase()){
                userProfile.wallet[key]+=selectedSum
                localStorage.setItem('copDataBase', JSON.stringify(copDataBase))
                alert(`money added successfull`)
                selectedSumDiv.textContent=0
            }
        })
    }
}

//function to append selected amount to selected sum div in modal
function appendAmount(amount){
    let selectedAmount=amount
    const selectedSumDiv=document.getElementById("selectedsum")
    selectedSumDiv.textContent=selectedAmount
}
//function to append inputed amount to selected sum div in modal 
function appendAmountFromInput() {
    const selectedSumDiv=document.getElementById("selectedsum");
    const amountCheck=document.getElementById("invalidamount");
    const otherAmountInput = document.getElementById("otheramount");
    const amount = parseInt(otherAmountInput.value, 10); // Convert the input value to an integer
    if (!isNaN(amount)) { // Check if the input value is a valid number
        if(amount<0) {
            amountCheck.innerHTML='invalid amount selected'
            //set time out i.e after this time the innerhtml of the div should be empty
            setTimeout(()=>{
    
                amountCheck.innerHTML=''
    
            }, 1000)
            otherAmountInput.value='';
            selectedSumDiv.textContent='';
            return;
        } else {
            selectedSumDiv.textContent=amount;
        }    
    } else{
        selectedSumDiv.textContent='';
    }
}
//the major problem is modal not hiding by default
const Modal=document.getElementById("wallet-modal")
Modal.style.display='none'
//function to openModal triggered by paywallet btn in dashboard
//i did this modal display manipulation because it wont hide
//from the begining of this js file  i set the display of the modal to none so i can use the add wallet btn to display it 
function paywallet(){
    Modal.style.display="block"
    Modal.style.display="flex"
    
}
//function to close Modal triggered by close btn in modal
function closeModal(){
    const Modal=document.getElementById("wallet-modal")
    Modal.style.display='none'
    
}
