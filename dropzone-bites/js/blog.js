const blogPosts = [
  {
    id: "post-1",
    titleKey: "blog.samplepost.title",
    textKey: "blog.samplepost.text",
    dateKey: "blog.samplepost.date",
    category: "stories",
    htmlFile: ".posts/post-1.html",
  },
  {
    id: "post-2",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-2.html",
  },
  {
    id: "post-3",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-3.html",
  },
  {
    id: "post-4",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-4.html",
  },
  {
    id: "post-5",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "tips",
    htmlFile: ".posts/post-5.html",
  },
  {
    id: "post-6",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "stories",
    htmlFile: ".posts/post-6.html",
  },
  {
    id: "post-7",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-7.html",
  },
  {
    id: "post-8",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-8.html",
  },
  {
    id: "post-9",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-9.html",
  },
  {
    id: "post-10",
    titleKey: "blog.samplepost2.title",
    textKey: "blog.samplepost2.text",
    dateKey: "blog.samplepost2.date",
    category: "safety",
    htmlFile: ".posts/post-10.html",
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
      fetch(post.htmlFile)
        .then((res) => res.text())
        .then((html) => {
          container.innerHTML = html;

          const backLink = document.createElement("a");
          backLink.href = "#/blog";
          backLink.textContent =
            translations["blog.backtolist"] || "← Back to all posts";
          backLink.classList.add("blog-back");
          container.appendChild(backLink);
        })
        .catch((err) => {
          container.innerHTML = "<p>Post not found.</p>";
          console.error(err);
        });
    }
    return;
  }

  // lista szűrés kategória szerint
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
  console.log("🔍 Raw hash:", hash);

  if (hash.startsWith("#/blog/post/")) {
    const postId = hash.split("/")[3];
    console.log("📄 Post megjelenítése:", postId);
    renderBlogPosts(postId);
  } else if (hash.startsWith("#/blog/")) {
    const path = hash.replace(/^#\//, "");
    const parts = path.split("/");
    const category = parts[1] || "all";
    console.log("📂 Kategória listázása:", category);
    renderBlogPosts(null, category);
  } else {
    console.log("📚 Alapértelmezett lista (all)");
    renderBlogPosts();
  }
}

window.addEventListener("load", handleBlogRouting);
window.addEventListener("hashchange", handleBlogRouting);
