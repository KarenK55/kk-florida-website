# KK Florida Photo Publisher (Brave / Windows)

Open **tools/gallery-builder.html** in Brave on your Windows computer.

## When adding new photographs

1. In GitHub Desktop, **Fetch origin** and **Pull origin** so your local \`data/gallery.json\` is current.
2. Upload your full-resolution photos to Picfair, write your titles/captions and add them to the appropriate public album(s).
3. Use your two Picfair **multi-album collector** bookmarks: collect the relevant albums, then download the combined JSON.
4. In \`tools/gallery-builder.html\`, select your *current* \`data/gallery.json\`, your Picfair JSON file(s), and your local original photos.
5. For each photo choose its Picfair match in the dropdown and verify it visually; the album can assign the KKFlorida category automatically. Choose the category manually if marked for review. **Never assume Picfair's filename matches the web image filename.**
6. Adjust web image size, thumbnail size, center watermark text/logo and opacity, then click **Create GitHub-ready ZIP**. This creates watermarked/resized copies; original files are untouched.
7. Extract the resulting ZIP into a temporary folder, then copy the extracted \`data\` and \`images\` folders over your local repository **merging** directories and **replacing only \`data/gallery.json\`**. Do not delete other existing folders.
8. Review the changes in GitHub Desktop, Commit, and **Push origin**. The existing GitHub workflow will rebuild category pages, \`sitemap.xml\`, and \`image-sitemap.xml\`. Cloudflare Pages handles the website deployment.
9. Pull again after GitHub Actions creates its automated regeneration commit.

## Safety

- This browser tool **does not publish or upload** to Picfair or GitHub; it only creates a local ZIP.
- You must manually match local photos to Picfair records. Duplicate Picfair IDs and image paths are blocked.
- For previously watermarked photos, switch the watermark off or you will apply it twice.
- If you are using an old local \`gallery.json\`, the exported ZIP could omit online changes. Always pull before opening the publisher.
- Default: web image 2,000 maximum dimension, thumbnail 520 maximum dimension, JPG output, centered "© KK Florida Photography" watermark. Select a transparent PNG watermark logo if desired.
- PNG input stays PNG when "Keep PNG transparency" is checked.
- For non-Picfair artwork, leave the Picfair match empty and enter the title, description, category and shopping URL yourself.
- New categories outside the current ten require a separate website change. The built-in categories correspond to the current static gallery generator.
