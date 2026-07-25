# Kali Linux Basics — Terminal Commands

My notes from the first ~45 minutes of the Kali Linux course, covering basic navigation and file management commands. These are the foundational commands I'll be using constantly, so I wanted to make sure I actually understood them (not just copy-pasted them) before moving on.

## Navigation

### `pwd` — Print Working Directory
Tells me exactly where I am in the filesystem right now (my current directory), as a full path.

```bash
pwd
# Output example: /home/kali
```

### `cd` — Change Directory
Moves me from one directory to another.

```bash
cd Downloads          # move into the Downloads folder (relative path)
cd /home/kali/Music    # move using a full/absolute path
cd ~/Music              # ~ is a shortcut for my home directory (/home/kali), so this means the same as above
cd ..                   # move UP one directory (to the parent of where I currently am)
cd ~                    # jump straight back to my home directory from anywhere
cd -                    # jump back to the PREVIOUS directory I was in before my last cd
cd /                    # go to the root of the entire filesystem
```

**Clarifying `cd ..` (this is what I wasn't sure about):**
Every directory has a "parent" — the folder that contains it. `..` always refers to that parent directory, no matter where I am. So if I'm in `/home/kali/Downloads` and run `cd ..`, I end up in `/home/kali`. I can even chain it: `cd ../..` moves up two levels at once.

**About `/` vs `.` (also something I was confused about):**
- `/` at the very start of a path means "start from the root of the filesystem" (an **absolute path**). Example: `/home/kali/Downloads`.
- `.` (single dot) means "the current directory I'm already in" (a **relative path** reference).
- `..` means "the parent of the current directory."
- If a path does NOT start with `/`, it's a **relative path** — it's interpreted relative to wherever I currently am (whatever `pwd` shows).

So `cp test.txt Downloads/` works because `Downloads/` is being read as "a folder named Downloads inside my current directory," not an absolute path.

### `ls` — List
Shows everything (files and folders) inside my current directory.

```bash
ls              # basic listing
ls -l           # "long" format — shows permissions, owner, size, date modified
ls -a           # shows ALL files, including hidden ones
ls -la          # combines both: long format AND hidden files
```

**Hidden files/folders in Linux:** anything whose name starts with a dot (`.`) is treated as hidden and won't show up with a plain `ls` — I need `-a` (or `-la` for more detail) to see them. This is just a naming convention, not a special permission or lock.

**Tab completion:** pressing `Tab` while typing a command auto-completes file/folder names. If there are multiple matches, pressing `Tab` twice shows me all the possible options instead of completing. This is genuinely useful for speed and for avoiding typos in long filenames.

## Creating and Removing Directories

### `mkdir` — Make Directory
Creates a new, empty **folder** (not a file — this was my point of confusion). To create files, I'd use a different approach (like `touch filename` or redirecting output into a file, as I did with `echo` below).

```bash
mkdir parmis
ls              # "parmis" now shows up as a new, empty folder
```

### `rmdir` — Remove Directory
Deletes a directory — but **only if it's empty**. If it has files inside, `rmdir` will refuse and give an error (I'll need a different command, like `rm -r`, for non-empty folders — something to look into later).

```bash
rmdir parmis/
ls              # "parmis" is gone
```

## Working with Files

### The `echo` + quotes issue I ran into
I tried:
```bash
echo "Hi!" > test.txt
```
and got stuck in a weird state where the terminal kept showing `dquote>` and wouldn't run my command.

**What actually happened:** `dquote>` is the shell telling me it thinks I have an **unclosed double quote** — meaning somewhere I opened a `"` but never closed it, so bash is still waiting for me to finish the string before it will execute anything. Every line I typed after that (`Hi!`, `Hi`, etc.) was just being swallowed as *more text inside that still-open quote*, not run as new commands. To get out of this stuck state, I need to either type the matching closing `"` or press `Ctrl+C` to cancel the whole thing and start the command over from scratch.

**What the command does when typed correctly:**
```bash
echo "Hi!" > test.txt
```
- `echo "Hi!"` just prints the text `Hi!` to the screen.
- The `>` symbol **redirects** that output into a file instead of printing it — and creates the file `test.txt` if it doesn't already exist (or overwrites it if it does).
- So this command doesn't "make a file" directly — it's really the combination of `echo` (produce text) + `>` (send that text into a file) that results in a new file containing "Hi!".

