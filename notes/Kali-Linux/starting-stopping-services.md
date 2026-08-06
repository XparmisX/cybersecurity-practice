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

## Example: Stopping Apache with `service`
 
I saw this in the video's terminal demo:
```bash
service apache2 stop
```
This immediately stops the Apache web server that's currently running — exactly the "on the fly" behavior from `service`: it takes effect right now, with no reboot needed. This is the practical version of what I noted above (starting/stopping something that's currently active).
 
## Example: A Quick Throwaway Web Server with Python
 
Separate from `service`/`systemctl` (this isn't a system service being enabled/disabled — it's a one-off temporary process), the video showed spinning up an instant web server using Python:
```bash
cd Downloads/
python -m SimpleHTTPServer 80
```
This starts a very basic HTTP server that serves whatever files are in the current directory (`Downloads/` here) on port 80, and prints a log line for every request it receives:
```
Serving HTTP on 0.0.0.0 port 80 ...
192.168.202.139 - - [26/Jun/2019 17:38:19] "GET / HTTP/1.1" 200 -
```
That log line shows a request came in from `192.168.202.139`, requesting `/`, and it succeeded (`200` status code).
 
**Note on the command itself:** `SimpleHTTPServer` is a **Python 2** module (this matches the path shown in the error traceback: `/usr/lib/python2.7/SimpleHTTPServer.py`). Since Python 2 is deprecated, on a modern system the equivalent Python 3 command would be:
```bash
python3 -m http.server 80
```
Good to know both, since older tutorials/write-ups (and CTF walkthroughs) often still reference the Python 2 version.
 
**Why this matters for pentesting:** spinning up an instant web server like this is an extremely common technique for **quickly transferring files** to/from a target machine during an engagement — e.g. hosting a tool or payload on my attacking machine, then downloading it onto the target with `wget`/`curl`, without needing to set up a full proper web server like Apache just for a temporary file transfer.
 
**About the traceback/`KeyboardInterrupt`:** the long `Traceback (most recent call last): ...` block followed by `KeyboardInterrupt` isn't an error I caused by doing something wrong — it's just what appears when I press `Ctrl+C` to stop the server (the `^C` shown right before it). Python prints that trace because it's showing exactly where in the code it was interrupted, but it's expected, harmless output from manually stopping a running process — not a crash.
 
## Clarifying `systemctl enable` / `disable` — Online vs. Offline
I wasn't sure if `enable`/`disable` referred to the service being "online" (currently running) vs "offline" (currently stopped) — but based on what I already worked out above, that's **not** quite right. To restate it clearly:
 
- `systemctl enable <service>` / `systemctl disable <service>` control whether the service **automatically starts the next time the machine boots up** — this is a persistent, on-disk setting, not something about its current running state.
- Whether the service is running **right now** ("online") is a completely separate thing, controlled by `service <name> start/stop` (or `systemctl start/stop <name>`, which does the same immediate-effect job as `service`).
So a service can be in any of these four combinations at once, and it's worth keeping them mentally separate:
1. **Enabled + running** — will start on boot, and is active right now.
2. **Enabled + stopped** — will start on next boot, but I've manually stopped it for now.
3. **Disabled + running** — I started it manually this session, but it won't survive a reboot.
4. **Disabled + stopped** — completely off, both now and on future boots.
## Mentioned: FTP Server
The video referenced an FTP server as another example of a typical service (alongside Apache/web servers) that can be controlled the same way — started/stopped with `service`, and set to persist across reboots (or not) with `systemctl enable`/`disable`. Same commands, just a different service name (e.g. `vsftpd` is a common FTP server package on Debian/Kali-based systems).
 
---
