/******************************************************************************
  Force_Sensitive_Resistor_Example.ino
  Example sketch for SparkFun's force sensitive resistors
  (https://www.sparkfun.com/products/9375)
  Jim Lindblom @ SparkFun Electronics
  April 28, 2016

  Create a voltage divider circuit combining an FSR with a 3.3k resistor.
  - The resistor should connect from A0 to GND.
  - The FSR should connect from A0 to 3.3V
  As the resistance of the FSR decreases (meaning an increase in pressure), the
  voltage at A0 should increase.

  Development environment specifics:
  Arduino 1.6.7
******************************************************************************/
#include <ArduinoJson.h>

unsigned long lastRead;
int sampleRate = 500; //used for the sampleRate timer

const int FSR_PIN = A0; // Pin connected to FSR/resistor divider
const int FSR_PIN2 = A1;

// Measure the voltage at 5V and resistance of your 3.3k resistor, and enter
// their value's below:
const float VCC = 4.98; // Measured voltage of Ardunio 5V line
const float R_DIV = 4000.0; // Measured resistance of 3.3k resistor

int p5input1; //these variables hold the input values
int p5input2;

void setup()
{
  Serial.begin(9600);
  pinMode(FSR_PIN, INPUT);
  pinMode(FSR_PIN2, INPUT);
}

void loop()
{
  // set up both force sensor pins
  int fsrADC = analogRead(FSR_PIN);
  int fsrADC2 = analogRead(FSR_PIN2);

  // If the FSR has no pressure, the resistance will be
  // near infinite. So the voltage should be near 0.
  if (millis() - lastRead >= sampleRate)
  {
    if (fsrADC != 0 || fsrADC2 != 0) // If the analog reading of either is non-zero
    {

      // Use ADC reading to calculate voltage:
      float fsrV = fsrADC * VCC / 1023.0;
      float fsrV2 = fsrADC2 * VCC / 1023.0;

      // Use voltage and static resistor value to
      // calculate FSR resistance:
      float fsrR = R_DIV * (VCC / fsrV - 1.0);
      float fsrR2 = R_DIV * (VCC / fsrV2 - 1.0);

      /*Serial.println("Resistance: " + String(fsrR) + " ohms");
        Serial.println("Resistance2: " + String(fsrR2) + " ohms");*/

      // Guesstimate force based on slopes in figure 3 of
      // FSR datasheet
      float force;

      float fsrG = 1.0 / fsrR;
      float fsrG2 = 1.0 / fsrR2;// Calculate conductance

      // Break parabolic curve down into two linear slopes:
      if (fsrR <= 600) {
        force = (fsrG - 0.00075) / 0.00000032639;
      } else {
        force =  fsrG / 0.000000642857;
        p5input1 = force;
      }
      // Break parabolic curve down into two linear slopes:
      if (fsrR2 <= 600) {
        force = (fsrG2 - 0.00075) / 0.00000032639;
      } else {
        force =  fsrG2 / 0.000000642857;
        p5input2 = force;
      }

      /*Serial.println("Force1:");
      Serial.print(p5input1);
      Serial.println(" ");

      Serial.println("Force2: ");
      Serial.print(p5input2);
      Serial.println(" ");*/

      DynamicJsonBuffer messageBuffer(200);                   //create the Buffer for the JSON object
      JsonObject& p5Send = messageBuffer.createObject();      //create a JsonObject variable in that buffer

      p5Send["s1"] = p5input1;                             //assign buttonValue to the key "s1" in the json object
      p5Send["s2"] = p5input2;                                //assign anaValue to the key "s2" in the json object

      p5Send.prettyPrintTo(Serial);                                 //print JSON object as a string
      Serial.println();                                     //print a \n character to the serial port to distinguish between objects
    }

    lastRead = millis();
  }
}
