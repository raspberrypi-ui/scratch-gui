BUILD INSTRUCTIONS
==================

Items in [] may be unnecessary after upstreaming.

Prepare image
-------------

Install SSH key for access to raspberrypi-ui GitHub

bash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)	 (run without local repo overrides)

sudo apt install (snapd squashfs-tools) closure-compiler

(Reboot)

(sudo snap install snapcraft --classic)

(git clone https://git.kernel.org/pub/scm/fs/squashfs/squashfs-tools.git)

(cd squashfs-tools/squashfs-tools)

(Add #include <sys/sysmacros.h> to both mksquashfs.c and unsquashfs.c)

(make)

(cd ~/)

(mkdir -p ~/.cache/electron-builder/appimage/appimage-9.1.0/linux-arm/)

(cp /usr/bin/desktop-file-validate ~/.cache/electron-builder/appimage/appimage-9.1.0/linux-arm/)

(cp ~/squashfs-tools/squashfs-tools/mksquashfs ~/.cache/electron-builder/appimage/appimage-9.1.0/linux-arm/)


In ~/
-----

git clone git@github.com:raspberrypi-ui/scratch-gui.git

git clone https://github.com/LLK/scratch-desktop.git


In ~/scratch-desktop
--------------------

npm install

????In node_modules/app-builder-lib/out/targets/targetFactory.js, in the function "computeArchToTargetNamesMap", change the line

    const defaultArchs...
    
to

    const defaultArchs = [“armv7l”];
    
or to 

    const defaultArchs = ["arm64"];
    
In scripts/electron-builder-wrapper.js, add the section

    case 'linux':
        return ['appimage'];

to the calculateTargets function, and (for 32-bit ARM builds only), change the relevant line in the getPlatformFlag function to

    case 'linux': return '--linux --armv7l';
    
In electron-builder.yaml, add a section

linux:
  target: dir


In ~/scratch-desktop/node_modules
---------------------------------

rm -rf scratch-gui

git clone https://github.com/LLK/scratch-gui.git


In ~/scratch-desktop/node_modules/scratch-gui
---------------------------------------------

git checkout scratch-desktop

cp -r ~/scratch-gui/src/lib/libraries/extensions/* src/lib/libraries/extensions/

In package.json, in the "devDependencies" section, remove the line starting “chromedriver”

npm install


In ~/scratch-desktop/node_modules/scratch-gui/node_modules/scratch-blocks
-------------------------------------------------------------------------

[cp ~/scratch-gui/node_modules/scratch-blocks/blocks_common/* blocks_common/]

[cp ~/scratch-gui/node_modules/scratch-blocks/core/* core/]

[In package.json, in the "devDependencies" section, remove the line starting “chromedriver”]

[npm install (ignore errors at end)]


In ~/scratch-desktop/node_modules/scratch-gui/node_modules/scratch-vm
---------------------------------------------------------------------

In package.json, replace "browser" section with

    "browser": {
        "fs": false,
        "child_process": false
    },

npm install

cp -r ~/scratch-gui/node_modules/scratch-vm/src/extensions/* src/extensions/

cp ~/scratch-gui/node_modules/scratch-vm/src/extension-support/* src/extension-support/

[cp ~/scratch-gui/node_modules/scratch-vm/src/engine/* src/engine/]

npm run build


In ~/scratch-desktop/node_modules/scratch-gui
---------------------------------------------

npm run build


In ~/scratch-desktop
--------------------

npm run dist

Build will error at end, but built standalone files will be in dist/__appImage-armv7l
