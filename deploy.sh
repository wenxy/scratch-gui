#!/bin/bash
#替换index.ejs的地址api.sweetbiancheng.com
sed -i "" "s/localhost:8081/api.sweetbiancheng.com/g" /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/src/playground/index.ejs
sed -i "" "s/localhost:8081/api.sweetbiancheng.com/g" /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/src/lib/http/URLs.js
sed -i "" "s/localhost:8081/api.sweetbiancheng.com/g" /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/src/playground/player.ejs

npm run build
cd build
zip -r scratch.zip *

echo 'copy scratch static assert to wxProject'
cp -R /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/build/static /Users/wenxiaoyu/workspace/kuku/coding/ykm/ykm-weixin/src/main/resources/static/view/scratch
cp -R /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/build/static /Users/wenxiaoyu/workspace/kuku/coding/flutter/scratch-server/src/main/resources/static/learn/scratch
echo 'copy scratch static assert to wxProject done!!!'

echo '拷贝scratch.zip 到远程服务器'
scp scratch.zip root@47.104.220.91:/usr/local/nginx/html/scratch
rm scratch.zip
echo '拷贝scratch.zip 到远程服务器 完成.'


ssh root@47.104.220.91 "cd /usr/local/nginx/html/scratch; unzip -o scratch.zip"
echo '解压远程scratch.zip成功.'

ssh root@47.104.220.91 "cd /usr/local/nginx/html/scratch; rm -rf scratch.zip"
echo '删除远程scratch.zip成功.'

sed -i "" "s/api.sweetbiancheng.com/localhost:8081/g" /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/src/playground/index.ejs
sed -i "" "s/api.sweetbiancheng.com/localhost:8081/g" /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/src/lib/http/URLs.js
sed -i "" "s/api.sweetbiancheng.com/localhost:8081/g" /Users/wenxiaoyu/workspace/kuku/coding/scratch/fork-scratch-gui/scratch-gui/src/playground/player.ejs
