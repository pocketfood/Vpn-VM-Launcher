const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const defaultConfig = {
    showConsole: false,
    memoryMB: 12288,
    cpus: 12,
    diskPath: 'deb.img',
    diskFormat: 'qcow2',
    useIso: false,
    isoPath: 'debian-13.3.0-amd64-netinst.iso',
    compatMode: false,
    machine: 'pc',
    display: 'sdl',
    accel: 'whpx',
    cpu: 'max',
};

// Load config
let config;
try {
    const userConfig = JSON.parse(fs.readFileSync('config.json'));
    config = { ...defaultConfig, ...userConfig };
} catch (error) {
    console.error('Could not read config.json, using default settings.');
    config = { ...defaultConfig };
}

// Define paths
const qemuPath = path.join('qemu', 'qemu-system-x86_64.exe'); // Relative path to QEMU executable

// Disk Image is for already finished distros, iso is if you want to install a new image.
// Remeber if you plan on installing a new image you need to have a blank .img file using (qemu-img create -f qcow2 c://path//to/file.img 20G)

const imgPath = path.resolve(config.diskPath); // Absolute path to disk image
const isoPath = path.resolve(config.isoPath); // Absolute path to ISO

// Name for the title
const vmName = 'VPN-VM-LAUNCHER';

function launchVM() {
    // Check if QEMU executable exists
    if (!fs.existsSync(qemuPath)) {
        console.error(`QEMU executable not found at ${qemuPath}`);
        return; // Exit if the executable isn't found
    }

    console.log(`Using QEMU Path: ${qemuPath}`);
    if (!fs.existsSync(imgPath)) {
        console.error(`Disk image not found at ${imgPath}`);
        return;
    }

    if (config.useIso && !fs.existsSync(isoPath)) {
        console.error(`ISO not found at ${isoPath}`);
        return;
    }

    console.log(`Using Disk Image Path: ${imgPath}`);
    if (config.useIso) {
        console.log(`Using ISO Path: ${isoPath}`);
    }

    // Define the arguments for the QEMU process
    const netDevArgs = [
        '-netdev', 'user,id=net0,hostfwd=tcp::8080-:9090,hostfwd=tcp::22-:22',
        '-device', `${config.compatMode ? 'rtl8139' : 'virtio-net-pci'},netdev=net0`,
    ];

    const diskArg = config.compatMode
        ? `file=${imgPath},if=ide,format=${config.diskFormat},cache=writeback`
        : `file=${imgPath},if=virtio,format=${config.diskFormat},cache=writeback,discard=unmap`;

    const videoArgs = config.compatMode
        ? ['-vga', 'std']
        : ['-device', 'virtio-vga'];

    const args = [
        '-accel', config.accel,
        '-machine', config.machine,
        '-cpu', config.cpu,
        '-m', String(config.memoryMB),
        '-smp', String(config.cpus),
        '-drive', diskArg,
        ...(config.useIso ? ['-cdrom', isoPath] : []),
        '-boot', config.useIso ? 'd' : 'c',
        ...netDevArgs,
        ...videoArgs,
        '-display', config.display,
        '-name', vmName,
    ];

    // If showConsole is false, set the window to hidden
    const spawnOptions = config.showConsole
        ? { windowsHide: false }
        : { detached: true, stdio: 'ignore', windowsHide: true };

    const qemuProcess = spawn(qemuPath, args, spawnOptions);

    // Handle stdout and stderr from QEMU
    if (config.showConsole) {
        qemuProcess.stdout.on('data', (data) => {
            console.log(`Output: ${data}`);
        });

        qemuProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });
    }

    qemuProcess.on('close', (code) => {
        console.log(`QEMU process exited with code ${code}`);
    });
}

// Call the function to launch the VM
launchVM();
