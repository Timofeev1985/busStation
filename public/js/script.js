

const fetchBusData = async () => {
  try {
    const response = await fetch("/next-departure");
    
    if (!response.ok) {
      throw new Error(`HTTP Error! status:${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching busdata:${error}`);
  }
};
const formatDate = (date) => date.toISOString().split("T")[0];
const formatTime = (date) => date.toTimeString().split(" ")[0].slice(0, 5);
//Время
const updateTime = () => {
  const currenTimeElrmrnt = document.querySelector("#current-time");
  const now = new Date();
  currenTimeElrmrnt.textContent = now.toTimeString().split(" ")[0];
  
  setTimeout(updateTime,1000)
}

// var timeElement = document.getElementById("currentTime");
// setInterval(function () {
//   var currentTime = new Date();
//   timeElement.textContent = currentTime.toLocaleTimeString();
// }, 1000);

const renderBusData = (buses) => {
  const tableBody = document.querySelector("#bus tbody");
  tableBody.textContent = "";
  
  const getTimeRemainingSeconds =(departureTime) =>{
    const now = new Date();
    const timeDeference = departureTime - now;
    return Math.floor(timeDeference / 1000);
  }
  buses.forEach((bus) => {
    const row = document.createElement("tr");
    const nextDepartureDateTimeUTC = new Date(
      `${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`
    );
    const remainingSeconds = getTimeRemainingSeconds(nextDepartureDateTimeUTC);
    const remainingTimeText = remainingSeconds < 60 ? 'Отправляется' : bus.nextDeparture.remaining;
    row.innerHTML = `
    <td>${bus.busNumber}</td>
    <td>${bus.startPoint} - ${bus.endPoint}</td>
    <td>${formatDate(nextDepartureDateTimeUTC)}</td>
    <td>${formatTime(nextDepartureDateTimeUTC)}</td>
    <td>${remainingTimeText}</td>
    `;
    
    tableBody.append(row);
  });
};
const initWebSocket = () => {
  const ws = new WebSocket(`ws://${location.host}`);
  ws.addEventListener("open", () => {
    console.log("Websocket connection");
  });
  ws.addEventListener("message", (event) => {
    const buses = JSON.parse(event.data);
    renderBusData(buses);
  });
  ws.addEventListener("error", () => {
    console.log(`Websocket connection close`);
  });
  ws.addEventListener("close", (error) => {
    console.log(`Websocket error:${error}`);
  });
};
const init = async () => {
  const buses = await fetchBusData();
  renderBusData(buses);
  initWebSocket();
  updateTime();
};
init();
