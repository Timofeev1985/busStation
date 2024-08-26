

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

var timeElement = document.getElementById("currentTime");
setInterval(function () {
  var currentTime = new Date();
  timeElement.textContent = currentTime.toLocaleTimeString();
}, 1000);

const renderBusData = (buses) => {
  const tableBody = document.querySelector("#bus tbody");
  tableBody.textContent = "";
  buses.forEach((bus) => {
    const row = document.createElement("tr");
    const nextDepartureDateTimeUTC = new Date(
      `${bus.nextDeparture.date}T${bus.nextDeparture.time}Z`
    );
    row.innerHTML = `
    <td>${bus.busNumber}</td>
    <td>${bus.startPoint} - ${bus.endPoint}</td>
    <td>${formatDate(nextDepartureDateTimeUTC)}</td>
    <td>${formatTime(nextDepartureDateTimeUTC)}</td>
    <td>${bus.nextDeparture.remaining}</td>
    `;
    
    tableBody.append(row);
  });
};
const initWebSocket = () => {
  const ws = new WebSocket(`wss://${location.host}`);
  ws.addEventListener("open", () => {
    console.log("Websocket connection");
  });
  ws.addEventListener("message", (event) => {
    const buses = JSON.parse(event.data);
    renderBusData(buses);
  });
  ws.addEventListener("error", () => {
    console.log(`Websocket commection close`);
  });
  ws.addEventListener("close", (error) => {
    console.log(`Websocket error:${error}`);
  });
};
const init = async () => {
  const buses = await fetchBusData();
  renderBusData(buses);
  initWebSocket();
};
init();
