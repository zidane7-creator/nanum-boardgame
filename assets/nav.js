/* 모든 페이지 오른쪽 아래: ⛶ 전체보기 (F) · ◀ 이전 화면 (Ctrl+Q) · 다음 화면 ▶ (Ctrl+E) · ▲ 맨 위로
   Ctrl+W는 브라우저가 ‘탭 닫기’로 쓰는 키라서 웹페이지가 가로챌 수 없어요. 그래서 다음 화면은 Ctrl+E예요. */
(function () {
  if (window.__siteNav) return; window.__siteNav = 1;
  const css = `#siteNav{position:fixed;right:14px;bottom:14px;z-index:9000;display:flex;gap:6px;align-items:center}
#siteNav button{width:42px;height:42px;border-radius:50%;border:2.5px solid #3b2f2a;background:#fff8e6;color:#3b2f2a;font:17px/1 "Jua","Apple SD Gothic Neo","Malgun Gothic",sans-serif;box-shadow:0 3px 0 #3b2f2a;cursor:pointer;position:relative;padding:0;display:inline-flex;align-items:center;justify-content:center;transition:transform .15s,opacity .2s}
#siteNav button:hover{transform:translateY(-2px)}#siteNav button:active{transform:translateY(2px);box-shadow:0 1px 0 #3b2f2a}
#siteNav .ic{display:inline-flex}#siteNav button:disabled{opacity:.35;cursor:default;transform:none}
#siteNav button.dim{opacity:.45}
#siteNav .tip{position:absolute;right:0;bottom:52px;white-space:nowrap;background:#3b2f2a;color:#fff;font:13px/1.45 "Jua","Apple SD Gothic Neo",sans-serif;padding:6px 10px;border-radius:10px;pointer-events:none;opacity:0;transform:translateY(4px);transition:.15s;text-align:left}
#siteNav .tip kbd{display:inline-block;background:#fff;color:#3b2f2a;border-radius:5px;padding:0 5px;margin:0 1px;font:12px/1.5 ui-monospace,Consolas,monospace}
#siteNav button:hover .tip,#siteNav button:focus-visible .tip{opacity:1;transform:none}
@media (max-width:600px){#siteNav{right:10px;bottom:10px;gap:5px}#siteNav button{width:38px;height:38px;font-size:15px}}
@media print{#siteNav{display:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const nav = window.navigation;
  const same = u => { try { return new URL(u).origin === location.origin } catch (_) { return false } };
  function canBack() {
    if (nav && nav.entries) { try { const i = nav.currentEntry.index, L = nav.entries(); return i > 0 && same(L[i - 1].url) } catch (_) { } }
    return history.length > 1 && !!document.referrer && same(document.referrer);
  }
  function canFwd() {
    if (nav && nav.entries) { try { const i = nav.currentEntry.index, L = nav.entries(); return i < L.length - 1 && same(L[i + 1].url) } catch (_) { } }
    return true;
  }
  const back = () => { if (canBack()) history.back() }, fwd = () => { if (canFwd()) history.forward() };
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });
  /* ⛶ 전체보기: 어느 메뉴에서든 화면 전체를 써요 (F 키로 켜고 끄기 — 글을 쓰는 칸에서는 그냥 글자가 써져요) */
  const de = document.documentElement;
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  const fsOk = () => !!(de.requestFullscreen || de.webkitRequestFullscreen);
  function fsToggle() {
    try {
      if (fsEl()) { const x = document.exitFullscreen || document.webkitExitFullscreen; if (x) { const q = x.call(document); if (q && q.catch) q.catch(() => { }) } return }
      const r = de.requestFullscreen || de.webkitRequestFullscreen; if (!r) { fsMsg(); return }
      const q = r.call(de); if (q && q.catch) q.catch(() => fsMsg());
    } catch (_) { fsMsg() }
  }
  function fsMsg() {
    let t = document.getElementById("siteFsMsg");
    if (!t) { t = document.createElement("div"); t.id = "siteFsMsg"; t.style.cssText = "position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:9100;background:#3b2f2a;color:#fff;padding:9px 14px;border-radius:12px;font:14px/1.5 'Jua','Apple SD Gothic Neo',sans-serif;max-width:90vw;text-align:center"; document.body.appendChild(t) }
    t.textContent = "이 브라우저에서는 전체보기를 쓸 수 없어요. (아이폰은 공유 → 홈 화면에 추가로 열면 화면 전체로 볼 수 있어요)";
    clearTimeout(t._h); t.style.display = "block"; t._h = setTimeout(() => { t.style.display = "none" }, 3500);
  }
  const FS_ON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    FS_OFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  function fsUpd() {
    const b = document.getElementById("navFs"); if (!b) return; const on = !!fsEl();
    b.querySelector(".ic").innerHTML = on ? FS_OFF : FS_ON; b.setAttribute("aria-label", (on ? "전체보기 끝내기" : "전체보기") + " (F)");
    b.querySelector(".tip").innerHTML = (on ? "전체보기 끝내기 " : "전체보기 ") + "<kbd>F</kbd>";
  }
  document.addEventListener("fullscreenchange", fsUpd); document.addEventListener("webkitfullscreenchange", fsUpd);
  function build() {
    if (document.getElementById("siteNav")) return;
    const w = document.createElement("div"); w.id = "siteNav"; w.setAttribute("aria-label", "화면 이동");
    w.innerHTML = '<button type="button" id="navFs" aria-label="전체보기 (F)"><span class="ic"></span><span class="tip">전체보기 <kbd>F</kbd></span></button>' +
      '<button type="button" id="navBack" aria-label="이전 화면 (Ctrl+Q)">◀<span class="tip">이전 화면으로 <kbd>Ctrl</kbd>+<kbd>Q</kbd></span></button>' +
      '<button type="button" id="navFwd" aria-label="다음 화면 (Ctrl+E)">▶<span class="tip">다시 앞 화면으로 <kbd>Ctrl</kbd>+<kbd>E</kbd><br><small style="opacity:.75">Ctrl+W는 브라우저의 ‘탭 닫기’ 키라 쓸 수 없어요</small></span></button>' +
      '<button type="button" id="navTop" aria-label="맨 위로">▲<span class="tip">맨 위로 <kbd>Home</kbd></span></button>';
    document.body.appendChild(w);
    w.querySelector("#navFs").onclick = fsToggle; if (!fsOk()) w.querySelector("#navFs").classList.add("dim"); fsUpd();
    w.querySelector("#navBack").onclick = back; w.querySelector("#navFwd").onclick = fwd; w.querySelector("#navTop").onclick = top;
    upd(); addEventListener("scroll", upd, { passive: true });
    if (nav && nav.addEventListener) nav.addEventListener("currententrychange", upd);
    addEventListener("pageshow", upd);
  }
  function upd() {
    const w = document.getElementById("siteNav"); if (!w) return;
    w.querySelector("#navBack").disabled = !canBack(); w.querySelector("#navFwd").disabled = !canFwd();
    w.querySelector("#navTop").classList.toggle("dim", (window.scrollY || document.documentElement.scrollTop) < 120);
  }
  addEventListener("keydown", e => {
    if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.repeat && !e.isComposing && (e.code === "KeyF" || (e.key || "").toLowerCase() === "f")) {
      const a = document.activeElement, tag = a && a.tagName;
      if (!(a && (a.isContentEditable || tag === "TEXTAREA" || tag === "SELECT" || (tag === "INPUT" && !/^(button|checkbox|radio|range|color|submit|reset)$/i.test(a.type))))) { e.preventDefault(); e.stopPropagation(); fsToggle(); return }
    }
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return; const k = (e.key || "").toLowerCase();
    if (k === "q" || e.code === "KeyQ") { e.preventDefault(); back() }
    else if (k === "e" || e.code === "KeyE") { e.preventDefault(); fwd() }
  }, true);
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
