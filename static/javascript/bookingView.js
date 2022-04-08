let welcomeTitle = document.querySelector(".section--bookingperson");
let customerName = localStorage.getItem("customerName");
let attractionName = document.querySelector(".box--attractionName--content");
let bookingDate = document.querySelector(".box--date--content");
let bookingTime = document.querySelector(".box--time--content");
let bookingCost = document.querySelector(".box--cost--content");
let attractionAddress = document.querySelector(".box--place--content");
let attractionImages = document.querySelector(".booking--img");
let bookingView = document.querySelector(".wholeSection");
let nobooking = document.querySelector(".nobooking");
let footer = document.querySelector(".footer");
let totalPayment = document.querySelector(".section4__sum--totalpayment");
let blank = document.querySelector(".blank");

async function showBookingView() {
	setTimeout(function () {
		blank.style.display = "none";
	}, 200);
	welcomeTitle.innerHTML = `您好， ${customerName}，待預定的行程如下：`;
	let url = `/api/booking`;
	let accessMethod = "GET";
	let fetchView = await fetch(url, { method: accessMethod });
	let statusCode = await fetchView.json();
	if (statusCode["message"]) {
		bookingView.style.display = "none";
		nobooking.innerHTML = statusCode["message"];
		footer.style.height = "865px";
		welcomeTitle.style.marginBottom = "35px";
		nobooking.style.marginBottom = "40px";
	} else {
		nobooking.innerHTML = "";
		footer.style.height = "104px";
		welcomeTitle.style.marginBottom = "";
		nobooking.style.marginBottom = "";
		attractionInfo = statusCode["data"]["attraction"];
		bookingInfo = statusCode["data"];
		attractionName.innerHTML = attractionInfo["name"];
		attractionAddress.innerHTML = attractionInfo["address"];
		attractionImages.src = attractionInfo["images"];
		bookingDate.innerHTML = bookingInfo["date"];
		if (bookingInfo["time"] == "morning") {
			bookingTime.innerHTML = "上半天";
		} else {
			bookingTime.innerHTML = "下半天";
		}
		bookingCost.innerHTML = bookingInfo["price"];
		totalPayment.innerHTML = `總價：新台幣 ${bookingInfo["price"]} 元`;
	}
}
showBookingView();

async function deleteBooking() {
	let url = `/api/booking`;
	let accessMethod = "DELETE";
	let fetchView = await fetch(url, { method: accessMethod });
	let statusCode = await fetchView.json();
	showBookingView();
}
