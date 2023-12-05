#include "Arduino.h"
#include "LED.h"
#include "Servo.h"
#include "PIR.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>


// Define the pins and LEDs
#define RED_LED_PIN D5
#define GREEN_LED_PIN D6
#define SERVO9G_PIN_SIG D3
#define PIR_PIN_SIG D2

// Global variables and defines

// WIFI Settings
// Define your WiFi credentials

// Define the ENDPOINT URL
String ENDPOINT = "https://769d-2801-84-1-2080-a047-b7b1-f4ad-349.ngrok-free.app/cotroller/configs/d3d6948c-98fb-41bb-9f34-17882b11b6f8";

// WIFI settings
const char* ssid = "xxx";
const char* password = "xxx";


// Device config
const String DEVICE_ID = "d3d6948c-98fb-41bb-9f34-17882b11b6f8"; 

struct DeviceConfig {
  unsigned int cooldown;
  unsigned int targetRest;
  unsigned int targetFinal;
};


// Object initialization
Servo servo9g;
PIR pir(PIR_PIN_SIG);
WiFiClient wifiClient;
WiFiClient client;
DeviceConfig config = { 2000, 0, 180 };


void setup() {
  // Initialize serial communication
  Serial.begin(9600);

  // WiFi.begin(ssid, password);
  // while (WiFi.status() != WL_CONNECTED) {
  //   delay(1000);
  //   Serial.println("Connecting to WiFi...");
  // }
  // postLog(DEVICE_ID, "WIFI_ON");

  // Serial.println("Connected to WiFi");
  // Serial.println("IP address: ");
  // Serial.println(WiFi.localIP());


  Serial.println("Getting device config");
  // fetchDeviceConfig();
  Serial.println("Got device configs.");


  // Init Servo
  // postLog(DEVICE_ID, "START");
  servo9g.attach(SERVO9G_PIN_SIG);
  servo9g.write(config.targetRest);
  delay(100);
  servo9g.detach();

  // Set LED pins as outputs
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);

  // Initially, turn on the red LED and turn off the green LED
  digitalWrite(RED_LED_PIN, HIGH);
  digitalWrite(GREEN_LED_PIN, LOW);

  
}

void loop() {
  while (1) {

    digitalWrite(RED_LED_PIN, HIGH);
    digitalWrite(GREEN_LED_PIN, LOW);

    servo9g.attach(SERVO9G_PIN_SIG);
    servo9g.write(config.targetRest);
    delay(100);
    servo9g.detach();
    Serial.print(F("Val: ")); Serial.println(pir.read());

    // Check for motion
    if (pir.read()) {
      
      // postLog(DEVICE_ID, "DOOR_OPEN");
      digitalWrite(RED_LED_PIN, LOW);
      digitalWrite(GREEN_LED_PIN, HIGH);

      servo9g.attach(SERVO9G_PIN_SIG);
      servo9g.write(config.targetFinal);
      delay(config.cooldown); // You might adjust the delay according to your preference
      servo9g.write(config.targetRest);
      servo9g.detach();
      // postLog(DEVICE_ID, "DOOR_CLOSE");
    }

    // Delay for a short time to prevent rapid toggling
    delay(200);  // Adjust this delay as needed
  }
}

void fetchDeviceConfig() {
  HTTPClient http;

  Serial.println(ENDPOINT);
  http.begin(wifiClient, ENDPOINT);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    // Parse JSON payload
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      config.cooldown = doc["cooldown"].as<unsigned int>();
      config.targetRest = doc["targetRest"].as<unsigned int>();
      config.targetFinal = doc["targetFinal"].as<unsigned int>();

      Serial.println("Device Configuration:");
      Serial.println("Cooldown: " + String(config.cooldown));
      Serial.println("Target Rest: " + String(config.targetRest));
      Serial.println("Target Final: " + String(config.targetFinal));
      
      // Use deviceConfig as needed
    } else {
      Serial.println("Failed to parse JSON");
    }
  } else {
    Serial.println("Error on HTTP request");
  }

  http.end();
}

void postLog(const String deviceId, const char* logMessage) {

  WiFiClient client;
  HTTPClient http;

  String payload = "{\"device\": \"" + String(deviceId) + "\", \"log\": \"" + String(logMessage) + "\"}";

  http.begin(client, ENDPOINT);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(payload);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.println("HTTP response code: " + String(httpCode));
    Serial.println("Server response: " + response);
  } else {
    Serial.println("HTTP request failed");
  }

  http.end();
}