### `cp` — Copy
Copies a file to another location, leaving the original in place.

```bash
cp test.txt Downloads/
ls Downloads/        # test.txt now exists inside Downloads too, and the original is still where it was
rm Downloads/test.txt  # deletes the copy from Downloads
```

### `mv` — Move
Moves a file to another location. Unlike `cp`, the original is **not** left behind — it's relocated.

```bash
mv test.txt Downloads/
ls Downloads/         # test.txt is now in Downloads, and it's gone from wherever it was before
rm Downloads/test.txt
```

**`cp` vs `mv`, in short:** `cp` = duplicate (two copies exist afterward). `mv` = relocate (only one copy exists afterward, just in a new place). `mv` is also how you **rename** a file, by the way — e.g. `mv oldname.txt newname.txt` in the same folder.

### `rm` — Remove
Deletes a file permanently (no Trash/Recycle Bin by default in the terminal — it's just gone).

## Finding Files: `locate` and `updatedb`

### `locate`
Searches for files by name across the whole filesystem, very quickly.

```bash
locate bash
# shows every file/path on the system with "bash" somewhere in its name
```

### `updatedb`
`locate` doesn't scan the live filesystem every time I search — that would be slow. Instead, it searches a **pre-built index/database** of file paths. `updatedb` is the command that rebuilds/refreshes that index.

**Clarifying the relationship between `locate` and `updatedb` (what I was confused about):**
If I create, delete, or move files, `locate`'s database doesn't know about those changes automatically — it only reflects the filesystem as it looked the last time `updatedb` ran. So if I create a brand-new file and immediately run `locate` on it, it might not show up yet, because the index is stale. Running `updatedb` refreshes that index so `locate`'s results are accurate again. That's why the course said to run it "frequently" — it's essentially keeping the search index in sync with reality.

### The permission error I got
```bash
updatedb
/var/lib/plocate/: Permission denied
```
This happened because `updatedb` needs to write to a system-level database file (in `/var/lib/plocate/`), and by default my regular user account (`kali`) doesn't have write permission there — only the root/admin user does. The fix is to run it with elevated privileges:
```bash
sudo updatedb
```
`sudo` temporarily runs the command as the superuser (root), which does have permission to update that system file. It'll prompt for my password before running.

## Account & Help

### `passwd`
Changes the password for my user account. Since Kali ships with the well-known default (`kali`/`kali`), running this and setting a unique password is an actual security step, not just a formality — anyone who knows the default credentials could otherwise access the machine if it's ever exposed on a network.

```bash
passwd
```

### `man` — Manual Pages
Almost every standard Linux command has a built-in manual page explaining what it does, its available options/flags, and usage examples.

```bash
man ls
```
This opens a scrollable reference (`q` to quit out of it) with full documentation for `ls` — genuinely the fastest way to check what a flag like `-la` actually does instead of guessing or searching online.

**Note on `--help`:** I tried `ls ..help` which doesn't work — the correct syntax is `ls --help` (two dashes, directly attached to `help`, with no space and no dots). Most commands support `--help` as a quicker, shorter summary than the full `man` page, so both are useful depending on how much detail I need.

## Summary Cheat Sheet

| Command | Purpose |
|---|---|
| `pwd` | Show current directory |
| `cd <path>` | Change directory (`cd ..` = up one level, `cd ~` = home, `cd -` = previous dir) |
| `ls` / `ls -la` | List files (with `-la` for hidden + detailed) |
| `mkdir <name>` | Create a new folder |
| `rmdir <name>` | Delete an empty folder |
| `cp <src> <dest>` | Copy a file (original stays) |
| `mv <src> <dest>` | Move/rename a file (original doesn't stay) |
| `rm <file>` | Delete a file |
| `locate <name>` | Search the filesystem index for a file by name |
| `sudo updatedb` | Refresh the search index used by `locate` |
| `passwd` | Change my account password |
| `man <command>` | Open the manual page for a command |
| `<command> --help` | Quick usage summary for a command |
