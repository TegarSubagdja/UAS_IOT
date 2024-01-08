let mqttClient;
const topic1 = "all-data";
const topic2 = "image-topic";
const topicServo = "position-servo";

const rangeInput = document.getElementById("my-slider");
const leftMove = document.getElementById("left");
const rightMove = document.getElementById("right");

leftMove.addEventListener("click", function () {
  publishServoPosition(380);
});

rightMove.addEventListener("click", function () {
  publishServoPosition(200);
});

rangeInput.addEventListener("change", function () {
  const currentValue = rangeInput.value;
  publishServoPosition(currentValue);
});

function publishServoPosition(value) {
  publishData(topicServo, value);
}

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);
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
    mqttClient.subscribe(topic1, { qos: 0 });
    mqttClient.subscribe(topic2, { qos: 0 });
  });

  mqttClient.on("message", (receivedTopic, message, packet) => {
    console.log(
      "Received Message: " +
      message.toString() +
      "\nOn topic: " +
      receivedTopic
    );
    handleReceivedData(receivedTopic, message.toString());
  });
}

function handleReceivedData(receivedTopic, dataString) {
  if (receivedTopic === topic1) {
    const dataArray = dataString.split(",");
    const value1 = parseFloat(dataArray[0].trim());
    const value2 = parseFloat(dataArray[1].trim());
    const value3 = parseFloat(dataArray[2].trim());
    const value4 = parseInt(dataArray[3].trim());

    const suhuArea = document.getElementById("suhuDht");
    const kelembabanArea = document.getElementById("kelembabanDht");
    const jumlahOrang = document.getElementById("sum");
    const estimasi = document.getElementById("estimasi");

    suhuArea.innerHTML = `${value1} <span class="text-success text-sm font-weight-bolder">°</span>`;
    kelembabanArea.innerHTML = `${value2} <span class="text-success text-sm font-weight-bolder">%</span>`;
    jumlahOrang.innerHTML = `${value3} <span class="text-success text-sm font-weight-bolder">orang</span>`;
    estimasi.innerHTML = `${value4} <span class="text-success text-sm font-weight-bolder">orang</span>`;
  } else if (receivedTopic === topic2) {
    const base64Image = dataString;
    const imageElement = document.getElementById("image-detect");
    imageElement.src = base64Image;
  }
}

function publishData(topic, value) {
  mqttClient.publish(topic, value.toString());
}

window.addEventListener("load", (event) => {
  connectToBroker();
});
