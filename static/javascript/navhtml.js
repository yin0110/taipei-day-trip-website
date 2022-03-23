function navBuild(){
    let nav=document.createElement("nav");
    document.body.appendChild(nav);
    let divDek=document.createElement("div");
    nav.appendChild(divDek);
    divDek.className="desktop";
    let divTaipei=document.createElement("div");
    divTaipei.className="taipei";
    let divJourney=document.createElement("div");
    divJourney.className="journey";
    let aBook=document.createElement("a");
    aBook.className="journey--book";
    let aLogin=document.createElement("a");
    aLogin.className="journey--login";
    let aLogout=document.createElement("a");
    aLogout.className="journey--logout";
    divDek.appendChild(divTaipei);
    divDek.appendChild(divJourney);
    divJourney.appendChild(aBook);
    divJourney.appendChild(aLogin);
    divJourney.appendChild(aLogout);
    divTaipei.innerHTML="台北一日遊";
    aBook.innerHTML="預定行程";
    aLogin.innerHTML="註冊/登入";
    aLogout.innerHTML="登出系統";
    // divTaipei.addEventListener('click', home);
    // aLogin.addEventListener('click', popupLogin);
    // aLogin.addEventListener('click', logOut);
}

navBuild();


let homepage= document.querySelector(".taipei")
homepage.addEventListener('click', home);

function home(){
    location.href = "/";
}

