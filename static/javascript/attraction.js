let ip = location.host;
let url=window.location.href
let thisId=url.split(ip+"/attraction/")[1]
let photo=null;
let imgQty=null;
let qty=0;

function home(){
    location.href = "/";
}

function showPosition(){
    let spot = document.getElementsByClassName("cir__items");
    for(let spotposition=0; spotposition<spot.length;spotposition++){//遍歷每個按鈕
        if( spotposition == qty ){
        spot[spotposition].classList.add("position");
        }else{
        spot[spotposition].classList.remove("position");//去除輪播按鈕hover樣式
        }
    }
}
// url=window.location.href

function attractionView(){
    //抓取現在網址
    // let thisId= localStorage.getItem("myID")
    fetch(`/api/attraction/${thisId}`)
    .then(res => {return res.json();
    }).then(result=>{
        let dataInfo= result.data;
        let siteName=dataInfo.name;
        let siteCategory=dataInfo.category;
        // if (dataInfo.mrt !==undefined)
        let siteMRT=dataInfo.mrt;
        let siteDescript= dataInfo.description
        let siteAddress= dataInfo.address
        let siteTransport= dataInfo.transport
        let putName = document.getElementsByClassName("content__name")[0];
        putName.innerHTML = siteName;
        let putCategory= document.getElementsByClassName("content__place")[0];
        if(siteMRT !== "None"){
            putCategory.innerHTML= siteCategory+" at "+ siteMRT;}
        else{
            putCategory.innerHTML= siteCategory+"   無鄰近捷運站可到達";}
        let putDescript= document.getElementsByClassName("section2--description")[0];
        putDescript.innerHTML=siteDescript;
        let putAddress= document.getElementsByClassName("section2--address")[0];
        putAddress.innerHTML=siteAddress;
        let putTransport= document.getElementsByClassName("section2--way")[0];
        putTransport.innerHTML=siteTransport;
        //頁面一開始載入
        let siteImg= dataInfo.images[0]
        let putImg= document.getElementsByClassName("img--pic")[0];
        putImg.src=siteImg;
        //取得圖片數量
        photo= dataInfo.images
        // let siteImg= dataInfo.images
        // console.log(siteImg[1])

        let dotQty=document.getElementById("cir");
        //取得圖片數目
        imgQty=photo.length
        for(let dot=0; dot<imgQty; dot++){
            let li= document.createElement("li");
            li.className="cir__items"
            dotQty.appendChild(li);    
        }
        showPosition();
        
    })

}
attractionView();

function turn(whichButton){
    if (whichButton=="right"){
        if(qty<imgQty-1){
            qty+=1
            // console.log(photo[qty])
            let siteImg= photo[qty]
            let putImg= document.getElementsByClassName("img--pic")[0];
            putImg.src=siteImg;
            showPosition();
        }
        else{
            qty=0;
            siteImg= photo[qty]
            putImg= document.getElementsByClassName("img--pic")[0];
            putImg.src=siteImg;
            showPosition();
        }
    
    }
        //拿到照片list
    else{
        if(0<qty){
            qty-=1
            // console.log(photo[qty])
            let siteImg= photo[qty]
            let putImg= document.getElementsByClassName("img--pic")[0];
            putImg.src=siteImg;
            showPosition();}
        
        else{
            qty=imgQty-1;
            let siteImg= photo[qty]
            let putImg= document.getElementsByClassName("img--pic")[0];
            putImg.src=siteImg;
            showPosition();
            }
        }
    }

//選擇行程時間
function chosenTime(time){
    let cost= document.querySelector(".cost--fee")
    cost.innerHTML=time;
}