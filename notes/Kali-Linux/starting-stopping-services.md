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
