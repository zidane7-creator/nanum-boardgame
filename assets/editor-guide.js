/* 사용 가이드: 이미지 제작기·주보 제작기 공용 (data-kind="image" | "jubo") */
(function () {
  const me = document.currentScript, KIND = (me && me.dataset.kind) || "image";
  const NAME = KIND === "jubo" ? "주보 제작기" : KIND === "subtitle" ? "자막스튜디오" : "이미지 제작기";
  const K = s => s.split(" ").map(k => "<kbd>" + k + "</kbd>").join(" ");

  const START = KIND === "jubo" ? `
    <p>처음 들어오면 <b>주보 면 구성</b> 창이 떠요. 몇 면짜리 주보를 만들지 고르면 바로 그 크기로 준비돼요.</p>
    <table><tr><th>2면</th><td>A4 한 장 앞·뒤. 순서·광고를 짧게 담는 간단한 주보</td></tr>
    <tr><th>4면</th><td>A4 두 장 크기를 반으로 접는 기본 주보 (표지 · 예배순서 · 광고 · 뒷면)</td></tr>
    <tr><th>6면</th><td>3단 접이. 순서, 광고, 기도제목, 섬김이 등을 나눠 담을 때</td></tr>
    <tr><th>8면</th><td>A4 두 장을 겹쳐 접는 소책자형. 말씀 요약·교회 소식이 많을 때</td></tr></table>
    <ul><li>왼쪽 아래 <b>📄 ○면 주보 가이드</b>에서 면마다 무엇을 넣으면 좋은지 보이고, <b>이 면 보기</b>로 그 면으로 바로 이동해요.</li>
    <li>면마다 <b>템플릿</b> 버튼을 누르면 그 면에 주보 디자인을 바로 넣을 수 있어요.</li>
    <li>면 수를 바꾸고 싶으면 가이드의 <b>면 바꾸기</b>를 누르세요.</li>
    <li>위쪽 <b>템플릿</b> 버튼: 주보 템플릿 500종 중에서 골라 고쳐 쓰기</li>
    <li>위쪽 <b>용지</b> 버튼: A4·B5 등 크기와 가로·세로 바꾸기</li></ul>` : `
    <p>교회 <b>현수막, 명찰, 유튜브·설교 썸네일, 포스터, 초대장</b> 같은 이미지를 만드는 편집기예요.</p>
    <ul><li>위쪽 <b>템플릿</b> 버튼: 행사·공연, 초대장, 시즌, 교육·클래스 등 분류별 디자인을 골라 글자와 사진만 바꿔 쓰세요.</li>
    <li>위쪽 <b>용지</b> 버튼: 만들 결과물의 크기·비율을 골라요. 예) 썸네일은 16:9, 현수막은 가로로 긴 비율, 명찰은 작은 카드 크기</li>
    <li><b>파일 › 새 문서</b>: 원하는 가로·세로 크기를 직접 넣어 빈 화면부터 시작</li>
    <li>한 문서에 <b>대지</b>(작업 판)를 여러 개 두면 명찰 여러 장, 썸네일 여러 버전을 한꺼번에 만들 수 있어요. (대지 도구 ${K("Shift+O")}, 창 › 대지 패널)</li></ul>`;

  const SUB = [
    ["start", "🚀 시작하기", `
      <ol><li>위쪽 <b>가사 붙여넣기</b>를 누르고 찬양 가사 전체를 붙여 넣으세요. (가사를 복사한 채로 화면에서 ${K("Ctrl+V")} 해도 열려요)</li>
      <li><b>한 장에 몇 줄</b>씩 넣을지 고르고, 빈 줄에서 새 슬라이드로 나눌지 정하세요. '1절', '후렴' 같은 표시 줄은 자동으로 빠져요.</li>
      <li>맨 앞에 <b>제목 슬라이드</b>를 넣을 수도 있어요.</li>
      <li><b>슬라이드 만들기</b>를 누르면 지금 보고 있는 디자인 그대로 슬라이드가 한 번에 만들어져요.</li></ol>
      <p>위쪽 제목 칸에 곡 제목을 적으면 내보낼 때 파일 이름이 돼요. 작업은 이 브라우저에 자동 저장돼요.</p>`],
    ["screen", "🧭 화면 구성", `
      <table><tr><th>왼쪽</th><td>슬라이드 목록. 눌러서 이동하고, 끌어서 순서를 바꿔요. 마우스를 올리면 복사(⧉)·위아래 이동·삭제(✕) 버튼이 나와요.</td></tr>
      <tr><th>가운데</th><td>슬라이드 화면. 글자나 도형을 눌러 고르고, 끌어서 옮기고, 모서리 점으로 크기를 바꿔요. 가운데에 오면 분홍 안내선이 나와요.</td></tr>
      <tr><th>오른쪽</th><td>템플릿 · 배경 · 요소 · 선택 · 일괄 변경 탭</td></tr>
      <tr><th>위쪽</th><td>새로 만들기, PPT 열기, 가사 붙여넣기, 화면 비율, 되돌리기, 내보내기</td></tr></table>`],
    ["tpl", "🎨 템플릿 · 배경", `
      <ul><li><b>템플릿 탭</b>: 1,000가지 디자인 중에서 고르면 배경과 가사 글꼴·색·위치가 한 번에 바뀌어요. 가사 내용은 그대로예요.</li>
      <li>단색 · 그라데이션 · 빛 · 자연 · 패턴 · 미니멀 · 예배 · 하단자막으로 나눠 보고, 어두운/밝은 배경만 볼 수도 있어요.</li>
      <li><b>적용 범위</b>를 '모든 슬라이드'로 하면 전체가 한 번에 바뀌어요.</li>
      <li><b>배경 탭</b>: 패턴 · 단색 · 그라데이션 · 사진 중에서 고르고 색을 바꿔요. 사진 위 가사가 잘 안 보이면 <b>어둡게 덮기</b>를 올리세요.</li>
      <li>사진 파일을 슬라이드 화면에 끌어다 놓으면 바로 배경이 돼요.</li></ul>`],
    ["text", "✏️ 글자 꾸미기", `
      <ul><li>글자를 <b>두 번 누르면</b> 슬라이드 위에서 바로 고칠 수 있어요. (고른 상태에서 ${K("Enter")}도 돼요)</li>
      <li><b>선택 탭</b>: 글꼴(무료 한글 글꼴 37종 + 영문 13종), 크기, 굵게, 색, 정렬, 줄 간격, 자간</li>
      <li>효과: 그림자, 외곽선, 글자 배경(반투명 띠), 불투명도</li>
      <li>위치 버튼: 상단 · 중앙 · 하단 · <b>하단 자막</b> · 전체</li>
      <li>고친 가사 서식을 <b>모든 슬라이드에 적용</b>할 수 있어요. 글꼴·크기·색·정렬·위치·효과 중 고른 것만 바꿀 수 있어요.</li>
      <li>컴퓨터에 설치된 글꼴은 글꼴 목록 위 입력칸에 이름을 적어 쓰고, 글꼴 파일(.ttf .otf .woff)은 요소 탭에서 올릴 수 있어요.</li></ul>`],
    ["add", "➕ 요소 · 일괄 변경", `
      <ul><li><b>요소 탭</b>: 가사 텍스트, 텍스트 상자, 곡 제목, 작은 글씨(출처), 이미지·로고, 하단 띠, 사각형, 원, 구분선을 넣어요.</li>
      <li>교회 로고나 하단 띠처럼 매 장 필요한 것은 고른 뒤 <b>모든 슬라이드에 넣기</b>를 누르세요. 한 곳에서 고치면 전부 같이 바뀌어요.</li>
      <li><b>일괄 변경 탭</b>: 모든 슬라이드의 가사 서식을 한 번에 바꾸고, <b>가사 줄 다시 나누기</b>로 한 장에 들어가는 줄 수를 바꿀 수 있어요.</li>
      <li>화면 비율: 16:9, 4:3, 21:9, 32:9(LED 띠), 세로 9:16 등. 직접 입력도 돼요.</li></ul>`],
    ["export", "💾 내보내기 · PPT 열기", `
      <ul><li><b>내보내기 ▾</b> 버튼에서 고르세요.
        <ul><li><b>PowerPoint (.pptx)</b>: 글자를 PPT에서 바로 고칠 수 있어요. 예배실 컴퓨터에도 같은 글꼴이 있어야 모양이 같아요.</li>
        <li><b>JPG 전체 (ZIP)</b> / <b>JPG 현재 슬라이드</b>: 1920px 이미지라 글꼴 걱정이 없어요.</li>
        <li><b>프로젝트 파일 (.json)</b>: 나중에 여기서 다시 열어 고칠 수 있어요.</li></ul></li>
      <li><b>PPT 열기</b>: 가지고 있던 .pptx나 .json 파일을 불러와서 고쳐 쓸 수 있어요. 파일을 화면에 끌어다 놓아도 돼요.</li>
      <li><b>자료실</b> 탭: 올려 둔 찬양 자막을 제목·가사·태그·초성으로 찾아 PPT·JPG로 받거나 편집기에서 열어 고쳐 쓸 수 있어요. 여러 곡을 골라 한 파일로 묶을 수도 있어요.</li>
      <li><b>📚 자료실로 보내기</b>(관리자): 만든 슬라이드가 누르는 즉시 자료실에 올라가요. 처음 한 번 관리자 키를 넣어야 해요. 다른 사람 화면에는 1분쯤 뒤에 보여요.</li></ul>`],
    ["keys", "⌨️ 단축키", `
      <table class="kt"><tr><td>되돌리기 / 다시 실행</td><td>${K("Ctrl+Z")} / ${K("Ctrl+Y")}</td></tr>
      <tr><td>슬라이드 복사</td><td>${K("Ctrl+D")}</td></tr>
      <tr><td>요소 복사 / 붙이기</td><td>${K("Ctrl+C")} / ${K("Ctrl+V")}</td></tr>
      <tr><td>고른 요소 지우기</td><td>${K("Delete")}</td></tr>
      <tr><td>글자 바로 고치기</td><td>${K("Enter")} 또는 두 번 누르기</td></tr>
      <tr><td>고른 요소 옮기기</td><td>방향키 (${K("Shift")}+방향키는 크게)</td></tr>
      <tr><td>슬라이드 넘기기</td><td>아무것도 안 고른 상태에서 방향키 · PageUp/PageDown</td></tr></table>
      <p class="muted">Mac에서는 Ctrl 대신 ⌘(Command)를 쓰세요.</p>`]
  ];
  const S = KIND === "subtitle" ? SUB : [
    ["start", "🚀 시작하기", START],
    ["screen", "🧭 화면 구성", `
      <table><tr><th>맨 위 메뉴</th><td>파일 · 편집 · 오브젝트 · 문자 · 선택 · 효과 · 보기 · 창 · 도움말 — 모든 기능이 여기 있어요.</td></tr>
      <tr><th>그 아래 줄</th><td>지금 고른 도구나 오브젝트의 빠른 설정(칠·획 색, 두께, 글꼴 등)</td></tr>
      <tr><th>왼쪽 도구</th><td>선택, 글자, 도형, 펜 같은 그리기 도구. 아이콘을 누르거나 단축키로 바꿔요.</td></tr>
      <tr><th>오른쪽 패널</th><td>속성 · 색상 · 정렬 · 레이어 등. 휴대폰/좁은 화면에서는 위의 <b>패널</b> 버튼으로 열고 닫아요.</td></tr>
      <tr><th>맨 아래</th><td>상태줄: 확대 비율, 선택 개수, 마우스 위치</td></tr></table>`],
    ["text", "✏️ 글자 넣고 고치기", `
      <ul><li><b>문자 도구</b> ${K("T")} 를 고르고 화면을 클릭해 바로 입력하세요. 드래그하면 글상자(영역 문자)가 만들어져요.</li>
      <li>이미 있는 글자는 <b>선택 도구</b> ${K("V")} 로 <b>더블클릭</b>하면 내용을 고칠 수 있어요.</li>
      <li>글꼴 · 크기 · 행간 · 자간 · 정렬은 위쪽 설정 줄이나 오른쪽 <b>속성</b> 패널에서 바꿔요.</li>
      <li><b>문자 메뉴</b>: 윤곽선 만들기(글자를 도형으로 바꿈, ${K("Shift+Ctrl+O")}), 영역 문자로, 세로쓰기, 대·소문자 바꾸기, 글꼴 목록, 찾기·바꾸기</li>
      <li>템플릿의 예시 글자는 그대로 더블클릭해서 교회 이름, 날짜, 설교 제목 등으로 바꾸면 돼요.</li></ul>`],
    ["photo", "🖼️ 사진 넣기 · 배경 지우기", `
      <ul><li><b>파일 › 가져오기</b> ${K("Shift+Ctrl+P")} 로 사진·SVG를 넣거나, 사진 파일을 화면에 <b>끌어다 놓아도</b> 돼요.</li>
      <li>사진을 넣을 때 방식을 고를 수 있어요 — <b>그대로 넣기 / 배경 자동 제거 / 누끼 작업창 열기</b>. (파일 › 이미지 넣기 방식에서 기본값 변경)</li>
      <li><b>오브젝트 › 배경 자동 제거</b>: 인물·물건만 남기고 배경을 지워요.</li>
      <li><b>오브젝트 › 누끼 작업창</b> ${K("Alt+Shift+Ctrl+K")}: 붓으로 남길 곳/지울 곳을 직접 칠해서 깔끔하게 따기</li>
      <li>누끼 작업창의 <b>✒ 펜</b> ${K("P")}: 대상 윤곽을 따라 클릭(직선)·드래그(곡선)로 점을 찍고, 첫 점을 다시 누르거나 ${K("Enter")}로 닫은 뒤 <b>안쪽만 남기기</b>. ${K("Backspace")} 마지막 점 취소</li>
      <li><b>이미지 자르기 도구</b> ${K("Shift+K")}: 사진의 필요한 부분만 남기기</li>
      <li>사진을 모양 안에 넣으려면 모양을 사진 위에 놓고 둘 다 선택한 뒤 <b>클리핑 마스크</b> ${K("Ctrl+7")}</li></ul>`],
    ["draw", "🔷 도형 · 그리기", `
      <table><tr><th>사각형 ${K("M")} · 원 ${K("L")} · 선 ${K("\\")}</th><td>드래그해서 그리기. ${K("Shift")} 를 누르면 정사각형·정원</td></tr>
      <tr><th>펜 ${K("P")} · 곡률 ${K("Shift+~")}</th><td>점을 찍어 원하는 모양 그리기. 고정점 추가 ${K("=")} · 삭제 ${K("-")} · 변환 ${K("Shift+C")}</td></tr>
      <tr><th>브러시 · 연필 · 물방울 브러시</th><td>손으로 그리듯 자유롭게. 브러시 크기는 ${K("[")} ${K("]")}</td></tr>
      <tr><th>가위 ${K("C")} · 지우개 · 칼</th><td>선이나 도형을 자르고 지우기</td></tr>
      <tr><th>도형 구성 ${K("Shift+M")}</th><td>겹친 도형을 드래그로 합치거나 지우기</td></tr>
      <tr><th>패스파인더 패널</th><td>합치기 · 앞에서 빼기 · 교차 · 나누기로 새 모양 만들기</td></tr>
      <tr><th>자유 변형 ${K("E")}</th><td>크기·회전·기울이기를 한 번에</td></tr></table>`],
    ["color", "🎨 색 · 꾸미기", `
      <ul><li>왼쪽 도구 아래 <b>칠(안쪽 색)</b>과 <b>획(테두리)</b> 상자를 눌러 색을 골라요. ${K("X")} 칠↔획 전환, ${K("Shift+X")} 맞바꾸기, ${K("D")} 기본색, ${K("/")} 색 없음</li>
      <li><b>스포이트</b> ${K("I")}: 다른 오브젝트의 색·스타일을 그대로 가져오기</li>
      <li><b>색상 · 스와치 · 그라디언트 패널</b>: 색 고르기, 자주 쓰는 색 저장, 그라데이션 만들기 (그라디언트 도구 ${K("G")})</li>
      <li><b>획 패널</b>: 테두리 두께, 점선, 끝 모양</li>
      <li><b>투명도 패널</b>: 불투명도와 혼합 모드(곱하기, 스크린 등)</li>
      <li><b>효과 메뉴</b>: 그림자, 외부·내부 광선, 가우시안 흐림, 페더, 입자, 거친 가장자리, 포스터화, 듀오톤 — <b>모양 패널</b>에서 켜고 끄거나 다시 고칠 수 있어요. 모두 없애려면 효과 › 지우기</li>
      <li><b>편집 메뉴</b>: 색상 재지정, 색상 반전, 회색 음영으로 변환</li></ul>`],
    ["arrange", "📐 배치 · 정렬 · 레이어", `
      <ul><li><b>정렬 패널</b>: 여러 개를 골라 왼쪽·가운데·오른쪽 맞추기, 간격 똑같이 나누기</li>
      <li>순서: 맨 앞으로 ${K("Shift+Ctrl+]")} · 앞으로 ${K("Ctrl+]")} · 뒤로 ${K("Ctrl+[")} · 맨 뒤로 ${K("Shift+Ctrl+[")}</li>
      <li>묶기: 그룹 ${K("Ctrl+G")} · 그룹 해제 ${K("Shift+Ctrl+G")}</li>
      <li>잠그기 ${K("Ctrl+2")} (배경이 자꾸 선택될 때 유용) · 모두 잠금 해제 ${K("Alt+Ctrl+2")} · 숨기기 ${K("Ctrl+3")}</li>
      <li><b>레이어 패널</b>: 배경 / 글자 / 사진처럼 층을 나눠서 관리하고, 눈 아이콘으로 숨기거나 자물쇠로 잠가요.</li>
      <li><b>변형 패널 · 오브젝트 › 변형</b>: 이동·회전·반사·크기·기울이기를 숫자로 정확하게. 같은 변형 반복 ${K("Ctrl+D")}</li>
      <li>고른 오브젝트는 방향키로 1px씩, ${K("Shift")}+방향키로 10px씩 움직여요.</li></ul>`],
    ["view", "🔍 화면 보기", `
      <ul><li>확대·축소: ${K("Ctrl+=")} / ${K("Ctrl+-")}, ${K("Ctrl")}+마우스 휠, 휴대폰은 두 손가락으로 벌리기. 대지에 맞추기 ${K("Ctrl+0")}, 실제 크기 ${K("Ctrl+1")}</li>
      <li>${K("Space")} 를 누른 채 끌면 화면 이동(손 도구 ${K("H")}), 돋보기 ${K("Z")}</li>
      <li><b>보기 메뉴</b>: 화면에 맞추기, 100%로 보기, 눈금자, 격자, 고급 안내선 ${K("Ctrl+U")}, 윤곽 보기</li>
      <li>눈금자에서 화면 안쪽으로 끌면 <b>안내선</b>이 생겨요. 여백·가운데 맞출 때 편해요.</li></ul>`],
    ["save", "💾 저장 · 내보내기 · 인쇄", `
      <ul><li>작업은 이 브라우저에 <b>자동으로 임시 저장</b>돼서 창을 닫았다 열어도 이어서 할 수 있어요. 단, 다른 기기나 브라우저로는 옮겨지지 않아요.</li>
      <li><b>파일 › 프로젝트 저장 (.json)</b> ${K("Ctrl+S")}: 나중에 다시 고칠 수 있는 작업 파일로 보관 → <b>파일 › 열기</b> ${K("Ctrl+O")}로 다시 불러오기</li>
      <li><b>파일 › 내보내기</b> ${K("Alt+Ctrl+E")}: <b>PNG · JPEG · WebP</b>(카톡·유튜브·SNS용) 또는 <b>PDF</b>(인쇄용)로 저장</li>
      <li><b>SVG로 저장</b> ${K("Shift+Ctrl+S")}: 크기를 키워도 깨지지 않는 그림 파일</li>
      ${KIND === "jubo" ? "<li>인쇄소에 맡기거나 직접 인쇄할 때는 PDF로 내보내고, 양면·접는 방향을 꼭 미리 한 장 시험 인쇄해 보세요.</li>" : "<li>썸네일은 PNG/JPEG, 현수막처럼 크게 뽑는 건 PDF나 큰 배율의 PNG로 내보내세요.</li>"}
      <li>모든 작업은 내 기기 안에서만 처리되고, 사진이 서버로 올라가지 않아요.</li></ul>`],
    ["keys", "⌨️ 자주 쓰는 단축키", `
      <table class="kt"><tr><td>실행 취소 / 다시 실행</td><td>${K("Ctrl+Z")} / ${K("Shift+Ctrl+Z")}</td></tr>
      <tr><td>복사 / 붙이기 / 제자리에 붙이기</td><td>${K("Ctrl+C")} / ${K("Ctrl+V")} / ${K("Shift+Ctrl+V")}</td></tr>
      <tr><td>지우기</td><td>${K("Delete")}</td></tr>
      <tr><td>선택 / 직접 선택 / 글자</td><td>${K("V")} / ${K("A")} / ${K("T")}</td></tr>
      <tr><td>그룹 / 해제</td><td>${K("Ctrl+G")} / ${K("Shift+Ctrl+G")}</td></tr>
      <tr><td>모두 선택</td><td>${K("Ctrl+A")}</td></tr>
      <tr><td>저장 / 내보내기</td><td>${K("Ctrl+S")} / ${K("Alt+Ctrl+E")}</td></tr>
      <tr><td>단축키 전체 보기</td><td>${K("Ctrl+/")} (도움말 › 키보드 단축키)</td></tr></table>
      <p class="muted">Mac에서는 Ctrl 대신 ⌘(Command), Alt 대신 ⌥(Option)을 쓰세요.</p>`],
    ["tips", "💡 팁 · 안 되는 것", `
      <ul><li>잘못 건드렸다면 당황하지 말고 ${K("Ctrl+Z")} — 여러 번 되돌릴 수 있어요.</li>
      <li>오브젝트가 선택이 안 되면 잠겨 있거나 숨겨졌을 수 있어요 → 오브젝트 › 모두 잠금 해제 / 모두 표시</li>
            <li>안 되는 것: .ai 파일 열기, CMYK 인쇄 색상, 벡터 PDF(PDF는 고해상도 이미지로 저장), 3D 회전</li></ul>`]
  ];

  const css = `
  #ugBack{position:fixed;inset:0;background:rgba(20,16,40,.45);z-index:9999;display:none;align-items:center;justify-content:center;padding:16px}
  #ugBack.show{display:flex}
  #ug{background:#fffdf7;color:#2b2540;width:min(920px,100%);height:min(680px,100%);border-radius:18px;border:3px solid #2b2540;box-shadow:0 10px 0 rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font:15px/1.65 "Pretendard","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif}
  #ug header{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:2px solid #eee3c8;background:#fff3cf}
  #ug header h2{margin:0;font-size:19px;flex:1}
  #ug header button{border:2px solid #2b2540;background:#fff;border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer}
  #ug .ugb{flex:1;display:flex;min-height:0}
  #ug nav{width:200px;flex:none;overflow:auto;padding:10px;border-right:2px solid #eee3c8;background:#fffaf0}
  #ug nav button{display:block;width:100%;text-align:left;border:0;background:none;padding:8px 10px;border-radius:10px;font:inherit;color:inherit;cursor:pointer}
  #ug nav button:hover{background:#fdeec2}#ug nav button.on{background:#f5b82e;color:#2b2540;font-weight:700}
  #ug article{flex:1;overflow:auto;padding:6px 22px 30px;scroll-behavior:smooth}
  #ug section{padding-top:14px}#ug h3{font-size:18px;margin:10px 0 8px;padding-bottom:6px;border-bottom:2px dashed #eee3c8}
  #ug ul{padding-left:20px;margin:6px 0}#ug li{margin:5px 0}
  #ug table{border-collapse:collapse;width:100%;margin:6px 0}#ug th,#ug td{border:1px solid #eee3c8;padding:7px 10px;text-align:left;vertical-align:top}
  #ug th{background:#fffaf0;white-space:nowrap;font-weight:700;width:1%}
  #ug .kt td:last-child{white-space:nowrap}
  #ug kbd{display:inline-block;background:#fff;border:1px solid #c9bfa5;border-bottom-width:2px;border-radius:5px;padding:0 5px;font:12px/1.6 ui-monospace,Consolas,monospace;color:#2b2540}
  #ug .muted{color:#7a7090;font-size:13px}
  #btnGuide{white-space:nowrap}
  @media (max-width:700px){#ug .ugb{flex-direction:column}#ug nav{width:auto;display:flex;overflow-x:auto;border-right:0;border-bottom:2px solid #eee3c8;padding:6px}#ug nav button{width:auto;white-space:nowrap;flex:none}#ug article{padding:4px 14px 24px}#ug th{white-space:normal;min-width:5.5em}#btnGuide .gl{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const back = document.createElement("div"); back.id = "ugBack";
  back.innerHTML = '<div id="ug" role="dialog" aria-modal="true" aria-label="' + NAME + ' 사용 가이드"><header><h2>📖 ' + NAME + ' 사용 가이드</h2><button type="button" id="ugX" aria-label="닫기">✕</button></header><div class="ugb"><nav>' +
    S.map(([id, t]) => '<button type="button" data-g="' + id + '">' + t + '</button>').join("") + '</nav><article>' +
    S.map(([id, t, b]) => '<section id="ug-' + id + '"><h3>' + t + '</h3>' + b + '</section>').join("") + '</article></div></div>';
  document.body.appendChild(back);
  const art = back.querySelector("article"), navs = [...back.querySelectorAll("nav button")];
  const mark = id => navs.forEach(b => b.classList.toggle("on", b.dataset.g === id));
  navs.forEach(b => b.onclick = () => { art.scrollTop = back.querySelector("#ug-" + b.dataset.g).offsetTop - art.offsetTop; mark(b.dataset.g) });
  art.addEventListener("scroll", () => { let cur = S[0][0]; for (const [id] of S) { if (back.querySelector("#ug-" + id).offsetTop - art.offsetTop <= art.scrollTop + 40) cur = id } mark(cur) });
  const close = () => back.classList.remove("show");
  const open = () => { back.classList.add("show"); mark(S[0][0]); art.scrollTop = 0; try { gtag("event", "guide_open", { menu_name: NAME }) } catch (e) {} };
  back.querySelector("#ugX").onclick = close;
  back.addEventListener("click", e => { if (e.target === back) close() });
  /* keep the editor's own shortcuts from firing while the guide is open */
  back.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Escape") close() });
  addEventListener("keydown", e => { if (back.classList.contains("show") && e.key === "Escape") { e.stopPropagation(); close() } }, true);

  const btn = document.createElement("button");
  btn.id = "btnGuide"; btn.className = "btn"; btn.type = "button"; btn.title = "사용 가이드 보기";
  btn.innerHTML = '📖<span class="gl"> 사용 가이드 보기</span>';
  btn.onclick = open;
  const tpl = document.getElementById("btnTpl");
  const hb = document.querySelector("[data-home-bar] .spacer");
  if (tpl) tpl.parentNode.insertBefore(btn, tpl); else if (hb) hb.parentNode.insertBefore(btn, hb.nextSibling); else document.body.appendChild(btn);
  window.openUserGuide = open;
})();
