#!/bin/bash
mkdir next-space-web-app
cd next-space-web-app
git init
# using gitlab project access token
git pull https://next-space-web-app:glpat-oh1irpK4z9NKHz4XNnoL@gitlab.devops.telekom.de/tel-it-sk-ad-community/next-space/next-space-web-app.git prod-test
sudo npm install
sudo npm start