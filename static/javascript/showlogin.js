let member= document.querySelector("#member")
let idName= document.querySelector("#name")
let email= document.querySelector("#email")
let password= document.querySelector("#password")
let background= document.querySelector(".background")
// let body= document.querySelector(".body")
let signIn= document.querySelector(".member--signin")
let signUp= document.querySelector(".member--signup")
let memberButton= document.querySelector(".member--button")
let signInStatus=document.querySelector(".member--signinStatus")
let aLogin= document.querySelector(".journey--login")
aLogin.addEventListener('click', popupLogin);
let aLogout= document.querySelector(".journey--logout")
aLogout.addEventListener('click', logOut);

function showFormSignin(){
    idName.style.display="none";
    signIn.style.display="none";
    signUp.style.display="block";
    member.style.height="281.5px";
    email.style.marginTop="15px";
    memberButton.innerHTML="登入帳戶"
    signUp.style.marginBottom="15px"
    background.style.display="block"
}


//跳出表單格式
function popupLogin(){
    // let member= document.querySelector("#member")
    member.style.display="flex";
    signInStatus.style.display="none"
    showFormSignin();
}
//關掉表單
function closeLogin(){
    member.style.display="none";
    background.style.display="none"
}

//註冊表單
function signupForm(){
    idName.style.display="block";
    signIn.style.display="block";
    signUp.style.display="none";
    member.style.height="338.5px";
    email.style.marginTop="10px";
    signIn.style.marginBottom="15px"
    memberButton.innerHTML="註冊新帳戶";
    
}

//登入表單
function signinForm(){
    showFormSignin()
}

// //註冊帳號
async function loginOrSignup(){
    buttonName=memberButton.innerHTML
    if (buttonName=="註冊新帳戶"){  
        let myname=idName.value;
        let emailInfo=email.value;
        let passwordInfo=password.value;
    let url= `/api/usr?name=${myname}&email=${emailInfo}&password=${passwordInfo}`;
    let accessMethod="POST"
        let fetchInfo= await fetch(url, {method:accessMethod});
        let statusCode= await fetchInfo.json();
    
        if (statusCode["ok"]){
            signInStatus.innerHTML="註冊成功，請重新登入"
            signInStatus.style.display="block"
            signIn.style.display="none";
        }
        else{
            signInStatus.innerHTML=statusCode["message"]
            signInStatus.style.display="block"
            signIn.style.display="none";
        }
    
    
    }
    else{
        let emailInfo=email.value;
        let passwordInfo=password.value;
        let url= `/api/usr?email=${emailInfo}&password=${passwordInfo}`;
        let accessMethod="PATCH"
        let fetchInfo= await fetch(url, {method:accessMethod});
        let statusCode= await fetchInfo.json();
        if (statusCode["ok"]){
            signInStatus.innerHTML="登入成功"
            signInStatus.style.display="block"
            signUp.style.display="none";
            setTimeout(function(){
                window.location.reload();
                }, 1000);
        }
        else{
            signInStatus.innerHTML=statusCode["message"]+"，請重新輸入"
            signInStatus.style.display="block"
            signUp.style.display="none";
        }


    }
}


