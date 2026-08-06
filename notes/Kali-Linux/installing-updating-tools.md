# Kali Linux Basics — Installing and Updating Tools

My notes on keeping Kali up to date and installing new tools, using `apt-get` and `git`.

## `apt-get` — Kali's Package Manager
`apt-get` is the command-line tool for installing, removing, and updating software packages on Kali (and any Debian-based Linux distro). Instead of downloading installers from random websites like on Windows, Linux distros maintain centralized **repositories** — trusted collections of pre-packaged software — and `apt-get` is how I interact with them.

### `sudo apt-get update && sudo apt-get upgrade`
This is actually two separate commands chained together with `&&` (meaning: "run the second command only if the first one succeeds").

- **`apt-get update`** — does **not** actually install or upgrade anything. It just refreshes my local list of what packages *exist* and what versions are currently available in the repositories (essentially syncing my local package index with what Kali's servers currently have). This is exactly the step I ran into before with `gedit` — installing failed with "no installation candidate" until I ran `update` first, because my local package list was stale.

- **`apt-get upgrade`** — this is the step that actually **installs the newer versions** of any packages I already have, based on the fresh list `update` just pulled. It compares what's installed on my system against what's now available and upgrades anything that has a newer version ready.

**Why chain them with `&&` instead of running separately:** it guarantees I'm always upgrading based on the *freshest* possible list — running `upgrade` on a stale index (without a fresh `update` first) could mean missing available updates, or in rare cases, trying to install a version that's since been replaced.

### `sudo apt-get install <package-name>`
This is how I install a specific new tool/package.
```bash
sudo apt-get install git
```
This installs `git` (see below for what git actually is) directly from Kali's repositories — no need to visit a website, download a file, or run an installer manually. `apt-get` handles finding the right package, downloading it, and setting it up, including any dependencies it needs along the way (I saw a good example of this earlier when installing `gedit` — it pulled in nearly 20 dependency packages automatically).

## `git` and Cloning from GitHub
Not every tool I might want is available through `apt-get`'s repositories — sometimes a tool only exists as source code hosted on a website like **GitHub**, especially newer, niche, or actively-developed security tools that haven't been packaged into Kali's official repos (yet, or ever).

**`git`** is a **version control system** — a tool originally built for tracking changes to code over time — but the specific feature relevant here is its ability to **clone** (download a full copy of) a project's entire codebase directly from its repository URL:
```bash
git clone https://github.com/some-user/some-tool.git
```
This downloads the complete project folder — all its files, and often its full history of changes — onto my machine, ready to use, inspect, or build from source.

**Why this matters:** between `apt-get` (for anything already packaged and maintained in Kali's official repositories) and `git clone` (for anything that only exists as source code on a site like GitHub), I have two complementary ways to get virtually any security tool I might need — `apt-get` first when possible (simpler, handles dependencies automatically), and `git clone` as the fallback when a tool isn't packaged that way.

## Summary Cheat Sheet

| Command | Purpose |
|---|---|
| `sudo apt-get update` | Refresh the local list of available packages/versions (doesn't install anything itself) |
| `sudo apt-get upgrade` | Actually install newer versions of already-installed packages |
| `sudo apt-get update && sudo apt-get upgrade` | Do both together — always upgrade against the freshest package list |
| `sudo apt-get install <name>` | Install a specific new package/tool from Kali's repositories |
| `git clone <repo-url>` | Download a full copy of a project hosted on a site like GitHub, when it isn't available via `apt-get` |

---
