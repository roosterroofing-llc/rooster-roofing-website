document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("input[name='tab']");
  const contents = document.querySelectorAll(".service-content");

  tabs.forEach((tab, i) => {
    tab.addEventListener("change", () => {
      contents.forEach(c => c.classList.remove("active"));
      const activeContent = document.getElementById("content" + (i + 1));
      if (activeContent) activeContent.classList.add("active");
    });
  });
});
