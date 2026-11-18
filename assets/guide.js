/* 모든 메뉴 공용: 오른쪽 위 '📖 사용가이드' 버튼과 설명 창.
   새 메뉴를 만들면 아래 GUIDES에 그 폴더 이름으로 설명을 추가하세요. (없으면 기본 안내가 나와요) */
(function () {
  const G = {
    score: ["찬양 악보 다듬기", ["악보 사진이나 PDF를 올리면 깨끗한 악보로 다듬어 줘요", "조옮김·가사·코드 표시를 바꿀 수 있어요", "다 만든 악보는 이미지나 PDF로 내려받아요"]],
    sermon: ["설교도우미", ["본문을 고르면 주석 찾기·원어(히브리어·헬라어) 뜻을 볼 수 있어요", "원어 단어를 누르면 한국어 뜻과 발음이 나와요", "고전 명주석은 번역 버튼으로 한국어로 볼 수 있어요"]],
    bible: ["성경 읽기", ["왼쪽에서 성경을 읽고 ‘이 장 다 읽었어요’를 누르면 읽기표에 체크돼요", "한 장 읽을 때마다 먹이가 생기고, 아기 양이 자라요 (일독하면 어른 양)", "✏️ 밑줄·형광펜, 📝 메모를 본문 위에 남길 수 있어요 (이 기기에 저장)", "🔍 단어 검색, 📚 평행본문, 장·절 이동 버튼도 있어요"]],
    meditation: ["묵상저장소", ["설교메모·QT·찬양·말씀·일상 묵상을 종류별로 기록해요", "캘린더에서 날짜별로 모아 보고, 검색·정렬할 수 있어요", "📷 필기 사진 → 글자로: 설교 필기 사진을 글자로 바꿔 넣어요", "카톡·텍스트·PDF·한글·JPG로 내보낼 수 있어요"]],
    prayer: ["기도 모으기", ["기도 제목을 적고 21·30·40일 중에 골라 포도송이를 만들어요", "포도알 번호는 날짜예요. 오늘 기도하면 오늘 번호 알이 채워져요", "지나간 날은 빈 채로 남아요. 여러 기도 제목을 동시에 키울 수 있어요"]],
    copy: ["필사나무 키우기", ["필사할 책과 키울 나무를 골라 씨앗을 심어요", "위의 본문을 보며 아래 줄 노트에 말씀만 직접 쳐서 써요 (장·절 번호 없이, 붙여넣기는 안 돼요)", "한 절을 다 쓰면 Enter. 줄마다 절 번호가 붙고, 지금 쓸 절은 파란색이에요", "한 장을 다 쓰면 나무가 자라고, 한 권을 다 쓰면 열매를 맺어요"]],
    board: ["나눔보드게임", ["주사위를 굴려 말을 움직이고, 도착한 칸의 질문에 답하며 나눠요", "셀모임·소그룹에서 한 화면을 같이 보며 해요"]],
    lifestory: ["신앙그래프", ["지금 나이를 적고, 나이별로 신앙이 어땠는지(-100%~+100%) 점을 찍어요", "짧은 메모도 함께 남기면 그래프에 같이 보여요", "그래프를 눌러도 점을 찍을 수 있어요. ⛶ 전체화면으로 나눔 때 보여 주세요"]],
    pray: ["누가 기도해?", ["칸 수를 정하고 칸마다 이름을 적어요", "🌅 시작기도 / 🌙 마무리기도를 고르고 돌리기를 눌러요", "시작기도에 걸린 사람은 마무리기도에서 뺄 수 있어요"]],
    anon: ["익명질문", ["방장이 방을 만들고 QR·링크로 초대해요. 참가자는 모두 ‘누군가’예요", "방장이 오른쪽에서 질문 받을 사람을 누르면 모두에게 ‘[이름]님에게 질문해 주세요’가 떠요", "질문이 올라오면 그 사람이 말로 대답하고, ▶ 다음 사람으로 넘어가요", "곤란한 질문은 방장이 숨길 수 있어요"]],
    worldcup: ["찬양월드컵", ["찬양 두 곡 중 더 좋은 곡을 골라 가며 우승곡을 정해요", "몇 강으로 할지 고르고, 대진에서 한 곡씩 골라요"]],
    tele: ["텔레스트레이션", ["방장이 방을 만들고 QR로 초대해요 (3명 이상)", "제시어를 그림으로 그리고, 다음 사람은 그림을 보고 말로 맞혀요", "한 바퀴 돌면 처음 제시어가 어떻게 바뀌었는지 함께 봐요"]],
    yut: ["윷놀이", ["팀 수(2~4)와 팀원 이름, 말 수(2~4)를 정하고 시작해요", "팀원이 돌아가며 윷을 던지고, 움직일 말을 골라요", "윷·모·잡기는 한 번 더! 같은 칸 우리 말은 업혀서 함께 가요", "말을 모두 먼저 들여보낸 팀이 이겨요"]],
    bingo: ["빙고게임", ["방장이 방을 만들고 QR·링크로 초대해요", "미션빙고: 칸을 눌러 미션에 맞는 사람 이름을 적으면 동그라미", "일반빙고: 단어를 드래그해 배치하거나 직접 적고, 방장이 부르면 동그라미", "판 크기(3×3~6×6)와 승리 조건(몇 줄·전체)은 방장이 정해요"]],
    paul: ["바울의 전도여행", ["싱글(한 기기로 돌아가며) 또는 멀티(QR 초대)로 2~4명이 해요", "주사위를 굴려 도시를 여행하고, 교회를 개척해 가정교회·교회·선교센터로 키워요", "다른 사람 도시에 서면 선교 후원금을 내요. ✉️ 은혜카드 80장, 🕊️ 안식일 쉼터, ⛓️ 감옥이 있어요", "바퀴나 시간이 끝나면 현금+도시+건물 값이 가장 많은 사람이 이겨요 (📖 규칙에 전체 설명)"]],
    food: ["주일에 뭐 먹지?", ["질문 몇 개에 답하면 메뉴 후보를 줄여 줘요", "마지막에 랜덤으로 오늘의 메뉴를 골라 줘요"]],
    retreat: ["수련회 장소 레이더", ["지도와 목록에서 지역·인원·종류로 수련회 장소를 찾아요", "장소를 누르면 연락처·지도·사진 링크를 볼 수 있어요", "직접 알게 된 장소를 추가할 수도 있어요"]],
    team: ["사역팀 관리부", ["사역팀 이름과 관리 연도로 팀을 만들고, 팀마다 따로 관리해요", "출석부(출석 요일 선택)·회의록·팀원 명부·캘린더·회계·통계 탭이 있어요", "회의록·회계보고는 미리보기 후 텍스트·PDF·JPG로 내보내요", "기록은 이 기기에 저장돼요. 가끔 백업 파일을 저장해 두세요"]],
    ebook: ["전자책 매대", ["책을 눌러 소개를 보고, 🛒 구매하기에서 송금 후 입금 알림 문자를 보내요", "판매자가 보내 준 열람 코드를 넣으면 책을 받을 수 있어요", "관리자: 📘 전자책 만들기·📤 책 올리기·👥 구매자 코드 관리"]],
    "ebook/maker": ["전자책 만들기", ["쪽을 추가하고 글 상자·이미지·배경·글꼴·쪽번호로 책을 꾸며요", "자동으로 보관함에 저장되고, 저장(Ctrl+S)하면 기록이 남아요", "📤 판매로 올리기: PDF와 표지를 만들어 매대의 책 올리기 화면으로 넘겨요 (관리자)", "다른 곳에서 만든 책은 내보내기 → 작업 파일 불러오기(.json)로 가져와요"]],
    cards: ["말씀카드", ["마음에 드는 말씀카드를 눌러 크게 보고", "💻 PC용, 📱 휴대폰용 중에 골라 내려받아요", "관리자는 ＋ 카드 올리기로 PC용·휴대폰용 이미지를 함께 올려요"]],
    jamak: ["자막저장소", ["찬양 자막 PPT를 찾아 내려받아요"]]
  };
  const parts = location.pathname.split("/").filter(Boolean);
  const known = Object.keys(G);
  let key = null;
  for (let i = 0; i < parts.length; i++) { const two = parts[i] + "/" + (parts[i + 1] || ""); if (G[two]) { key = two; break; } if (G[parts[i]]) key = parts[i]; }
  if (!key) return;                     /* 홈 화면 등에는 넣지 않아요 */
  function mount() {
    if (document.getElementById("btnGuide") || document.getElementById("siteGuideBtn")) return;  /* 자체 가이드가 있는 편집기는 그대로 */
    const [title, items] = G[key];
    const st = document.createElement("style");
    st.textContent = `#siteGuideBtn{font:15px/1 "Jua","Apple SD Gothic Neo",sans-serif;color:#3b2a20;border:2px solid #3b2a20;background:#fffaf0;border-radius:14px;padding:5px 11px;cursor:pointer;box-shadow:0 2px 0 #3b2a20;white-space:nowrap;flex:none}
      #siteGuideBtn.float{position:fixed;right:12px;top:calc(10px + env(safe-area-inset-top,0px));z-index:9001}
      #siteGuide{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px}
      #siteGuide .bx{background:#fffaf0;border:3px solid #3b2a20;border-radius:22px;max-width:460px;width:100%;max-height:85vh;overflow:auto;padding:18px 20px;font:16px/1.6 "Jua","Apple SD Gothic Neo",sans-serif;color:#3b2a20;box-shadow:0 6px 0 rgba(0,0,0,.15)}
      #siteGuide h2{margin:0 0 10px;font-weight:normal;font-size:22px}
      #siteGuide ol{margin:0;padding-left:22px}#siteGuide li{margin:6px 0}
      #siteGuide button{font:inherit;border:2px solid #3b2a20;background:#f5b82e;border-radius:14px;padding:6px 18px;cursor:pointer;box-shadow:0 2px 0 #3b2a20;margin-top:12px}
      @media (max-width:600px){#siteGuideBtn .gt{display:none}}`;
    document.head.appendChild(st);
    const b = document.createElement("button");
    b.type = "button"; b.id = "siteGuideBtn"; b.title = "사용가이드"; b.innerHTML = '📖<span class="gt"> 사용가이드</span>';
    const bar = document.querySelector(".top") || document.querySelector("header.top") || document.querySelector("header.band .brand");
    if (bar) { b.style.marginLeft = "auto"; bar.appendChild(b); const ttl = bar.querySelector(".ttl"); if (ttl) b.style.marginLeft = "0"; }
    else { b.classList.add("float"); document.body.appendChild(b); }
    b.onclick = () => {
      const m = document.createElement("div"); m.id = "siteGuide";
      m.innerHTML = `<div class="bx" role="dialog" aria-label="사용가이드"><h2>📖 ${title} 사용가이드</h2><ol>${items.map(t => `<li>${t}</li>`).join("")}</ol><div style="text-align:center"><button type="button">알겠어요</button></div></div>`;
      document.body.appendChild(m);
      const close = () => m.remove();
      m.onclick = e => { if (e.target === m || e.target.tagName === "BUTTON") close(); };
      addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); removeEventListener("keydown", k); } });
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(mount, 300)); else setTimeout(mount, 300);
})();
