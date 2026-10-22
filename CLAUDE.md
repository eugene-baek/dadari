# 다다리 가계부 (dadari)

단일 파일 PWA. 공개 주소: https://eugene-baek.github.io/dadari/ (저장소 eugene-baek/dadari, main 브랜치, GitHub Pages)

## 수정 후 자동 반영 (사용자가 허락함)
이 폴더의 앱 파일(index.html, sw.js, manifest.webmanifest, 아이콘)을 고친 뒤에는 사용자에게 다시 묻지 않고 바로 배포한다.

1. 변경을 로컬 브라우저에서 확인한다 (`.claude/launch.json`의 dadari 서버 또는 localhost).
2. `./deploy.sh "커밋 메시지"`를 실행한다. sw.js의 `dadari-vN` 버전을 올리고 커밋·푸시까지 한다.
3. 사용자에게 무엇을 올렸는지 한두 줄로 알린다.

- 허락 범위는 이 저장소의 main 푸시뿐이다. force push, 다른 저장소·브랜치, 서버 설정 변경은 따로 확인받는다.
- 사용자 데이터는 폰 브라우저 localStorage에 있다. 저장 키(`dadari_transactions_v1`, `dadari_goal_v1`, `dadari_cards_v1`, `dadari_recurs_v1`, `dadari_recur_done_v1`)는 바꾸지 않는다. 바꿔야 하면 기존 데이터를 옮기는 코드를 같이 넣는다.
- 백업 JSON은 두 형식을 모두 불러온다: 예전 형식(내역 배열)과 v2 형식(`{app, version, transactions, cards, recurs, recurDone, goal}`). 내보내기는 v2.
- 카드는 이름·종류·결제일만 저장한다. 카드번호 등 민감한 정보는 받지 않는다.
- 시간표(`dadari_schedule_v1`: members, items)는 백업 v2의 `schedule`에 들어간다. 시간표만 담은 파일도 불러올 수 있다.
- **이 저장소는 공개다.** 가족 이름, 아이 시간표, 학원·장소 같은 개인 정보를 코드·커밋에 넣지 않는다. 시험 데이터도 저장소 폴더 밖에서 만들고, 배포 전에 `git status`와 grep으로 확인한다(`deploy.sh`가 `git add -A`를 쓴다).
- 영수증 사진은 IndexedDB(`dadari`/`receipts`)에 있고 백업 JSON에는 들어가지 않는다.
- 로컬 테스트용 데이터는 확인 후 지운다.
