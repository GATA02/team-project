const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const article = document.querySelector(".wiki-article");

// 이전 검색 표시 지우기
function clearMarks() {
  article.querySelectorAll("mark.search-mark").forEach((mark) => {
    mark.replaceWith(document.createTextNode(mark.textContent));
  });
  article.normalize(); // 쪼개진 텍스트 노드 다시 합치기
}

// 검색어가 들어간 텍스트를 <mark>로 감싸기
function highlight(keyword) {
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  const targets = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue.toLowerCase().includes(keyword.toLowerCase())) {
      targets.push(node);
    }
  }

  const regex = new RegExp(
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi"
  );

  targets.forEach((node) => {
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();
    let last = 0;

    text.replace(regex, (match, offset) => {
      frag.append(document.createTextNode(text.slice(last, offset)));
      const mark = document.createElement("mark");
      mark.className = "search-mark";
      mark.textContent = match;
      frag.append(mark);
      last = offset + match.length;
    });

    frag.append(document.createTextNode(text.slice(last)));
    node.replaceWith(frag);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMarks();

  const keyword = input.value.trim();
  if (!keyword) return;

  highlight(keyword);

  const first = article.querySelector("mark.search-mark");
  if (first) {
    first.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    alert("검색 결과가 없습니다.");
  }
});
