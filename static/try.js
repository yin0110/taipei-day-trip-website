let currentPage=0;
let main=document.createElement("main");
document.body.appendChild(main);
main.id="main";

function getdata(){
    currentPage=0;
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
        }
            else{
                perSite="null";
                }
        }}
    apiFetch()
    // currentPage=1
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
        currentPage=1;
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

async function searchData(){ 
    let val = document.getElementById('search').value;
    let main = document.getElementById("main");
    main.innerHTML = '';
    let divOuter= document.createElement("div");
    divOuter.id="siteOuter";
    divOuter.className="siteOuter";
    main.appendChild(divOuter);
    let page=0;
        async function getKeyword(){
            let keywordAPI= await fetch(`/api/attraction?page=${page}&keyword=${val}`);
            let keywordJson= await keywordAPI.json();
                //拿出dataAPI字典，以便後面拿取不同資訊資
            if(keywordJson.error==true){
                divOuter.innerHTML = `查無符合${val}的景點`;
                }
                else{
                let dataInfo= keywordJson.data;  
                page=keywordJson.nextPage;
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
                for(let item=0; item<12; item++){
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
                    // let divOuter=getElementById("siteOuter")
                    divOuter.appendChild(divInner);
                    divInner.appendChild(imgBox);
                    //sitename生成p element再放入文字
                    divInner.appendChild(nameBox);
                    nameBox.appendChild(siteText);
                    divInner.appendChild(mrtBox);
                    mrtBox.appendChild(mrtText);
                    divInner.appendChild(categoryBox);
                    categoryBox.appendChild(categoryText);
                }
                else{
                    perSite="null";
                    }
                }
                }
                
            }
            await getKeyword();
            let divNew= document.createElement("p");
            document.body.appendChild(divNew);
            divNew.className="divNew";
            let options={
                root:null,
                // document.querySelector(".siteOuter"),
                rootmargin:"-5px",
                threshold: 0.05
                }
            const observer = new IntersectionObserver(endImg, options);
            const target = document.querySelector('.divNew');
            // const img=document.querySelector('.siteinner');
            observer.observe(target);
            page=1
            async function endImg (entry, ob) {
                if(entry.isIntersecting){
                    if(page !== "null"){
                    await getKeyword();
                }
                    else{
                    ob.unobserve(target);
                    }
                }
                }     

}