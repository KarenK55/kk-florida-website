
const products = [
  {
    title: "Florida Birds",
    category: "Birds",
    description: "Cardinals, herons, egrets, hawks, and other Florida birds.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Butterflies",
    category: "Butterflies",
    description: "Colorful butterflies photographed in gardens and natural areas.",
    image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Dragonflies",
    category: "Dragonflies",
    description: "Close-up views of Florida dragonflies and damselflies.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Flowers & Plants",
    category: "Flowers",
    description: "Native plants, tropical blooms, and colorful Florida flowers.",
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Everglades Wildlife",
    category: "Everglades",
    description: "Wetlands, alligators, wading birds, and wild South Florida.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Florida Sunsets",
    category: "Sunsets",
    description: "Coastal light, colorful skies, and dramatic evening scenes.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Florida T-Shirts",
    category: "Apparel",
    description: "Florida-inspired artwork on shirts in many styles and colors.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  },
  {
    title: "Stickers & Gifts",
    category: "Gifts",
    description: "Stickers, mugs, phone cases, and gifts featuring original designs.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  },
  {
    title: "Inspirational Art",
    category: "Inspirational",
    description: "Faith-based and uplifting artwork for apparel and gifts.",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  }
];

let activeCategory = "All";

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
});

if (navigation) navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navigation.classList.remove("open"));
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function productCard(product) {
  return `
    <article class="gallery-card">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy">
      <div class="gallery-card-content">
        <span class="card-category">${escapeHtml(product.category)} • ${escapeHtml(product.store)}</span>
        <h3>${escapeHtml(product.title)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <a class="button" href="${escapeHtml(product.url)}" target="_blank" rel="noopener">
          Shop on ${escapeHtml(product.store)}
        </a>
      </div>
    </article>
  `;
}

function renderFilters() {
  const filters = document.getElementById("filters");
  const categories = ["All", ...new Set(products.map(product => product.category))];

  filters.innerHTML = categories.map(category => `
    <button class="filter-button ${category === activeCategory ? "active" : ""}" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </button>
  `).join("");

  filters.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderGallery();
    });
  });
}

function renderGallery() {
  const gallery = document.getElementById("galleryGrid");
  const search = document.getElementById("searchBox").value.trim().toLowerCase();

  const filtered = products.filter(product => {
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const text = `${product.title} ${product.category} ${product.description} ${product.store}`.toLowerCase();
    return categoryMatch && text.includes(search);
  });

  gallery.innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : "<p>No matching items were found.</p>";
}

const searchBox = document.getElementById("searchBox");
if (searchBox) {
  searchBox.addEventListener("input", renderGallery);
  renderFilters();
  renderGallery();
}
