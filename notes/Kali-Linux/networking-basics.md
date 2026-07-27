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
Building on the concepts from `networking-basics.md`, here's what I got when I actually ran each command in my Kali VM, and what it means — plus why each one actually matters in pentesting.
 
## `ifconfig`
 
```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fd17:625c:f037:2:6c38:68cc:e7ed:c0e1  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::d1b0:e08b:1ed2:14c  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:5a:87:bc  txqueuelen 1000  (Ethernet)
        RX packets 888  bytes 687896 (671.7 KiB)
        TX packets 635  bytes 80683 (78.7 KiB)
 
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
```
 
**What this shows:** every network interface on my machine and its addressing info.
 
- **`eth0`** is my main (virtual) Ethernet interface — this is the one actually connecting me to the network.
  - `inet 10.0.2.15` → my IPv4 address. This `10.0.2.x` range is VirtualBox's default **NAT network** — it's not my real home network address, it's a private virtual network VirtualBox creates between the VM and my host machine.
  - `netmask 255.255.255.0` → matches the subnet mask concept from my notes — the `10.0.2` part is the network, `.15` is my specific host on it.
  - `inet6 ...` → my IPv6 addresses (I have two: a global one and a link-local one, `fe80::...`, which is only usable on the local network segment, not routable to the internet).
  - `ether 08:00:27:5a:87:bc` → this is my MAC address. Interestingly, `08:00:27` is a well-known VirtualBox vendor prefix — so this MAC actually reveals that this is a VirtualBox VM, which is a neat real-world example of how MAC address prefixes can fingerprint virtualization/hardware vendors.
  - RX/TX packets → how much data has been received/transmitted through this interface so far.
- **`lo`** is the **loopback interface** — always `127.0.0.1`. This is a virtual interface that represents "talking to myself" (i.e., a service on my own machine connecting to another service on the same machine, without ever touching a physical network card). Any traffic sent to `127.0.0.1` never leaves the device.
**Pentesting relevance:** `ifconfig` is usually the very first command I'd run on any machine (my own or one I've gained access to) to answer "what network am I actually on, and what's my address on it?" It's foundational recon — I can't plan any further network activity (scanning, pivoting, etc.) without first knowing my own position in the network.
 
## `iwconfig` — Failed to Install
 
```
Command 'iwconfig' not found, but can be installed with:
sudo apt install wireless-tools
...
Error: Package 'wireless-tools' has no installation candidate
```
 
This failed because **`wireless-tools` (which provides `iwconfig`) has been deprecated/obsoleted** in current Kali repositories — it's an older package that's been phased out in favor of the newer `iw` command, which does the same job (showing/configuring wireless interface settings) with more modern syntax.
 
There's also a more fundamental reason `iwconfig` wouldn't show anything useful here even if installed: my VM's `eth0` is a **virtual Ethernet adapter provided by VirtualBox** — there's no real wireless card being passed through to the VM at all, so there'd be no wireless interface to configure or inspect in the first place.
 
**Note to self:** if I actually need this functionality later, the modern equivalent command is `iw dev` (list wireless interfaces) or `iw dev <interface> info`, using the `iw` package instead of the old `wireless-tools`.
 
## `ping`
 
```
$ ping 192.168.16.1
PING 192.168.16.1 (192.168.16.1) 56(84) bytes of data.
^C
--- 192.168.16.1 ping statistics ---
19 packets transmitted, 0 received, 100% packet loss, time 18432ms
```
 
I pinged `192.168.16.1` — an address that isn't actually reachable from my current network (my VM is on the `10.0.2.x` VirtualBox NAT network, not `192.168.16.x`, so this address doesn't exist anywhere I can reach). The result — **19 packets sent, 0 received, 100% packet loss** — confirms exactly that: my Echo Requests went out but nothing ever came back, because that address isn't a real, reachable device from where I am.
 
I also had to manually stop it with `Ctrl+C` (shown as `^C`), because by default `ping` keeps sending Echo Requests indefinitely (once per second) until I tell it to stop — it doesn't have a built-in limit unless I specify one with a flag like `ping -c 4 <address>` (send exactly 4 and stop automatically).
 
**Pentesting relevance:** in a real engagement, `ping` is a quick first check for host discovery — "is this specific IP alive?" before spending time running heavier scans (like `nmap`) against it. That said, on real networks many hosts/firewalls block ICMP entirely as a hardening measure, so a failed ping alone is never proof a target is offline — it just tells me ICMP specifically isn't getting a response.
 
## `arp -a`
 
```
? (10.0.2.2) at 52:55:0a:00:02:02 [ether] on eth0
```
 
