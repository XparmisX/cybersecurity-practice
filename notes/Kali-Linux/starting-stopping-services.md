# Kali Linux Basics — Starting and Stopping Kali Services
 
My notes on managing services in Kali: `service` and `systemctl`

## What Is a "Service"?
A **service** (also called a **daemon** in Linux terminology) is a program that runs quietly in the background, usually without any direct interaction from me, providing some ongoing function that other programs or other computers can use. Examples mentioned so far:
- A **web server** (e.g. Apache, Nginx) — sits and waits to respond to web page requests.
- **SSH** — sits and waits to accept remote login connections.
- A **SQL database** (e.g. MySQL, PostgreSQL) — sits and waits to respond to database queries from other programs.
The common thread: none of these need me to sit there actively running them like a normal application (e.g. opening a text editor) — they start up once and then just keep running, listening for something to do, until they're stopped.
 
## Clarifying a couple of phrases
