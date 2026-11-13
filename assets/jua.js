/* 주아체(Jua) 세로 가운데 맞춤 (사이트 공용)
   주아체는 한글이 글자 칸 가운데보다 약 0.07em 위에 그려진다 (윗선 0.80 / 아랫선 0.20, 한글 획은 0.78 ~ -0.045).
   그래서 버튼·이름표·말풍선 안의 글자가 늘 조금 떠 보인다.
   같은 글꼴 파일을 윗선 86.75% / 아랫선 13.25% 로 다시 등록해 글자 칸의 가운데가 한글 획의 가운데와 같아지게 한다.
   (줄 높이 합계는 100% 그대로라 배치는 바뀌지 않음) */
(function () {
  if (window.__juaCentered) return;
  window.__juaCentered = true;
  var URL = "https://fonts.googleapis.com/css2?family=Jua&display=swap";
  try {
    fetch(URL).then(function (r) { return r.ok ? r.text() : ""; }).then(function (css) {
      if (!css || css.indexOf("@font-face") < 0) return;
      css = css.replace(/@font-face\s*\{/g, "@font-face{ascent-override:86.75%;descent-override:13.25%;line-gap-override:0%;");
      var st = document.createElement("style");
      st.setAttribute("data-jua-center", "");
      st.textContent = css;
      document.head.appendChild(st);
    }).catch(function () {});
  } catch (e) {}
})();
