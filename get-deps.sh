#!/bin/sh
mkdir work
cd work
npm install purecss
mv node_modules/purecss/build ../css/pure
git clone https://github.com/PencilCode/musical.js musical
mv musical/musical.min.js ..
cd ..
rm -rf work
