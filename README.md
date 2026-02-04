## Requirements for building
- qemu for the emulation/virutal box
- Windows Hypervisor Platform or Hyper-V enabled (for WHPX acceleration)
- nodejs for packaging 
- iso image of distro (This is when you are installing a distro)
- Disk.img for the installation (make from qemu-img create -f qcow2)
- pkg for compiling into windows
- Absolute paths for specificing where the files are

## File structure
When exporting and distributing directory must have 
1. deb.img
2. qemu directory
3. config.json
4. ISO file specified by config.json (for installs)

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

## Building

### old
npm build = pkg . --targets node14-win-x64 --output vpn-vm-launcher.exe --debug

### New
npx pkg . --targets node14-win-x64 --output vpn-vm-launcher.exe --debug --win-console=false
