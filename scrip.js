const API_KEY = "e6b41f08d7da4a79a6ff0f999e5e3226";
const newsContainer = document.getElementById("news-container");
const categoryButtons = document.querySelectorAll(".categories button");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const filterBtn = document.getElementById("filter-btn");
const filterPanel = document.getElementById("filter-panel");
const applyFilterBtn = document.getElementById("apply-filter");
const homeBtn = document.getElementById("home-btn");

let currentCategory = "general";
let filterSettings = { from: null, to: null, lang: "en" };

const categoryColors = {
  home: "#FFD700",
  general: "#FFD700",
  technology: "#00BFFF",
  politics: "#FF6347",
  sports: "#FF4500",
  entertainment: "#9370DB",
  business: "#32CD32",
  health: "#FF1493",
  science: "#20B2AA"
};

// ====== Fetch News ======
async function fetchNews(query = "") {
  newsContainer.innerHTML = "<p>Loading...</p>";
  let url = "";

  // Use /everything only if search or from/to filter
  if (query || filterSettings.from || filterSettings.to) {
    url = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&q=${query || currentCategory}&pageSize=30`;
    if (filterSettings.from) url += `&from=${filterSettings.from}`;
    if (filterSettings.to) url += `&to=${filterSettings.to}`;
    if (filterSettings.lang) url += `&language=${filterSettings.lang}`;
  } else {
    // Default top-headlines for category
    url = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&category=${currentCategory}&pageSize=30&language=en`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    newsContainer.innerHTML = "";
    data.articles.forEach(article => {
      const card = document.createElement("div");
      card.className = "news-card";

      const image = article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image";
      card.innerHTML = `
        <div class="img-container">
          <img src="${image}" alt="News Image" />
        </div>
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.description || "No description available."}</p>
          <div class="card-footer">
            <a href="${article.url}" target="_blank">Read more</a>
          </div>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    newsContainer.innerHTML = "<p>Error fetching news.</p>";
    console.error(error);
  }
}

// ====== Category Buttons ======
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => {
      b.classList.remove("active");
      b.style.background = "";
      b.style.color = "white";
    });
    homeBtn.style.background = "";
    homeBtn.style.color = "white";

    btn.classList.add("active");
    btn.style.background = categoryColors[btn.dataset.category] || "yellow";
    btn.style.color = "black";
    currentCategory = btn.dataset.category;

    filterSettings = { from: null, to: null, lang: "en" }; // reset filters
    searchInput.value = "";
    fetchNews();
  });
});

// ====== Home Button ======
homeBtn.addEventListener("click", () => {
  categoryButtons.forEach(b => {
    b.classList.remove("active");
    b.style.background = "";
    b.style.color = "white";
  });
  homeBtn.style.background = categoryColors.home;
  homeBtn.style.color = "black";

  currentCategory = "general";
  filterSettings = { from: null, to: null, lang: "en" };
  searchInput.value = "";
  fetchNews();
});

// ====== Search ======
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    categoryButtons.forEach(b => b.classList.remove("active"));
    homeBtn.style.background = "";
    homeBtn.style.color = "white";
    fetchNews(query);
  }
});

// ====== Filter Toggle ======
filterBtn.addEventListener("click", () => {
  filterPanel.classList.toggle("hidden");
});

// ====== Apply Filter ======
applyFilterBtn.addEventListener("click", () => {
  filterSettings.from = document.getElementById("from-date").value;
  filterSettings.to = document.getElementById("to-date").value;
  filterSettings.lang = document.getElementById("language").value;
  filterPanel.classList.add("hidden");
  fetchNews();
});

// ====== Initial Load ======
fetchNews();
