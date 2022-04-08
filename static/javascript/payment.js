let getOrderPerson = null;
let getOrderPhone = null;
let getOrderEmail = null;
let getPrimeError = document.querySelector(".payment__errorMessage");
let errorHeight = document.querySelector("section3__payment--password");

async function deleteLastAttraction() {
	let url = `/api/booking`;
	let accessMethod = "DELETE";
	let fetchView = await fetch(url, { method: accessMethod });
}

async function checkBookingInfo() {
	let orderPerson = document.querySelector("#bookingname");
	let orderEmail = document.querySelector("#bookingemail");
	let orderPhone = document.querySelector("#bookingphone");
	if (getOrderPerson == "" && getOrderEmail == "" && getOrderPhone == "") {
		orderPerson.placeholder = "請輸入姓名";
		orderEmail.placeholder = "請輸入信箱";
		orderPhone.placeholder = "請輸入電話";
	} else if (getOrderPerson == "" && getOrderEmail == "") {
		orderPerson.placeholder = "請輸入姓名";
		orderEmail.placeholder = "請輸入信箱";
	} else if (getOrderEmail == "" && getOrderPhone == "") {
		orderEmail.placeholder = "請輸入信箱";
		orderPhone.placeholder = "請輸入電話";
	} else if (getOrderPerson == "" && getOrderPhone == "") {
		orderPerson.placeholder = "請輸入姓名";
		orderPhone.placeholder = "請輸入電話";
	} else if (getOrderEmail == "") {
		orderEmail.placeholder = "請輸入信箱";
	} else if (getOrderPhone == "") {
		orderPhone.placeholder = "請輸入電話";
	} else if (getOrderPerson == "") {
		orderPerson.placeholder = "請輸入姓名";
	} else {
		getOrderPerson = orderPerson.value;
		getOrderEmail = orderEmail.value;
		getOrderPhone = orderPhone.value;
	}
}

TPDirect.setupSDK(
	123997,
	"app_TUOjw0xyPcLl2hu0QRZWoCj8Z1A0wy2mFC0JKFxF5kunSk7NpE9hY5pPm2xY",
	"sandbox"
);

var fields = {
	number: {
		// css selector
		element: "#card-number",
		placeholder: "**** **** **** ****",
	},
	expirationDate: {
		// DOM object
		element: document.getElementById("card-expiration-date"),
		placeholder: "MM / YY",
	},
	ccv: {
		element: "#card-ccv",
		placeholder: "CVV",
	},
};

TPDirect.card.setup({
	fields: fields,
	styles: {
		// Style all elements
		input: {
			color: "gray",
		},
		// Styling ccv field
		"input.ccv": {
			// 'font-size': '16px'
		},
		// Styling expiration-date field
		"input.expiration-date": {
			// 'font-size': '16px'
		},
		// Styling card-number field
		"input.card-number": {
			// 'font-size': '16px'
		},
		// style focus state
		":focus": {
			// 'color': 'black'
		},
		// style valid state
		".valid": {
			color: "green",
		},
		// style invalid state
		".invalid": {
			color: "red",
		},
		// Media queries
		// Note that these apply to the iframe, not the root window.
		"@media screen and (max-width: 400px)": {
			input: {
				color: "orange",
			},
		},
	},
});

TPDirect.card.getTappayFieldsStatus();

async function onSubmit(event) {
	await checkBookingInfo();
	event.preventDefault();

	// 取得 TapPay Fields 的 status
	const tappayStatus = TPDirect.card.getTappayFieldsStatus();

	// 確認是否可以 getPrime
	if (tappayStatus.canGetPrime === false) {
		getPrimeError.innerHTML = "請輸入正確的付款資訊";
		errorHeight.style.marginBottom = "20px";
		return;
	}

	// Get prime
	TPDirect.card.getPrime(async (result) => {
		if (result.status !== 0) {
			getPrimeError.innerHTML = "請輸入正確的付款資訊";
			errorHeight.style.marginBottom = "20px";
			return;
		} else {
			prime = result.card.prime;
			let url = `/api/booking`;
			let method = "GET";
			let fetchInfo = await fetch(url, {
				method: method,
			});
			attractionInfo = await fetchInfo.json();
			attractionInfo = attractionInfo["data"];
			id = attractionInfo["attraction"]["id"];
			attractionName = attractionInfo["attraction"]["name"];
			address = attractionInfo["attraction"]["address"];
			image = attractionInfo["attraction"]["images"];
			date = attractionInfo["date"];
			price = attractionInfo["price"];
			time = attractionInfo["time"];
			let urlForOrder = `/api/orders`;
			let methodForOrder = "POST";
			let orderInfo = await fetch(urlForOrder, {
				method: methodForOrder,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					attractionId: id,
					name: attractionName,
					address: address,
					image: image,
					date: date,
					time: time,
					price: price,
					contactName: getOrderPerson,
					email: getOrderEmail,
					phone: getOrderPhone,
					prime: prime,
				}),
			});
			let statusCode = await orderInfo.json();
			if (statusCode["data"]["payment"]["status"] == 0) {
				orderNumber = statusCode["data"]["number"];
				await deleteLastAttraction();
				location.href = `/thankyou?number=${orderNumber}`;
			} else {
			}
		}
		// alert("get prime 成功，prime: " + result.card.prime);

		// send prime to your server, to pay with Pay by Prime API .
		// Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
	});
}
