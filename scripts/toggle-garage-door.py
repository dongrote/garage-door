#!/usr/bin/env python3
from time import sleep
from gpiozero.output_devices import DigitalOutputDevice

#
# Relay is hooked up to share power with signal line
# Load is hooked up to Normal-Open.
#

def blink_sync(relay, sleep_time):
  # DigitalOutputDevice.blink creates a thread, we need synchronous
  # execution; use .on() and .off() with time.sleep() instead
  relay.on()
  sleep(sleep_time)
  relay.off()

# This object instantiation does not toggle the garage door opener
# at creation time of the object; other configurations cause the
# relay to switch and thus unintentionally toggle the garage door opener
relay = DigitalOutputDevice('GPIO4', True, False)
blink_sync(relay, 0.4)
