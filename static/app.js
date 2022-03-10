let nextPage=0;
let main=document.createElement("main");
document.body.appendChild(main);
// let divOuter= document.createElement("div");
// divOuter.id="siteOuter";
// divOuter.className="siteOuter";
// main.appendChild(divOuter);
main.id="main";


async function getdata(){
    let divOuter= document.createElement("div");
    divOuter.id="siteOuter";
    divOuter.className="siteOuter";
    main.appendChild(divOuter);
    let dataAPI= await fetch(`/api/attraction?page=${nextPage}`);
    let dataJson= await dataAPI.json();
    //拿出dataAPI字典，以便後面拿取不同資訊資料
    let dataInfo= dataJson.data;
    
    function buildelement(){
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
        // let divOuter=getElementById("siteOuter");
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
buildelement();
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
    
    function endImg (entries, ob) {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            if(nextPage < 4){
                nextPage += 1;
            // else{nextPage = "null" }
            fetch(`/api/attraction?page=${nextPage}`)
            .then(res => {return res.json();
            }).then(result=> {
                let dataInfo= result.data;
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
            });
        }
        else{nextPage = "null";
            ob.unobserve(target);        
    }


          //最外層if  
          }
        })}
}
getdata();
    
function searchData(){ 
    let val = document.getElementById('search').value;
    let main = document.getElementById("main");
    main.innerHTML = '';
    let divOuter= document.createElement("div");
    divOuter.id="siteOuter";
    divOuter.className="siteOuter";
    main.appendChild(divOuter);
    let nextPage=0;
        fetch(`/api/attraction?page=${nextPage}&keyword=${val}`)
            .then(res => {return res.json();
            }).then(result=> {
                if(result.error){
                    divOuter.innerHTML = `查無符合${val}的景點`;
                    console.log(result)
                }
                else{
                let dataInfo= result.data;
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
            ;})
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
    
    function endImg (entries, ob) {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            if(nextPage < 3){
                nextPage += 1;
            fetch(`/api/attraction?page=${nextPage}&keyword=${val}`)
            .then(res => {return res.json();
            }).then(result=> {
                let page= result.nextPage;
                console.log(page)
                if (page!==false){
                let dataInfo= result.data;
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
            else{
                page="null";
                ob.unobserve(target);
            }
        });

         
        }
        else{nextPage = "null";
        ob.unobserve(target);
    }
        }
        })}
    



}
