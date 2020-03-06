#!/bin/sh

curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered > node.sh

bash node.sh

sudo apt install -y closure-compiler

cd ~/

git clone https://github.com/LLK/scratch-desktop.git

cd ~/scratch-desktop

npm install
    
cd ~/scratch-desktop/node_modules

rm -rf scratch-gui

git clone https://github.com/LLK/scratch-gui.git

cd ~/scratch-desktop/node_modules/scratch-gui

git checkout scratch-desktop

cp -r ~/scratch-gui/src/lib/libraries/extensions/* src/lib/libraries/extensions/

sed -i '/chromedriver/d' package.json

npm install

cd ~/scratch-desktop/node_modules/scratch-gui/node_modules/scratch-blocks

cp ~/scratch-gui/node_modules/scratch-blocks/blocks_common/* blocks_common/

cp ~/scratch-gui/node_modules/scratch-blocks/core/* core/

sed -i '/chromedriver/d' package.json

npm install

cd ~/scratch-desktop/node_modules/scratch-gui/node_modules/scratch-vm

sed -i 's/^.*"browser".*$/\t"browser": {\n\t\t"fs": false,\n\t\t"child_process": false\n\t},/' package.json

npm install

cp -r ~/scratch-gui/node_modules/scratch-vm/src/extensions/* src/extensions/

cp ~/scratch-gui/node_modules/scratch-vm/src/extension-support/* src/extension-support/

cp ~/scratch-gui/node_modules/scratch-vm/src/engine/* src/engine/

npm run build

cd ~/scratch-desktop/node_modules/scratch-gui

npm run build

cd ~/scratch-desktop
