#!/usr/bin/env python3
"""
GPIO Control Script for Gate Controller
Oddělený script pro ovládání GPIO pinu
"""

from gpiozero import LED, Device
import time
import sys
import os
from gpiozero.pins.rpigpio import RPiGPIOFactory
from gpiozero.pins.pigpio import PiGPIOFactory

def setup_gpio_factory():
    """Nastavení GPIO factory s fallback možnostmi"""
    try:
        # Nejprve zkus pigpio (často funguje lépe na novějších Raspberry Pi)
        Device.pin_factory = PiGPIOFactory()
        print("GPIO: Using PiGPIO factory", file=sys.stderr)
        return True
    except Exception as e:
        print(f"GPIO: PiGPIO failed: {e}", file=sys.stderr)
        try:
            # Fallback na RPiGPIO
            Device.pin_factory = RPiGPIOFactory()
            print("GPIO: Using RPiGPIO factory", file=sys.stderr)
            return True
        except Exception as e2:
            print(f"GPIO: RPiGPIO also failed: {e2}", file=sys.stderr)
            # Použij default factory
            print("GPIO: Using default factory", file=sys.stderr)
            return True

def toggle_gate_pin(pin_number=27, duration=0.5):
    """
    Sepne a vypne GPIO pin
    
    Args:
        pin_number (int): Číslo GPIO pinu (default: 27)
        duration (float): Doba sepnutí v sekundách (default: 0.5)
    
    Returns:
        bool: True pokud bylo sepnutí úspěšné, False jinak
    """
    try:
        # Nastav GPIO factory
        setup_gpio_factory()
        
        # Inicializuj LED/pin
        pin = LED(pin_number)
        
        # Sepni pin
        pin.on()
        print(f"GPIO {pin_number}: ON", file=sys.stderr)
        
        # Čekej
        time.sleep(duration)
        
        # Vypni pin
        pin.off()
        print(f"GPIO {pin_number}: OFF", file=sys.stderr)
        
        # Uklid
        pin.close()
        
        return True
        
    except Exception as e:
        print(f"GPIO Error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # Pokud je script spuštěn přímo
    pin = 27
    duration = 0.5
    
    # Parsuj argumenty z příkazové řádky
    if len(sys.argv) > 1:
        try:
            pin = int(sys.argv[1])
        except ValueError:
            print(f"Invalid pin number: {sys.argv[1]}", file=sys.stderr)
            sys.exit(1)
    
    if len(sys.argv) > 2:
        try:
            duration = float(sys.argv[2])
        except ValueError:
            print(f"Invalid duration: {sys.argv[2]}", file=sys.stderr)
            sys.exit(1)
    
    print(f"Toggling GPIO pin {pin} for {duration} seconds", file=sys.stderr)
    
    success = toggle_gate_pin(pin, duration)
    
    if success:
        print("SUCCESS")
        sys.exit(0)
    else:
        print("FAILED")
        sys.exit(1)
