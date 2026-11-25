/* 🔗 함께 쓰기 — Firebase Firestore로 여러 사람이 같은 데이터를 실시간으로 써요.
   공유 링크 안의 긴 비밀 코드(spaces/{코드})를 아는 사람만 읽고 쓸 수 있어요 (Firestore 보안 규칙).
   비밀번호를 걸면 실제 기록은 "링크 코드 + 비밀번호"로 만든 다른 주소(SHA-256)에 저장돼서, 링크만으로는 열 수 없어요.
   아래 설정값은 웹에 공개되는 값이라 여기에 두어도 괜찮아요. */
(function () {
  const CFG = { apiKey: "AIzaSyApRyYIDC1-c9OwtAaEKKM04L67UTSDAf4", authDomain: "chiyoung-church.firebaseapp.com", projectId: "chiyoung-church", storageBucket: "chiyoung-church.firebasestorage.app", messagingSenderId: "952146259627", appId: "1:952146259627:web:cd9d29c1b4cf0c5df411ee" };
  const V = "10.12.2";
  let ready = null;
  const load = src => new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("SDK를 불러오지 못했어요")); document.head.appendChild(s) });
  function init() {
    if (ready) return ready;
    ready = (async () => {
      if (!CFG) throw new Error("함께 쓰기 설정이 아직 없어요");
      if (!window.firebase || !firebase.firestore) {
        await load("https://cdn.jsdelivr.net/npm/firebase@" + V + "/firebase-app-compat.js");
        await load("https://cdn.jsdelivr.net/npm/firebase@" + V + "/firebase-firestore-compat.js");
      }
      if (!firebase.apps.length) firebase.initializeApp(CFG);
      return firebase.firestore();
    })();
    ready.catch(() => { ready = null });
    return ready;
  }
  /* Firestore는 배열 안의 배열을 못 담아서, 저장할 때 감싸고 읽을 때 풀어요 */
  const enc = v => Array.isArray(v) ? v.map(x => Array.isArray(x) ? { __arr: enc(x) } : enc(x)) : (v && typeof v === "object") ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, enc(x)])) : v;
  const dec = v => Array.isArray(v) ? v.map(dec) : (v && typeof v === "object") ? (Object.keys(v).length === 1 && Array.isArray(v.__arr) ? dec(v.__arr) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, dec(x)]))) : v;
  const clean = d => JSON.parse(JSON.stringify(d));
  const wrapDocSnap = s => ({ id: s.id, exists: s.exists, metadata: s.metadata, data: () => s.exists ? dec(s.data()) : undefined });
  const wrapDoc = r => ({
    id: r.id,
    set: (d, o) => r.set(enc(clean(d)), o || {}),
    update: d => r.set(enc(clean(d)), { merge: true }),
    delete: () => r.delete(),
    get: () => r.get().then(wrapDocSnap),
    onSnapshot: (cb, err) => r.onSnapshot({ includeMetadataChanges: false }, s => cb(wrapDocSnap(s)), err)
  });
  const wrapCol = c => ({
    doc: id => wrapDoc(c.doc(String(id))),
    get: () => c.get().then(s => ({ docs: s.docs.map(wrapDocSnap), metadata: s.metadata })),
    onSnapshot: (cb, err) => c.onSnapshot(s => cb({ docs: s.docs.map(wrapDocSnap), metadata: s.metadata, size: s.size }), err)
  });
  async function space(id) {
    const fs = await init(), root = fs.collection("spaces").doc(id);
    return {
      id,
      collection: n => wrapCol(root.collection(n)),
      doc: p => { const [c, ...d] = p.split("/"); return wrapDoc(root.collection(c).doc(d.join("/"))) },
      /* 여러 개를 한꺼번에 (400개씩 나눠서) */
      putMany: async list => { for (let i = 0; i < list.length; i += 400) { const b = fs.batch(); list.slice(i, i + 400).forEach(([p, d]) => { const [c, ...r] = p.split("/"); b.set(root.collection(c).doc(r.join("/")), enc(clean(d))) }); await b.commit() } }
    };
  }
  const newId = () => { const a = new Uint8Array(26); crypto.getRandomValues(a); const ch = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"; return Array.from(a, b => ch[b % ch.length]).join("") };
  const link = (id, extra) => location.origin + location.pathname + "?share=" + id + (extra || "");
  /* 🔒 비밀번호: 링크 코드와 비밀번호로 실제 저장 주소를 만들어요 (비밀번호 자체는 어디에도 올리지 않아요) */
  async function sha(t) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, "0")).join("") }
  const keyOf = async (id, pw) => (pw = String(pw || "").trim()) ? sha("chiyoung-share:" + id + ":" + pw) : id;
  const lockRef = async id => (await init()).collection("spaces").doc(id).collection("pub").doc("lock");
  async function isLocked(id) { return (await (await lockRef(id)).get()).exists }
  async function setLock(id) { await (await lockRef(id)).set({ locked: true, t: Date.now() }) }
  /* 새 공유 공간: {id(링크), key(저장 주소), sp} */
  async function make(pw) { const id = newId(), key = await keyOf(id, pw); return { id, key, pw: String(pw || "").trim(), sp: await space(key), locked: !!String(pw || "").trim() } }
  /* 다 올린 뒤에 잠금 표시 (비밀번호가 있을 때만) */
  async function finish(m) { if (m.locked) await setLock(m.id) }
  /* 예전 공간의 문서를 지워요 (새 링크·비밀번호로 옮길 때) */
  async function wipe(key, paths) { const fs = await init(), root = fs.collection("spaces").doc(key); for (let i = 0; i < paths.length; i += 400) { const b = fs.batch(); paths.slice(i, i + 400).forEach(p => { const [c, ...r] = p.split("/"); b.delete(root.collection(c).doc(r.join("/"))) }); await b.commit() } }
  function askPw(msg, title, show) {
    return new Promise(res => { let done = false;
      const w = dialog({ html: '<h3 style="margin:0 0 8px;font-size:22px">' + (title || "🔒 비밀번호를 적어 주세요") + '</h3><p style="margin:0 0 10px;font-size:15px;line-height:1.5">' + msg + '</p><input type="' + (show ? "text" : "password") + '" id="__pw" autocomplete="off" style="width:100%;font-size:18px;padding:8px;border:2px solid #cdbda6;border-radius:10px">',
        buttons: [[show ? "정하기" : "들어가기", w => { done = true; res(w.querySelector("#__pw").value) }, true]], onClose: () => { if (!done) res(null) } });
      const i = w.querySelector("#__pw"); i.focus(); i.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing) { done = true; w.remove(); res(i.value) } }) })
  }
  /* 링크로 들어오기: 잠겨 있으면 비밀번호를 물어요. probe = 있어야 하는 문서 (예: "camp/main")
     → null(없음) | {cancel:true} | {key, snap, pw, locked} */
  async function join(id, probe) {
    if (!(await isLocked(id))) { const s = await (await space(id)).doc(probe).get(); return s.exists ? { key: id, snap: s, pw: "", locked: false } : null }
    let msg = "이 함께 쓰기는 비밀번호가 걸려 있어요. 링크를 보낸 사람에게 받은 비밀번호를 적어 주세요. 이 기기에서는 처음 한 번만 물어요.";
    for (;;) { const pw = await askPw(msg); if (pw == null) return { cancel: true }; if (!pw.trim()) { msg = "비밀번호를 적어 주세요."; continue }
      const key = await keyOf(id, pw), s = await (await space(key)).doc(probe).get(); if (s.exists) return { key, snap: s, pw: pw.trim(), locked: true };
      msg = "❌ 비밀번호가 맞지 않아요. 다시 적어 주세요." }
  }
  /* 함께 쓰기 시작 창에 넣는 비밀번호 칸 */
  const pwField = () => '<label style="display:block;margin-top:10px;font-size:15px">🔒 비밀번호 <span style="color:#7a6a5c;font-size:13px">(선택 · 비워 두면 링크만으로 들어와요)</span><input id="__newPw" autocomplete="off" placeholder="예) 함께 정한 단어나 숫자" style="width:100%;font-size:16px;padding:8px;border:2px solid #cdbda6;border-radius:10px;margin-top:4px"></label><p style="font-size:13px;color:#7a6a5c;margin:4px 0 0;line-height:1.5">비밀번호를 걸면 <b>링크와 비밀번호를 둘 다 아는 사람만</b> 들어와요. 링크와 비밀번호는 따로 보내 주세요. 잊어버리면 찾을 수 없으니 꼭 적어 두세요.</p>';
  /* 함께 쓰는 중 창의 비밀번호 줄 */
  const pwInfo = (pw, locked) => locked ? '<p style="margin:8px 0 0;font-size:15px">🔒 비밀번호: <b>' + String(pw || "(이 기기에 적어 두지 않았어요)").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])) + '</b> <span style="color:#7a6a5c;font-size:13px">· 링크와 따로 보내 주세요</span></p>' : '<p style="margin:8px 0 0;font-size:14px;color:#7a6a5c">🔓 비밀번호 없이 링크만으로 들어와요.</p>';
  /* 공유 링크 창 */
  function dialog(o) {
    const w = document.createElement("div"); w.style.cssText = "position:fixed;inset:0;z-index:7000;background:rgba(40,30,20,.5);display:flex;align-items:center;justify-content:center;padding:16px";
    w.innerHTML = '<div style="background:#fffaf0;border:3px solid #3b2a20;border-radius:20px;max-width:480px;width:100%;padding:18px;font-family:Jua,sans-serif;color:#3b2a20;box-shadow:0 6px 0 rgba(0,0,0,.2);max-height:90vh;overflow:auto">' + o.html + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px" data-acts></div></div>';
    const acts = w.querySelector("[data-acts]");
    const close = () => { w.remove(); if (o.onClose) o.onClose() };
    (o.buttons || []).concat([["닫기", null]]).forEach(([t, fn, pri]) => { const b = document.createElement("button"); b.textContent = t; b.style.cssText = "font:inherit;border:2px solid #3b2a20;border-radius:12px;padding:7px 14px;cursor:pointer;box-shadow:0 2px 0 #3b2a20;background:" + (pri ? "#e8503a;color:#fff" : "#fffaf0"); b.onclick = async () => { if (fn) { b.disabled = true; try { const keep = await fn(w); if (keep === true) { b.disabled = false; return } } catch (e) { alert(e && e.message || e); b.disabled = false; return } w.remove(); return } close() }; acts.appendChild(b) });
    w.addEventListener("click", e => { if (e.target === w) close() });
    document.body.appendChild(w); return w;
  }
  window.SHARE = { enabled: () => !!CFG, init, space, newId, link, dialog, enc, dec, keyOf, isLocked, setLock, make, finish, wipe, join, askPw, pwField, pwInfo };
})();
