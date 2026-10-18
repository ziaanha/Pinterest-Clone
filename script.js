const starterPins = [
  ["Iced Coffee Aesthetic", "Food", "1.jpg"],
  ["Anime Drink Collection", "Food", "2.jpg"],
  ["Manga Collection", "Art", "3.jpg"],
  ["Study Planner Setup", "Study", "4.jpg"],
  ["Arencia Skincare", "Beauty", "5.jpg"],
  ["Skincare Product Collection", "Beauty", "6.jpg"],
  ["Minimalist Skincare", "Beauty", "7.jpg"],
  ["Coca-Cola Beauty Collection", "Beauty", "8.jpg"],
  ["Minimalist Perfume", "Beauty", "9.jpg"],
  ["Red Handbag Inspiration", "Fashion", "10.jpg"],
  ["Anime Gaming Setup", "Art", "11.jpg"],
  ["Japanese Breakfast", "Food", "12.jpg"],
  ["Gentle Monster Glasses", "Fashion", "13.jpg"],
  ["Skincare Essentials", "Beauty", "14.jpg"],
  ["Diet Coke Aesthetic", "Food", "15.jpg"],
  ["Paris Street Photography", "Travel", "16.jpg"],
  ["Paris Picnic Ideas", "Travel", "17.jpg"],
  ["Beige Winter Outfit", "Fashion", "18.jpg"],
  ["Burgundy Outfit Inspiration", "Fashion", "19.jpg"],
  ["Brown Street Style", "Fashion", "20.jpg"],
  ["Mary Jane Shoes", "Fashion", "21.jpg"],
  ["Japanese Meal Ideas", "Food", "22.jpg"],
  ["Cute Anime Keychains", "Art", "23.jpg"],
  ["Manga Collection Ideas", "Art", "24.jpg"],
  ["Japanese Noodle Bowl", "Food", "25.jpg"],
  ["Black Handbag Details", "Fashion", "26.jpg"],
  ["Japanese Street Views", "Travel", "27.jpg"],
  ["Anime Character Earrings", "Fashion", "28.jpg"]
];

let pins = starterPins.map((item, index) => ({
  id: `starter-${index}`,
  title: item[0],
  category: item[1],
  image: `./${item[2]}`,
  saved: false,
  userCreated: false
}));

let activeCategory = "All";
let showSavedOnly = false;
let previewUrl = null;

const pinGrid = document.querySelector("#pinGrid");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const categoryButtons = document.querySelectorAll(".category");
const createPinButton = document.querySelector("#createPin");
const createDialog = document.querySelector("#createDialog");
const closeDialog = document.querySelector("#closeDialog");
const pinForm = document.querySelector("#pinForm");
const imageInput = document.querySelector("#imageInput");
const imagePreview = document.querySelector("#imagePreview");
const pinTitle = document.querySelector("#pinTitle");
const pinCategory = document.querySelector("#pinCategory");
const emptyState = document.querySelector("#emptyState");
const feedTitle = document.querySelector("#feedTitle");
const resetButton = document.querySelector("#resetButton");
const savedButton = document.querySelector("#savedButton");
const homeButton = document.querySelector("#homeButton");
const exploreButton = document.querySelector("#exploreButton");
const profileButton = document.querySelector("#profileButton");

