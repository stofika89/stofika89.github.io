const blogPosts = [
  {
    id: "post-1",
    titleKey: "blog.samplepost.title",
    textKey: "blog.samplepost.text",
    dateKey: "blog.samplepost.date",
    category: "stories",
    htmlFile: "posts/post-1.html",
    summaryKey: "blog.samplepost.summary",
  },
  {
    id: "post-2",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-2.html",
    summaryKey: "blog.samplepost2.summary",
  },
  {
    id: "post-3",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-3.html",
    summaryKey: "blog.samplepost3.summary",
  },
  {
    id: "post-4",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-4.html",
    summaryKey: "blog.samplepost4.summary",
  },
  {
    id: "post-5",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "tips",
    htmlFile: "posts/post-5.html",
    summaryKey: "blog.samplepost5.summary",
  },
  {
    id: "post-6",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "stories",
    htmlFile: "posts/post-6.html",
    summaryKey: "blog.samplepost6.summary",
  },
  {
    id: "post-7",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-7.html",
    summaryKey: "blog.samplepost7.summary",
  },
  {
    id: "post-8",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-8.html",
    summaryKey: "blog.samplepost8.summary",
  },
  {
    id: "post-9",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-9.html",
    summaryKey: "blog.samplepost9.summary",
  },
  {
    id: "post-10",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: "posts/post-10.html",
    summaryKey: "blog.samplepost10.summary",
  },
];

function renderBlogPosts(postId = null, category = "all") {
  const container = document.getElementById("blog-content");
  if (!container || !window.translations) return;

  container.innerHTML = "";

  let postsToRender = blogPosts;

  if (postId) {
    const post = blogPosts.find((p) => p.id === postId);

    if (post && post.htmlFile) {
      fetch(post.htmlFile, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) throw new Error("Post HTML file not found.");
          return fetch(post.htmlFile).then((r) => r.text());
        })
        .then((html) => {
          container.innerHTML = html;

          const backLink = document.createElement("a");
          backLink.href = "#/blog";
          backLink.textContent =
            translations["blog.backtolist"] || "← Back to all posts";
          backLink.classList.add("blog-back");
          container.appendChild(backLink);

          updateTexts();
        })
        .catch((err) => {
          console.warn("Post not found:", err);
          loadComponent("app", "./pages/404.html");
        });
    } else {
      loadComponent("app", "./pages/404.html");
    }

    return;
  }

  // Ha nem egy adott cikket kértek le
  if (category && category !== "all") {
    postsToRender = blogPosts.filter((post) => post.category === category);
  }

  postsToRender.forEach((post) => {
    const article = document.createElement("article");
    article.classList.add("blog-post");

    article.innerHTML = `
      <h3>
        <a href="#/blog/post/${post.id}">
          ${translations[post.titleKey] || post.titleKey}
        </a>
      </h3>
      <p>${translations[post.summaryKey] || ""}</p>
      <p class="meta">
        <i class="fa-solid fa-calendar-days"></i>
        ${translations[post.dateKey] || post.dateKey}
      </p>
    `;

    container.appendChild(article);
  });
}

function handleBlogRouting() {
  const hash = location.hash;
  if (hash.startsWith("#/blog/post/")) {
    const postId = hash.split("/")[3];
    renderBlogPosts(postId);
  } else if (hash.startsWith("#/blog/")) {
    const parts = hash.replace(/^#\//, "").split("/");
    const category = parts[1] || "all";
    renderBlogPosts(null, category);
  } else {
    renderBlogPosts();
  }
}

window.addEventListener("load", handleBlogRouting);
window.addEventListener("hashchange", handleBlogRouting);
