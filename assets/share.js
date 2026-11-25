/* 🔗 함께 쓰기 — Firebase Firestore로 여러 사람이 같은 데이터를 실시간으로 써요.
   공유 링크 안의 긴 비밀 코드(spaces/{코드})를 아는 사람만 읽고 쓸 수 있어요 (Firestore 보안 규칙).
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
  /* 공유 링크 창 */
  function dialog(o) {
    const w = document.createElement("div"); w.style.cssText = "position:fixed;inset:0;z-index:5000;background:rgba(40,30,20,.5);display:flex;align-items:center;justify-content:center;padding:16px";
    w.innerHTML = '<div style="background:#fffaf0;border:3px solid #3b2a20;border-radius:20px;max-width:480px;width:100%;padding:18px;font-family:Jua,sans-serif;color:#3b2a20;box-shadow:0 6px 0 rgba(0,0,0,.2);max-height:90vh;overflow:auto">' + o.html + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px" data-acts></div></div>';
    const acts = w.querySelector("[data-acts]");
    (o.buttons || []).concat([["닫기", null]]).forEach(([t, fn, pri]) => { const b = document.createElement("button"); b.textContent = t; b.style.cssText = "font:inherit;border:2px solid #3b2a20;border-radius:12px;padding:7px 14px;cursor:pointer;box-shadow:0 2px 0 #3b2a20;background:" + (pri ? "#e8503a;color:#fff" : "#fffaf0"); b.onclick = async () => { if (fn) { b.disabled = true; try { const keep = await fn(w); if (keep === true) { b.disabled = false; return } } catch (e) { alert(e && e.message || e); b.disabled = false; return } } w.remove() }; acts.appendChild(b) });
    w.addEventListener("click", e => { if (e.target === w) w.remove() });
    document.body.appendChild(w); return w;
  }
  window.SHARE = { enabled: () => !!CFG, init, space, newId, link, dialog, enc, dec };
})();
