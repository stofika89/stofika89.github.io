console.log("recipes.js betöltve"); // ellenőrzésre, hogy időben tölt-e be, majd ki kell vennem.

(function initRecipes() {
  function renderRecipeCards() {
    const t = window.translations || {};

    const recipes = [
      {
        titleKey: "recipe.chickenWrap",
        descKey: "desc.chickenWrap",
        img: "hamburger.jpg",
      },
      {
        titleKey: "recipe.oatmeal",
        descKey: "desc.oatmeal",
        img: "avocado-chicken.jpg",
      },
      {
        titleKey: "recipe.greenSmoothie",
        descKey: "desc.greenSmoothie",
        img: "steak.jpg",
      },
      {
        titleKey: "recipe.pancake",
        descKey: "desc.pancake",
        img: "pancake.jpg",
      },
      { titleKey: "recipe.salad", descKey: "desc.salad", img: "salad.png" },
      { titleKey: "recipe.pizza", descKey: "desc.pizza", img: "pizza.jpg" },
      { titleKey: "recipe.curry", descKey: "desc.curry", img: "curry.jpg" },
      { titleKey: "recipe.bowl", descKey: "desc.bowl", img: "bowl.jpg" },
      { titleKey: "recipe.cake", descKey: "desc.cake", img: "cake.png" },
    ];

    const grid = document.getElementById("recipes-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();

    recipes.forEach((recipe) => {
      const title = t[recipe.titleKey] || "...";
      const desc = t[recipe.descKey] || "";

      const card = document.createElement("a");
      card.href = "#/recipe-details";
      card.classList.add("recipe-card");

      card.innerHTML = `
        <img src="./img/recipes/${recipe.img}" alt="${title}" loading="lazy" />
        <h3>${title}</h3>
        <p>${desc}</p>
      `;

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  if (!window._recipeLangObserverAdded) {
    window.addEventListener("translationsUpdated", () => {
      renderRecipeCards();
    });
    window._recipeLangObserverAdded = true;
  }

  renderRecipeCards();
})();
