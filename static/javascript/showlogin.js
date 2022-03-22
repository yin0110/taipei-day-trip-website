let member= document.querySelector("#member")
let idName= document.querySelector("#name")
let idUsername= document.querySelector("#email")
// let body= document.querySelector(".body")
let signIn= document.querySelector(".member--signin")
let signUp= document.querySelector(".member--signup")


function showFormSignin(){
    idName.style.display="none";
    signIn.style.display="none";
    signUp.style.display="block";
    member.style.height="275px";
}


//跳出表單格式
function popupLogin(){
    // let member= document.querySelector("#member")
    member.style.display="flex";
    idUsername.style.marginTop="15px";
    showFormSignin();
}
//關掉表單
function closeLogin(){
    member.style.display="none";
}

//註冊表單
function signupForm(){
    idName.style.display="block";
    signIn.style.display="block";
    signUp.style.display="none";
    member.style.height="332px";
}

//登入表單
function signinForm(){
    showFormSignin()
}