function renderPins() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredPins = pins.filter((pin) => {
    const matchesCategory =
      activeCategory === "All" || pin.category === activeCategory;

    const matchesSearch =
      pin.title.toLowerCase().includes(query) ||
      pin.category.toLowerCase().includes(query);

    const matchesSaved = !showSavedOnly || pin.saved;

    return matchesCategory && matchesSearch && matchesSaved;
  });

  pinGrid.innerHTML = "";
  emptyState.hidden = filteredPins.length > 0;

  if (showSavedOnly) {
    feedTitle.textContent = "Your saved pins";
  } else if (activeCategory === "All") {
    feedTitle.textContent = "Ideas for you";
  } else {
    feedTitle.textContent = `${activeCategory} ideas`;
  }

  clearSearch.style.display = query ? "block" : "none";

  filteredPins.forEach((pin) => {
    const card = document.createElement("article");
    card.className = "pin-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "pin-image-wrap";

    const image = document.createElement("img");
    image.className = "pin-image";
    image.src = pin.image;
    image.alt = pin.title;
    image.loading = "lazy";

    image.onerror = () => {
      image.alt = `Image unavailable: ${pin.title}`;
      image.style.minHeight = "150px";
      image.style.background = "#f5e5ed";
      image.style.objectFit = "contain";
    };

    imageWrap.appendChild(image);

    const content = document.createElement("div");
    content.className = "pin-card-content";

    const text = document.createElement("div");
    text.className = "pin-text";

    const title = document.createElement("h3");
    title.className = "pin-title";
    title.textContent = pin.title;

    const category = document.createElement("p");
    category.className = "pin-category";
    category.textContent = pin.category;

    text.append(title, category);

    const actions = document.createElement("div");
    actions.className = "pin-actions";

    const saveButton = document.createElement("button");
    saveButton.className = `save-button ${pin.saved ? "saved" : ""}`;
    saveButton.textContent = pin.saved ? "Saved" : "Save";

    saveButton.addEventListener("click", () => {
      pin.saved = !pin.saved;
      renderPins();
    });

    actions.appendChild(saveButton);

    if (pin.userCreated) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "×";
      deleteButton.title = "Delete pin";

      deleteButton.addEventListener("click", () => {
        pins = pins.filter((item) => item.id !== pin.id);

        if (pin.image.startsWith("blob:")) {
          URL.revokeObjectURL(pin.image);
        }

        renderPins();
      });

      actions.appendChild(deleteButton);
    }

    content.append(text, actions);
    card.append(imageWrap, content);
    pinGrid.appendChild(card);
  });
}

function selectCategory(categoryName) {
  activeCategory = categoryName;
  showSavedOnly = false;

  categoryButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.category === categoryName
    );
  });

  renderPins();
}

// Search pins
searchInput.addEventListener("input", renderPins);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderPins();
  searchInput.focus();
});

// Filter categories
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectCategory(button.dataset.category);
  });
});

// Home button
homeButton.addEventListener("click", () => {
  searchInput.value = "";
  selectCategory("All");
});

// Search shortcut
exploreButton.addEventListener("click", () => {
  searchInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// View saved pins
savedButton.addEventListener("click", () => {
  showSavedOnly = true;
  activeCategory = "All";

  categoryButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.category === "All"
    );
  });

  renderPins();
});

// Profile button
profileButton.addEventListener("click", () => {
  alert("Welcome to your inspiration board!");
});

// Reset filters
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  selectCategory("All");
});

// Open upload dialog
createPinButton.addEventListener("click", () => {
  pinForm.reset();
  imagePreview.hidden = true;

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  createDialog.showModal();
});

closeDialog.addEventListener("click", () => {
  createDialog.close();
});

// Close when clicking outside the dialog
createDialog.addEventListener("click", (event) => {
  if (event.target === createDialog) {
    createDialog.close();
  }
});

// Preview selected image
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  if (!file) {
    imagePreview.hidden = true;
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    imageInput.value = "";
    imagePreview.hidden = true;
    return;
  }

  previewUrl = URL.createObjectURL(file);
  imagePreview.src = previewUrl;
  imagePreview.hidden = false;
});

// Publish a pin
pinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = pinTitle.value.trim();
  const file = imageInput.files[0];
  const category = pinCategory.value;

  if (!title || !file) {
    alert("Please enter a title and choose an image.");
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  pins.unshift({
    id: `user-${Date.now()}`,
    title,
    category,
    image: imageUrl,
    saved: false,
    userCreated: true
  });

  searchInput.value = "";
  selectCategory("All");

  createDialog.close();
  pinForm.reset();
  imagePreview.hidden = true;

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }
});

// Show initial feed
renderPins();
