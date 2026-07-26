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
After the type character, the rest is split into **three sets of three**, always in this order:
1. **Owner** permissions (the specific user who owns the file — shown by the 3rd column, e.g. `kali`)
2. **Group** permissions (any user belonging to the file's group — shown by the 4th column, e.g. `kali` group)
3. **Others** permissions (literally everyone else on the system, not the owner and not in the group)
Each set of three follows the same pattern: **r, w, x** (in that fixed order), where a letter present means that permission is granted, and a `-` in that position means it's denied:
- `r` = **read** (can view the file's contents / list a directory's contents)
- `w` = **write** (can modify/delete the file / create-delete files inside a directory)
- `x` = **execute** (can run the file as a program or script / "enter" into a directory with `cd`)
### Worked example from my own output
```
-rw-rw-r--  1 kali kali     6 Jul 26 03:09 hello.txt
```
- `-` → regular file
- `rw-` (owner/kali) → I can read and write it, but not execute it
- `rw-` (group/kali) → members of the `kali` group can also read and write it, but not execute it
- `r--` (others) → everyone else can only read it, no write, no execute
This is Linux's actual **default permission for a newly created file** (`rw-rw-r--`, or `664` in numeric form) — nothing unusual happened, that's just the standard starting permission before any `umask`/`chmod` adjustments.
 
### Another example — a directory
```
drwxr-xr-x  2 kali kali  4096 Jul 23 03:14 Desktop
```
- `d` → directory
- `rwx` (owner) → I can list its contents, create/delete files inside it, and `cd` into it
- `r-x` (group) → group members can list contents and `cd` into it, but can't create/delete files inside
- `r-x` (others) → same as group — read/list and enter, but no write
### And a locked-down one
```
drwx------ 19 kali kali  4096 Jul 26 02:52 .
```
This is my own home directory (`.`, meaning "this directory itself"). Owner (`kali`) has full `rwx`, but group and others have **nothing** (`---`) — meaning no other user on the system can even look inside my home folder, let alone read or modify anything in it. Makes sense as a sane default for a personal home directory.
 
### The number right after the permissions string
That number (e.g. the `19` in `drwx------ 19 kali kali ...`) is the **link count** — for directories, it roughly corresponds to the number of subdirectories inside it plus 2 (one for itself `.` and one for its parent `..`). I don't need to worry about this much day-to-day, just good to know what that number represents.
 
## `chmod` — Change Mode (Change Permissions)
 
`chmod` lets me change the read/write/execute permissions on a file or directory. There are two ways to specify what I want:
 
### Numeric (octal) mode
Each permission has a numeric value:
- `r` = 4
- `w` = 2
- `x` = 1
- (no permission) = 0
I add these up **per group** (owner / group / others) to get a single digit for each, then combine all three digits in order (owner, group, others):
 
```bash
chmod 777 hello.txt
```
`7` = 4+2+1 = read+write+execute. Applying `777` means owner, group, AND others all get full read/write/execute:
```
-rwxrwxrwx  1 kali kali     6 Jul 26 03:09 hello.txt
```
Note: `777` is almost always **too permissive** for real-world use (it lets literally anyone on the system modify or execute the file) — it's fine for a throwaway test file like this, but it's a common security mistake to leave real files/scripts at `777`.
 
Other common combinations I should remember:
- `644` (`rw-r--r--`) — normal default for files: owner can edit, everyone else can only read.
- `755` (`rwxr-xr-x`) — normal for scripts/programs: owner can edit and run, everyone else can only read and run.
- `600` (`rw-------`) — private file: only the owner can read/write, nobody else can even look. Good for sensitive files like SSH keys (which is exactly why I saw `.ssh` listed as `drwx------` earlier).
### Symbolic mode (the `+`/`-` style)
Instead of numbers, I can add or remove specific permissions with letters:
```bash
chmod +x script.sh       # add execute permission for everyone
chmod u+x script.sh      # add execute permission for the owner (u = user/owner) only
chmod g-w file.txt       # remove write permission from the group
chmod o-r file.txt       # remove read permission from others
```
(`u` = owner/user, `g` = group, `o` = others, `a` = all three at once)
 
## Users, `/etc/passwd`, and `/etc/shadow`
 
### `adduser`
Creates a new user account on the system.
```bash
sudo adduser newusername
```
It walks me through setting a password and some optional info (full name, room number, etc. — mostly leftover fields from very old Unix systems, I can just press Enter to skip most of them).
 
### `/etc/passwd`
This file lists every user account on the system — one line per user. I can view it with:
```bash
cat /etc/passwd
```
After creating a new user, their entry shows up at the bottom of this file. Each line has a specific structure (colon-separated fields), roughly: `username:x:UID:GID:comment:home_directory:default_shell`.
 
**Important nuance I need to remember:** despite the name, `/etc/passwd` does **not** actually store passwords anymore (that used to be true decades ago, but was a huge security risk since this file is readable by everyone). The `x` in the second field is just a placeholder that means "the real password hash lives elsewhere" — specifically in `/etc/shadow`.
 
### `/etc/shadow`
This is where the actual **password hashes** are stored (not the plaintext passwords themselves — a one-way cryptographic hash of them). Unlike `/etc/passwd`, this file is **only readable by root**, which is an important security boundary — regular users can't even peek at the hashes to attempt cracking them offline.
```bash
sudo cat /etc/shadow
```
(Needs `sudo` — a regular user will get "Permission denied" trying to read it directly, which itself demonstrates the permission concepts from earlier in these notes.)
 
Cracking these hashes (e.g. with tools like `John the Ripper` or `hashcat`) is a whole separate topic I'll get into later — for now, the key takeaway is just understanding *where* passwords actually live and why they're separated from `/etc/passwd`.
 
## `su` — Switch User
Lets me switch to being a different user account from my current terminal session.
```bash
su otherusername
```
It will prompt for **that other user's password** (not my own) before letting me in — which makes sense, since I'm essentially proving I have the right to act as them.
 
Running `su` with no username at all defaults to trying to switch to **root**:
```bash
su
```
 
## Root vs. Regular Users — Why Permissions Matter Here
This ties directly back to the permissions section above: **root has unrestricted access to everything on the system**, regardless of what the `rwx` permissions on a file say. A regular user (like `kali`) is bound by those permissions — if a file/directory isn't readable/writable by them (like `/etc/shadow`, or another user's home folder), they simply can't access it, full stop, unless they elevate to root somehow.
 
