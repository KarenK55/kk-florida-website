# Searchable category pages
The 10 category directories are static HTML generated from `data/gallery.json`, with photographs, captions, canonical metadata, shopping links and internal links.
When a photo is added to `data/gallery.json`, the GitHub Actions workflow automatically regenerates the pages and sitemap on push (provided Actions can write to the repository).

To generate manually from the project folder with Node.js installed:
```
node tools/generate-category-pages.js
```
Commit and push the changed category files and sitemap. The homepage's original pop-up gallery functionality remains available.
