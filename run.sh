#!/bin/bash
rm -rf data/
mkdir data
npm run build
# rm -rf data/dist
# cp -r dist/. data
# cp -r public/. data/public
cp -r README.md data
cp -r plugin.json data