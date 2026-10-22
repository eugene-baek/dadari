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
- 카드는 이름·종류·결제일·연회비(`fee`)·브랜드(`brand`)·혜택 텍스트(`benefits`)만 저장한다. 카드번호 등 민감한 정보는 받지 않는다. 혜택은 한 줄에 하나이고 "이름 / 40-4천원 / 70-7천원"(전월 실적 만원-혜택) 형식이면 `parseBenefits`가 구간으로 읽어 전월 실적(그 카드로 기록한 지출)에 맞는 혜택을 보여 준다. "전월실적 30만원"처럼 구간 없이 쓴 한 줄은 단일 실적 기준으로 읽어 달성/미달과 나머지 혜택의 적용 여부를 보여 준다. 그 밖의 형식이 아닌 줄은 적은 그대로 보여 준다.
- 시간표(`dadari_schedule_v1`: members, items)는 백업 v2의 `schedule`에 들어간다. 시간표만 담은 파일도 불러올 수 있다.
- **이 저장소는 공개다.** 가족 이름, 아이 시간표, 학원·장소 같은 개인 정보를 코드·커밋에 넣지 않는다. 시험 데이터도 저장소 폴더 밖에서 만들고, 배포 전에 `git status`와 grep으로 확인한다(`deploy.sh`가 `git add -A`를 쓴다).
- 카테고리(`dadari_categories_v1`)는 사용자가 수정한다. `CATEGORIES`는 기본값일 뿐이고, 화면은 `categories`를 쓴다. 이름을 바꾸면 내역·자동이체의 카테고리도 같이 바꾼다.
- 건강관리(`dadari_health_v1`: visits, periods, vaccines, meds)는 병원 진료·생리주기·접종·복약 기록이다. 복약의 오늘 체크는 약 레코드 안의 `taken`(날짜→시간대 배열, 45일 지나면 정리)에 둔다. 개인 정보라서 시험 데이터도 저장소에 넣지 않는다. 접종 시기·횟수는 앱이 정해 주지 않고 사용자가 입력한다(의료 일정을 임의로 넣지 않는다).
- 접종 표준일정(`VAX`)은 질병관리청 국가예방접종 표준일정(어린이)을 옮긴 것이다. 구성원 `birth`(생년월일)로 나이를 계산해 백신·차수별 칩(완료/예정/시기 도래/곧)을 보여 준다. 일정을 고칠 때는 공식 자료(nip.kdca.go.kr, 질병관리청)로 확인한 값만 쓰고, 확인한 날짜를 주석에 남긴다. 기록과 칩은 백신 이름 정규식으로 짝지으므로 `VACCINES` 이름 목록과 `VAX.re`를 함께 맞춘다.
- 카드의 `fixedDefault`는 "고정비 기본 카드"(하나만 true)다. 기록 폼에서 "고정비"에 체크하면 결제수단이 그 카드로 바뀌고 해제·기록 후 원래 선택으로 돌아가며(`payBeforeFixed`), 자동이체 등록의 카드 기본값도 된다.
- 병원 진료의 실비(실손보험) 청구는 `claim`('' 부 / 'todo' 청구 필요 / 'done' 여), `claimDate`, `claimAmt`다. 'todo'는 병원 화면 맨 위에 모아 보여 준다.
- 구성원(`schedule.members`)은 시간표와 건강관리가 함께 쓰는 목록이다. 배열 순서가 곧 나열 순서이고(구성원 관리의 ▲▼), 동기화로 합칠 때도 이 기기 순서를 따른다. 건강관리의 "나"(`me`)는 목록에 없는 고정 항목이다. 구성원을 지우면 그 사람의 시간표·병원·접종·복약 기록도 함께 지우므로 `removeMember`를 거친다.
- 지출의 결제수단은 `pay`('cash'|'transfer'|'card')와 선택적 `cardId`다. `pay`가 없는 예전 내역은 결제수단을 표시하지 않는다.
- **동기화**: 사용자의 GitHub **비공개** 저장소 파일 `dadari-data.json`에 전체 데이터를 모은다(Contents API, 토큰은 기기별 localStorage `dadari_sync_v1`에만 두고 백업·스냅샷에 넣지 않는다). 변경하면 2초 뒤·열 때·60초마다 동기화한다. 합칠 때는 id 기준 합집합이고 지운 항목은 `tombs`로 되살아나지 않게 한다. 그래서 **삭제하는 코드는 `tomb(id)`를 부르고, 자동 생성 항목은 고정 id를 쓴다.** 새 데이터 종류를 추가하면 `snapshot`·`mergeSnapshots`·`applySnapshot`·백업 내보내기/불러오기에 넣는다.
- 서비스 워커(`sw.js`)는 페이지·파일을 가져올 때 `cache: 'no-cache'`로 서버에 새 버전이 있는지 먼저 확인한다. 이게 없으면 GitHub Pages가 알려 주는 10분 캐시 때문에 업데이트가 늦게 보인다. 로컬에서 시험할 때 예전 화면이 보이면 서비스 워커를 해제(unregister)하고 캐시를 지운 뒤 다시 연다.
- 동기화 연결 화면은 먼저 GitHub에 접속해 확인하고 실패하면 창 안에 이유를 보여 준다(연결 정보는 성공했을 때만 저장).
- 시험할 때는 GitHub 대신 로컬 모의 서버를 쓰고, 연결 설정에 `api` 값을 넣으면 그 주소로 요청한다(실제 토큰을 쓰지 않는다).
- 영수증 사진은 IndexedDB(`dadari`/`receipts`)에 있고 백업 JSON에는 들어가지 않는다.
- 로컬 테스트용 데이터는 확인 후 지운다.
