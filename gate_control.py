from gpiozero import LED
import time

pin = LED(27)

pin.on()
print("on")
time.sleep(0.5)

pin.off()
print("off")