This shows my **ARP cache** — the IP-to-MAC mappings my machine has already learned by talking to other devices on the local network. Here, it shows that `10.0.2.2` (which is actually my **default gateway** — I can confirm this later by cross-referencing the `route` output below) maps to MAC address `52:55:0a:00:02:02`. The `?` just means the hostname for that IP isn't known/resolved — only the IP itself is shown.
 
Since I've only interacted with essentially one other device on this virtual network (the gateway itself), this table is very short — on a real, busy local network, `arp -a` could show many entries, one per device I've recently communicated with.
 
**Pentesting relevance:** on an internal network engagement, the ARP table is genuinely useful for quickly discovering **other live devices on the same local network segment** — anything my machine has already talked to shows up here without needing to actively scan for it. Tools like `arp-scan` build on this same idea but actively probe the whole subnet instead of passively relying on what's already been cached.
 
## `netstat -nao`
 
This produced two sections:
 
### 1. Active Internet connections
```
Proto Recv-Q Send-Q Local Address           Foreign Address         State       Timer
udp        0      0 10.0.2.15:68            10.0.2.2:67             ESTABLISHED off (0.00/0/0)
raw6       0      0 :::58                   :::*                    7           off (0.00/0/0)
```
- The first line (`udp ... 10.0.2.15:68 ... 10.0.2.2:67`) is my machine's **DHCP client** talking to the gateway's **DHCP server** (ports 68/67 are the standard DHCP client/server ports) — this is literally the process that assigned me my `10.0.2.15` address in the first place.
- The `raw6` line relates to low-level IPv6 protocol handling (ICMPv6, type 58) rather than a normal application connection.
### 2. Active UNIX domain sockets
This massive list (dozens of `unix ... STREAM ... CONNECTED/LISTENING` lines) isn't network traffic at all — **UNIX domain sockets are a way for processes on the *same* machine to talk to each other**, without going through the network stack (similar in spirit to the loopback interface, but even more direct — no IP/port involved at all). These are just my desktop environment's internal plumbing: D-Bus (system messaging), X11 (the graphical display server), PulseAudio/PipeWire (sound), gpg-agent/SSH agent (key management), and so on — completely normal background activity for a running desktop session, not anything network-facing or suspicious.
 
**Pentesting relevance:** `netstat` (or its modern replacement, `ss`) is essential for understanding **what's actually listening and what's actively connected** on a machine — during recon on my own system to understand a baseline, and especially on a compromised target to see what services are running, what an attacker/defender might already be connected to, or to spot unusual outbound connections (a sign of malware/backdoors calling home). The flags I used: `-n` (show numeric addresses/ports instead of resolving names — faster and avoids DNS lookups), `-a` (show all sockets, listening and established), `-o` (show timers).
 
## `route`
 
```
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         10.0.2.2        0.0.0.0         UG    100    0        0 eth0
10.0.2.0        0.0.0.0         255.255.255.0   U     100    0        0 eth0
```
 
This is my routing table:
- The **`default`** row means: "for any destination not matched by a more specific rule below, send it to gateway `10.0.2.2` via `eth0`." This confirms `10.0.2.2` is indeed my default gateway — matching what I saw in the `arp -a` output above.
- The **`10.0.2.0`** row (with genmask `255.255.255.0`) means: "anything within my own local subnet (`10.0.2.0`–`10.0.2.255`) can be reached directly through `eth0`, no gateway needed" — this is exactly the subnet mask concept, deciding what counts as "local" vs. what needs to be routed out.
- **`Flags`**: `U` = route is up/active, `G` = this route goes through a gateway (as opposed to being directly reachable).
**Pentesting relevance:** understanding the routing table matters most in **network pivoting** — if I've compromised one machine that has access to multiple networks (e.g., it's dual-homed, connected both to the internet-facing segment and an internal segment), the routing table tells me what other networks might be reachable *through* that machine, which is often how lateral movement across network segments actually gets planned out.
 
## Summary Cheat Sheet
 
| Command | What it shows | Why it matters in pentesting |
|---|---|---|
| `ifconfig` | My IP(s), MAC address, interface status | Basic recon — establishes where I am on the network |
| `iwconfig` / `iw dev` | Wireless interface details | Wireless recon (not applicable to my current VM setup) |
| `ping <host>` | Basic reachability + latency via ICMP | Quick host-alive check before deeper scanning |
| `arp -a` | Known IP-to-MAC mappings (local network) | Passive discovery of other devices already contacted |
| `netstat -nao` | Listening ports + active connections (network and local) | Spot running services, active connections, possible backdoors |
| `route` | Routing table (default gateway, local subnet rules) | Understand pivoting potential across network segments |
