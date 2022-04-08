let orderNumber = null;
let welcomeTitle = document.querySelector(".section--bookingperson");
let nobooking = document.querySelector(".nobooking");
let footer = document.querySelector(".footer");
let customerName = localStorage.getItem("customerName");

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
		welcomeTitle.innerHTML = `您好，${customerName}，感謝您完成訂購`;
		nobooking.innerHTML = `訂單號碼：${orderNumber}`;
		footer.style.height = "865px";
		welcomeTitle.style.marginBottom = "35px";
		nobooking.style.marginBottom = "40px";
	} else {
		welcomeTitle.innerHTML = `您好，請輸入正確的訂單號碼`;
		footer.style.height = "865px";
		welcomeTitle.style.marginBottom = "35px";
		nobooking.style.marginBottom = "40px";
	}
}
finishOrder();
