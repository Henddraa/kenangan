const featuredImg = document.getElementById("featured-img");
const BIG = "2.4fr",
  SMALL = "0.8fr",
  NORM = "1fr";

function setGrid(gallery, hoverCell) {
  if (!hoverCell) {
    gallery.style.setProperty("--c0", NORM);
    gallery.style.setProperty("--c1", NORM);
    gallery.style.setProperty("--c2", NORM);
    gallery.style.setProperty("--r0", NORM);
    gallery.style.setProperty("--r1", NORM);
    gallery.style.setProperty("--r2", NORM);
    return;
  }
  const c = +hoverCell.dataset.c;
  const r = +hoverCell.dataset.r;
  gallery.style.setProperty("--c0", c === 0 ? BIG : SMALL);
  gallery.style.setProperty("--c1", c === 1 ? BIG : SMALL);
  gallery.style.setProperty("--c2", c === 2 ? BIG : SMALL);
  gallery.style.setProperty("--r0", r === 0 ? BIG : SMALL);
  gallery.style.setProperty("--r1", r === 1 ? BIG : SMALL);
  gallery.style.setProperty("--r2", r === 2 ? BIG : SMALL);
}

document.querySelectorAll(".gallery").forEach((gallery) => {
  gallery.addEventListener("mouseover", (e) => {
    const cell = e.target.closest(".cell");
    if (cell) setGrid(gallery, cell);
  });

  gallery.addEventListener("mouseleave", () => {
    setGrid(gallery, null);
  });

  gallery.addEventListener("click", (e) => {
    // Prevent double-trigger from bubbling
    e.stopPropagation();
    const cell = e.target.closest(".cell");
    if (!cell) return;

    // Remove active from ALL cells
    document
      .querySelectorAll(".cell.active")
      .forEach((c) => c.classList.remove("active"));
    cell.classList.add("active");

    // Fade-swap featured image
    const src = cell.dataset.src + "?w=480&h=640&fit=crop";
    featuredImg.style.opacity = "0";
    setTimeout(() => {
      featuredImg.src = src;
      featuredImg.style.opacity = "1";
    }, 200);
  });
});
