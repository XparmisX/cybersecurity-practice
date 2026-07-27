Before getting into the actual commands (`ifconfig`, `iwconfig`, `ping`, `arp`, `netstat`, `route`), I needed to properly understand the underlying networking concepts they all rely on. These are my notes on that foundational layer.
 
## IP Address
Every device connected to a network (home Wi-Fi, the internet, etc.) gets a unique **numerical address**, so other devices know where to send data — conceptually similar to a postal address.
 
### IPv4 vs IPv6
- **IPv4**: the familiar format, e.g. `192.168.1.1` — four numbers (0–255) separated by dots. Its major limitation is a finite address space (~4.3 billion addresses total), which the modern internet has essentially exhausted.
- **IPv6**: a newer, much longer format, e.g. `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. It exists specifically to solve the address-exhaustion problem, since its address space is astronomically larger (practically limitless for foreseeable use).
## MAC Address
Unlike an IP address (which can change depending on what network I connect to), a **MAC address** is a **physical, hardware-level identifier** burned into a device's network interface card (Wi-Fi or Ethernet). It looks like `00:1A:2B:3C:4D:5E` — six pairs of hexadecimal characters.
 
**Key distinction:**
- IP = like a postal address — changes depending on where you are.
- MAC = like a hardware serial number — effectively permanent (unless deliberately altered, a technique known as MAC spoofing, which comes up in ethical hacking contexts).
## Subnet Mask
