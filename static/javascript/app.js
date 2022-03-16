let currentPage=0;
let main=document.createElement("main");
document.body.appendChild(main);
main.id="main";
let mysiteId=0;

function getdata(){
    let divOuter= document.createElement("div");
    divOuter.id="siteOuter";
    divOuter.className="siteOuter";
    main.appendChild(divOuter);
    async function apiFetch(){
        let dataAPI= await fetch(`/api/attraction?page=${currentPage}`);
        let dataJson= await dataAPI.json();
        //拿出dataAPI字典，以便後面拿取不同資訊資
        let dataInfo= dataJson.data;   
        currentPage=dataJson.nextPage
         let img=[];
        let siteName=[];
        let category=[];
        let mrt= [];
        for(data in dataInfo){
            let allImg=dataInfo[data].images[0];
                // 抓到每個id的第一張圖片
            img.push(allImg);
                //抓到每個景點名稱
            let allName=dataInfo[data].name;
            siteName.push(allName);
            let allCategory=dataInfo[data].category;
            category.push(allCategory);
            let allMRT=dataInfo[data].mrt;
            mrt.push(allMRT);
            }
    // 開始做生成element

        for(item=0; item<12; item++){
            //抓取每個點的info
            let perSite=siteName[item];
            let perCategory=category[item];
            let perMRT= mrt[item];
            //設定最外層divOuter
            if (perSite !== undefined){
                let divInner= document.createElement("div");
                divInner.className="siteInner";
                //生成img跟p Element
                let imgBox=document.createElement("img");
                imgBox.className="siteImg"
                let nameBox=document.createElement("div");
                nameBox.className="siteName"
                let categoryBox=document.createElement("div");
                categoryBox.className="siteCategory"
                let mrtBox=document.createElement("div");
                mrtBox.className="siteMRT"
                //每個p放入將放入的文字
                let siteText = document.createTextNode(perSite);
                let categoryText = document.createTextNode(perCategory);
                let mrtText= document.createTextNode(perMRT);
                imgBox.src=img[item];
                //放入html
                divOuter.appendChild(divInner);
                divInner.appendChild(imgBox);
                //sitename生成p element再放入文字
                divInner.appendChild(nameBox);
                nameBox.appendChild(siteText);
                divInner.appendChild(mrtBox);
                mrtBox.appendChild(mrtText);
                divInner.appendChild(categoryBox);
                categoryBox.appendChild(categoryText);
                divInner.addEventListener('click', loadAttraction)
                // 建立每個景點id
                let siteId = document.getElementsByClassName("siteInner");
                for (var i = 0; i < siteId.length; i++) {
                    siteId[i].id = "id" + (i + 1);
                    }   
                //拿到每個景點id
                divInner.addEventListener('click', loadAttraction)
                function loadAttraction(event) {
                    //取得景點名稱
                    let chosenSite = document.getElementById(this.id).childNodes[1].textContent
                    fetch(`/api/attraction?page=0&keyword=${chosenSite}`)
                    .then(res => {return res.json();
                    }).then(result=> {
                        let dataInfo= result.data;
                        mysiteId= dataInfo[0].id
                        // 進到attraction id 頁面
                        location.href = `/attraction/${mysiteId}`;
                        });
                    
                }

            }
            else{
                perSite="null";
                }
        }}
    apiFetch()
    currentPage=1
        // console.log(currentPage)
    let divNew= document.createElement("p");
    document.body.appendChild(divNew);
    divNew.className="divNew";
    let options={
        root:null,
        rootmargin:"-5px",
        threshold: 0.05
        }
    const observer = new IntersectionObserver(endImg, options);
    const target = document.querySelector('.divNew');
        // const img=document.querySelector('.siteinner');
    observer.observe(target);
        // currentPage=1;
    function endImg (entries, ob) {
        entries.forEach(entry => {
        if(entry.isIntersecting){
            if(currentPage !== "null"){
                apiFetch()
                }
            else{currentPage = "null";
                ob.unobserve(target);        
            }

        }
        })}
}

getdata()

