#include "Arduino.h"
#include "LED.h"
#include "Servo.h"
#include "PIR.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

// Define the RFID pins and LEDs
#define RFID_PIN_RST D8
#define RFID_PIN_SDA D10
#define RED_LED_PIN D6
#define GREEN_LED_PIN D5
#define SERVO9G_PIN_SIG D3
#define PIR_PIN_SIG 2

// Global variables and defines
const int TARGET_REST = 90;    // Starting position
const int TARGET_FINAL = 180;  // Position when event is detected

// Object initialization
Servo servo9g;
PIR pir(PIR_PIN_SIG);

void setup() {
  // Initialize serial communication
  Serial.begin(9600);

  // Init Servo
  servo9g.attach(SERVO9G_PIN_SIG);
  servo9g.write(TARGET_REST);
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
    servo9g.write(TARGET_REST);
    delay(100);
    servo9g.detach();

    // Check for motion
    if (pir.read()) {
      digitalWrite(RED_LED_PIN, LOW);
      digitalWrite(GREEN_LED_PIN, HIGH);

      servo9g.attach(SERVO9G_PIN_SIG);
      servo9g.write(TARGET_FINAL);
      delay(5000); // You might adjust the delay according to your preference
      servo9g.write(TARGET_REST);
      delay(100);
      servo9g.detach();
    }

    // Delay for a short time to prevent rapid toggling
    delay(100);  // Adjust this delay as needed
  }
}
