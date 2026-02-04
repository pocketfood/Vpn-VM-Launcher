# VPN Virtual Machine Launcher

A simple Node.js-based launcher for a preconfigured QEMU virtual machine. VPN routing is handled by your host VPN client or network setup.

> ⚠️ This project does **not include QEMU binaries** due to licensing. See the **QEMU Setup** section below for instructions on installing them manually.

---

## Features
- Launches a QEMU VM from a preconfigured disk image
- Optional ISO boot for OS installs
- Config-driven VM settings (CPU, RAM, display, accel)
- Designed to run alongside a host VPN (routing handled externally)

---

## Requirements
- Windows Hypervisor Platform or Hyper-V enabled (for WHPX acceleration)
- Node.js (v18+ recommended for development/build)
- QEMU binaries in `qemu/`
- VM disk image (e.g., `.qcow2`)
- Optional ISO image for installs
- `pkg` for building the Windows EXE
- Optional VPN client (OpenVPN or WireGuard) if you want host VPN routing

## File structure
When exporting and distributing, the directory must have:
1. `deb.img` (or your VM disk image)
2. `qemu/`
3. `config.json`
4. ISO file specified by `config.json` (for installs)

---

## Config
The launcher reads `config.json` and uses these keys:
- `showConsole`: Show QEMU output window.
- `useIso`: `true` to boot from ISO for installs.
- `isoPath`: Path to the installer ISO.
- `diskPath`: Path to the VM disk image.
- `memoryMB`: RAM in MB.
- `cpus`: vCPU count.
- `diskFormat`: Disk format, default `qcow2`.
- `compatMode`: `true` to use legacy devices (IDE disk, RTL8139 NIC, standard VGA). Helpful if WHPX has MSI/virtio issues.
- `machine`: QEMU machine type, default `pc` (i440fx).
- `display`: Display backend, default `sdl` (often smoother than `gtk` on Windows).
- `accel`: Acceleration backend, default `whpx`. You can add options like `whpx,kernel-irqchip=off` if WHPX MSI injection fails.
- `cpu`: CPU model, default `max` (WHPX does not accept `host`).

Paths in `config.json` can be relative to the project root or absolute.

---

## Installation

### QEMU Setup
This project depends on QEMU to launch virtual machines. Due to licensing terms (GPLv2), QEMU binaries are not included in this repository.

#### Option 1: Install QEMU manually
Download QEMU for Windows from:
- https://qemu.weilnetz.de/
- https://www.qemu.org/download/

Extract the `.exe` and `.dll` files into the `qemu/` directory at the root of this project.

---

## Debian Netinst ISO (Optional)
If you need a minimal Debian installation image, download the official Debian netinst ISO:
- https://www.debian.org/distrib/netinst

Place the `.iso` file wherever you keep VM assets and set `isoPath` in `config.json` to match.

Example:
```text
vm-images/
├── debian-13.3.0-amd64-netinst.iso
├── debian.qcow2
```

---

## Usage

Install dependencies:
```bash
npm install
```

Install a distro (recommended flow):
1. Set `useIso` to `true` in `config.json` and point `isoPath` to the ISO.
2. Run:
```bash
node index.js
```
3. After installation, set `useIso` back to `false` to boot from disk.

Legacy install script (uses hardcoded paths):
```bash
node install.js
```

Run/test an existing image:
```bash
node index.js
```

---

## Building

Old:
```bash
npm build = pkg . --targets node14-win-x64 --output vpn-vm-launcher.exe --debug
```

New:
```bash
npx pkg . --targets node14-win-x64 --output vpn-vm-launcher.exe --debug --win-console=false
```
