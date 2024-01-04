let mqttClient;
const topic1 = "dht-value"; // Ganti dengan topik pertama yang diinginkan
const topic2 = "image-topic"; // Ganti dengan topik kedua yang diinginkan

window.addEventListener("load", (event) => {
    connectToBroker();
});

function connectToBroker() {
    const clientId = "client" + Math.random().toString(36).substring(7);

    // Change this to point to your MQTT broker
    const host = "ws://broker.hivemq.com:8000/mqtt";

    const options = {
        keepalive: 60,
        clientId: clientId,
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
    };

    mqttClient = mqtt.connect(host, options);

    mqttClient.on("error", (err) => {
        console.log("Error: ", err);
        mqttClient.end();
    });

    mqttClient.on("reconnect", () => {
        console.log("Reconnecting...");
    });

    mqttClient.on("connect", () => {
        console.log("Client connected:" + clientId);
        // Subscribe to the predefined topics
        mqttClient.subscribe(topic1, { qos: 0 });
        mqttClient.subscribe(topic2, { qos: 0 });
    });

    // Received
    mqttClient.on("message", (receivedTopic, message, packet) => {
        console.log(
            "Received Message: " + message.toString() + "\nOn topic: " + receivedTopic
        );
        handleReceivedData(receivedTopic, message.toString());
    });
}

function handleReceivedData(receivedTopic, dataString) {
    if (receivedTopic === topic1) {
        // Misalkan format data adalah "24.00, 25.00"
        const dataArray = dataString.split(","); // Pisahkan nilai berdasarkan koma
        const value1 = parseFloat(dataArray[0].trim()); // Ambil nilai pertama dan konversi ke float
        const value2 = parseFloat(dataArray[1].trim()); // Ambil nilai kedua dan konversi ke float

        // Tampilkan nilai di elemen HTML
        const suhuArea = document.getElementById("suhuDht");
        const kelembabanArea = document.getElementById("kelembabanDht");

        suhuArea.innerHTML = `${value1} <span class="text-success text-sm font-weight-bolder">°</span>`;
        kelembabanArea.innerHTML = `${value2} <span class="text-success text-sm font-weight-bolder">%</span>`;
    } else if (receivedTopic === topic2) {
        // Misalkan format data adalah base64 gambar
        const base64Image = dataString;

        // Set sumber (src) elemen gambar
        const imageElement = document.getElementById("image-detect");
        imageElement.src = base64Image;
    }
}
