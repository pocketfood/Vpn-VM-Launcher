# VPN Virtual Machine Launcher

A simple Node.js-based launcher for a preconfigured QEMU virtual machine with VPN routing.

> ⚠️ This project does **not include QEMU binaries** due to licensing. See the **QEMU Setup** section below for instructions on installing them manually or via script.

---

## 🚀 Features
- Launches a secure virtual machine using QEMU
- Routes VM traffic through a VPN interface
- Built-in Node.js control interface
- Minimal GUI / CLI for selecting VM profiles

---

## 📦 Requirements
- Node.js (v18+ recommended)
- A compatible VPN client (e.g., OpenVPN or WireGuard)
- Virtual disk image (e.g., `.qcow2`)
- QEMU (manually installed or fetched via script)
- ISO image of distro (This is when you are installing a distro)
- Disk.img for the installation (make from `qemu-img create -f qcow2`)
- PKG for compiling into Windows and other systems
- Absolute paths for specifying where the files are

## 📁 File structure
When exporting and distributing, the directory must have:
1. deb.img
2. QEMU
3. config.json
4. debian-12.0.0-amd64-netinst.iso

---

## 🛠️ Installation
### QEMU Setup
This project depends on QEMU to launch virtual machines. Due to licensing terms (GPLv2), QEMU binaries are not included in this repository.

#### Option 1: Install QEMU manually
Download QEMU for Windows from:
- [QEMU for Windows](https://qemu.weilnetz.de/)
- [QEMU Downloads](https://www.qemu.org/download/)

Extract the .exe and .dll files into the `qemu/` directory at the root of this project.

---

## 🐧 Debian Netinst ISO (Optional)

If you need a minimal Debian installation image for your virtual machine, you can download the official **Debian netinst ISO**:

➡️ [Download Debian netinst ISO](https://www.debian.org/distrib/netinst)

This image is ideal for small VMs, as it only contains the installer and fetches the rest of the packages from the internet during setup.

Once downloaded, place the `.iso` file in your `vm-images/` directory (or wherever you keep your VM assets), and update your `config.json` or launch script to boot from it.

```bash
vm-images/
├── debian-12.6.0-amd64-netinst.iso
├── your-vm-disk.qcow2
```

---


## Final

```bash
git clone 
cd vpn-vm-launcher
npm install


## installing an image please use install.js
node install


## Running / Testing an img 
node index


## Building for windows

npm build = pkg . --targets node14-win-x64 --output vpn-vm-launcher.exe --debug




```

