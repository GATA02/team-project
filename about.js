
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
