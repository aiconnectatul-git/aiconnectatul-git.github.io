# UtilityBox starter

A lightweight, static mini-tools directory designed for GitHub Pages. No framework, build step, database, or server required.

## Run locally
Open `index.html` in a browser. For best results, use a simple local static server (for example VS Code Live Server).

## Add a new mini-site
1. Create a folder under `apps/`, using the category/subcategory/tool pattern:
   `apps/<category>/<tool-name>/index.html`
2. Keep each mini app self-contained. Shared homepage styling is in `assets/`; mini apps can use `assets/css/tool.css` with the correct relative path.
3. Open `assets/js/catalog.js` and add a tool entry under the matching category and subcategory:
   `{ name: "My Tool", description: "What it does", path: "apps/category/tool-name/index.html", tags: ["keyword"] }`
4. Commit and push. The homepage will automatically include it.

## Deploy to GitHub Pages
1. Create a **public** GitHub repository (GitHub Free requires a public repository for Pages).
2. Upload the contents of this folder to the repository root.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site will publish at `https://<username>.github.io/<repository>/`. For a user site, name the repository `<username>.github.io`.

GitHub Pages hosts static HTML/CSS/JS. It does not run server-side code. Do not put secrets, private data, or API keys in this public repository.

## Design notes
- Responsive dark theme with mint accent
- Search across tool names, descriptions, categories and tags
- Category and subcategory grouping
- Keyboard shortcut: `Cmd/Ctrl + K` to search; `Esc` to clear
- Each mini app is a standalone HTML page and can have its own CSS/JS
