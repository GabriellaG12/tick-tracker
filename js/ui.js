// when you click a tab it hides the others tabs and shows clicked one
document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});
