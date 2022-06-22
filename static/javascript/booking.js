let errorMessage = document.querySelector(".error");
let date = document.querySelector("#date");

async function deleteLastAttraction() {
	let url = `/api/booking`;
	let accessMethod = "DELETE";
	let fetchView = await fetch(url, { method: accessMethod });
}

async function getBookingInfo() {
	if (document.getElementById("time1").checked) {
		cost = document.getElementById("time1").value;
		costInfo = Number(cost.substr(4, 4));
		dateInfo = date.value;
		time = "morning";
		thisId = Number(thisId);
		await getPageAttractionId();
		let url = `/api/booking`;
		let accessMethod = "POST";
		let fetchInfo = await fetch(url, {
			method: accessMethod,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				attractionId: thisId,
				date: dateInfo,
				time: time,
				price: costInfo,
			}),
		});
		let statusCode = await fetchInfo.json();
		if (statusCode["message"]) {
			errorMessage.innerHTML = statusCode["message"];
		} else {
			location.href = `/booking`;
		}
	} else {
		document.getElementById("time2").checked;
		cost = document.getElementById("time2").value;
		costInfo = Number(cost.substr(4, 4));
		dateInfo = date.value;
		time = "afternoon";
		let url = `/api/booking`;
		let accessMethod = "POST";
		let fetchInfo = await fetch(url, {
			method: accessMethod,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				attractionId: thisId,
				date: dateInfo,
				time: time,
				price: costInfo,
			}),
		});
		let statusCode = await fetchInfo.json();
		if (statusCode["message"]) {
			errorMessage.innerHTML = statusCode["message"];
		} else {
			location.href = `/booking`;
		}
	}
}

async function booking() {
	url = `/api/usr`;
	accessMethod = "GET";
	try {
		let fetchInfo = await fetch(url, { method: accessMethod });
		let statusCode = await fetchInfo.json();
		if (statusCode["data"]) {
			async function deleteLastAttraction() {
				let url = `/api/booking`;
				let accessMethod = "DELETE";
				let fetchView = await fetch(url, { method: accessMethod });
			}
			await deleteLastAttraction();
			await getBookingInfo();
		}
	} catch (error) {
		popupLogin();
	}
}
