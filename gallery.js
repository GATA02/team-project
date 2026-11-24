document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("main-header");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const article = document.querySelector(".wiki-article");

    // 스크롤 시 헤더 그림자 강조
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 30);
        });
    }

    // 검색 결과 표시 해제
    function clearMarks() {
        if (!article) return;
        article.querySelectorAll("mark.search-mark").forEach((m) => {
            const p = m.parentNode;
            p.replaceChild(document.createTextNode(m.textContent), m);
            p.normalize();
        });
    }

    // 문서 내 검색
    function runSearch(query) {
        clearMarks();
        const q = query.trim();
        if (!q || !article) return;

        const lower = q.toLowerCase();
        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                const tag = node.parentElement ? node.parentElement.tagName : "";
                if (["SCRIPT", "STYLE", "MARK", "INPUT", "BUTTON"].includes(tag)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.toLowerCase().includes(lower)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            }
        });

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");
        let first = null;

        nodes.forEach((textNode) => {
            const val = textNode.nodeValue;
            const frag = document.createDocumentFragment();
            let last = 0;
            val.replace(regex, (match, _g1, offset) => {
                if (offset > last) frag.appendChild(document.createTextNode(val.slice(last, offset)));
                const mark = document.createElement("mark");
                mark.className = "search-mark";
                mark.textContent = match;
                if (!first) first = mark;
                frag.appendChild(mark);
                last = offset + match.length;
                return match;
            });
            if (last < val.length) frag.appendChild(document.createTextNode(val.slice(last)));
            textNode.parentNode.replaceChild(frag, textNode);
        });

        if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            runSearch(searchInput.value);
        });
    }

    // 검색창 밖의 다른 화면을 클릭하면 검색 색 처리 해제
    document.addEventListener("click", (e) => {
        if (searchForm && searchForm.contains(e.target)) return;
        clearMarks();
    });
});
