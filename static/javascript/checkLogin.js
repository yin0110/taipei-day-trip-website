let login=document.querySelector(".journey--login")
let logout=document.querySelector(".journey--logout")
async function checkLogin(){
    url= `/api/usr`
    accessMethod="GET"
    try{
    let fetchInfo= await fetch(url, {method:accessMethod});
    let statusCode= await fetchInfo.json();
    if (statusCode["data"]){
        login.style.display="none";
        logout.style.display="inline-block";
        customerName=statusCode["data"]["name"]
        localStorage.setItem("customerName",customerName);
    }
    }
    catch(error){
        login.style.display="inline-block";
        login.innerHTML="註冊/登入"
        login.style.color="#666666"
        logout.style.display="none";
    }
}

async function logOut(){
    url= `/api/usr`
    accessMethod="DELETE"
    let fetchInfo= await fetch(url, {method:accessMethod});
    let statusCode= await fetchInfo.json();
    login.style.display="inline-block";
    login.innerHTML="註冊/登入"
    logout.style.display="none";
    setTimeout(function(){
        window.location.reload();
        }, 50);
}

async function bookingCheckLogin(){
    url= `/api/usr`
    accessMethod="GET"
    try{
    let fetchInfo= await fetch(url, {method:accessMethod});
    let statusCode= await fetchInfo.json();
    if (statusCode["data"]){
        login.style.display="none";
        logout.style.display="inline-block";
    }
    }
    catch(error){
        location.href = `/`;
        // login.style.display="inline-block";
        // login.innerHTML="註冊/登入"
        // login.style.color="#666666"
        // logout.style.display="none";
    }
}