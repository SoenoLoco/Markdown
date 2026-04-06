const routes = {};

export function addRoute(pattern, handler) {
  routes[pattern] = handler;
}

export function navigate(hash) {
  window.location.hash = hash; // вызовет hashchange
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute(); // вызываем сразу, чтобы обработать начальный URL
}

function handleRoute() {
  const hash = window.location.hash || "#/";
  const app = document.getElementById("app");
  // Точное совпадение (например #/ или #/about)

  if (routes[hash]) {
    routes[hash](app);
    updateActiveNav(hash);
    return;
  }

  // Динамические маршруты: #/post/:id
  for (const pattern in routes) {
    const regex = new RegExp(
      "^" + pattern.replace(/:([\w]+)/g, "([^/]+)") + "$",
    );
    const match = hash.match(regex);
    if (match) {
      routes[pattern](app, match[1]); // передаём id статьи
      return;
    }
  }

  // 404
  app.innerHTML = "<h2>404 — Страница не найдена</h2>";
}

function updateActiveNav(hash) {
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === hash);
  });
}
