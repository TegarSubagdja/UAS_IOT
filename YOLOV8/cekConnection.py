import paho.mqtt.client as mqtt
import time

# This is the Publisher

# MQTT Broker Configuration
mqtt_broker = "broker.hivemq.com"
mqtt_port = 1883
mqtt_topic = "datadaritegar"

# Create an MQTT client instance
client = mqtt.Client()

# Connect to the MQTT broker
client.connect(mqtt_broker, mqtt_port, 60)

# Publish messages every 2 seconds
while True:
    message = "Hello, world!"  # Replace this with your desired message
    client.publish(mqtt_topic, message)
    print(f"Published message: {message}")
    time.sleep(2)
