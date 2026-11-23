
// 협업 과정 접기 / 펼치기
const button = document.querySelector("#work-button");
const list = document.querySelector("#work-list");

if (button && list) {
  button.hidden = false;

  button.addEventListener("click", function () {
    list.hidden = !list.hidden;

    button.textContent = list.hidden
      ? "협업 과정 펼치기"
      : "협업 과정 접기";

    button.setAttribute(
      "aria-expanded",
      String(!list.hidden)
    );
  });
}


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
