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
}
const renderBusData = (buses) => {
    const tableBody = document.querySelector('#bus tbody');
    tableBody.textContent="";
    console.log(buses);
    
}
const init = () => {
    const buses = fetchBusData(); 
    renderBusData(buses);
}
init();