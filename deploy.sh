#!/bin/sh
# 사용법: ./deploy.sh "커밋 메시지"
# sw.js의 캐시 버전을 올린 뒤 커밋하고 GitHub(main)에 푸시한다. 푸시하면 GitHub Pages가 자동으로 다시 배포한다.
set -e
cd "$(dirname "$0")"
[ -n "$1" ] || { echo "커밋 메시지를 넣어 주세요"; exit 1; }
n=$(grep -o "dadari-v[0-9]*" sw.js | head -1 | sed 's/dadari-v//')
sed -i "s/dadari-v$n/dadari-v$((n + 1))/" sw.js
sed -i "s/APP_VERSION = 'v$n'/APP_VERSION = 'v$((n + 1))'/" index.html
git add -A
git commit -q -m "$1" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
git push origin main
echo "배포 요청 완료: sw.js 버전 dadari-v$((n + 1)) (1~2분 뒤 https://eugene-baek.github.io/dadari/ 에 반영)"
