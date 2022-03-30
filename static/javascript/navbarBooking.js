let bookingJourney= document.querySelector(".journey--book");
bookingJourney.addEventListener('click', bookingJourneyOnclick);
bookingJourney.style.cursor="pointer";


async function bookingJourneyOnclick(){
    url= `/api/usr`;
    accessMethod="GET";
    try{
    let fetchInfo= await fetch(url, {method:accessMethod});
    let statusCode= await fetchInfo.json();
    if (statusCode["data"]){
        location.href = `/booking`;
    }
    }
    catch(error){
        popupLogin();
    }
}