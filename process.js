
 // 문서 검색 기능
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
      alert("검색어를 입력해주세요.");
      return;
    }

    const sections = document.querySelectorAll(
      ".wiki-article section"
    );

    let found = false;

    sections.forEach(function (section) {
      section.classList.remove("search-highlight");
    });

    for (const section of sections) {
      const content = section.textContent.toLowerCase();

      if (content.includes(keyword)) {
        section.querySelectorAll("details").forEach(detail => {
          if (detail.textContent.toLowerCase().includes(keyword))
            detail.open = true;
        });

        section.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        section.classList.add("search-highlight");

        found = true;
        break;
      }
    }

    if (!found) {
      alert("검색 결과가 없습니다.");
    }
  });
}


// 스크롤 시 헤더 그림자 강조
const mainHeader = document.querySelector("#main-header");

if (mainHeader) {
  window.addEventListener("scroll", function () {
    mainHeader.classList.toggle("scrolled", window.scrollY > 30);
  });
}


// 검색창 밖의 다른 화면을 클릭하면 검색 강조 해제
document.addEventListener("click", function (event) {
  if (searchForm && searchForm.contains(event.target)) return;

  document.querySelectorAll(".search-highlight").forEach(function (el) {
    el.classList.remove("search-highlight");
  });
});


// 목차 접기 / 펼치기
const tocToggle = document.querySelector("#toc-toggle");
const tocList = document.querySelector("#toc-list");

if (tocToggle && tocList) {
  tocToggle.addEventListener("click", function () {
    const hidden = tocList.style.display === "none";

    tocList.style.display = hidden ? "" : "none";
    tocToggle.textContent = hidden ? "[접기]" : "[펼치기]";
    tocToggle.setAttribute("aria-expanded", String(hidden));
  });
}


// 목차에서 닫힌 항목으로 이동할 때 자동 펼치기
document.querySelectorAll(".toc a").forEach(link =>
  link.addEventListener("click", () => {
    const target = document.getElementById(link.hash.slice(1));
    if (target && target.tagName === "DETAILS") target.open = true;
  })
);
