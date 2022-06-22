async function searchData() {
	let val = document.getElementById("search").value;
	let main = document.getElementById("main");
	main.innerHTML = "";
	let divOuter = document.createElement("div");
	divOuter.id = "siteOuter";
	divOuter.className = "siteOuter";
	main.appendChild(divOuter);
	let currentPage = 0;
	async function getKeyword() {
		let keywordAPI = await fetch(
			`/api/attraction?page=${currentPage}&keyword=${val}`
		);
		let result = await keywordAPI.json();
		if (result.error) {
			divOuter.innerHTML = `查無符合${val}的景點`;
		} else {
			let dataInfo = result.data;
			currentPage = result.nextPage;
			let img = [];
			let siteName = [];
			let category = [];
			let mrt = [];
			for (data in dataInfo) {
				let allImg = dataInfo[data].images[0];
				// 抓到每個id的第一張圖片
				img.push(allImg);
				//抓到每個景點名稱
				let allName = dataInfo[data].name;
				siteName.push(allName);
				let allCategory = dataInfo[data].category;
				category.push(allCategory);
				let allMRT = dataInfo[data].mrt;
				mrt.push(allMRT);
			}
			for (let item = 0; item < 12; item++) {
				//抓取每個點的info
				let perSite = siteName[item];
				let perCategory = category[item];
				let perMRT = mrt[item];
				//設定最外層divOuter
				if (perSite !== undefined) {
					let divInner = document.createElement("div");
					divInner.className = "siteInner";

					//生成img跟p Element
					let imgBox = document.createElement("img");
					imgBox.className = "siteImg";
					let nameBox = document.createElement("div");
					nameBox.className = "siteName";
					let categoryBox = document.createElement("div");
					categoryBox.className = "siteCategory";
					let mrtBox = document.createElement("div");
					mrtBox.className = "siteMRT";
					//每個p放入將放入的文字
					let siteText = document.createTextNode(perSite);
					let categoryText = document.createTextNode(perCategory);
					let mrtText = document.createTextNode(perMRT);
					imgBox.src = img[item];
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
					// 建立每個景點id
					let siteId = document.getElementsByClassName("siteInner");
					for (var i = 0; i < siteId.length; i++) {
						siteId[i].id = "id" + (i + 1);
					}
					//拿到每個景點id
					divInner.addEventListener("click", loadAttraction);
					function loadAttraction(event) {
						//取得景點名稱
						let chosenSite = document.getElementById(this.id).childNodes[1]
							.textContent;
						fetch(`/api/attraction?page=0&keyword=${chosenSite}`)
							.then((res) => {
								return res.json();
							})
							.then((result) => {
								let dataInfo = result.data;
								mysiteId = dataInfo[0].id;
								// 進到attraction id 頁面
								location.href = `/attraction/${mysiteId}`;
							});
					}
				} else {
					perSite = "null";
				}
			}
		}
	}
	await getKeyword();
	//我的function
	let divNew = document.createElement("p");
	document.body.appendChild(divNew);
	divNew.className = "divNew";
	let options = {
		root: null,
		// document.querySelector(".siteOuter"),
		rootmargin: "-5px",
		threshold: 0.05,
	};
	const observer = new IntersectionObserver(endImg, options);
	const target = document.querySelector(".divNew");
	observer.observe(target);
	function endImg(entries, ob) {
		entries.forEach(async (entry) => {
			if (entry.isIntersecting) {
				if (currentPage !== "null") {
					await getKeyword();
				} else {
					ob.unobserve(target);
				}
			}
		});
	}
}
