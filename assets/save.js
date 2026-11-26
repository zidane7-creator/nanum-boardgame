/* 📥 파일 저장 — 휴대폰에서도 받을 수 있게
   · 컴퓨터·안드로이드 크롬: 바로 내려받기
   · 아이폰·카카오톡/네이버 등 앱 안 브라우저: 공유하기(사진·파일에 저장) → 안 되면 이미지를 길게 눌러 저장하는 화면 */
(function () {
  if (window.SAVEFILE) return;
  const ua = navigator.userAgent || "";
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const inApp = /KAKAOTALK|NAVER\(|Instagram|FBAN|FBAV|Line\/|everytimeApp|DaumApps|SamsungBrowser\/[0-9.]+ Mobile VR|wv\)/i.test(ua);
  function anchor(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 4000) }
  function viewer(blob, name) {
    const url = URL.createObjectURL(blob), img = /^image\//.test(blob.type), w = document.createElement("div");
    w.style.cssText = "position:fixed;inset:0;z-index:2147483600;background:rgba(20,14,10,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;gap:12px;font-family:Jua,'Apple SD Gothic Neo',sans-serif;color:#fff;text-align:center;overflow:auto";
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    w.innerHTML = (img ? '<img src="' + url + '" alt="" style="max-width:100%;max-height:68vh;border-radius:12px;background:#fff"><div style="font-size:18px">👆 이미지를 <b>길게 눌러</b> ‘이미지 저장’(사진에 추가)을 골라 주세요</div>'
      : '<div style="font-size:19px">📄 ' + esc(name) + '</div><a href="' + url + '" target="_blank" download="' + esc(name) + '" style="background:#e8503a;color:#fff;padding:10px 20px;border-radius:14px;text-decoration:none;font-size:18px">파일 열기</a><div style="font-size:14px;opacity:.85">열린 화면에서 공유(⬆️) → ‘파일에 저장’이나 다운로드를 눌러 주세요</div>')
      + (inApp ? '<div style="font-size:14px;opacity:.9;background:rgba(255,255,255,.15);padding:9px 12px;border-radius:10px;line-height:1.5">💡 카카오톡·네이버 같은 앱 안에서 열면 내려받기가 막힐 수 있어요.<br>오른쪽 위 <b>⋮ (더보기)</b> → <b>다른 브라우저로 열기</b>를 눌러 크롬·사파리에서 다시 받아 주세요.</div>' : "")
      + '<button type="button" style="font:inherit;font-size:16px;padding:8px 20px;border-radius:12px;border:2px solid #fff;background:transparent;color:#fff">닫기</button>';
    w.querySelector("button").onclick = () => { w.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000) };
    document.body.appendChild(w)
  }
  async function save(blob, name) {
    if (!blob) return;
    if (!(ios || android)) { anchor(blob, name); return }
    if (android && !inApp) { anchor(blob, name); return }
    try { const f = new File([blob], name, { type: blob.type || "application/octet-stream" }); if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: name }); return } }
    catch (e) { if (e && e.name === "AbortError") return }
    viewer(blob, name)
  }
  window.SAVEFILE = save;
})();
