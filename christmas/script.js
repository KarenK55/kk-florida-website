(() => {
  const C = window.SITE_CONFIG;
  if (!C) {
    document.body.innerHTML = '<main style="font-family:system-ui;padding:40px"><h1>Missing site-config.js</h1><p>Make sure site-config.js is in the same folder as index.html.</p></main>';
    return;
  }

  const $ = (selector) => document.querySelector(selector);
  const setText = (selector, value = "") => { const el = $(selector); if (el) el.textContent = value; };
  const setLink = (selector, item = {}) => { const el = $(selector); if (!el) return; el.textContent = item.label || ""; el.href = item.url || "#"; };
  const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  // Colors
  const colors = C.colors || {};
  const colorVars = {ink:'--ink', inkSoft:'--ink-soft', paper:'--paper', white:'--white', muted:'--muted', line:'--line', primary:'--primary', primaryDark:'--primary-dark', accent:'--accent'};
  Object.entries(colorVars).forEach(([key, cssVar]) => colors[key] && document.documentElement.style.setProperty(cssVar, colors[key]));

  // SEO / browser metadata
  document.title = C.seo?.title || C.business?.name || document.title;
  const meta = (selector, value) => { const el = $(selector); if (el && value) el.setAttribute('content', value); };
  meta('meta[name="description"]', C.seo?.description);
  meta('meta[name="keywords"]', C.seo?.keywords);
  meta('meta[name="theme-color"]', colors.ink);
  meta('meta[property="og:title"]', C.seo?.title || C.business?.name);
  meta('meta[property="og:description"]', C.seo?.description);
  meta('meta[property="og:url"]', C.business?.domain);
  meta('meta[property="og:image"]', C.business?.socialImage && C.business?.domain ? new URL(C.business.socialImage, C.business.domain).href : C.business?.socialImage);
  if (C.business?.favicon) $('#site-favicon').href = C.business.favicon;

  // Announcement
  const announcement = $('#announcement');
  announcement.innerHTML = (C.announcement || []).map((x, i) => `${i ? '<span aria-hidden="true">•</span>' : ''}<span>${escapeHTML(x)}</span>`).join('');

  // Brand and navigation
  [$('#header-logo'), $('#footer-logo')].forEach(img => { if (img) { img.src = C.business.logo; img.alt = C.business.name; } });
  $('#brand-link').setAttribute('aria-label', `${C.business.name} home`);
  $('#site-nav').innerHTML = (C.navigation || []).map(item => `<a href="${escapeHTML(item.url)}">${escapeHTML(item.label)}</a>`).join('') + `<a class="nav-shop" href="${escapeHTML(C.business.shopUrl || '#')}">Visit shop</a>`;

  // Hero
  setText('#hero-eyebrow', C.hero?.eyebrow);
  setText('#hero-title', C.hero?.title);
  setText('#hero-highlight', C.hero?.highlight);
  setText('#hero-description', C.hero?.description);
  setLink('#hero-primary', C.hero?.primaryButton);
  setLink('#hero-secondary', C.hero?.secondaryButton);
  $('#hero-points').innerHTML = (C.hero?.points || []).map(x => `<span>${escapeHTML(x)}</span>`).join('');
  $('#hero-image-1').src = C.hero?.image1 || '';
  $('#hero-image-1').alt = C.hero?.image1Alt || '';
  $('#hero-image-2').src = C.hero?.image2 || '';
  $('#hero-image-2').alt = C.hero?.image2Alt || '';
  setText('#hero-badge', C.hero?.badge);

  // Ticker duplicated for seamless marquee
  const tickerItems = C.ticker || [];
  const tickerHTML = tickerItems.map(x => `<span>${escapeHTML(x)}</span><span>•</span>`).join('');
  $('#ticker-track').innerHTML = tickerHTML + tickerHTML;

  // Featured items
  setText('#featured-eyebrow', C.featured?.eyebrow);
  setText('#featured-heading', C.featured?.heading);
  setLink('#view-all', {label: C.featured?.viewAllLabel, url: C.featured?.viewAllUrl});
  const filterButtons = $('#filter-buttons');
  filterButtons.innerHTML = (C.featured?.filters || [{key:'all',label:'All'}]).map((f, i) => `<button class="filter-button ${i === 0 ? 'active' : ''}" data-filter="${escapeHTML(f.key)}" type="button">${escapeHTML(f.label)}</button>`).join('');

  function renderProducts(filter = 'all') {
    const items = filter === 'all' ? C.products : (C.products || []).filter(p => p.category === filter);
    $('#product-grid').innerHTML = (items || []).map(product => `
      <article class="product-card">
        <a href="${escapeHTML(product.url)}" aria-label="View ${escapeHTML(product.title)}">
          <div class="product-image-wrap">
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.title)}" loading="lazy">
            ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ''}
          </div>
          <div class="product-info">
            <p class="product-type">${escapeHTML(product.type)}</p>
            <h3 class="product-title">${escapeHTML(product.title)}</h3>
            <div class="product-bottom"><span class="product-price">${escapeHTML(product.price || '')}</span><span class="product-shop">View →</span></div>
          </div>
        </a>
      </article>`).join('');
  }
  filterButtons.addEventListener('click', event => {
    const button = event.target.closest('.filter-button');
    if (!button) return;
    filterButtons.querySelectorAll('.filter-button').forEach(x => x.classList.remove('active'));
    button.classList.add('active');
    renderProducts(button.dataset.filter);
  });
  renderProducts();

  // About
  setText('#about-eyebrow', C.about?.eyebrow);
  setText('#about-heading', C.about?.heading);
  $('#about-paragraphs').innerHTML = (C.about?.paragraphs || []).map(x => `<p>${escapeHTML(x)}</p>`).join('');
  setText('#about-link-label', C.about?.linkLabel);
  $('#about-link').href = C.about?.linkUrl || '#';
  setText('#visual-top', C.about?.visualTop);
  setText('#visual-middle', C.about?.visualMiddle);
  setText('#visual-highlight', C.about?.visualHighlight);

  // Values
  setText('#values-eyebrow', C.valuesSection?.eyebrow);
  setText('#values-heading', C.valuesSection?.heading);
  $('#value-grid').innerHTML = (C.values || []).map(v => `<article class="value-card"><span class="value-number">${escapeHTML(v.number)}</span><h3>${escapeHTML(v.title)}</h3><p>${escapeHTML(v.text)}</p></article>`).join('');

  // Collections
  setText('#collections-eyebrow', C.collectionsSection?.eyebrow);
  setText('#collections-heading', C.collectionsSection?.heading);
  $('#collection-grid').innerHTML = (C.collections || []).map((item, i) => `<a class="collection-card collection-${i+1}" href="${escapeHTML(item.url)}"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}"><span class="collection-overlay"></span><span class="collection-content"><small>${escapeHTML(item.label || 'COLLECTION')}</small><strong>${escapeHTML(item.title)}</strong><em>${escapeHTML(item.action || 'View now →')}</em></span></a>`).join('');

  // Final CTA
  setText('#cta-eyebrow', C.finalCallToAction?.eyebrow);
  setText('#cta-heading', C.finalCallToAction?.heading);
  setLink('#cta-button', {label:C.finalCallToAction?.buttonLabel, url:C.finalCallToAction?.buttonUrl});

  // Footer
  setText('#footer-description', C.footer?.description);
  setText('#footer-name', C.business?.name);
  setText('#footer-closing', C.footer?.closingLine);
  $('#footer-links').innerHTML = (C.footer?.columns || []).map(col => `<div><h3>${escapeHTML(col.heading)}</h3>${(col.links || []).map(link => `<a href="${escapeHTML(link.url)}">${escapeHTML(link.label)}</a>`).join('')}</div>`).join('');
  setText('#year', new Date().getFullYear());

  // Mobile menu
  const menuButton = $('.menu-button');
  const siteNav = $('#site-nav');
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('open', !isOpen);
  });
  siteNav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    siteNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
})();
