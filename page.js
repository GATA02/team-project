document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("main-header");
    const sections = document.querySelectorAll(".nw-section");
    const navLinks = document.querySelectorAll(".nw-nav a[href^='#']");
    const tocToggle = document.getElementById("toc-toggle");
    const tocList = document.getElementById("toc-list");
    const foldBtns = document.querySelectorAll(".nw-fold-btn");
    const navboxToggle = document.getElementById("navbox-toggle");
    const navboxBody = document.getElementById("navbox-body");
    const fnRefs = document.querySelectorAll(".nw-fn");
    const popover = document.getElementById("fn-popover");
    const searchForm = document.getElementById("nw-search-form");
    const searchInput = document.getElementById("nw-search-input");
    const article = document.querySelector(".nw-article");

    // 스크롤 시 헤더 그림자 강조
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 30);
    });

    // 현재 섹션 상단 메뉴 활성화
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            });
        },
        { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    sections.forEach((sec) => observer.observe(sec));

    // 목차 접기/펼치기
    if (tocToggle && tocList) {
        tocToggle.addEventListener("click", () => {
            const hidden = tocList.style.display === "none";
            tocList.style.display = hidden ? "" : "none";
            tocToggle.textContent = hidden ? "[접기]" : "[펼치기]";
        });
    }

    // 문단별 접기/펼치기
    foldBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const body = document.getElementById(btn.dataset.target);
            if (!body) return;
            const collapsed = body.classList.toggle("collapsed");
            btn.textContent = collapsed ? "[펼치기]" : "[접기]";
        });
    });

    // 관련 페이지 틀 접기/펼치기
    if (navboxToggle && navboxBody) {
        navboxToggle.addEventListener("click", () => {
            const collapsed = navboxBody.classList.toggle("collapsed");
            navboxToggle.textContent = collapsed ? "[펼치기]" : "[접기]";
        });
    }

    // 각주 호버/클릭 팝오버
    function hidePopover() {
        if (!popover) return;
        popover.hidden = true;
    }

    fnRefs.forEach((ref) => {
        const showNote = (e) => {
            e.stopPropagation();
            const fnId = ref.dataset.fn;
            const item = document.getElementById(`fn-item-${fnId}`);
            if (!item || !popover) return;

            popover.textContent = item.textContent;
            popover.hidden = false;

            const rect = ref.getBoundingClientRect();
            const left = Math.min(window.innerWidth - 316, Math.max(12, rect.left));
            const top = Math.min(window.innerHeight - 90, rect.bottom + 6);
            popover.style.left = `${left}px`;
            popover.style.top = `${top}px`;
        };

        ref.addEventListener("mouseenter", showNote);
        ref.addEventListener("click", (e) => {
            showNote(e);
            const targetItem = document.getElementById(`fn-item-${ref.dataset.fn}`);
            if (targetItem) {
                targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
        ref.addEventListener("mouseleave", hidePopover);
    });

    document.addEventListener("click", hidePopover);

    // 문서 내 검색 하이라이트
    function clearMarks() {
        if (!article) return;
        article.querySelectorAll("mark.nw-mark").forEach((m) => {
            const p = m.parentNode;
            p.replaceChild(document.createTextNode(m.textContent), m);
            p.normalize();
        });
    }

    function runSearch(query) {
        clearMarks();
        const q = query.trim();
        if (!q || !article) return;

        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                const tag = node.parentElement ? node.parentElement.tagName : "";
                if (["SCRIPT", "STYLE", "MARK", "INPUT", "BUTTON"].includes(tag)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.toLowerCase().includes(q.toLowerCase())
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
            if (!regex.test(val)) return;
            regex.lastIndex = 0;

            const frag = document.createDocumentFragment();
            let last = 0;
            val.replace(regex, (match, _g1, offset) => {
                if (offset > last) frag.appendChild(document.createTextNode(val.slice(last, offset)));
                const mark = document.createElement("mark");
                mark.className = "nw-mark";
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
});