from gpiozero import LED
from gpiozero.pins.rpigpio import RPiGPIOFactory
import time

pin = LED(27)

pin.on()
print("on")
time.sleep(0.5)

pin.off()
print("off")