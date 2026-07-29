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
