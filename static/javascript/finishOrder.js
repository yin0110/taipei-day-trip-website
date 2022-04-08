let orderNumber = null;
let welcomeTitle = document.querySelector(".section--bookingperson");
let nobooking = document.querySelector(".nobooking");
let footer = document.querySelector(".footer");
let customerName = localStorage.getItem("customerName");
let orderDate = document.querySelector(".bookingperson--orderDate");
let blank = document.querySelector(".blank");

function getPageOrderNumber() {
	let ip = location.host;
	let url = window.location.href;
	orderNumber = url.split(ip + "/thankyou?number=")[1];
	return orderNumber;
}
async function finishOrder() {
	getPageOrderNumber();
	let urlForOrder = `/api/order/${orderNumber}`;
	let methodForOrder = "GET";
	let fetchInfo = await fetch(urlForOrder, { method: methodForOrder });
	let orderInfo = await fetchInfo.json();
	if (orderInfo["data"]) {
		setTimeout(function () {
			blank.style.display = "none";
		}, 300);
		welcomeTitle.innerHTML = `您好，${customerName}，感謝您完成訂購`;
		nobooking.innerHTML = `訂單號碼：${orderNumber}`;
		welcomeTitle.style.marginBottom = "35px";
		nobooking.style.marginBottom = "20px";
		orderDate.innerHTML =
			"訂購日期：" +
			orderNumber.slice(0, 4) +
			"-" +
			orderNumber.slice(4, 6) +
			"-" +
			orderNumber.slice(6, 8);
	} else {
		setTimeout(function () {
			blank.style.display = "none";
		}, 300);
		welcomeTitle.innerHTML = `您好，請輸入正確的訂單號碼`;
		welcomeTitle.style.marginBottom = "35px";
		nobooking.style.marginBottom = "40px";
		orderDate.style.display = "none";
	}
}
finishOrder();
