#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>
#include <DHT.h>

const char* ssid = "asd";
const char* password = "10022003";
const char* mqttServer = "broker.hivemq.com";
int port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

const int pinServoOne = 12;
const int pinServoTwo = 13;

Servo servoOne;
Servo servoTwo;

const int dhtPin = 14; 
const int dhtType = DHT11;

DHT dht(dhtPin, dhtType);

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.println("IP address: " + WiFi.localIP().toString());

  client.setServer(mqttServer, port);
  client.setCallback(callback);

  servoOne.attach(pinServoOne);
  servoTwo.attach(pinServoTwo);
  servoOne.write(0);

  dht.begin();
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  
  String stMessage;
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    stMessage += (char)message[i];
  }
  Serial.println();

  if (String(topic) == "position-servo") {
    // Convert String to integer
    int intValue = stMessage.toInt();
    
    Serial.print("Received integer value: ");
    Serial.println(intValue);

    if (intValue < 200) {
      servoOne.write(intValue);
    } else {
      servoTwo.attach(pinServoTwo);
      intValue -= 200;
      Serial.println(intValue);
      servoTwo.write(intValue);
      delay(250);
      servoTwo.detach();
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    long r = random(1000);
    String clientId = "ESP32-" + String(r);

    if (client.connect(clientId.c_str())) {
      Serial.println(" connected");
      client.subscribe("position-servo");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void publishDHTData() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("% Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");

  String payload = String(temperature) + "," + String(humidity);
  client.publish("dht-value", payload.c_str());
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  static unsigned long lastMillis = 0;
  if (millis() - lastMillis > 500) {
    lastMillis = millis();
    publishDHTData();
  }
}
