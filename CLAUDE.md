# 다다리 가계부 (dadari)

단일 파일 PWA. 공개 주소: https://eugene-baek.github.io/dadari/ (저장소 eugene-baek/dadari, main 브랜치, GitHub Pages)

## 수정 후 자동 반영 (사용자가 허락함)
이 폴더의 앱 파일(index.html, sw.js, manifest.webmanifest, 아이콘)을 고친 뒤에는 사용자에게 다시 묻지 않고 바로 배포한다.

1. 변경을 로컬 브라우저에서 확인한다 (`.claude/launch.json`의 dadari 서버 또는 localhost).
2. `./deploy.sh "커밋 메시지"`를 실행한다. sw.js의 `dadari-vN` 버전을 올리고 커밋·푸시까지 한다.
3. 사용자에게 무엇을 올렸는지 한두 줄로 알린다.

- 허락 범위는 이 저장소의 main 푸시뿐이다. force push, 다른 저장소·브랜치, 서버 설정 변경은 따로 확인받는다.
- 사용자 데이터는 폰 브라우저 localStorage에 있다. 저장 키(`dadari_transactions_v1`, `dadari_goal_v1`)와 백업 JSON 형식은 바꾸지 않는다. 바꿔야 하면 기존 데이터를 옮기는 코드를 같이 넣는다.
- 로컬 테스트용 데이터는 확인 후 지운다.
