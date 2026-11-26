/* 🎨 디자인 편집기 — 단체티·선교책자가 함께 써요
   글자·사진·도형(도형 안에 사진)을 캔버스에 그려서, 화면에 보이는 그대로 PDF·JPG로 내보내요.
   Ctrl+휠로 확대/축소, 끌어서 옮기기, 모서리로 크기, 위 동그라미로 회전, 두 번 눌러 글자 고치기. */
(function () {
  "use strict";
  /* ---------- 무료 글꼴 (Google Fonts) ---------- */
  const FONTS = [
    ["Noto Sans KR", "본고딕"], ["Noto Serif KR", "본명조"], ["Nanum Gothic", "나눔고딕"], ["Nanum Myeongjo", "나눔명조"], ["Gothic A1", "고딕 A1"], ["IBM Plex Sans KR", "IBM 플렉스"],
    ["Gowun Dodum", "고운돋움"], ["Gowun Batang", "고운바탕"], ["Hahmlet", "함렛"], ["Song Myung", "송명"], ["Orbit", "오르빗"], ["Diphylleia", "디필레이아"],
    ["Black Han Sans", "검은고딕"], ["Do Hyeon", "도현"], ["Jua", "주아"], ["Gugi", "구기"], ["Gasoek One", "가석"], ["Bagel Fat One", "베이글"], ["Dongle", "동글"], ["Sunflower", "해바라기"], ["Stylish", "스타일리시"],
    ["Nanum Pen Script", "나눔펜"], ["Nanum Brush Script", "나눔붓"], ["Gaegu", "개구"], ["Gamja Flower", "감자꽃"], ["Hi Melody", "하이멜로디"], ["Poor Story", "푸어스토리"], ["Single Day", "싱글데이"],
    ["Yeon Sung", "연성"], ["Cute Font", "귀여운"], ["Dokdo", "독도"], ["East Sea Dokdo", "동해독도"], ["Kirang Haerang", "기랑해랑"], ["Moirai One", "모이라이"], ["Grandiflora One", "그랜디플로라"], ["Black And White Picture", "흑백사진"], ["Nanum Gothic Coding", "나눔고딕코딩"],
    ["Montserrat", "Montserrat"], ["Bebas Neue", "Bebas Neue"], ["Oswald", "Oswald"], ["Anton", "Anton"], ["Playfair Display", "Playfair"], ["Cinzel", "Cinzel"], ["Abril Fatface", "Abril Fatface"], ["Roboto Slab", "Roboto Slab"],
    ["Pacifico", "Pacifico"], ["Dancing Script", "Dancing Script"], ["Great Vibes", "Great Vibes"], ["Lobster", "Lobster"], ["Caveat", "Caveat"], ["Permanent Marker", "Permanent Marker"], ["Righteous", "Righteous"], ["Shadows Into Light", "Shadows Into Light"]];
  const FONT_Q = { "Sunflower": "Sunflower:wght@500", "Moirai One": "Moirai+One", "Dongle": "Dongle" };
  const asked = new Set();
  function ensureFont(f) {
    if (!f) return Promise.resolve(); if (asked.has(f)) return document.fonts ? document.fonts.load('40px "' + f + '"', "가A").catch(() => { }) : Promise.resolve();
    asked.add(f); const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + (FONT_Q[f] || f.replace(/ /g, "+")) + "&display=swap"; document.head.appendChild(l);
    return new Promise(res => { l.onload = () => { (document.fonts ? document.fonts.load('40px "' + f + '"', "가나다ABC") : Promise.resolve()).then(res, res) }; l.onerror = res })
  }
  /* ---------- 도형 ---------- */
  const SHAPES = [["rect", "네모"], ["round", "둥근 네모"], ["circle", "동그라미"], ["triangle", "세모"], ["diamond", "마름모"], ["pentagon", "오각형"], ["hexagon", "육각형"], ["star", "별"], ["heart", "하트"], ["arrow", "화살표"], ["bubble", "말풍선"], ["cross", "십자가"], ["line", "선"], ["wave", "물결"], ["arch", "아치"]];
  function poly(p, pts, w, h) { pts.forEach(([x, y], i) => i ? p.lineTo(x * w, y * h) : p.moveTo(x * w, y * h)); p.closePath() }
  function shapePath(k, w, h, r) {
    const p = new Path2D(), m = Math.min(w, h);
    switch (k) {
      case "round": { const rr = Math.max(0, Math.min(r != null ? r : m * .15, w / 2, h / 2)); if (p.roundRect) p.roundRect(0, 0, w, h, rr); else p.rect(0, 0, w, h); break }
      case "circle": p.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); break;
      case "triangle": poly(p, [[.5, 0], [1, 1], [0, 1]], w, h); break;
      case "diamond": poly(p, [[.5, 0], [1, .5], [.5, 1], [0, .5]], w, h); break;
      case "pentagon": poly(p, Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [.5 + .5 * Math.cos(a), .52 + .5 * Math.sin(a)] }), w, h); break;
      case "hexagon": poly(p, [[.25, 0], [.75, 0], [1, .5], [.75, 1], [.25, 1], [0, .5]], w, h); break;
      case "star": poly(p, Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? .2 : .5; return [.5 + rr * Math.cos(a), .53 + rr * Math.sin(a)] }), w, h); break;
      case "heart": p.moveTo(w * .5, h * .27); p.bezierCurveTo(w * .5, h * .05, w * .05, h * -.02, w * .03, h * .3); p.bezierCurveTo(w * .02, h * .58, w * .35, h * .78, w * .5, h); p.bezierCurveTo(w * .65, h * .78, w * .98, h * .58, w * .97, h * .3); p.bezierCurveTo(w * .95, h * -.02, w * .5, h * .05, w * .5, h * .27); p.closePath(); break;
      case "arrow": poly(p, [[0, .3], [.6, .3], [.6, 0], [1, .5], [.6, 1], [.6, .7], [0, .7]], w, h); break;
      case "bubble": { const bh = h * .8, rr = Math.min(m * .15, bh / 2); p.moveTo(rr, 0); p.lineTo(w - rr, 0); p.quadraticCurveTo(w, 0, w, rr); p.lineTo(w, bh - rr); p.quadraticCurveTo(w, bh, w - rr, bh); p.lineTo(w * .38, bh); p.lineTo(w * .16, h); p.lineTo(w * .22, bh); p.lineTo(rr, bh); p.quadraticCurveTo(0, bh, 0, bh - rr); p.lineTo(0, rr); p.quadraticCurveTo(0, 0, rr, 0); p.closePath(); break }
      case "cross": poly(p, [[.4, 0], [.6, 0], [.6, .28], [.86, .28], [.86, .44], [.6, .44], [.6, 1], [.4, 1], [.4, .44], [.14, .44], [.14, .28], [.4, .28]], w, h); break;
      case "wave": { p.moveTo(0, h * .35); const n = 4; for (let i = 0; i < n; i++) { const x0 = w * i / n, x1 = w * (i + .5) / n, x2 = w * (i + 1) / n; p.quadraticCurveTo((x0 + x1) / 2, 0, x1, h * .35); p.quadraticCurveTo((x1 + x2) / 2, h * .7, x2, h * .35) } p.lineTo(w, h); p.lineTo(0, h); p.closePath(); break }
      case "arch": p.moveTo(0, h); p.lineTo(0, w / 2 < h ? w / 2 : h * .5); p.ellipse(w / 2, Math.min(w / 2, h * .5), w / 2, Math.min(w / 2, h * .5), 0, Math.PI, 0); p.lineTo(w, h); p.closePath(); break;
      default: p.rect(0, 0, w, h)
    }
    return p
  }
  /* ---------- 그리기 ---------- */
  const fontStr = (e, px) => `${e.i ? "italic " : ""}${e.b ? "bold " : ""}${px}px "${e.font || "Noto Sans KR"}", "Jua", sans-serif`;
  function measure(ctx, t, ls) { return ctx.measureText(t).width + (ls || 0) * Math.max(0, [...t].length - 1) }
  function layoutText(ctx, e) {
    const px = +e.size || 30, ls = (+e.ls || 0), lh = px * (+e.lh || 1.35); ctx.font = fontStr(e, px); const max = Math.max(px, e.w), out = [];
    String(e.t == null ? "" : e.t).split("\n").forEach(par => {
      if (!par) { out.push(""); return } let line = "";
      for (const ch of [...par]) {
        const test = line + ch;
        if (line && measure(ctx, test, ls) > max) { const sp = line.lastIndexOf(" "); if (sp > 0 && ch !== " ") { out.push(line.slice(0, sp)); line = line.slice(sp + 1) + ch } else { out.push(line); line = ch === " " ? "" : ch } }
        else line = test
      }
      out.push(line)
    });
    return { lines: out, lh, px, ls, h: Math.max(lh, out.length * lh) }
  }
  function drawLine(ctx, t, x, y, ls, align) {
    if (!ls) { ctx.textAlign = align; ctx.fillText(t, x, y); return }
    const W = measure(ctx, t, ls); let cx = align === "center" ? x - W / 2 : align === "right" ? x - W : x; ctx.textAlign = "left";
    for (const ch of [...t]) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + ls }
  }
  function strokeLine(ctx, t, x, y, ls, align) {
    if (!ls) { ctx.textAlign = align; ctx.strokeText(t, x, y); return }
    const W = measure(ctx, t, ls); let cx = align === "center" ? x - W / 2 : align === "right" ? x - W : x; ctx.textAlign = "left";
    for (const ch of [...t]) { ctx.strokeText(ch, cx, y); cx += ctx.measureText(ch).width + ls }
  }
  function drawText(ctx, e) {
    const L = layoutText(ctx, e); e.h = L.h; const al = e.align || "left", x = al === "center" ? e.w / 2 : al === "right" ? e.w : 0;
    ctx.textBaseline = "middle"; ctx.font = fontStr(e, L.px);
    L.lines.forEach((t, i) => {
      const y = i * L.lh + L.lh / 2;
      if (e.stw > 0 && e.st) { ctx.lineWidth = e.stw * 2; ctx.strokeStyle = e.st; ctx.lineJoin = "round"; strokeLine(ctx, t, x, y, L.ls, al) }
      ctx.fillStyle = e.color || "#222"; drawLine(ctx, t, x, y, L.ls, al);
      if ((e.u || e.s) && t) {
        const W = measure(ctx, t, L.ls), x0 = al === "center" ? x - W / 2 : al === "right" ? x - W : x, th = Math.max(1, L.px / 14); ctx.fillStyle = e.color || "#222";
        if (e.u) ctx.fillRect(x0, y + L.px * .45, W, th); if (e.s) ctx.fillRect(x0, y + L.px * .02, W, th)
      }
    })
  }
  function cover(ctx, im, w, h, fit) {
    const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height; if (!iw || !ih) return;
    const s = fit === "contain" ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih), dw = iw * s, dh = ih * s; ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh)
  }
  function drawEl(ctx, e, img) {
    ctx.save(); ctx.globalAlpha = e.op == null ? 1 : +e.op; ctx.translate(e.x + e.w / 2, e.y + e.h / 2); ctx.rotate((+e.rot || 0) * Math.PI / 180); ctx.translate(-e.w / 2, -e.h / 2);
    if (e.type === "text") drawText(ctx, e);
    else if (e.type === "shape" || e.type === "image") {
      const p = e.type === "image" ? shapePath(e.kind || (e.r ? "round" : "rect"), e.w, e.h, e.r) : shapePath(e.kind, e.w, e.h, e.r), src = e.type === "image" ? e.src : e.img, im = src ? img(src) : null;
      if (im) { ctx.save(); ctx.clip(p); cover(ctx, im, e.w, e.h, e.fit); ctx.restore() }
      else if (e.type === "image") { ctx.fillStyle = "#e9e2d6"; ctx.fill(p); ctx.fillStyle = "#a89880"; ctx.font = Math.max(12, Math.min(e.w, e.h) * .18) + "px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("📷", e.w / 2, e.h / 2) }
      else if (e.fill && e.fill !== "none") { ctx.fillStyle = e.fill; ctx.fill(p) }
      if (+e.sw > 0 && e.stroke && e.stroke !== "none") { ctx.lineWidth = +e.sw; ctx.strokeStyle = e.stroke; ctx.lineJoin = "round"; if (e.dash) ctx.setLineDash([e.sw * 2.2, e.sw * 1.6]); ctx.stroke(p) }
    }
    ctx.restore()
  }
  /* 판 하나 그리기: data={bg,els}, under(ctx,w,h)=옷 모양처럼 밑그림 */
  function drawBoard(ctx, b, img, opt) {
    opt = opt || {}; const d = b.data;
    if (b.under) b.under(ctx, b.w, b.h, d); else { ctx.fillStyle = d.bg || "#ffffff"; ctx.fillRect(0, 0, b.w, b.h) }
    (d.els || []).forEach(e => { if (opt.skip && opt.skip === e.id) return; drawEl(ctx, e, img) });
    if (b.over && !opt.clean) b.over(ctx, b.w, b.h, d)
  }
  /* ---------- 사진 ---------- */
  const IMG = new Map();
  function imgGetter(assets, onLoad) {
    return id => {
      let im = IMG.get(id); if (im) return im.complete && im.naturalWidth ? im : null;
      const src = assets && assets.get(id); if (!src) return null; im = new Image(); im.onload = () => onLoad && onLoad(); im.src = src; IMG.set(id, im); return null
    }
  }
  function readImage(file, max) {
    return new Promise((res, rej) => {
      const fr = new FileReader(); fr.onerror = rej; fr.onload = () => {
        const im = new Image(); im.onerror = rej; im.onload = () => {
          const s = Math.min(1, (max || 1600) / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
          const x = c.getContext("2d"); x.drawImage(im, 0, 0, c.width, c.height); const png = /png|gif|svg|webp/.test(file.type);
          res({ url: c.toDataURL(png ? "image/png" : "image/jpeg", .9), w: c.width, h: c.height })
        }; im.src = fr.result
      }; fr.readAsDataURL(file)
    })
  }
  /* ---------- 색 고르기 (컬러코드 보기·입력) ---------- */
  const SWATCH = ["#ffffff", "#000000", "#3b2a20", "#7a6a5c", "#e8503a", "#f5b82e", "#fde68a", "#3f9a55", "#a7d8a0", "#2f6fb0", "#93c5fd", "#1f2a44", "#7a4fb0", "#c8507a", "#f9c6d3", "#f3ede2"];
  const RECENT = []; try { JSON.parse(localStorage.getItem("dz-recent") || "[]").forEach(c => RECENT.push(c)) } catch (_) { }
  const normHex = v => { v = String(v || "").trim(); if (!v.startsWith("#")) v = "#" + v; if (/^#[0-9a-f]{3}$/i.test(v)) v = "#" + v.slice(1).split("").map(c => c + c).join(""); return /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : null };
  function pushRecent(c) { c = normHex(c); if (!c) return; const i = RECENT.indexOf(c); if (i >= 0) RECENT.splice(i, 1); RECENT.unshift(c); RECENT.length = Math.min(RECENT.length, 8); try { localStorage.setItem("dz-recent", JSON.stringify(RECENT)) } catch (_) { } }
  function colorCtl(host, label, val, onSet, opt) {
    opt = opt || {}; const none = val === "none" || !val; const box = document.createElement("div"); box.className = "dz-col";
    box.innerHTML = `<div class="dz-colrow"><span class="dz-lab">${label}</span>${opt.none ? `<label class="dz-none"><input type="checkbox" ${none ? "checked" : ""}> 없음</label>` : ""}<input type="color" value="${normHex(val) || "#000000"}"><input class="dz-hex" maxlength="7" value="${none ? "" : (normHex(val) || "")}" placeholder="#000000" spellcheck="false"></div>${opt.compact?"":`<div class="dz-sw">${[...new Set([...RECENT, ...SWATCH])].slice(0, 20).map(c => `<button type="button" data-c="${c}" style="background:${c}" title="${c}"></button>`).join("")}</div>`}`;
    const ci = box.querySelector('input[type=color]'), hx = box.querySelector(".dz-hex"), nc = box.querySelector(".dz-none input");
    const set = (c, from) => { c = normHex(c); if (!c) return; if (from !== "c") ci.value = c; if (from !== "h") hx.value = c; if (nc) nc.checked = false; onSet(c) };
    ci.addEventListener("input", () => set(ci.value, "c")); ci.addEventListener("change", () => pushRecent(ci.value));
    hx.addEventListener("input", () => { const c = normHex(hx.value); hx.classList.toggle("bad", !c && !!hx.value); if (c) set(c, "h") }); hx.addEventListener("change", () => pushRecent(hx.value));
    box.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { set(b.dataset.c); pushRecent(b.dataset.c) });
    if (nc) nc.onchange = () => { if (nc.checked) { hx.value = ""; onSet("none") } else set(ci.value) };
    host.appendChild(box); return box
  }
  /* ---------- 화면 꾸밈 ---------- */
  const CSS = `.dz-stage{position:relative;overflow:auto;background:#d9d0c2;border-radius:14px;min-height:300px;max-height:78vh;touch-action:pan-x pan-y;overscroll-behavior:contain}
.dz-wrap{display:flex;gap:28px;padding:26px;width:max-content;min-width:100%;justify-content:center;align-items:flex-start}
.dz-board{position:relative;flex:none}.dz-board canvas{display:block;box-shadow:0 4px 18px rgba(0,0,0,.22);background:#fff}
.dz-blab{position:absolute;left:0;top:-21px;font:14px Jua,sans-serif;color:#3b2a20;white-space:nowrap}
.dz-sel{position:absolute;border:1.5px solid #2f6fb0;pointer-events:none;box-sizing:border-box}
.dz-sel i{position:absolute;width:12px;height:12px;background:#fff;border:2px solid #2f6fb0;border-radius:3px;pointer-events:auto;margin:-6px 0 0 -6px;touch-action:none}
.dz-sel i.rot{border-radius:50%;background:#2f6fb0;cursor:grab}.dz-sel i.rot:after{content:"";position:absolute;left:4px;top:10px;width:1.5px;height:16px;background:#2f6fb0}
.dz-edit{position:absolute;border:1.5px dashed #2f6fb0;background:rgba(255,255,255,.5);resize:none;overflow:hidden;padding:0;margin:0;outline:none;white-space:pre-wrap;word-break:break-all;transform-origin:center center}
.dz-guide{position:absolute;background:#e8503a;pointer-events:none}
.dz-tools{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px}
.dz-tools button,.dz-panel button{font:inherit;font-size:14px;border:1.5px solid #3b2a20;background:#fffaf0;border-radius:9px;padding:3px 9px;cursor:pointer;color:#3b2a20}
.dz-tools button.on,.dz-panel button.on{background:#ffe08a}
.dz-tools .dz-z{font-size:13px;color:#7a6a5c;min-width:44px;text-align:center}
.dz-menu{position:absolute;z-index:50;background:#fff;border:2px solid #3b2a20;border-radius:12px;padding:6px;display:grid;grid-template-columns:repeat(3,auto);gap:4px;box-shadow:0 6px 20px rgba(0,0,0,.2)}
.dz-menu button{display:flex;flex-direction:column;align-items:center;font-size:12px;padding:4px 6px}
.dz-menu canvas{width:42px;height:42px}
.dz-panel{font-size:14px;color:#3b2a20}.dz-panel h4{margin:10px 0 4px;font:16px Jua,sans-serif}.dz-panel .row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:4px 0}
.dz-panel label{display:flex;align-items:center;gap:4px;font-size:13px;color:#7a6a5c}.dz-panel input[type=number]{width:70px}.dz-panel input[type=range]{width:120px}
.dz-panel textarea{width:100%;min-height:70px;font:inherit;border:1.5px solid #cdbda6;border-radius:8px;padding:6px}
.dz-panel select{max-width:100%;font:inherit;border:1.5px solid #cdbda6;border-radius:8px;padding:3px 6px}
.dz-col{margin:6px 0}.dz-colrow{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.dz-lab{font-size:13px;color:#7a6a5c;min-width:52px}
.dz-colrow input[type=color]{width:38px;height:30px;padding:0;border:1.5px solid #cdbda6;border-radius:6px;background:#fff}
.dz-hex{width:84px;font:13px ui-monospace,Consolas,monospace;border:1.5px solid #cdbda6;border-radius:6px;padding:4px 6px}.dz-hex.bad{border-color:#e8503a}
.dz-sw{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}.dz-sw button{width:20px;height:20px;border-radius:5px;border:1.5px solid #0002;padding:0;cursor:pointer}
.dz-none{font-size:13px}.dz-fontsel option{font-size:16px}
.dz-tog button{min-width:34px}`;
  function css() { if (document.getElementById("dz-css")) return; const s = document.createElement("style"); s.id = "dz-css"; s.textContent = CSS; document.head.appendChild(s) }
  const uid = () => "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const clone = o => JSON.parse(JSON.stringify(o));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* ---------- 편집기 ---------- */
  function editor(o) {
    css(); const stage = o.stage, panel = o.panel, tools = o.tools; stage.classList.add("dz-stage"); panel.classList.add("dz-panel");
    let boards = [], Z = o.zoom || .6, sel = null, editing = null, drag = null, guides = [], hist = [], fut = [], clip = null;
    const img = imgGetter(o.assets, () => draw());
    const wrap = document.createElement("div"); wrap.className = "dz-wrap"; stage.appendChild(wrap);
    const B = id => boards.find(b => b.id === id), curEl = () => { if (!sel) return null; const b = B(sel.b); return b ? (b.data.els || []).find(e => e.id === sel.id) || null : null }, curBoard = () => sel ? B(sel.b) : boards[0];
    const snap = () => JSON.stringify(boards.map(b => ({ id: b.id, data: b.data })));
    let last = null;
    function commit(silent) { const s = snap(); if (s === last) return; if (last != null) { hist.push(last); if (hist.length > 80) hist.shift(); fut = [] } last = s; if (!silent && o.onChange) o.onChange(); updTools() }
    function restore(s) { const L = JSON.parse(s); L.forEach(x => { const b = B(x.id); if (b) { Object.keys(b.data).forEach(k => delete b.data[k]); Object.assign(b.data, x.data) } }); last = s; sel = null; draw(); renderPanel(); o.onChange && o.onChange(); updTools() }
    function undo() { if (!hist.length) return; fut.push(snap()); restore(hist.pop()) }
    function redo() { if (!fut.length) return; hist.push(snap()); restore(fut.pop()) }
    /* 판 만들기 */
    function setBoards(L, keepHist) {
      boards = L; boards.forEach(b => { b.data.els = b.data.els || [] }); if (!keepHist) { hist = []; fut = []; last = snap() } sel = null; editing = null;
      wrap.innerHTML = ""; boards.forEach(b => {
        const d = document.createElement("div"); d.className = "dz-board"; d.dataset.b = b.id; d.innerHTML = `${b.label ? `<div class="dz-blab">${esc(b.label)}</div>` : ""}<canvas></canvas>`; wrap.appendChild(d); b.dom = d; b.cv = d.querySelector("canvas");
        b.cv.addEventListener("pointerdown", e => down(e, b)); b.cv.addEventListener("dblclick", e => dbl(e, b))
      });
      const fonts = new Set(); boards.forEach(b => b.data.els.forEach(e => { if (e.type === "text") fonts.add(e.font || "Noto Sans KR") }));
      Promise.all([...fonts].map(ensureFont)).then(() => draw()); draw(); renderPanel(); updTools()
    }
    function draw() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      boards.forEach(b => {
        const c = b.cv; if (!c) return; const W = Math.round(b.w * Z), H = Math.round(b.h * Z); c.style.width = W + "px"; c.style.height = H + "px";
        if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr) }
        const x = c.getContext("2d"); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); x.setTransform(Z * dpr, 0, 0, Z * dpr, 0, 0);
        drawBoard(x, b, img, { skip: editing && editing.b === b.id ? editing.id : null })
      });
      overlay()
    }
    function overlay() {
      wrap.querySelectorAll(".dz-sel,.dz-guide").forEach(n => n.remove());
      boards.forEach(b => guides.filter(g => g.b === b.id).forEach(g => { const n = document.createElement("div"); n.className = "dz-guide"; if (g.v) n.style.cssText = `left:${g.at * Z}px;top:0;width:1px;height:${b.h * Z}px`; else n.style.cssText = `top:${g.at * Z}px;left:0;height:1px;width:${b.w * Z}px`; b.dom.appendChild(n) }));
      const e = curEl(); if (!e || editing) return; const b = B(sel.b), n = document.createElement("div"); n.className = "dz-sel";
      n.style.cssText = `left:${e.x * Z}px;top:${e.y * Z}px;width:${e.w * Z}px;height:${e.h * Z}px;transform:rotate(${+e.rot || 0}deg)`;
      const H = e.type === "text" ? [["nw", 0, 0], ["ne", 1, 0], ["e", 1, .5], ["se", 1, 1], ["sw", 0, 1], ["w", 0, .5]] : [["nw", 0, 0], ["n", .5, 0], ["ne", 1, 0], ["e", 1, .5], ["se", 1, 1], ["s", .5, 1], ["sw", 0, 1], ["w", 0, .5]];
      n.innerHTML = H.map(([k, x, y]) => `<i data-h="${k}" style="left:${x * 100}%;top:${y * 100}%;cursor:${k}-resize"></i>`).join("") + `<i class="rot" data-h="rot" style="left:50%;top:-26px"></i>`;
      n.querySelectorAll("i").forEach(h => h.addEventListener("pointerdown", ev => hdown(ev, b, e, h.dataset.h))); b.dom.appendChild(n)
    }
    const pt = (ev, b) => { const r = b.cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) / Z, y: (ev.clientY - r.top) / Z } };
    function hit(b, p) {
      const L = b.data.els; for (let i = L.length - 1; i >= 0; i--) {
        const e = L[i]; if (e.lock) continue; const cx = e.x + e.w / 2, cy = e.y + e.h / 2, a = -(+e.rot || 0) * Math.PI / 180, dx = p.x - cx, dy = p.y - cy;
        const lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a), pad = 4 / Z; if (Math.abs(lx) <= e.w / 2 + pad && Math.abs(ly) <= e.h / 2 + pad) return e
      } return null
    }
    function select(bid, id) { if (editing) finishEdit(); sel = id ? { b: bid, id } : null; overlay(); renderPanel(); updTools() }
    function down(ev, b) {
      if (ev.button > 0) return; if (editing) finishEdit(); const p = pt(ev, b), e = hit(b, p);
      if (!e) { select(b.id, null); sel = { b: b.id, id: null }; renderPanel(); return }
      if (!sel || sel.id !== e.id) select(b.id, e.id); ev.preventDefault(); b.cv.setPointerCapture(ev.pointerId);
      drag = { k: "move", b, e, p0: p, x0: e.x, y0: e.y, moved: false };
      const mv = ev2 => {
        const q = pt(ev2, b); let nx = drag.x0 + q.x - drag.p0.x, ny = drag.y0 + q.y - drag.p0.y; if (!drag.moved && Math.hypot(q.x - drag.p0.x, q.y - drag.p0.y) * Z < 3) return; drag.moved = true;
        guides = []; const t = 7 / Z, cx = nx + e.w / 2, cy = ny + e.h / 2;
        if (Math.abs(cx - b.w / 2) < t) { nx = b.w / 2 - e.w / 2; guides.push({ b: b.id, v: 1, at: b.w / 2 }) } if (Math.abs(cy - b.h / 2) < t) { ny = b.h / 2 - e.h / 2; guides.push({ b: b.id, v: 0, at: b.h / 2 }) }
        e.x = Math.round(nx); e.y = Math.round(ny); draw()
      };
      const up = () => { b.cv.removeEventListener("pointermove", mv); b.cv.removeEventListener("pointerup", up); b.cv.removeEventListener("pointercancel", up); guides = []; draw(); if (drag && drag.moved) { commit(); syncPanel() } drag = null };
      b.cv.addEventListener("pointermove", mv); b.cv.addEventListener("pointerup", up); b.cv.addEventListener("pointercancel", up)
    }
    function hdown(ev, b, e, h) {
      ev.preventDefault(); ev.stopPropagation(); const el = ev.target; el.setPointerCapture(ev.pointerId); const p0 = pt(ev, b), s = { x: e.x, y: e.y, w: e.w, h: e.h, rot: +e.rot || 0, size: +e.size || 30 };
      const sx = /e/.test(h) ? 1 : /w/.test(h) ? -1 : 0, sy = /s/.test(h) ? 1 : /n/.test(h) ? -1 : 0, ratio = s.w / s.h, keep = e.type === "image" || (e.type === "shape" && e.img);
      const mv = ev2 => {
        const q = pt(ev2, b), cx = s.x + s.w / 2, cy = s.y + s.h / 2;
        if (h === "rot") { let a = Math.atan2(q.y - cy, q.x - cx) * 180 / Math.PI + 90; if (ev2.shiftKey || Math.abs(((a % 90) + 90) % 90) < 4 || Math.abs(((a % 90) + 90) % 90) > 86) a = Math.round(a / (ev2.shiftKey ? 15 : 90)) * (ev2.shiftKey ? 15 : 90); e.rot = Math.round(((a % 360) + 540) % 360 - 180); draw(); return }
        const a = s.rot * Math.PI / 180, dx = q.x - p0.x, dy = q.y - p0.y, lx = dx * Math.cos(-a) - dy * Math.sin(-a), ly = dx * Math.sin(-a) + dy * Math.cos(-a);
        let w = Math.max(8, s.w + sx * lx), hh = e.type === "text" ? s.h : Math.max(4, s.h + sy * ly);
        if ((keep || ev2.shiftKey) && sx && sy) { if (w / hh > ratio) hh = w / ratio; else w = hh * ratio }
        const tc = e.type === "text" && sx && sy; if (tc) { hh = s.h * w / s.w; e.size = Math.max(4, Math.round(s.size * w / s.w * 10) / 10) }
        const dw = (w - s.w) * (sx || 0) / 2, dh = (hh - s.h) * (sy || 0) / 2, gx = dw * Math.cos(a) - dh * Math.sin(a), gy = dw * Math.sin(a) + dh * Math.cos(a);
        e.w = Math.round(w); if (e.type !== "text") e.h = Math.round(hh); e.x = Math.round(cx + gx - w / 2); e.y = Math.round(cy + gy - (e.type === "text" && !tc ? s.h : hh) / 2); draw()
      };
      const up = () => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); commit(); syncPanel() };
      el.addEventListener("pointermove", mv); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up)
    }
    function dbl(ev, b) { const e = hit(b, pt(ev, b)); if (e && e.type === "text") startEdit(b, e) }
    function startEdit(b, e) {
      select(b.id, e.id); editing = { b: b.id, id: e.id }; draw(); const t = document.createElement("textarea"); t.className = "dz-edit"; t.value = e.t || "";
      const fit = () => { t.style.cssText = `left:${e.x * Z}px;top:${e.y * Z}px;width:${e.w * Z}px;height:${Math.max(e.h, (+e.size || 30) * (+e.lh || 1.35)) * Z + 4}px;transform:rotate(${+e.rot || 0}deg);font:${(e.i ? "italic " : "") + (e.b ? "bold " : "")}${(+e.size || 30) * Z}px/${(+e.lh || 1.35)} "${e.font || "Noto Sans KR"}",Jua,sans-serif;letter-spacing:${(+e.ls || 0) * Z}px;text-align:${e.align || "left"};color:${e.color || "#222"}` };
      fit(); b.dom.appendChild(t); t.focus(); t.select();
      t.addEventListener("input", () => { e.t = t.value; const x = document.createElement("canvas").getContext("2d"); e.h = layoutText(x, e).h; fit(); const ta = panel.querySelector("[data-p=t]"); if (ta) ta.value = e.t });
      t.addEventListener("blur", () => finishEdit()); t.addEventListener("keydown", k => { if (k.key === "Escape") { k.preventDefault(); t.blur() } k.stopPropagation() });
      editing.ta = t
    }
    function finishEdit() { if (!editing) return; const t = editing.ta; editing = null; if (t) t.remove(); draw(); commit() }
    /* 추가 */
    function center(b) { const r = stage.getBoundingClientRect(), br = b.cv.getBoundingClientRect(); const cx = ((Math.max(r.left, br.left) + Math.min(r.right, br.right)) / 2 - br.left) / Z, cy = ((Math.max(r.top, br.top) + Math.min(r.bottom, br.bottom)) / 2 - br.top) / Z; return { x: isFinite(cx) ? Math.max(0, Math.min(b.w, cx)) : b.w / 2, y: isFinite(cy) ? Math.max(0, Math.min(b.h, cy)) : b.h / 2 } }
    function add(e, b) {
      b = b || curBoard(); if (!b) return; const c = center(b); e.id = uid(); e.x = Math.round(e.x != null ? e.x : c.x - e.w / 2); e.y = Math.round(e.y != null ? e.y : c.y - e.h / 2); b.data.els.push(e);
      if (e.type === "text") ensureFont(e.font).then(draw); select(b.id, e.id); draw(); commit(); return e
    }
    const dflt = () => Object.assign({ font: "Noto Sans KR", color: "#222222" }, o.textDefault || {});
    function addText() { const b = curBoard(); if (!b) return; const d = dflt(), size = d.size || Math.round(b.w / 14); const e = add(Object.assign({ type: "text", t: "글자를 두 번 눌러 고쳐요", w: Math.round(b.w * .6), h: size * 1.35, size, lh: 1.35, ls: 0, align: "center" }, d, { size })); if (e) setTimeout(() => startEdit(b, e), 30) }
    function addShape(kind) { const b = curBoard(); if (!b) return; const m = Math.round(Math.min(b.w, b.h) * .3); add({ type: "shape", kind, w: kind === "line" ? Math.round(b.w * .5) : kind === "arrow" || kind === "wave" ? Math.round(m * 1.5) : m, h: kind === "line" ? Math.max(3, Math.round(b.w / 200)) : m, fill: kind === "line" ? "#3b2a20" : (o.shapeFill || "#f5b82e"), stroke: "#3b2a20", sw: 0, r: kind === "round" ? Math.round(m * .15) : undefined }) }
    function pickFile() { return new Promise(res => { const i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = () => res(i.files[0] || null); i.click() }) }
    async function imageAsset() { const f = await pickFile(); if (!f) return null; try { const r = await readImage(f, o.imgMax || 1800); const id = await o.assets.put(r.url); return { id, w: r.w, h: r.h } } catch (_) { alert("사진을 읽지 못했어요"); return null } }
    async function addImage() { const b = curBoard(); if (!b) return; const a = await imageAsset(); if (!a) return; const m = Math.min(b.w, b.h) * .5, s = Math.min(m / a.w, m / a.h); add({ type: "image", src: a.id, w: Math.round(a.w * s), h: Math.round(a.h * s), r: 0, sw: 0, stroke: "#ffffff" }, b) }
    function del() { const e = curEl(); if (!e) return; const b = B(sel.b); b.data.els = b.data.els.filter(x => x !== e); sel = null; draw(); renderPanel(); commit() }
    function dup(e, b) { e = e || curEl(); b = b || (sel && B(sel.b)); if (!e || !b) return; const c = clone(e); c.id = uid(); c.x += 20; c.y += 20; b.data.els.push(c); select(b.id, c.id); draw(); commit() }
    function order(k) { const e = curEl(); if (!e) return; const L = B(sel.b).data.els, i = L.indexOf(e); L.splice(i, 1); const j = k === "top" ? L.length : k === "bottom" ? 0 : k === "up" ? Math.min(L.length, i + 1) : Math.max(0, i - 1); L.splice(j, 0, e); draw(); commit() }
    /* 확대·축소 */
    function zoom(z, cx, cy) {
      z = Math.max(.1, Math.min(4, z)); const r = stage.getBoundingClientRect(); cx = cx == null ? r.left + r.width / 2 : cx; cy = cy == null ? r.top + r.height / 2 : cy;
      const ax = (stage.scrollLeft + cx - r.left), ay = (stage.scrollTop + cy - r.top), k = z / Z; Z = z; if (editing) finishEdit(); draw(); stage.scrollLeft = ax * k - (cx - r.left); stage.scrollTop = ay * k - (cy - r.top); updTools(); o.onZoom && o.onZoom(Z)
    }
    function fit() { if (!boards.length) return; const r = stage.getBoundingClientRect(), tw = boards.reduce((s, b) => s + b.w, 0), th = Math.max(...boards.map(b => b.h)); const z = Math.min((r.width - 52 - 28 * (boards.length - 1)) / tw, ((Math.min(window.innerHeight * .78, 2000)) - 70) / th); zoom(Math.max(.1, Math.min(2, z))) }
    stage.addEventListener("wheel", e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoom(Z * Math.exp(-e.deltaY * .0018), e.clientX, e.clientY) }, { passive: false });
    /* 단축키 */
    function key(e) {
      if (!stage.isConnected || stage.offsetParent === null) return; const t = e.target; if (t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable)) return;
      const c = e.ctrlKey || e.metaKey, el = curEl();
      if (c && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return } if (c && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); return }
      if (!el) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); del(); return }
      if (c && e.key.toLowerCase() === "d") { e.preventDefault(); dup(); return } if (c && e.key.toLowerCase() === "c") { clip = clone(el); return }
      if (e.key === "Enter" && el.type === "text") { e.preventDefault(); startEdit(B(sel.b), el); return }
      if (e.key === "Escape") { select(null, null); return }
      const st = e.shiftKey ? 10 : 1, mv = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key]; if (mv) { e.preventDefault(); el.x += mv[0]; el.y += mv[1]; draw(); clearTimeout(key.t); key.t = setTimeout(() => { commit(); syncPanel() }, 400) }
    }
    function paste(e) { const t = e.target; if (t && /INPUT|TEXTAREA/.test(t.tagName)) return; if (!clip || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "v" || !stage.isConnected || stage.offsetParent === null) return; e.preventDefault(); const b = curBoard(); if (b) dup(clip, b) }
    document.addEventListener("keydown", key); document.addEventListener("keydown", paste);
    /* 도구 줄 */
    function updTools() { if (!tools) return; const z = tools.querySelector(".dz-z"); if (z) z.textContent = Math.round(Z * 100) + "%"; const u = tools.querySelector("[data-t=undo]"), r = tools.querySelector("[data-t=redo]"); if (u) u.disabled = !hist.length; if (r) r.disabled = !fut.length }
    if (tools) {
      tools.classList.add("dz-tools");
      tools.innerHTML = `<button data-t="text">🔤 글자</button><button data-t="image">🖼️ 사진</button><button data-t="shape">🔷 도형 ▾</button><span style="width:8px"></span><button data-t="undo" title="되돌리기 (Ctrl+Z)">↶</button><button data-t="redo" title="다시 하기 (Ctrl+Y)">↷</button><span style="flex:1"></span><button data-t="zout" title="축소">－</button><span class="dz-z"></span><button data-t="zin" title="확대">＋</button><button data-t="fit">화면에 맞춤</button>`;
      tools.addEventListener("click", ev => {
        const t = ev.target.closest("[data-t]"); if (!t) return; const k = t.dataset.t;
        if (k === "text") addText(); else if (k === "image") addImage(); else if (k === "undo") undo(); else if (k === "redo") redo(); else if (k === "zin") zoom(Z * 1.2); else if (k === "zout") zoom(Z / 1.2); else if (k === "fit") fit();
        else if (k === "shape") shapeMenu(t)
      })
    }
    function shapeMenu(btn, onPick) {
      document.querySelectorAll(".dz-menu").forEach(m => m.remove()); const m = document.createElement("div"); m.className = "dz-menu";
      m.innerHTML = SHAPES.map(([k, n]) => `<button data-k="${k}"><canvas width="84" height="84"></canvas>${n}</button>`).join(""); document.body.appendChild(m);
      const r = btn.getBoundingClientRect(); m.style.left = Math.min(window.innerWidth - 260, r.left + scrollX) + "px"; m.style.top = (r.bottom + scrollY + 4) + "px";
      m.querySelectorAll("button").forEach(b => { const x = b.querySelector("canvas").getContext("2d"); x.translate(10, 10); x.fillStyle = "#f5b82e"; x.strokeStyle = "#3b2a20"; x.lineWidth = 3; const p = shapePath(b.dataset.k, 64, b.dataset.k === "line" ? 8 : 64, 10); if (b.dataset.k === "line") x.translate(0, 28); x.fill(p); x.stroke(p); b.onclick = () => { m.remove(); (onPick || addShape)(b.dataset.k) } });
      setTimeout(() => document.addEventListener("pointerdown", function f(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener("pointerdown", f) } }), 0)
    }
    /* ---------- 오른쪽 설정 칸 ---------- */
    function renderPanel() {
      panel.innerHTML = ""; const e = curEl(), b = curBoard();
      if (!e) { boardPanel(b); return }
      const h = s => { const d = document.createElement("div"); d.innerHTML = s; while (d.firstChild) panel.appendChild(d.firstChild) };
      const set = (k, v, re) => { e[k] = v; if (e.type === "text" && (k === "font")) ensureFont(v).then(() => { draw() }); draw(); clearTimeout(set.t); set.t = setTimeout(() => commit(), 350); if (re) renderPanel() };
      const bind = () => {
        panel.querySelectorAll("[data-p]").forEach(i => {
          const k = i.dataset.p, n = i.type === "number" || i.type === "range";
          i.addEventListener("input", () => { let v = n ? +i.value : i.value; if (k === "op") v = v / 100; set(k, v); const tw = panel.querySelector(`[data-pv="${k}"]`); if (tw) tw.textContent = i.value })
        });
        panel.querySelectorAll("[data-tg]").forEach(btn => btn.onclick = () => { const k = btn.dataset.tg; if (k.startsWith("al:")) set("align", k.slice(3), true); else set(k, !e[k], true) });
        panel.querySelectorAll("[data-do]").forEach(btn => btn.onclick = async () => {
          const k = btn.dataset.do; if (k === "del") del(); else if (k === "dup") dup(); else if (/^(top|up|down|bottom)$/.test(k)) order(k);
          else if (k === "edit") startEdit(B(sel.b), e);
          else if (k === "pic") { const a = await imageAsset(); if (!a) return; if (e.type === "image") { e.src = a.id; const r = a.w / a.h; e.h = Math.round(e.w / r) } else e.img = a.id; draw(); commit(); renderPanel() }
          else if (k === "unpic") { delete e.img; draw(); commit(); renderPanel() }
          else if (k === "kind") shapeMenu(btn, kk => { e.kind = kk; draw(); commit(); renderPanel() })
        })
      };
      const name = { text: "🔤 글자", image: "🖼️ 사진", shape: "🔷 도형" }[e.type];
      h(`<div class="row"><b style="font:17px Jua,sans-serif">${name}</b><span style="flex:1"></span><button data-do="dup" title="복제 (Ctrl+D)">📄 복제</button><button data-do="del" title="지우기 (Delete)">🗑</button></div>`);
      if (e.type === "text") {
        h(`<textarea data-p="t" placeholder="글자">${esc(e.t)}</textarea>`);
        h(`<div class="row"><select class="dz-fontsel" data-p="font" style="flex:1">${FONTS.map(([f, n]) => `<option value="${esc(f)}" style="font-family:'${esc(f)}'"${(e.font || "Noto Sans KR") === f ? " selected" : ""}>${esc(n)}${n !== f ? " · " + esc(f) : ""}</option>`).join("")}</select></div>`);
        h(`<div class="row"><label>크기<input type="number" min="4" max="2000" data-p="size" value="${+e.size || 30}"></label><label>자간<input type="range" min="-10" max="60" data-p="ls" value="${+e.ls || 0}"><span data-pv="ls">${+e.ls || 0}</span></label></div>`);
        h(`<div class="row"><label>줄간격<input type="range" min="0.8" max="3" step="0.05" data-p="lh" value="${+e.lh || 1.35}"><span data-pv="lh">${+e.lh || 1.35}</span></label></div>`);
        h(`<div class="row dz-tog"><button data-tg="b" class="${e.b ? "on" : ""}" title="진하게"><b>가</b></button><button data-tg="i" class="${e.i ? "on" : ""}" title="기울임"><i>가</i></button><button data-tg="u" class="${e.u ? "on" : ""}" title="밑줄"><u>가</u></button><button data-tg="s" class="${e.s ? "on" : ""}" title="취소선"><s>가</s></button><span style="width:8px"></span>${[["left", "⯇ 왼쪽"], ["center", "가운데"], ["right", "오른쪽 ⯈"]].map(([k, n]) => `<button data-tg="al:${k}" class="${(e.align || "left") === k ? "on" : ""}">${n}</button>`).join("")}</div>`);
        colorCtl(panel, "글자색", e.color || "#222222", c => set("color", c));
        h(`<h4>외곽선</h4>`); colorCtl(panel, "선 색", e.st || "none", c => set("st", c), { none: 1 }); h(`<div class="row"><label>두께<input type="range" min="0" max="30" data-p="stw" value="${+e.stw || 0}"><span data-pv="stw">${+e.stw || 0}</span></label></div>`)
      }
      if (e.type === "shape") {
        h(`<div class="row"><button data-do="kind">모양 바꾸기 ▾</button><span style="font-size:13px;color:#7a6a5c">${esc((SHAPES.find(s => s[0] === e.kind) || [, ""])[1])}</span></div>`);
        h(`<div class="row"><button data-do="pic">📷 ${e.img ? "도형 속 사진 바꾸기" : "도형 안에 사진 넣기"}</button>${e.img ? '<button data-do="unpic">사진 빼기</button>' : ""}</div>`);
        if (!e.img) colorCtl(panel, "채우기", e.fill || "none", c => set("fill", c), { none: 1 });
        colorCtl(panel, "테두리", +e.sw > 0 ? e.stroke : "none", c => { if (c === "none") set("sw", 0, true); else { e.stroke = c; if (!(+e.sw > 0)) set("sw", Math.max(2, Math.round(Math.min(e.w, e.h) / 40)), true); else set("stroke", c) } }, { none: 1 });
        h(`<div class="row"><label>테두리 두께<input type="range" min="0" max="40" data-p="sw" value="${+e.sw || 0}"><span data-pv="sw">${+e.sw || 0}</span></label><button data-tg="dash" class="${e.dash ? "on" : ""}">점선</button></div>`);
        if (e.kind === "round") h(`<div class="row"><label>모서리<input type="range" min="0" max="${Math.round(Math.min(e.w, e.h) / 2)}" data-p="r" value="${+e.r || 0}"></label></div>`)
      }
      if (e.type === "image") {
        h(`<div class="row"><button data-do="pic">📷 사진 바꾸기</button><button data-tg="fitc" style="display:none"></button></div>`);
        h(`<div class="row"><label>모서리 둥글게<input type="range" min="0" max="${Math.round(Math.min(e.w, e.h) / 2)}" data-p="r" value="${+e.r || 0}"></label></div>`);
        colorCtl(panel, "테두리", +e.sw > 0 ? e.stroke : "none", c => { if (c === "none") set("sw", 0, true); else { e.stroke = c; if (!(+e.sw > 0)) set("sw", Math.max(2, Math.round(Math.min(e.w, e.h) / 40)), true); else set("stroke", c) } }, { none: 1 });
        h(`<div class="row"><label>테두리 두께<input type="range" min="0" max="40" data-p="sw" value="${+e.sw || 0}"></label></div>`)
      }
      h(`<h4>위치·모양</h4><div class="row"><label>가로<input type="number" data-p="x" value="${Math.round(e.x)}"></label><label>세로<input type="number" data-p="y" value="${Math.round(e.y)}"></label></div><div class="row"><label>너비<input type="number" min="4" data-p="w" value="${Math.round(e.w)}"></label>${e.type === "text" ? "" : `<label>높이<input type="number" min="4" data-p="h" value="${Math.round(e.h)}"></label>`}</div>`);
      h(`<div class="row"><label>회전<input type="range" min="-180" max="180" data-p="rot" value="${+e.rot || 0}"><span data-pv="rot">${+e.rot || 0}</span>°</label></div><div class="row"><label>투명도<input type="range" min="5" max="100" data-p="op" value="${Math.round((e.op == null ? 1 : e.op) * 100)}"><span data-pv="op">${Math.round((e.op == null ? 1 : e.op) * 100)}</span>%</label></div>`);
      h(`<div class="row"><span style="font-size:13px;color:#7a6a5c">순서</span><button data-do="top">맨 앞</button><button data-do="up">앞으로</button><button data-do="down">뒤로</button><button data-do="bottom">맨 뒤</button></div>`);
      h(`<p style="font-size:12px;color:#7a6a5c;margin:8px 0 0">끌어서 옮기고, 모서리로 크기(글자는 모서리를 끌면 글자 크기가, 옆 가운데를 끌면 줄 폭이 바뀌어요), 위 동그라미로 회전(Shift: 15°씩). 글자는 두 번 눌러 고쳐요. Delete 지우기 · Ctrl+D 복제 · Ctrl+Z 되돌리기 · 방향키로 조금씩</p>`);
      bind(); if (o.onPanel) o.onPanel(panel, e, b)
    }
    function syncPanel() { const e = curEl(); if (!e) return; ["x", "y", "w", "h", "rot", "size"].forEach(k => { const i = panel.querySelector(`[data-p="${k}"]`); if (i && document.activeElement !== i) i.value = Math.round(+e[k] || 0) }) }
    /* 아무것도 고르지 않았을 때: 판 설정 + 쓰인 색 한꺼번에 바꾸기 */
    function usedColors(b) {
      const m = new Map(), addc = (c, w) => { c = normHex(c); if (c) m.set(c, (m.get(c) || 0) + w) };
      if (b.bgEditable !== false && !b.under) addc(b.data.bg, 2); b.data.els.forEach(e => { if (e.type === "text") { addc(e.color, 1); if (+e.stw > 0) addc(e.st, 1) } else { if (!e.img) addc(e.fill, 1); if (+e.sw > 0) addc(e.stroke, 1) } });
      return [...m.keys()]
    }
    function boardPanel(b) {
      if (!b) { panel.innerHTML = '<p style="color:#7a6a5c">판이 없어요</p>'; return }
      const head = document.createElement("div"); head.innerHTML = `<b style="font:17px Jua,sans-serif">${esc(b.label || "판")}</b><p style="font-size:13px;color:#7a6a5c;margin:4px 0">요소를 누르면 여기에서 글자·색·크기를 바꿔요. 위 도구로 글자·사진·도형을 넣어요.</p>`; panel.appendChild(head);
      if (o.boardPanel) o.boardPanel(panel, b);
      if (!b.under && b.bgEditable !== false) colorCtl(panel, "배경색", b.data.bg || "#ffffff", c => { b.data.bg = c; draw(); clearTimeout(boardPanel.t); boardPanel.t = setTimeout(() => commit(), 300) });
      const cols = usedColors(b); if (cols.length) {
        const d = document.createElement("div"); d.innerHTML = `<h4>🎨 이 판에 쓰인 색 바꾸기</h4><p style="font-size:12px;color:#7a6a5c;margin:0 0 4px">색을 고르면 이 판에서 그 색을 쓴 요소(템플릿 장식 포함)가 한꺼번에 바뀌어요.</p>`; panel.appendChild(d);
        cols.forEach(c0 => { let cur = c0; colorCtl(panel, `<span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:${c0};border:1px solid #0003;vertical-align:-2px"></span>`, c0, c => { const f = x => normHex(x) === cur ? c : x; if (!b.under) b.data.bg = f(b.data.bg); b.data.els.forEach(e => { ["color", "st", "fill", "stroke"].forEach(k => { if (e[k]) e[k] = f(e[k]) }) }); cur = c; draw(); clearTimeout(boardPanel.t); boardPanel.t = setTimeout(() => commit(), 300) }, { compact: 1 }) })
      }
    }
    /* 내보내기 */
    function exportCanvas(b, scale) {
      const c = document.createElement("canvas"); c.width = Math.round(b.w * scale); c.height = Math.round(b.h * scale); const x = c.getContext("2d"); x.setTransform(scale, 0, 0, scale, 0, 0); drawBoard(x, b, img, { clean: 1 }); return c
    }
    async function ready(list) { const fonts = new Set(), ims = []; (list || boards).forEach(b => b.data.els.forEach(e => { if (e.type === "text") fonts.add(e.font || "Noto Sans KR"); const s = e.type === "image" ? e.src : e.img; if (s) { img(s); const im = IMG.get(s); if (im && !im.complete) ims.push(new Promise(r => { im.onload = im.onerror = r })) } })); await Promise.all([...[...fonts].map(ensureFont), ...ims]) }
    addEventListener("resize", () => overlay());
    return { setBoards, draw, renderPanel, select, zoom, fit, undo, redo, commit, exportCanvas, ready, addText, addImage, addShape, get zoomLevel() { return Z }, get boards() { return boards }, current: curEl, deselect: () => select(null, null), img }
  }
  /* jsPDF 불러오기 */
  let pdfP = null;
  function loadPdf() { if (window.jspdf) return Promise.resolve(window.jspdf); if (pdfP) return pdfP; pdfP = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = () => res(window.jspdf); s.onerror = () => { pdfP = null; rej(new Error("PDF 도구를 불러오지 못했어요")) }; document.head.appendChild(s) }); return pdfP }
  function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 2000) }
  /* 사진 보관 (IndexedDB) */
  function assetStore(dbName) {
    const mem = new Map(); let dbp = null;
    const db = () => dbp || (dbp = new Promise((res, rej) => { const r = indexedDB.open(dbName, 1); r.onupgradeneeded = () => r.result.createObjectStore("a"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) }));
    return {
      get: id => mem.get(id),
      put: async url => { const id = "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); mem.set(id, url); try { const d = await db(); await new Promise(r => { const t = d.transaction("a", "readwrite"); t.objectStore("a").put(url, id); t.oncomplete = t.onerror = r }) } catch (_) { } return id },
      load: async ids => { try { const d = await db(); await Promise.all([...ids].filter(id => !mem.has(id)).map(id => new Promise(r => { const q = d.transaction("a").objectStore("a").get(id); q.onsuccess = () => { if (q.result) mem.set(id, q.result); r() }; q.onerror = r }))) } catch (_) { } },
      del: async id => { mem.delete(id); try { const d = await db(); d.transaction("a", "readwrite").objectStore("a").delete(id) } catch (_) { } }
    }
  }
  const usedAssets = data => { const s = new Set(); (data.els || []).forEach(e => { if (e.type === "image" && e.src) s.add(e.src); if (e.img) s.add(e.img) }); return s };
  window.DESIGN = { editor, drawBoard, drawEl, shapePath, layoutText, ensureFont, FONTS, SHAPES, colorCtl, normHex, loadPdf, download, assetStore, usedAssets, readImage, uid, clone, esc, imgGetter };
})();
