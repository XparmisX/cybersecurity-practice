# Kali Linux Basics — Viewing, Creating, and Editing Files
 
My notes on the commands for creating and editing files from the terminal: `echo`, `cat`, redirection (`>` vs `>>`), `touch`, `nano`, and `gedit`.
 
## `echo`
Simply prints back whatever text I give it to the terminal screen.
```bash
echo "hello"
# Output: hello
```
On its own, it doesn't touch any files — it just displays text. It becomes genuinely useful for file creation once combined with redirection (below).
 
## `cat`
Prints out the full contents of a file to the terminal.
```bash
cat hey.txt
```
It's the quickest way to peek inside a text file without opening a full editor — great for short files, though for long files it just dumps everything at once (no scrolling/pagination like `man` has).
 
## Redirection: `>` (overwrite) vs `>>` (append)
This is the key thing that turns `echo` into a file-creation tool, and I confirmed the difference directly by testing it:
 
### `>` — overwrite/replace
```bash
echo "hey" > hey.txt        # hey.txt didn't exist yet, so this creates it
cat hey.txt                  # hey
 
echo "hey again" > hey.txt  # hey.txt already exists — this REPLACES its entire content
cat hey.txt                  # hey again   (the original "hey" is completely gone)
```
`>` always starts the destination file fresh — whatever was in it before is discarded, whether the file existed already or not.
 
### `>>` — append
```bash
echo "hey again again" >> hey.txt
cat hey.txt
# hey again
# hey again again
```
`>>` adds the new content **after** whatever is already in the file, instead of erasing it. My test showed this clearly: after using `>>`, both the previous line ("hey again") and the new line ("hey again again") were present.
 
**When each is useful:**
- `>` — when I specifically want to reset/replace a file's contents (e.g. starting a fresh output file for a scan).
- `>>` — when I want to keep building up a file over time without losing previous entries — e.g. appending discovered IP addresses to a list, logging the output of several different commands into the same file, or building up notes/results across multiple scan runs without overwriting earlier findings.
## `touch`
Creates a new, completely **empty** file instantly (unlike `echo ... >`, which requires me to also provide some text content).
```bash
touch newfile.txt
ls                  # newfile.txt now exists
cat newfile.txt      # (nothing — it's empty)
```
Useful when I just need a placeholder file to exist (to edit later, or because some tool/script expects a file to already be present) without needing to put anything in it yet.
 
## `nano` — Terminal-Based Text Editor
A text editor that runs **inside the terminal itself** — no separate window opens.
```bash
nano newfile.txt
```
This opens a full-screen editing view directly in my terminal window, where I can type normally, and the bottom of the screen shows keyboard shortcuts (like `Ctrl+O` to save/"Write Out", `Ctrl+X` to exit).
 
**Important behavior I confirmed:** if I run `nano` on a filename that **doesn't exist yet**, it doesn't error out — it just opens a blank editor, and the file only actually gets created on disk once I save it (`Ctrl+O`) and confirm the filename. I tested this directly:
```bash
nano thisisnew.txt
ls                        # thisisnew.txt does NOT show up yet — I hadn't saved/typed anything
cat thisisnew.txt          # No such file or directory
 
nano thisisnew.txt        # opened it again, typed "hello", saved this time
ls                        # thisisnew.txt now exists
cat thisisnew.txt          # hello
```
So `nano` (like most editors) only writes to disk on an explicit save — simply opening it on a new filename doesn't create anything by itself.
 
## `gedit` — Graphical Text Editor