This is exactly why commands like `updatedb` failed for me earlier with "Permission denied" (from my previous notes) — regular users are deliberately restricted from touching certain system-level files, and root is the one account that bypasses those restrictions.
 
## `sudo` — "Superuser Do"
Rather than fully switching my identity to root (like `su` does), `sudo` lets me run just a **single command** with root privileges, using **my own password** (not root's) — assuming my user account has been granted sudo privileges in the first place (which the default `kali` user has, out of the box).
 
```bash
sudo command_here
```
 
**`su` vs `sudo`, in short:**
- `su root` → fully becomes root for the rest of the session, needs root's own password.
- `sudo <command>` → temporarily elevates just one command to root privileges, using my own account's password. Generally considered the safer/more standard practice, since I'm not sitting in a full root shell where one typo could do serious damage — I'm only elevating exactly what I explicitly ask for.
There's also a file, `/etc/sudoers`, which controls **who is allowed to use `sudo` at all** and what they're permitted to run with it. It shouldn't be edited directly with a normal text editor (a syntax error there could lock out sudo access entirely) — the safe way to edit it is with the dedicated command `sudo visudo`, which checks the syntax before saving.
 
## Summary Cheat Sheet
 
| Command | Purpose |
|---|---|
| `ls -la` | Show detailed permissions, owner, and group for files/folders |
| `chmod <mode> <file>` | Change a file's permissions (numeric like `755`, or symbolic like `u+x`) |
| `adduser <name>` | Create a new user account |
| `cat /etc/passwd` | List all user accounts (no password hashes here anymore) |
| `sudo cat /etc/shadow` | View password hashes (root-only) |
| `su <user>` | Fully switch to another user (needs their password) |
| `sudo <command>` | Run one command as root (needs my own password) |
| `sudo visudo` | Safely edit who has sudo access and what they can run |
 
### Quick reference — permission letters/numbers
| Symbol | Meaning | Number |
|---|---|---|
| `r` | read | 4 |
| `w` | write | 2 |
| `x` | execute | 1 |
| `-` | no permission | 0 |
 
Position order is always: **owner → group → others**, and within each: **r → w → x**.
