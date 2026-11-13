/* 설교도우미: 📚 주석 찾기 + 🔎 원어 사전(페이지 안 검색) */
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const say = t => { try { toast(t) } catch (_) { alert(t) } };

  /* ---------- 성경 66권 ---------- */
  const BOOKS = [
    ["창세기","창","genesis",50],["출애굽기","출","exodus",40],["레위기","레","leviticus",27],["민수기","민","numbers",36],["신명기","신","deuteronomy",34],
    ["여호수아","수","joshua",24],["사사기","삿","judges",21],["룻기","룻","ruth",4],["사무엘상","삼상","1_samuel",31],["사무엘하","삼하","2_samuel",24],
    ["열왕기상","왕상","1_kings",22],["열왕기하","왕하","2_kings",25],["역대상","대상","1_chronicles",29],["역대하","대하","2_chronicles",36],["에스라","스","ezra",10],
    ["느헤미야","느","nehemiah",13],["에스더","에","esther",10],["욥기","욥","job",42],["시편","시","psalms",150],["잠언","잠","proverbs",31],
    ["전도서","전","ecclesiastes",12],["아가","아","songs",8],["이사야","사","isaiah",66],["예레미야","렘","jeremiah",52],["예레미야애가","애","lamentations",5],
    ["에스겔","겔","ezekiel",48],["다니엘","단","daniel",12],["호세아","호","hosea",14],["요엘","욜","joel",3],["아모스","암","amos",9],
    ["오바댜","옵","obadiah",1],["요나","욘","jonah",4],["미가","미","micah",7],["나훔","나","nahum",3],["하박국","합","habakkuk",3],
    ["스바냐","습","zephaniah",3],["학개","학","haggai",2],["스가랴","슥","zechariah",14],["말라기","말","malachi",4],
    ["마태복음","마","matthew",28],["마가복음","막","mark",16],["누가복음","눅","luke",24],["요한복음","요","john",21],["사도행전","행","acts",28],
    ["로마서","롬","romans",16],["고린도전서","고전","1_corinthians",16],["고린도후서","고후","2_corinthians",13],["갈라디아서","갈","galatians",6],["에베소서","엡","ephesians",6],
    ["빌립보서","빌","philippians",4],["골로새서","골","colossians",4],["데살로니가전서","살전","1_thessalonians",5],["데살로니가후서","살후","2_thessalonians",3],["디모데전서","딤전","1_timothy",6],
    ["디모데후서","딤후","2_timothy",4],["디도서","딛","titus",3],["빌레몬서","몬","philemon",1],["히브리서","히","hebrews",13],["야고보서","약","james",5],
    ["베드로전서","벧전","1_peter",5],["베드로후서","벧후","2_peter",3],["요한일서","요일","1_john",5],["요한이서","요이","2_john",1],["요한삼서","요삼","3_john",1],
    ["유다서","유","jude",1],["요한계시록","계","revelation",22]];
  const ALIAS = { "시편": 18, "시": 18, "아가서": 21, "애가": 24, "요한1서": 61, "요한2서": 62, "요한3서": 63, "계시록": 65, "야고보": 58, "빌레몬": 56, "유다": 64 };
  function parseRef(t) {
    t = String(t || "").replace(/\s+/g, " ").trim();
    let m = t.match(/^([가-힣0-9]+?)\s*(\d+)(?:\s*(?:장|:)\s*(\d+))?/);
    if (!m) { const only = t.match(/^([가-힣]+)/); if (!only) return null; m = [t, only[1], "1", ""] }
    const name = m[1].replace(/\s/g, "");
    let bi = BOOKS.findIndex(b => b[0] === name);
    if (bi < 0) bi = BOOKS.findIndex(b => b[1] === name);
    if (bi < 0 && name in ALIAS) bi = ALIAS[name];
    if (bi < 0) bi = BOOKS.findIndex(b => b[0].startsWith(name) && name.length >= 2);
    if (bi < 0) return null;
    const c = Math.min(+m[2] || 1, BOOKS[bi][3]);
    return { b: bi, c, v: m[3] ? +m[3] : 0 };
  }

  /* ---------- 공통 스타일 ---------- */
  const st = document.createElement("style");
  st.textContent = `
  .st-btn{margin-top:6px;font-size:14px;padding:5px 12px;border-radius:10px;cursor:pointer}
  .st-box{width:min(760px,100%)!important}
  .st-h{font-family:Jua,sans-serif;font-weight:normal;margin:0 0 6px;display:flex;align-items:center;gap:8px}
  .st-h .x{margin-left:auto}
  .st-ref{display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px;margin:8px 0}
  .st-ref select,.st-ref input,.st-q{border:1.5px solid var(--line);border-radius:10px;padding:7px 9px;background:#fff;font:inherit;width:100%}
  .st-cm{display:grid;gap:8px;margin-top:8px}
  .st-c{border:1.5px solid var(--line);border-radius:14px;padding:10px 12px;background:#fff;display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:center}
  .st-c b{font-size:16px}.st-c small{color:var(--soft);display:block;line-height:1.5}
  .st-c .acts{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
  .st-c a,.st-kr a{text-decoration:none;border:1.5px solid var(--ink);border-radius:9px;padding:3px 10px;font-size:13px;color:var(--ink);background:var(--paper);white-space:nowrap}
  .st-c a.ko{background:#fff3cf}
  .st-kr{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
  .st-sec{margin-top:14px;font-family:Jua,sans-serif;font-size:16px}
  .st-tip{font-size:13px;color:var(--soft);line-height:1.6;background:#fffaf0;border-radius:10px;padding:8px 10px;margin-top:8px}
  .st-tabs{display:flex;gap:6px;margin:6px 0}
  .st-tabs button{border-radius:999px;padding:4px 12px;font-size:14px}
  .st-tabs button.on{background:var(--ink);color:#fff}
  .st-res{display:grid;gap:8px;margin-top:8px}
  .st-r{border:1.5px solid var(--line);border-radius:14px;padding:10px 12px;background:#fff}
  .st-r .top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
  .st-r .lem{font-size:26px;font-family:"SBL Hebrew","SBL Greek","Times New Roman",serif}
  .st-r .tr{font-size:15px}.st-r .no{font-size:12px;border:1px solid var(--line);border-radius:999px;padding:1px 8px;color:var(--soft)}
  .st-r .def{margin:4px 0;line-height:1.6}.st-r .kjv,.st-r .der{font-size:13px;color:var(--soft);line-height:1.5}
  .st-r .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
  .st-r .acts a,.st-r .acts button{font-size:13px;border:1.5px solid var(--ink);border-radius:9px;padding:3px 10px;background:var(--paper);color:var(--ink);text-decoration:none;cursor:pointer}
  .st-src{font-size:11px;color:var(--soft);margin-top:10px}`;
  document.head.appendChild(st);

  function modal(id, html) {
    let m = document.getElementById(id);
    if (!m) { m = document.createElement("div"); m.className = "modal"; m.id = id; m.innerHTML = '<div class="box st-box"></div>'; document.body.appendChild(m); m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show") }); }
    m.firstChild.innerHTML = html; m.classList.add("show");
    m.querySelectorAll("[data-x]").forEach(b => b.onclick = () => m.classList.remove("show"));
    return m;
  }
  addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal.show").forEach(m => { if (m.id.startsWith("st-")) m.classList.remove("show") }) });

  /* ---------- 📚 주석 찾기 ---------- */
  const CLASSIC = [
    ["mhcw", "매튜 헨리 주석", "1706년 · 영국 청교도 목사. 신앙 생활에 바로 닿는 따뜻한 강해로 가장 널리 읽혀요."],
    ["calvin", "칼빈 주석", "1500년대 · 종교개혁자 장 칼뱅. 본문의 뜻을 정확하게 짚어요. (요한계시록 등 몇 권은 쓰지 않았어요)"],
    ["gill", "존 길 주석", "1760년대 · 영국 침례교 신학자. 히브리어·유대 문헌을 깊이 풀어요."],
    ["barnes", "알버트 반즈 주석", "1830년대 · 미국 장로교 목사. 절마다 쉽고 실용적으로 설명해요."],
    ["jfb", "JFB 주석", "1871년 · 제미슨·포셋·브라운. 간결하면서 학문적인 절별 주석이에요."]];
  const KOREAN = ["호크마 주석", "카리스 종합주석", "박윤선 주석", "그랜드 종합주석", "매튜헨리 주석"];
  const bh = p => "https://biblehub.com/commentaries/" + p;
  const gtr = u => "https://translate.google.com/translate?sl=en&tl=ko&hl=ko&u=" + encodeURIComponent(u);
  function openComm() {
    const r = parseRef($("#text") && $("#text").value) || { b: 42, c: 1, v: 0 };
    const m = modal("st-comm", `<h2 class="st-h">📚 주석 찾기<button class="x" data-x>✕</button></h2>
      <div class="hint">설교 본문을 고르면 그 장의 주석이 열려요. 절을 적으면 그 절만 모아 보는 링크도 생겨요.</div>
      <div class="st-ref"><select id="stB">${BOOKS.map((b, i) => `<option value="${i}">${b[0]}</option>`).join("")}</select><select id="stC"></select><input id="stV" type="number" min="1" placeholder="절 (선택)"></div>
      <div id="stList"></div>`);
    const B = m.querySelector("#stB"), C = m.querySelector("#stC"), V = m.querySelector("#stV");
    const fillC = () => { const n = BOOKS[+B.value][3]; C.innerHTML = Array.from({ length: n }, (_, i) => `<option value="${i + 1}">${i + 1}장</option>`).join("") };
    B.value = r.b; fillC(); C.value = r.c; V.value = r.v || "";
    const draw = () => {
      const b = BOOKS[+B.value], c = +C.value, v = +V.value || 0, ref = b[0] + " " + c + "장" + (v ? " " + v + "절" : "");
      const rows = CLASSIC.map(([slug, name, desc]) => { const u = bh(slug + "/" + b[2] + "/" + c + ".htm");
        return `<div class="st-c"><div><b>${name}</b><small>${desc}</small></div><div class="acts"><a href="${u}" target="_blank" rel="noopener">원문 열기</a><a class="ko" href="${u}" target="_blank" rel="noopener" data-ko="${esc(u)}">한국어로 읽기</a></div></div>` }).join("");
      const verseAll = v ? bh(b[2] + "/" + c + "-" + v + ".htm") : "";
      m.querySelector("#stList").innerHTML = `<div class="st-sec">고전 명주석 5 · ${esc(ref)}</div><div class="st-cm">${rows}</div>
        ${verseAll ? `<div class="st-kr" style="margin-top:8px"><a href="${verseAll}" target="_blank" rel="noopener">📖 ${esc(b[0] + " " + c + ":" + v)} 한 절의 여러 주석 한눈에 (원문)</a></div>` : ""}
        <div class="st-tip">💡 <b>한국어로 읽기</b>: 주석 페이지가 열리면 브라우저 번역을 쓰세요. 크롬·엣지는 주소창 오른쪽 <b>번역 아이콘</b>이나 페이지에서 <b>오른쪽 클릭 → 한국어로 번역</b>, 휴대폰 크롬은 <b>⋮ → 번역</b>, 삼성 인터넷은 <b>메뉴 → 번역</b>을 누르면 돼요. <a href="#" id="stG">구글 번역 페이지로 열기</a>도 해 볼 수 있어요. (지역·기기에 따라 안 될 수 있어요)</div>
        <div class="st-sec">한국어 주석 찾아보기 · ${esc(ref)}</div>
        <div class="st-kr">${KOREAN.map(k => `<a href="https://search.naver.com/search.naver?query=${encodeURIComponent(ref + " " + k)}" target="_blank" rel="noopener">🔍 ${k}</a>`).join("")}</div>
        <div class="st-tip">한국어 주석은 출판사에 저작권이 있어서, 그 본문으로 검색한 결과로 연결해요.</div>`;
      m.querySelectorAll("a.ko").forEach(a => a.onclick = () => say("열린 페이지에서 브라우저의 ‘한국어로 번역’을 눌러 주세요"));
      const g = m.querySelector("#stG"); if (g) g.onclick = e => { e.preventDefault(); window.open(gtr(bh(CLASSIC[0][0] + "/" + b[2] + "/" + c + ".htm")), "_blank", "noopener") };
    };
    B.onchange = () => { fillC(); draw() }; C.onchange = draw; V.oninput = draw; draw();
  }

  /* ---------- 🔎 원어 사전 ---------- */
  const KO = { "사랑":"love","믿음":"faith","믿다":"believe","은혜":"grace","소망":"hope","평강":"peace","평화":"peace","평안":"peace","기쁨":"joy","구원":"salvation save","죄":"sin","회개":"repent","의":"righteous","의로움":"righteousness","거룩":"holy","영":"spirit","성령":"spirit","영혼":"soul","마음":"heart","생명":"life","죽음":"death","부활":"resurrection","십자가":"cross","피":"blood","말씀":"word","진리":"truth","빛":"light","어둠":"darkness","하나님":"god","주":"lord","왕":"king","나라":"kingdom","하늘":"heaven","땅":"earth","교회":"church","제자":"disciple","사도":"apostle","선지자":"prophet","제사장":"priest","성전":"temple","제사":"sacrifice","기도":"pray prayer","찬양":"praise","예배":"worship","경배":"worship","영광":"glory","복":"bless","축복":"bless","저주":"curse","율법":"law","계명":"commandment","언약":"covenant","약속":"promise","자비":"mercy","긍휼":"mercy compassion","인자":"kindness","오래참음":"longsuffering","인내":"patience","겸손":"humble","순종":"obey","지혜":"wisdom","지식":"knowledge","두려움":"fear","경외":"fear","용서":"forgive","화목":"reconcile","속죄":"atonement","구속":"redeem","대속":"ransom","의롭다":"justify","성화":"sanctify","형제":"brother","이웃":"neighbour","아버지":"father","아들":"son","어린양":"lamb","목자":"shepherd","양":"sheep","포도나무":"vine","열매":"fruit","씨":"seed","물":"water","떡":"bread","포도주":"wine","성막":"tabernacle","장막":"tent","광야":"wilderness","시험":"tempt","고난":"suffer","환난":"tribulation","위로":"comfort","능력":"power","권세":"authority","이름":"name","심판":"judge judgment","공의":"justice","정의":"justice","진노":"wrath","소금":"salt","눈물":"tear","표적":"sign","기적":"miracle","천사":"angel","마귀":"devil","사탄":"satan","귀신":"demon","영원":"eternal","세상":"world","육체":"flesh","몸":"body","섬김":"serve","종":"servant","은사":"gift","복음":"gospel","전파":"preach","가르침":"teach","증인":"witness","증거":"testimony","신실":"faithful","선":"good","악":"evil","소리":"voice","길":"way","문":"door","집":"house","성":"city","백성":"people","이방인":"gentile","할례":"circumcise","세례":"baptize","금식":"fast","안식일":"sabbath","절기":"feast","유월절":"passover","기름":"anoint","그리스도":"christ","메시아":"messiah","생각":"think mind","뜻":"will","계시":"reveal","비밀":"mystery","감사":"thank","노래":"sing song","회복":"restore","치유":"heal","병":"sickness","손":"hand","눈":"eye","귀":"ear","입":"mouth","얼굴":"face","발":"foot","머리":"head","목숨":"life","새":"new","옛":"old","아버지":"father","어머니":"mother","자녀":"child","교제":"fellowship","연합":"one","소명":"call","부르심":"call","택하심":"elect","예정":"predestinate","선택":"choose","상":"reward","면류관":"crown","보좌":"throne","통치":"reign","종말":"end","재림":"coming","성도":"saint","장로":"elder","집사":"deacon","목사":"pastor shepherd","감독":"bishop overseer" };
  /* 자주 쓰는 신앙 낱말이 가리키는 대표 원어 (Strong 번호) — 검색 결과 맨 위에 둔다 */
  const PREF = { "사랑":"G26 G25 G5368 G5373 H157 H160","믿음":"G4102 G4100 H530 H539","믿다":"G4100 H539","은혜":"G5485 H2580 H2603","소망":"G1680 G1679 H8615 H3176","평강":"G1515 H7965","평화":"G1515 H7965","평안":"G1515 H7965","기쁨":"G5479 G5463 H8057","구원":"G4991 G4982 H3444 H3467","죄":"G266 G264 H2403 H2398 H5771","회개":"G3341 G3340 H7725 H5162","의":"G1343 G1342 H6666 H6664","의로움":"G1343 H6666","거룩":"G40 G37 H6944 H6918","영":"G4151 H7307","성령":"G4151 H7307","영혼":"G5590 H5315","마음":"G2588 H3820 H3824","생명":"G2222 G5590 H2416","말씀":"G3056 G4487 H1697 H565","진리":"G225 H571","빛":"G5457 H216","영광":"G1391 H3519","복음":"G2098","십자가":"G4716","교회":"G1577","기도":"G4335 G4336 H8605 H6419","찬양":"G136 G134 H8416 H1984","예배":"G4352 H7812","경배":"G4352 H7812","자비":"G1656 H2617 H7356","긍휼":"G1656 G3628 H7356 H2617","인자":"H2617 G5544","목자":"G4166 H7462","언약":"G1242 H1285","율법":"G3551 H8451","지혜":"G4678 H2451","복":"G2127 G3107 H1288 H835","축복":"G2127 H1288","부활":"G386","용서":"G863 H5545 H5375","구속":"G629 H1350","주":"G2962 H136 H3068","하나님":"G2316 H430 H410","왕":"G935 H4428","나라":"G932 H4467","성전":"G2411 G3485 H1964","제자":"G3101","사도":"G652","선지자":"G4396 H5030","제사장":"G2409 H3548","어린양":"G286 G721 H3532","세례":"G907 G908","겸손":"G5012 H6035","순종":"G5218 H8085","인내":"G5281","소금":"G217 H4417","길":"G3598 H1870","심판":"G2920 H4941","공의":"H6666 H4941 G1343","정의":"H4941 H6666","진노":"G3709 H639","능력":"G1411 H3581","이름":"G3686 H8034","세상":"G2889 H8398","형제":"G80 H251","아버지":"G3962 H1","아들":"G5207 H1121","종":"G1401 H5650","섬김":"G1247 H5647","천사":"G32 H4397","마귀":"G1228","사탄":"G4567 H7854","영원":"G166 H5769","감사":"G2169 H8426","위로":"G3874 H5162","고난":"G3804 G3958","시험":"G3986 H5254","화목":"G2643 G2644","성도":"G40 H6918","장로":"G4245 H2205","그리스도":"G5547","메시아":"G3323 H4899" };
  const LEX = {};
  async function lex(lang) {
    if (LEX[lang]) return LEX[lang];
    const r = await fetch("lex/" + (lang === "H" ? "hebrew" : "greek") + ".json"); const d = await r.json();
    return LEX[lang] = d.rows.map(x => ({ lang, n: x[0], lemma: x[1], tr: x[2], pron: x[3], def: x[4], kjv: x[5], der: x[6], key: plain(x[1]) + " " + plain(x[2]) + " " + plain(x[3]), en: (" " + x[4] + " " + x[5] + " ").toLowerCase() }));
  }
  const plain = s => String(s || "").normalize("NFD").replace(/[̀-֑ͯ-ׇʼʽ’'’ʼ\-]/g, "").toLowerCase();
  function score(e, q) {
    const raw = q.trim(); if (!raw) return 0;
    const num = raw.match(/^([hg])?\s*(\d{1,5})$/i);
    if (num) return (!num[1] || num[1].toUpperCase() === e.lang) && e.n === +num[2] ? 1000 : 0;
    const p = plain(raw);
    if (/[Ͱ-Ͽἀ-῿֐-׿]/.test(raw) || /^[a-z]+$/i.test(raw)) {
      const ks = e.key.split(" ");
      if (ks.includes(p)) return 900; if (e.key.startsWith(p) || e.key.includes(" " + p)) return 700;
      if (/^[a-z]+$/i.test(raw)) {
        /* 뜻풀이가 그 낱말로 시작하는 핵심 단어를 먼저, 그다음 뜻풀이·KJV 번역에 그 낱말이 들어간 단어 */
        const w = raw.toLowerCase(), wb = new RegExp("(^|[^a-z])" + w + "([^a-z]|$)"), d = e.def.toLowerCase().replace(/^\s*(to\s+|a\s+|an\s+|the\s+)?/, ""), k = e.kjv.toLowerCase();
        const start = new RegExp("^" + w + "([^a-z]|$)").test(d), inDef = wb.test(d), inKjv = new RegExp("(^|[^a-z(-])" + w + "([^a-z]|$)").test(k);
        let s = start ? 600 : inKjv ? 450 : inDef ? 400 : e.en.includes(w) ? 80 : 0;
        if (s && inKjv && (start || inDef)) s += 150;
        if (s) return s - Math.min(60, e.def.length / 8);
      }
      if (e.key.includes(p)) return 300; return 0;
    }
    return 0;
  }
  function koTerms(q) { const t = q.trim(); if (KO[t]) return KO[t].split(" "); const hit = Object.keys(KO).filter(k => t.length >= 2 && (k.startsWith(t) || t.startsWith(k))).sort((a, b) => b.length - a.length)[0]; return hit ? KO[hit].split(" ") : null }
  function naverURL(e) { const w = plain(e.lemma).replace(/\s/g, ""); return e.lang === "H" ? "https://dict.naver.com/hbokodict/#/search?query=" + encodeURIComponent(w) : "https://dict.naver.com/grckodict/#/search?query=" + encodeURIComponent(w) }
  let lang = "G";
  async function openLex(preset) {
    const m = modal("st-lex", `<h2 class="st-h">🔎 원어 사전<button class="x" data-x>✕</button></h2>
      <div class="st-tabs"><button data-l="G">헬라어 (신약)</button><button data-l="H">히브리어 (구약)</button><button data-l="A">둘 다</button></div>
      <input class="st-q" id="stQ" placeholder="원어(ἀγάπη, אהב) · 발음(agape) · 번호(G26, H157) · 영어(love) · 한국어(사랑, 믿음, 은혜…)" autocomplete="off">
      <div class="hint" id="stInfo" style="margin-top:6px"></div><div class="st-res" id="stRes"></div>
      <div class="st-src">뜻풀이: Strong's Exhaustive Concordance (James Strong, 1890) · 데이터: Open Scriptures (CC-BY-SA). 한국어 뜻은 각 단어의 <b>네이버 사전</b> 버튼으로 볼 수 있어요.</div>`);
    const Q = m.querySelector("#stQ"), tabs = m.querySelectorAll("[data-l]");
    const setTab = l => { lang = l; tabs.forEach(b => b.classList.toggle("on", b.dataset.l === l)); run() };
    tabs.forEach(b => b.onclick = () => setTab(b.dataset.l));
    let t; Q.oninput = () => { clearTimeout(t); t = setTimeout(run, 180) };
    async function run() {
      const q = Q.value.trim(), out = m.querySelector("#stRes"), info = m.querySelector("#stInfo");
      if (!q) { out.innerHTML = ""; info.textContent = "검색어를 넣으면 바로 찾아요. 한국어는 자주 쓰는 신앙 낱말(사랑, 믿음, 은혜, 구원…)을 영어 뜻으로 바꿔 찾아요."; return }
      info.textContent = "찾는 중…";
      const langs = lang === "A" ? ["G", "H"] : [lang];
      const num = q.match(/^([hg])\s*\d+$/i); const L = num ? [num[1].toUpperCase()] : langs;
      let all = []; for (const l of L) all = all.concat(await lex(l));
      let terms = null; if (/[가-힣]/.test(q)) { terms = koTerms(q); if (!terms) { out.innerHTML = ""; info.innerHTML = `‘${esc(q)}’은(는) 아직 준비된 한국어 낱말이 아니에요. 영어 뜻(예: love)이나 원어로 찾아 보세요.`; return } }
      const qs = terms || [q];
      const prefKey = terms ? Object.keys(PREF).find(k => k === q) || Object.keys(PREF).find(k => q.startsWith(k) && k.length >= 2) : null;
      const pref = prefKey ? PREF[prefKey].split(" ") : [];
      const hits = all.map(e => { const pi = pref.indexOf(e.lang + e.n); return { e, s: pi >= 0 ? 5000 - pi : Math.max(...qs.map(x => score(e, x))) } }).filter(x => x.s > 0).sort((a, b) => b.s - a.s || a.e.n - b.e.n).slice(0, 40);
      info.innerHTML = hits.length ? `${hits.length}개 찾았어요${terms ? ` (‘${esc(q)}’ → ${esc(terms.join(", "))})` : ""}${hits.length === 40 ? " · 위에서 40개까지 보여요" : ""}` : "찾는 단어가 없어요. 다른 철자나 영어 뜻으로 찾아 보세요.";
      out.innerHTML = hits.map(({ e }) => `<div class="st-r"><div class="top"><span class="lem" dir="${e.lang === "H" ? "rtl" : "ltr"}">${esc(e.lemma)}</span><span class="tr">${esc(e.tr)}</span><span class="no">${e.lang}${e.n} · ${e.lang === "H" ? "히브리어" : "헬라어"}</span>${e.pron ? `<span class="kjv">발음 ${esc(e.pron)}</span>` : ""}</div>
        <div class="def">${esc(e.def)}</div>${e.kjv ? `<div class="kjv">KJV 번역 용례: ${esc(e.kjv)}</div>` : ""}${e.der ? `<div class="der">어원: ${esc(e.der)}</div>` : ""}
        <div class="acts"><a href="${naverURL(e)}" target="_blank" rel="noopener">네이버 사전에서 한국어 뜻</a><button data-add="${e.lang}${e.n}">원어 연구 메모에 넣기</button></div></div>`).join("");
      out.querySelectorAll("[data-add]").forEach(b => b.onclick = () => { const id = b.dataset.add, e = all.find(x => x.lang + x.n === id); const ta = document.getElementById("nOrig"); if (!ta || !e) return;
        ta.value = (ta.value ? ta.value.replace(/\s*$/, "") + "\n" : "") + `${e.lang}${e.n} ${e.lemma} (${e.tr}) — ${e.def}`; ta.dispatchEvent(new Event("input", { bubbles: true })); say("원어·단어 연구 메모에 넣었어요") });
    }
    if (preset) Q.value = preset; setTab(lang); Q.focus();
  }

  /* ---------- 버튼 달기 ---------- */
  function mount() {
    const txt = document.getElementById("text");
    if (txt && !document.getElementById("stCommBtn")) { const b = document.createElement("button"); b.type = "button"; b.id = "stCommBtn"; b.className = "st-btn"; b.textContent = "📚 주석 찾기"; b.onclick = e => { e.preventDefault(); openComm() }; txt.insertAdjacentElement("afterend", b) }
    const d = document.querySelector(".dict");
    if (d && !document.getElementById("stLexBtn")) { const b = document.createElement("a"); b.href = "#"; b.id = "stLexBtn"; b.textContent = "🔎 원어 사전 (여기서 검색)"; b.style.background = "#fff3cf"; b.onclick = e => { e.preventDefault(); openLex() }; d.insertBefore(b, d.firstChild) }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  window.sermonStudy = { openComm, openLex, parseRef };
})();
