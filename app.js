
const products = [
  {
    title: "Florida Wildlife Photography",
    category: "Photography",
    description: "Browse original birds, butterflies, flowers, wildlife, alligators, and Everglades scenes.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=85",
    url: "https://flwildlife.picfair.com/",
    store: "Picfair"
  },
  {
    title: "Dragon Wagon",
    category: "Cartoon Art",
    description: "A dragonfly driving a wild cartoon wagon.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/t-shirt/95685868-dragon-wagon?store_id=4510655",
    store: "TeePublic"
  },
  {
    title: "Butterflies of Florida",
    category: "Butterflies",
    description: "A colorful Florida butterfly design for nature lovers.",
    image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/t-shirt/94480346-butterflies-of-florida?store_id=4510655",
    store: "TeePublic"
  },
  {
    title: "Groovy Truckin'",
    category: "Truck Art",
    description: "A bright psychedelic truck design with a carefree retro spirit.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/t-shirt/94219640-groovy-truckin?store_id=4510655",
    store: "TeePublic"
  },
  {
    title: "Happy 250th USA Florida",
    category: "Florida Pride",
    description: "A patriotic Florida-themed celebration design.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/t-shirt/94218939-happy-250th-usa-florida-celebration?store_id=4510655",
    store: "TeePublic"
  },
  {
    title: "Red Cardinal & Psalms 91:4",
    category: "Inspirational",
    description: "A comforting red cardinal design inspired by Psalms 91:4.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  },
  {
    title: "The Lord's Prayer at Sunset",
    category: "Inspirational",
    description: "A peaceful sunset design featuring the Lord's Prayer.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  },
  {
    title: "Let Your Dreams Be Your Wings",
    category: "Inspirational",
    description: "Butterfly and flower artwork with an uplifting message.",
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  },
  {
    title: "Dragonfly & Butterfly",
    category: "Nature Art",
    description: "A colorful garden composition featuring a dragonfly and butterfly.",
    image: "https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=85",
    url: "https://www.teepublic.com/user/kk-florida",
    store: "TeePublic"
  }
];

let activeCategory = "All";

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => navigation.classList.toggle("open"));
  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navigation.classList.remove("open"));
  });
}

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
          View on ${escapeHtml(product.store)}
        </a>
      </div>
    </article>
  `;
}

function renderFilters() {
  const filters = document.getElementById("filters");
  if (!filters) return;
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
  const searchBox = document.getElementById("searchBox");
  if (!gallery || !searchBox) return;
  const search = searchBox.value.trim().toLowerCase();

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
