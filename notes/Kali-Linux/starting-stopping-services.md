# Kali Linux Basics — Starting and Stopping Kali Services
 
My notes on managing services in Kali: `service` and `systemctl`

## What Is a "Service"?
A **service** (also called a **daemon** in Linux terminology) is a program that runs quietly in the background, usually without any direct interaction from me, providing some ongoing function that other programs or other computers can use. Examples mentioned so far:
- A **web server** (e.g. Apache, Nginx) — sits and waits to respond to web page requests.
- **SSH** — sits and waits to accept remote login connections.
- A **SQL database** (e.g. MySQL, PostgreSQL) — sits and waits to respond to database queries from other programs.
The common thread: none of these need me to sit there actively running them like a normal application (e.g. opening a text editor) — they start up once and then just keep running, listening for something to do, until they're stopped.
 
## Clarifying a couple of phrases
 
**"On the fly"** — this is just a common English expression meaning *"immediately, in real time, without needing to restart or reset anything first."* So "start/stop services on the fly" simply means I can turn a service on or off right now, while the system keeps running normally, without needing to reboot the whole machine for the change to take effect.
 
**"Boot"** — short for **booting up** — refers to the process of a computer starting up from being fully powered off: the hardware initializes, the operating system loads into memory, and the system becomes usable. So "load up on boot" means "automatically start this service every single time the computer is turned on/restarted," as opposed to only starting when I manually tell it to.
 
## `service` — Starting/Stopping Services Immediately
Used to control whether a service is currently **running or not, right now** (the "on the fly" part) — this does not affect what happens the next time the machine restarts.
 
```bash
sudo service <name> start     # start the service now
sudo service <name> stop      # stop the service now
sudo service <name> restart   # stop then start it again (useful after changing a config file)
sudo service <name> status    # check whether it's currently running
```
 
## `systemctl` — Controlling Boot-Time Behavior
While `service` deals with the service's state *right now*, `systemctl` (short for **system control**) is the more modern, more powerful tool — and specifically covers whether a service should **automatically start every time the system boots up**, independent of whether it's running at this exact moment.
 
```bash
sudo systemctl enable <name>    # make this service auto-start on every future boot
sudo systemctl disable <name>   # stop it from auto-starting on boot
```
 
**Key distinction I need to keep straight:** `enable`/`disable` control **future boot behavior only** — they don't necessarily start or stop the service *right now*. So it's common to need both commands together: e.g. `sudo systemctl enable ssh` (so it survives reboots) plus `sudo service ssh start` (so it's actually running immediately too), if I want a service both running now and persisting across restarts.
 
---
