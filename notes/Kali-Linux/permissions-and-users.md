# Kali Linux Basics — Permissions & User Management
 
My notes on file permissions, `chmod`, users, and switching/elevating privileges (`adduser`, `/etc/passwd`, `/etc/shadow`, `su`, `sudo`).
 
## Reading `ls -la` Output — What `drwxrwxrwx` Actually Means
 
When I run `ls -la`, each line starts with a 10-character string like this:
 
```
drwxr-xr-x  2 kali kali  4096 Jul 23 03:14 Desktop
-rw-r--r--  1 kali kali   220 Jun 16 10:30 .bash_logout
```
 
That first block (`drwxr-xr-x`, `-rw-r--r--`, etc.) is the **permissions string**, and it breaks down into distinct parts:
 
```
d rwx r-x r-x
│ │   │   │
│ │   │   └── permissions for OTHERS (everyone else on the system)
│ │   └────── permissions for the GROUP (kali group, in my case)
│ └────────── permissions for the OWNER (the user "kali")
└──────────── file TYPE (not a permission at all — explained below)
```
 
### 1. The very first character — file type
This isn't part of the permissions at all, it just tells me *what kind of thing* this line describes:
- `-` → a regular file (like `.bashrc` or `hello.txt`)
- `d` → a directory/folder (like `Desktop`, `.config`)
- `l` → a symbolic link (a shortcut/pointer to another file) — I saw this with `.face.icon -> .face`

### 2. The remaining 9 characters — three groups of three
