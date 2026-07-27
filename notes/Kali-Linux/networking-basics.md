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
A subnet mask defines which portion of an IP address represents the **network** and which portion represents the specific **host** (device) within that network.
 
Example: a very common subnet mask is `255.255.255.0`. This means the first three sections of an IP (e.g. `192.168.1`) identify the network itself, while only the last number (e.g. `.5` or `.20`) identifies the specific device within that network. This is how devices determine whether a destination is on their own local network (and can be reached directly) or is somewhere external (requiring a router to forward the traffic).
 
## ARP (Address Resolution Protocol)
Networks communicate using **IP addresses**, but the actual physical hardware only understands **MAC addresses**. ARP is the protocol that bridges this gap: when my device needs to talk to a specific IP address on the local network, it uses ARP to essentially ask "which MAC address belongs to this IP?" and caches the answer in something called an ARP table.
 
## ICMP (Internet Control Message Protocol) and What `ping` Actually Does
This was the part I didn't originally understand, so here's the fuller explanation:
 
`ping` is a small diagnostic tool built on top of the **ICMP** protocol. ICMP isn't used for normal data transfer (like loading a webpage) — it's specifically designed for **network diagnostics and error reporting** between devices.
 
**What happens, step by step, when I run `ping some-address`:**
1. My machine sends out a tiny ICMP packet called an **Echo Request** to the target address — essentially a message that just says "are you there?"
2. If the target device is reachable and configured to respond, it sends back an **Echo Reply** — basically saying "yes, I'm here."
3. My machine measures the **round-trip time** — how long it took for that reply to come back (measured in milliseconds).
4. This repeats a few times (by default), and I get a summary: how many packets got a reply (reachability), and the timing stats (min/avg/max latency).
**Why this is useful:** `ping` answers two very basic but important questions — is the target device actually reachable at all, and if so, how fast/slow is the connection to it. It doesn't tell me anything about *what services* are running on that device (that's what tools like `nmap` are for) — it purely checks basic reachability and latency at the network level.
 
**One nuance worth remembering:** some devices/firewalls are deliberately configured to ignore ICMP Echo Requests (i.e., they won't respond to `ping` even though they're online and reachable through other protocols). So a failed `ping` doesn't always mean a device is offline — it might just mean ICMP is being blocked, which is itself a useful thing to know during reconnaissance.
 
## Ports — Connections and Listening Ports
A single device can run many different services simultaneously (a web server, an email server, SSH access, etc.). To keep data going to the correct service instead of getting mixed up, each service listens on a specific **port** — a number between 0 and 65535.
 
- **Listening port**: a service is actively running and waiting for incoming connections on that port (e.g. port 80 for a web server, port 22 for SSH).
- **Connection**: an actual, currently active link between two devices (e.g. my browser is right now talking to a specific website over port 443).
This is exactly what the `netstat` command is for — it shows which ports on my machine are currently listening, and what active connections currently exist.
 
## Routing Table
When data needs to travel from my device to a destination **outside** my local network (like a website on the internet), my device needs to know which path/gateway to send it through. The **routing table** is essentially a list of rules like: "to reach this range of addresses, send traffic out through this path." The `route` command (or its modern replacement, `ip route`) displays this table, and can also be used to modify it.
 
## How These Concepts Map to the Commands I'm About to Learn
Now that I have this foundation, the upcoming commands make a lot more sense:
- **`ifconfig`** → shows my own IP and MAC address information
- **`iwconfig`** → same idea, but specifically for wireless network interfaces
- **`ping`** → uses ICMP to test whether a host is reachable and measure latency
- **`arp`** → displays the ARP table (IP-to-MAC address mappings)
- **`netstat`** → shows listening ports and active connections
- **`route`** → displays (and can modify) the routing table
---
# Networking Commands
