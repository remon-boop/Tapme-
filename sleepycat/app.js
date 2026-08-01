/* ============================================================
   SleepyCat — app logic (vanilla JS, no build step)
   Unified state in localStorage · theming · branding · admin CRUD
   No AI / matching — direct contact only.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = (p) => p + Math.random().toString(36).slice(2, 9);
  const GRADS = ['linear-gradient(135deg,#ffd7ba,#ffb385)','linear-gradient(135deg,#d9c7ff,#b49dff)','linear-gradient(135deg,#bde7d6,#8fe0bf)','linear-gradient(135deg,#ffe3a8,#ffcf6b)','linear-gradient(135deg,#ffc9c9,#ff9a9a)','linear-gradient(135deg,#c3e5ff,#93cdff)'];
  const CATS = ['🐱','🐈','🐈‍⬛','😺','😸','😻','🙀','😽'];
  const FOOD_EMO = ['🍗','🐟','🍖','🥣','🐾','🥫'];
  const ACCENTS = [
    { name: 'Coral', hex: '#ff6b4a' }, { name: 'Peach', hex: '#ff9a5c' }, { name: 'Bubblegum', hex: '#ff6fae' },
    { name: 'Grape', hex: '#8b6ff0' }, { name: 'Ocean', hex: '#2aa7d8' }, { name: 'Mint', hex: '#18b98a' }, { name: 'Sunflower', hex: '#f0a91e' }
  ];

  /* ---------- default content ---------- */
  const DEFAULTS = () => ({
    v: 2,
    brand: { name: 'SleepyCat', logoType: 'emoji', logoEmoji: '🐱', logoImage: '' },
    hero: {
      pill: '😴 no algorithms · just cats',
      title: 'A cozy little corner for <span class="grad">cat people</span>.',
      lede: "Browse breeds, adopt a floof, help find lost kitties, and rate the food they actually deign to eat. Contact owners directly — no matching magic, just vibes.",
      cat: '🐈', bg: ''
    },
    theme: { accent: '#ff6b4a', mode: 'system' },
    footer: 'Made with 🧶 for cat people · SleepyCat',
    pin: '1234',
    saved: [],
    content: {
      breed: [
        { id: 'b1', name: 'Mochi', breed: 'British Shorthair', age: '2 yrs', vax: true, loc: 'Dhaka', emoji: '😺', img: '', desc: 'Chunky, calm and endlessly cuddly. Loves sunbeams and being carried like a loaf.', owner: 'Rima', phone: '+8801700000001' },
        { id: 'b2', name: 'Pixel', breed: 'Bengal', age: '1 yr', vax: true, loc: 'Chittagong', emoji: '😸', img: '', desc: 'Wild rosettes, wilder energy. A tiny leopard who thinks the curtains are a jungle gym.', owner: 'Tanvir', phone: '+8801700000002' },
        { id: 'b3', name: 'Luna', breed: 'Persian', age: '3 yrs', vax: true, loc: 'Sylhet', emoji: '😻', img: '', desc: 'A fluffy cloud with opinions. Requires daily brushing and constant admiration.', owner: 'Nabila', phone: '+8801700000003' },
        { id: 'b4', name: 'Sootie', breed: 'Bombay', age: '4 yrs', vax: false, loc: 'Dhaka', emoji: '🐈‍⬛', img: '', desc: 'A little panther with copper eyes. Velvet coat, dog-like loyalty, huge appetite.', owner: 'Farhan', phone: '+8801700000004' },
        { id: 'b5', name: 'Ginger', breed: 'Maine Coon', age: '2 yrs', vax: true, loc: 'Khulna', emoji: '🦁', img: '', desc: 'Gentle giant, the size of a small dog. Chirps instead of meows. Absolute unit.', owner: 'Sadia', phone: '+8801700000005' },
        { id: 'b6', name: 'Boba', breed: 'Scottish Fold', age: '1 yr', vax: true, loc: 'Dhaka', emoji: '😽', img: '', desc: 'Folded ears, folded into your heart. Sits like a person, judges like one too.', owner: 'Imran', phone: '+8801700000006' },
        { id: 'b7', name: 'Miso', breed: 'Siamese', age: '5 yrs', vax: true, loc: 'Rajshahi', emoji: '😼', img: '', desc: 'Chatty, clever and very loud about dinner being 4 minutes late. Blue-eyed diva.', owner: 'Anika', phone: '+8801700000007' },
        { id: 'b8', name: 'Cloud', breed: 'Ragdoll', age: '2 yrs', vax: true, loc: 'Chittagong', emoji: '😻', img: '', desc: 'Goes fully limp when you pick him up. Pure floppy affection in cat form.', owner: 'Zayed', phone: '+8801700000008' }
      ],
      adopt: [
        { id: 'a1', name: 'Peanut', breed: 'Domestic Shorthair', age: '8 mo', vax: true, loc: 'Dhaka', emoji: '😺', img: '', desc: 'Rescued from a rooftop. Now the friendliest goofball. Great with kids & other cats.', owner: 'Paws Shelter', phone: '+8801711111111' },
        { id: 'a2', name: 'Coco', breed: 'Tuxedo', age: '1.5 yrs', vax: true, loc: 'Chittagong', emoji: '🐈‍⬛', img: '', desc: 'Dressed for a wedding 24/7. Litter-trained, spayed, ready for a calm home.', owner: 'Nadia', phone: '+8801711111112' },
        { id: 'a3', name: 'Marmalade', breed: 'Orange Tabby', age: '3 yrs', vax: true, loc: 'Sylhet', emoji: '😸', img: '', desc: 'One brain cell, infinite love. Will headbutt you until you accept the friendship.', owner: 'Kittyhaven', phone: '+8801711111113' },
        { id: 'a4', name: 'Shadow', breed: 'Grey DSH', age: '6 mo', vax: false, loc: 'Dhaka', emoji: '🐱', img: '', desc: 'Shy at first, velcro-cat once he trusts you. Needs a patient, quiet family.', owner: 'Rafi', phone: '+8801711111114' },
        { id: 'a5', name: 'Honey', breed: 'Calico', age: '2 yrs', vax: true, loc: 'Khulna', emoji: '😻', img: '', desc: 'Tri-color queen. Independent but loves an evening lap session. Spayed & chipped.', owner: 'StreetCats BD', phone: '+8801711111115' },
        { id: 'a6', name: 'Pumpkin', breed: 'Orange Tabby', age: '4 mo', vax: true, loc: 'Dhaka', emoji: '😽', img: '', desc: 'A tiny orange menace with the zoomies. Bottle-raised, adores humans.', owner: 'Mariam', phone: '+8801711111116' }
      ],
      lost: [
        { id: 'l1', name: 'Simba', color: 'Orange & white', loc: 'Dhanmondi, Dhaka', time: '2 days ago', emoji: '😿', img: '', desc: 'Slipped out the balcony. Answers to Simba, has a red collar with a bell. Very food-motivated.', owner: 'Sabbir', phone: '+8801722222221' },
        { id: 'l2', name: 'Nova', color: 'Grey tabby', loc: 'Agrabad, Chittagong', time: '5 days ago', emoji: '🙀', img: '', desc: 'Micro-chipped. Shy around strangers, may be hiding under cars. Please do not chase.', owner: 'Elham', phone: '+8801722222222' },
        { id: 'l3', name: 'Coco', color: 'Black', loc: 'Uttara Sector 7, Dhaka', time: '1 week ago', emoji: '🐈‍⬛', img: '', desc: 'Small black cat, white chest patch, one notched ear. Reward for safe return 🙏', owner: 'Junaid', phone: '+8801722222223' }
      ],
      food: [
        { id: 'f1', food: 'Royal Canin Kitten', brand: 'Royal Canin', rating: 5, emoji: '🍗', text: "My kittens demolish this and their coats got noticeably shinier in 3 weeks. Kibble size is perfect for tiny mouths. Pricey but worth it.", by: 'Rima', date: 'Jul 2026' },
        { id: 'f2', food: 'Whiskas Tuna Pouch', brand: 'Whiskas', rating: 4, emoji: '🐟', text: 'Great value wet food, my two go nuts for the tuna. Marked down one star because the gravy can be a bit watery.', by: 'Tanvir', date: 'Jul 2026' },
        { id: 'f3', food: 'Sheba Prime Chicken', brand: 'Sheba', rating: 5, emoji: '🍖', text: 'The fussiest cat I own actually finished a whole tray. Smells rich, no weird fillers. This is our new treat-night food.', by: 'Nabila', date: 'Jun 2026' },
        { id: 'f4', food: 'Me-O Persian Adult', brand: 'Me-O', rating: 3, emoji: '🥣', text: 'Affordable and my cats eat it fine, but I noticed more shedding vs premium brands. Fine as a budget everyday option.', by: 'Farhan', date: 'Jun 2026' },
        { id: 'f5', food: 'Purina Fancy Feast', brand: 'Purina', rating: 4, emoji: '🐾', text: 'Classic for a reason. So many flavors that even picky Miso stays interested. Wish the cans were slightly bigger.', by: 'Anika', date: 'May 2026' },
        { id: 'f6', food: 'Reflex Plus Sterilised', brand: 'Reflex', rating: 2, emoji: '🥫', text: 'My neutered cat just would not touch this one, and it upset his stomach. Might work for others but not for us.', by: 'Zayed', date: 'May 2026' }
      ]
    }
  });

  /* ---------- state persistence ---------- */
  const KEY = 'sleepycat.state.v2';
  let state;
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) { state = deepMerge(DEFAULTS(), JSON.parse(raw)); return; } } catch {}
    state = DEFAULTS();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast('Storage full — try smaller images'); } }
  function deepMerge(base, over) {
    if (Array.isArray(over)) return over;
    if (over && typeof over === 'object') { const out = { ...base }; for (const k in over) out[k] = deepMerge(base ? base[k] : undefined, over[k]); return out; }
    return over === undefined ? base : over;
  }
  load();

  /* ---------- THEME ---------- */
  const themeToggle = $('#themeToggle');
  function systemDark() { return window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches; }
  function applyTheme() {
    const mode = state.theme.mode;
    const root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    root.style.setProperty('--accent', state.theme.accent);
    root.style.setProperty('--accent-press', shade(state.theme.accent, -14));
    root.style.setProperty('--accent-ink', pickInk(state.theme.accent));
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', state.theme.accent);
  }
  function currentlyDark() {
    const m = state.theme.mode; return m === 'dark' || (m === 'system' && systemDark());
  }
  themeToggle.addEventListener('click', () => {
    state.theme.mode = currentlyDark() ? 'light' : 'dark';
    applyTheme(); save(); syncThemeSeg();
  });
  // hex utils
  function hx(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; }
  function shade(hex, pct) { const [r,g,b] = hx(hex); const f = (v) => Math.max(0, Math.min(255, Math.round(v + (pct/100)*255))); return '#' + [f(r),f(g),f(b)].map(v => v.toString(16).padStart(2,'0')).join(''); }
  function pickInk(hex) { const [r,g,b] = hx(hex); const lum = (0.299*r + 0.587*g + 0.114*b); return lum > 165 ? '#2c2320' : '#ffffff'; }

  /* ---------- BRANDING ---------- */
  function applyBrand() {
    $('#brandName').textContent = state.brand.name;
    $('#loaderName').firstChild.textContent = state.brand.name;
    const mark = $('#brandMark');
    if (state.brand.logoType === 'image' && state.brand.logoImage) mark.innerHTML = `<img src="${esc(state.brand.logoImage)}" alt="">`;
    else mark.textContent = state.brand.logoEmoji || '🐱';
    $('#heroPill').innerHTML = esc(state.hero.pill);
    $('#heroTitle').innerHTML = state.hero.title; // may contain <span class="grad">
    $('#heroLede').textContent = state.hero.lede;
    $('#heroCat').textContent = state.hero.cat || '🐈';
    const hero = $('#hero'), bg = $('#heroBg');
    if (state.hero.bg) { bg.hidden = false; bg.style.backgroundImage = `url(${state.hero.bg})`; hero.classList.add('has-banner'); }
    else { bg.hidden = true; bg.style.backgroundImage = ''; hero.classList.remove('has-banner'); }
    $('#footerText').textContent = state.footer;
    document.title = state.brand.name + ' — cozy home for cat people';
  }
  function renderStats() {
    const c = state.content;
    const stats = [
      { n: c.breed.length + c.adopt.length, l: 'cats listed' },
      { n: c.adopt.length, l: 'up for adoption' },
      { n: c.lost.length, l: 'lost & searching' },
      { n: c.food.length, l: 'food reviews' }
    ];
    $('#homeStats').innerHTML = stats.map(s => `<div class="stat"><b>${s.n}</b><span>${s.l}</span></div>`).join('');
  }

  /* ---------- LOADER ---------- */
  const loader = $('#loader');
  const showLoader = () => loader.classList.remove('hide');
  const hideLoader = () => loader.classList.add('hide');
  window.addEventListener('load', () => setTimeout(hideLoader, 1000));
  setTimeout(hideLoader, 2500);

  /* ---------- TOAST ---------- */
  let toastTimer;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400); }

  /* ---------- NAVIGATION ---------- */
  const views = { home:$('#view-home'), breed:$('#view-breed'), adopt:$('#view-adopt'), lost:$('#view-lost'), food:$('#view-food'), saved:$('#view-saved'), admin:$('#view-admin') };
  let current = 'home';
  function go(section) {
    if (!views[section] || section === current) { closeMobileNav(); return; }
    showLoader(); closeMobileNav();
    setTimeout(() => {
      views[current].hidden = true; views[section].hidden = false;
      views[section].style.animation = 'none'; void views[section].offsetWidth; views[section].style.animation = '';
      current = section; renderSection(section); updateNavActive();
      window.scrollTo({ top: 0, behavior: 'auto' }); hideLoader();
    }, 600);
  }
  const updateNavActive = () => $$('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.section === current));
  function renderSection(s) {
    if (s === 'breed') renderCats('breedGrid', 'breed');
    else if (s === 'adopt') renderCats('adoptGrid', 'adopt');
    else if (s === 'lost') renderLost();
    else if (s === 'food') renderFood();
    else if (s === 'saved') renderSaved();
    else if (s === 'admin') renderAdmin();
    else if (s === 'home') renderStats();
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-section]'); if (b) { e.preventDefault(); go(b.dataset.section); } });

  const menuToggle = $('#menuToggle'), mobileNav = $('#mobileNav');
  const closeMobileNav = () => { menuToggle.classList.remove('open'); mobileNav.classList.remove('open'); };
  menuToggle.addEventListener('click', () => { menuToggle.classList.toggle('open'); mobileNav.classList.toggle('open'); });

  /* ---------- PHOTO helper ---------- */
  function photo(item, i, badge) {
    if (item.img) return `<div class="card-photo" style="background-image:url(${esc(item.img)})">${badge || ''}<button class="like-btn ${saveState(item.id)?'liked':''}" data-like="${item.id}" aria-label="Save">${saveState(item.id)?'♥':'♡'}</button></div>`;
    return `<div class="card-photo" style="background:${GRADS[i % GRADS.length]}">${badge || ''}<button class="like-btn ${saveState(item.id)?'liked':''}" data-like="${item.id}" aria-label="Save">${saveState(item.id)?'♥':'♡'}</button><span class="emoji">${item.emoji || '🐱'}</span></div>`;
  }
  function photoLost(item, i, badge) {
    if (item.img) return `<div class="card-photo" style="background-image:url(${esc(item.img)})">${badge}</div>`;
    return `<div class="card-photo" style="background:${GRADS[(i+2) % GRADS.length]}">${badge}<span class="emoji">${item.emoji || '😿'}</span></div>`;
  }
  const saveState = (id) => state.saved.includes(id);

  /* ---------- CAT CARDS ---------- */
  function catCard(c, i) {
    const card = el('article', 'card'); card.style.animationDelay = (i % 12) * 0.045 + 's';
    const isSaved = saveState(c.id);
    const badge = c.vax ? '<span class="badge vax">💉 Vaccinated</span>' : '<span class="badge novax">Not vaccinated</span>';
    card.innerHTML = photo(c, i, badge) + `
      <div class="card-body">
        <h3 class="card-title">${esc(c.name)}</h3>
        <p class="card-meta">${esc(c.breed)}</p>
        <div class="chips"><span class="chip age">${esc(c.age)}</span><span class="chip loc">${esc(c.loc)}</span></div>
        <p class="card-desc">${esc(c.desc)}</p>
        <div class="card-actions">
          <button class="btn-contact" data-contact="${c.id}">Message ${esc((c.owner||'owner').split(' ')[0])}</button>
          <button class="btn-save-out ${isSaved?'saved':''}" data-like="${c.id}">${isSaved?'♥ Saved':'♡ Save'}</button>
        </div>
      </div>`;
    return card;
  }
  function renderCats(gridId, kind, list) {
    const grid = $('#' + gridId); grid.innerHTML = '';
    const data = list || state.content[kind];
    if (!data.length) { grid.appendChild(emptyState('No cats match that search 🐾', 'Try a different breed or city.')); return; }
    data.forEach((c, i) => grid.appendChild(catCard(c, i)));
  }
  function renderSaved() {
    const grid = $('#savedGrid'); grid.innerHTML = '';
    const all = [...state.content.breed, ...state.content.adopt];
    const list = state.saved.map(id => all.find(c => c.id === id)).filter(Boolean);
    if (!list.length) { grid.appendChild(emptyState('No saved cats yet', 'Tap the ♥ on any breed or adopt listing to keep it here.')); return; }
    list.forEach((c, i) => grid.appendChild(catCard(c, i)));
  }
  const emptyState = (t, s) => el('div', 'empty', `<span class="em">😽</span><h3>${esc(t)}</h3><p>${esc(s)}</p>`);

  /* like / save */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-like]'); if (!b) return;
    const id = b.dataset.like; const now = !saveState(id);
    if (now) state.saved.push(id); else state.saved = state.saved.filter(x => x !== id);
    save(); updateSavedCount(); toast(now ? 'Saved to your cats ♥' : 'Removed from saved');
    $$(`[data-like="${CSS.escape(id)}"]`).forEach(elm => {
      if (elm.classList.contains('like-btn')) { elm.classList.toggle('liked', now); elm.textContent = now ? '♥' : '♡'; elm.classList.remove('pop'); void elm.offsetWidth; elm.classList.add('pop'); }
      else { elm.classList.toggle('saved', now); elm.textContent = now ? '♥ Saved' : '♡ Save'; }
    });
    if (current === 'saved') renderSaved();
  });
  const updateSavedCount = () => { $('#savedCount').textContent = state.saved.length; };

  /* ---------- LOST ---------- */
  function renderLost(filter) {
    const grid = $('#lostGrid'); grid.innerHTML = ''; let data = state.content.lost;
    if (filter) { const q = filter.toLowerCase(); data = data.filter(c => [c.name,c.color,c.loc,c.desc].join(' ').toLowerCase().includes(q)); }
    if (!data.length) { grid.appendChild(emptyState('No lost cats found here', 'That could be good news! Try another search.')); return; }
    data.forEach((c, i) => {
      const card = el('article', 'card'); card.style.animationDelay = (i % 12) * 0.045 + 's';
      card.innerHTML = photoLost(c, i, '<span class="badge lost">🔍 Lost</span>') + `
        <div class="card-body">
          <h3 class="card-title">${esc(c.name)}</h3>
          <p class="card-meta">${esc(c.color)}</p>
          <div class="chips"><span class="chip loc">${esc(c.loc)}</span><span class="chip time">${esc(c.time)}</span></div>
          <p class="card-desc">${esc(c.desc)}</p>
          <div class="card-actions"><button class="btn-contact" data-contact-lost="${c.id}">I've seen this cat</button></div>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ---------- FOOD ---------- */
  const starHTML = (n) => { let s = ''; for (let i=1;i<=5;i++) s += `<span class="${i<=n?'on':'off'}">★</span>`; return s; };
  function renderFood() {
    const list = $('#foodList'); const q = ($('#foodSearch').value || '').toLowerCase(); const sort = $('#foodSort').value;
    let data = state.content.food.filter(f => [f.food,f.brand,f.text].join(' ').toLowerCase().includes(q));
    if (sort === 'top') data = [...data].sort((a,b) => b.rating - a.rating);
    else if (sort === 'low') data = [...data].sort((a,b) => a.rating - b.rating);
    list.innerHTML = '';
    if (!data.length) { list.appendChild(emptyState('No reviews match', 'Be the first to review it!')); return; }
    data.forEach((f, i) => {
      const r = el('article', 'review'); r.style.animationDelay = (i % 12) * 0.045 + 's';
      r.innerHTML = `
        <div class="review-top">
          <div class="food-avatar" style="background:${GRADS[i % GRADS.length]}">${f.emoji || '🍽️'}</div>
          <div><div class="review-food">${esc(f.food)}</div><div class="review-brand">${esc(f.brand)}</div></div>
          <div class="stars">${starHTML(f.rating)}<span class="rating-num">${Number(f.rating).toFixed(1)}</span></div>
        </div>
        <p class="review-text">“${esc(f.text)}”</p>
        <div class="review-foot"><span>— ${esc(f.by)}</span><span>${esc(f.date)}</span></div>`;
      list.appendChild(r);
    });
  }

  /* ---------- SEARCH / FILTER ---------- */
  function filterCats(gridId, kind) {
    const input = $(`.search[data-grid="${gridId}"]`); const sel = $(gridId === 'breedGrid' ? '#breedFilter' : '#adoptFilter');
    const q = (input.value || '').toLowerCase(); const fv = sel.value;
    renderCats(gridId, kind, state.content[kind].filter(c => (fv === 'all' || c.breed === fv) && [c.name,c.breed,c.loc,c.desc].join(' ').toLowerCase().includes(q)));
  }
  $$('.search[data-grid]').forEach(input => {
    const g = input.dataset.grid;
    input.addEventListener('input', () => { if (g === 'breedGrid') filterCats('breedGrid','breed'); else if (g === 'adoptGrid') filterCats('adoptGrid','adopt'); else if (g === 'lostGrid') renderLost(input.value); });
  });
  function populateFilters() {
    [['#breedFilter','breed'],['#adoptFilter','adopt']].forEach(([sel, kind]) => {
      const cur = $(sel).value;
      const breeds = [...new Set(state.content[kind].map(c => c.breed))].sort();
      $(sel).innerHTML = '<option value="all">All breeds</option>' + breeds.map(b => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
      if (cur && [...$(sel).options].some(o => o.value === cur)) $(sel).value = cur;
    });
  }
  $('#breedFilter').addEventListener('change', () => filterCats('breedGrid','breed'));
  $('#adoptFilter').addEventListener('change', () => filterCats('adoptGrid','adopt'));
  $('#foodSearch').addEventListener('input', renderFood);
  $('#foodSort').addEventListener('change', renderFood);

  /* ---------- MODAL ---------- */
  const modalRoot = $('#modalRoot'), modalContent = $('#modalContent');
  function openModal(node) { modalContent.innerHTML = ''; modalContent.appendChild(node); modalRoot.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModal() { modalRoot.hidden = true; document.body.style.overflow = ''; modalContent.innerHTML = ''; }
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modalRoot.hidden) closeModal(); });

  /* contact */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-contact]'); if (!b) return;
    const c = [...state.content.breed, ...state.content.adopt].find(x => x.id === b.dataset.contact); if (!c) return;
    contactModal(c.name, c.owner, c.phone, `Hi ${(c.owner||'there').split(' ')[0]}! I saw ${c.name} (${c.breed}) on ${state.brand.name} and I'd love to know more 🐱`);
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-contact-lost]'); if (!b) return;
    const c = state.content.lost.find(x => x.id === b.dataset.contactLost); if (!c) return;
    contactModal(c.name, c.owner, c.phone, `Hi ${c.owner||'there'}! I think I saw ${c.name} near ${c.loc}. Here's what I noticed…`, true);
  });
  function contactModal(catName, owner, phone, prefill, isLost) {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">${isLost ? 'Help find ' : 'Message about '}${esc(catName)}</h3>
      <p class="modal-p">Reach out to <b>${esc(owner || 'the owner')}</b> directly — no middle-man, no algorithm.</p>
      <div class="contact-row"><span class="ci">📱</span><div><div class="cv">${esc(phone || '—')}</div><div class="cl">Opens a WhatsApp chat</div></div></div>
      <div class="field"><label>Your message</label><textarea id="cMsg">${esc(prefill)}</textarea></div>
      <button class="btn btn-primary block" id="cSend">Message on WhatsApp 💬</button>`;
    openModal(wrap);
    $('#cSend').addEventListener('click', () => {
      const msg = encodeURIComponent($('#cMsg').value || prefill); const num = (phone || '').replace(/[^\d]/g, '');
      window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener'); closeModal(); toast('Opening WhatsApp…');
    });
  }

  /* ---------- POST LOST (public) ---------- */
  $('#openLostForm').addEventListener('click', () => {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">Post a lost cat 🔍</h3><p class="modal-p">Free for everyone. The more detail, the better the chances.</p>
      <div class="field"><label>Cat's name</label><input id="lName" placeholder="e.g. Simba"></div>
      <div class="field"><label>Color / markings</label><input id="lColor" placeholder="e.g. Orange with white paws"></div>
      <div class="field"><label>Last seen location</label><input id="lLoc" placeholder="e.g. Dhanmondi, Dhaka"></div>
      <div class="field"><label>When?</label><input id="lTime" placeholder="e.g. 2 days ago"></div>
      <div class="field"><label>Description</label><textarea id="lDesc" placeholder="Collar, behaviour, chip, reward…"></textarea></div>
      <div class="field-row"><div class="field"><label>Your name</label><input id="lOwner" placeholder="Contact name"></div><div class="field"><label>Phone</label><input id="lPhone" placeholder="+8801…"></div></div>
      <button class="btn btn-primary block" id="lSubmit">Post lost cat</button>`;
    openModal(wrap);
    $('#lSubmit').addEventListener('click', () => {
      const name = $('#lName').value.trim(), loc = $('#lLoc').value.trim();
      if (!name || !loc) { toast('Add at least a name and location 🙏'); return; }
      state.content.lost.unshift({ id: uid('l'), name, color: $('#lColor').value.trim() || 'Unknown', loc, time: $('#lTime').value.trim() || 'Just now', desc: $('#lDesc').value.trim() || 'No extra details provided.', owner: $('#lOwner').value.trim() || 'Anonymous', phone: $('#lPhone').value.trim() || '+880', emoji: CATS[name.length % CATS.length], img: '' });
      save(); closeModal(); renderLost(); toast('Posted 💛 hope they come home soon');
    });
  });

  /* ---------- WRITE REVIEW (public) ---------- */
  $('#openFoodForm').addEventListener('click', () => {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">Write a review 🍽️</h3><p class="modal-p">Real talk for fellow cat parents. Rating + a few honest words.</p>
      <div class="field"><label>Food name</label><input id="rFood" placeholder="e.g. Royal Canin Kitten"></div>
      <div class="field"><label>Brand</label><input id="rBrand" placeholder="e.g. Royal Canin"></div>
      <div class="field"><label>Your rating</label><div class="star-pick" id="rStars">${[1,2,3,4,5].map(n=>`<span data-n="${n}">★</span>`).join('')}</div></div>
      <div class="field"><label>Your review</label><textarea id="rText" placeholder="Coat, digestion, value, did your cat love it?"></textarea></div>
      <div class="field"><label>Your name</label><input id="rBy" placeholder="Signed…"></div>
      <button class="btn btn-primary block" id="rSubmit">Post review</button>`;
    openModal(wrap);
    let picked = 0; const stars = $$('#rStars span');
    stars.forEach(s => { s.addEventListener('click', () => { picked = +s.dataset.n; stars.forEach(x => x.classList.toggle('on', +x.dataset.n <= picked)); });
      s.addEventListener('mouseenter', () => stars.forEach(x => x.classList.toggle('on', +x.dataset.n <= +s.dataset.n))); });
    $('#rStars').addEventListener('mouseleave', () => stars.forEach(x => x.classList.toggle('on', +x.dataset.n <= picked)));
    $('#rSubmit').addEventListener('click', () => {
      const food = $('#rFood').value.trim(), text = $('#rText').value.trim();
      if (!food) { toast('What food are you reviewing? 🐟'); return; }
      if (!picked) { toast('Pick a star rating ⭐'); return; }
      if (!text) { toast('Add a few words about it 🙂'); return; }
      state.content.food.unshift({ id: uid('f'), food, brand: $('#rBrand').value.trim() || '—', rating: picked, text, by: $('#rBy').value.trim() || 'Anonymous cat parent', date: 'Aug 2026', emoji: FOOD_EMO[picked % FOOD_EMO.length] });
      save(); closeModal(); $('#foodSort').value = 'new'; renderFood(); toast('Thanks for the review! ⭐');
    });
  });

  /* ============================================================
     ADMIN PANEL
     ============================================================ */
  $('#adminLink').addEventListener('click', () => {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">Admin access 🔐</h3><p class="modal-p">Enter your PIN to manage the site.</p>
      <div class="field"><label>PIN</label><input id="pinIn" type="password" inputmode="numeric" placeholder="••••" autocomplete="off"></div>
      <button class="btn btn-primary block" id="pinGo">Unlock</button>`;
    openModal(wrap);
    const tryPin = () => { if ($('#pinIn').value === String(state.pin)) { closeModal(); go('admin'); } else { toast('Wrong PIN 🙈'); $('#pinIn').value=''; } };
    $('#pinGo').addEventListener('click', tryPin);
    $('#pinIn').addEventListener('keydown', e => { if (e.key === 'Enter') tryPin(); });
    setTimeout(() => $('#pinIn').focus(), 100);
  });

  let contentTab = 'breed';
  function renderAdmin() { fillAdminInputs(); renderSwatches(); syncThemeSeg(); syncLogoType(); renderAdminList(); }

  // admin tab switching
  $$('.admin-tab').forEach(t => t.addEventListener('click', () => {
    $$('.admin-tab').forEach(x => x.classList.remove('active')); t.classList.add('active');
    $$('.admin-panel').forEach(p => p.classList.remove('active')); $('#apanel-' + t.dataset.atab).classList.add('active');
  }));

  function fillAdminInputs() {
    $('#in-logoEmoji').value = state.brand.logoEmoji;
    $('#in-siteName').value = state.brand.name;
    $('#in-pill').value = state.hero.pill;
    $('#in-heroTitle').value = state.hero.title.replace(/<\/?span[^>]*>/g, '');
    $('#in-heroLede').value = state.hero.lede;
    $('#in-heroCat').value = state.hero.cat;
    $('#in-footer').value = state.footer;
    $('#in-accent').value = state.theme.accent;
    $('#in-pin').value = state.pin;
    $('#logoPreview').innerHTML = state.brand.logoType === 'image' && state.brand.logoImage ? `<img src="${esc(state.brand.logoImage)}" alt="">` : (state.brand.logoEmoji || '🐱');
    $('#clearHeroBg').hidden = !state.hero.bg;
  }
  function syncLogoType() {
    $$('#logoTypeSeg button').forEach(b => b.classList.toggle('on', b.dataset.lt === state.brand.logoType));
    $('#logoEmojiField').hidden = state.brand.logoType !== 'emoji';
    $('#logoImageField').hidden = state.brand.logoType !== 'image';
  }
  $$('#logoTypeSeg button').forEach(b => b.addEventListener('click', () => { state.brand.logoType = b.dataset.lt; syncLogoType(); }));
  function syncThemeSeg() { $$('#themeSeg button').forEach(b => b.classList.toggle('on', b.dataset.tm === state.theme.mode)); }
  $$('#themeSeg button').forEach(b => b.addEventListener('click', () => { state.theme.mode = b.dataset.tm; applyTheme(); syncThemeSeg(); }));

  function renderSwatches() {
    $('#swatches').innerHTML = ACCENTS.map(a => `<button class="swatch ${a.hex.toLowerCase()===state.theme.accent.toLowerCase()?'sel':''}" style="background:${a.hex}" title="${a.name}" data-hex="${a.hex}" aria-label="${a.name}"></button>`).join('');
    $$('#swatches .swatch').forEach(s => s.addEventListener('click', () => { state.theme.accent = s.dataset.hex; $('#in-accent').value = s.dataset.hex; applyTheme(); renderSwatches(); }));
  }
  $('#in-accent').addEventListener('input', () => { state.theme.accent = $('#in-accent').value; applyTheme(); renderSwatches(); });

  // image upload helpers
  function readImage(input, cb, maxKB = 900) {
    const f = input.files[0]; if (!f) return;
    if (f.size > maxKB * 1024 * 3) { toast('Image is quite large — it may not save'); }
    const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(f); input.value = '';
  }
  $('#in-logoImage').addEventListener('change', function () { readImage(this, (d) => { state.brand.logoImage = d; state.brand.logoType = 'image'; $('#logoPreview').innerHTML = `<img src="${d}" alt="">`; syncLogoType(); }); });
  $('#in-heroBg').addEventListener('change', function () { readImage(this, (d) => { state.hero.bg = d; $('#clearHeroBg').hidden = false; toast('Banner set — save to keep'); }); });
  $('#clearHeroBg').addEventListener('click', () => { state.hero.bg = ''; $('#clearHeroBg').hidden = true; toast('Banner image removed'); });

  // collect branding inputs into state
  function collectAdmin() {
    state.brand.name = $('#in-siteName').value.trim() || 'SleepyCat';
    state.brand.logoEmoji = $('#in-logoEmoji').value.trim() || '🐱';
    state.hero.pill = $('#in-pill').value.trim();
    const t = $('#in-heroTitle').value.trim(); state.hero.title = t.replace(/(cat people|cat lovers|cats)/i, '<span class="grad">$1</span>');
    state.hero.lede = $('#in-heroLede').value.trim();
    state.hero.cat = $('#in-heroCat').value.trim() || '🐈';
    state.footer = $('#in-footer').value.trim() || 'Made for cat people';
    state.theme.accent = $('#in-accent').value;
    state.pin = $('#in-pin').value.trim() || '1234';
  }
  $('#adminSave').addEventListener('click', () => { collectAdmin(); save(); applyBrand(); applyTheme(); populateFilters(); toast('Saved ✓ your site is updated'); });
  $('#adminPreview').addEventListener('click', () => { collectAdmin(); applyBrand(); applyTheme(); go('home'); });

  /* ----- content CRUD ----- */
  $$('#contentTabs button').forEach(b => b.addEventListener('click', () => { contentTab = b.dataset.ct; $$('#contentTabs button').forEach(x => x.classList.toggle('on', x === b)); renderAdminList(); }));
  function renderAdminList() {
    const list = $('#adminList'); const data = state.content[contentTab]; list.innerHTML = '';
    if (!data.length) { list.innerHTML = `<p class="sec-sub">No items yet — hit “Add new”.</p>`; return; }
    data.forEach(item => {
      const isFood = contentTab === 'food';
      const title = isFood ? item.food : item.name;
      const sub = isFood ? `${item.brand} · ${item.rating}★` : (contentTab === 'lost' ? item.loc : `${item.breed} · ${item.loc}`);
      const av = item.img ? `<img src="${esc(item.img)}" alt="">` : (item.emoji || (isFood ? '🍽️' : '🐱'));
      const row = el('div', 'admin-item');
      row.innerHTML = `<div class="ai-emoji">${av}</div><div class="ai-info"><b>${esc(title)}</b><span>${esc(sub)}</span></div>
        <div class="ai-actions"><button class="mini-btn edit" title="Edit">✏️</button><button class="mini-btn del" title="Delete">🗑️</button></div>`;
      row.querySelector('.edit').addEventListener('click', () => editItem(contentTab, item));
      row.querySelector('.del').addEventListener('click', () => { if (confirm(`Delete “${title}”?`)) { state.content[contentTab] = state.content[contentTab].filter(x => x !== item); save(); renderAdminList(); renderStats(); toast('Deleted'); } });
      list.appendChild(row);
    });
  }
  $('#adminAddBtn').addEventListener('click', () => editItem(contentTab, null));

  function editItem(kind, item) {
    const isNew = !item; const d = item || {};
    const wrap = el('div');
    let body = `<h3 class="modal-h">${isNew ? 'Add' : 'Edit'} ${kind} listing</h3>`;
    if (kind === 'food') {
      body += `
        <div class="field"><label>Food name</label><input id="e-food" value="${esc(d.food)}"></div>
        <div class="field"><label>Brand</label><input id="e-brand" value="${esc(d.brand)}"></div>
        <div class="field"><label>Rating (1–5)</label><input id="e-rating" type="number" min="1" max="5" value="${esc(d.rating||5)}"></div>
        <div class="field"><label>Review text</label><textarea id="e-text">${esc(d.text)}</textarea></div>
        <div class="field-row"><div class="field"><label>Reviewer</label><input id="e-by" value="${esc(d.by)}"></div><div class="field"><label>Emoji</label><input id="e-emoji" maxlength="4" value="${esc(d.emoji||'🍽️')}"></div></div>`;
    } else if (kind === 'lost') {
      body += `
        <div class="field"><label>Cat name</label><input id="e-name" value="${esc(d.name)}"></div>
        <div class="field"><label>Colour / markings</label><input id="e-color" value="${esc(d.color)}"></div>
        <div class="field-row"><div class="field"><label>Last seen</label><input id="e-loc" value="${esc(d.loc)}"></div><div class="field"><label>When</label><input id="e-time" value="${esc(d.time)}"></div></div>
        <div class="field"><label>Description</label><textarea id="e-desc">${esc(d.desc)}</textarea></div>
        <div class="field-row"><div class="field"><label>Contact name</label><input id="e-owner" value="${esc(d.owner)}"></div><div class="field"><label>Phone</label><input id="e-phone" value="${esc(d.phone)}"></div></div>
        <div class="field"><label>Emoji</label><input id="e-emoji" maxlength="4" value="${esc(d.emoji||'😿')}"></div>
        ${imgField(d)}`;
    } else {
      body += `
        <div class="field-row"><div class="field"><label>Name</label><input id="e-name" value="${esc(d.name)}"></div><div class="field"><label>Breed</label><input id="e-breed" value="${esc(d.breed)}"></div></div>
        <div class="field-row"><div class="field"><label>Age</label><input id="e-age" value="${esc(d.age)}"></div><div class="field"><label>Location</label><input id="e-loc" value="${esc(d.loc)}"></div></div>
        <div class="field"><label>Vaccinated?</label><select id="e-vax"><option value="yes"${d.vax?' selected':''}>Yes 💉</option><option value="no"${d.vax===false?' selected':''}>No</option></select></div>
        <div class="field"><label>Description</label><textarea id="e-desc">${esc(d.desc)}</textarea></div>
        <div class="field-row"><div class="field"><label>Owner</label><input id="e-owner" value="${esc(d.owner)}"></div><div class="field"><label>Phone</label><input id="e-phone" value="${esc(d.phone)}"></div></div>
        <div class="field"><label>Emoji</label><input id="e-emoji" maxlength="4" value="${esc(d.emoji||'🐱')}"></div>
        ${imgField(d)}`;
    }
    body += `<button class="btn btn-primary block" id="e-save">${isNew ? 'Add listing' : 'Save changes'}</button>`;
    wrap.innerHTML = body; openModal(wrap);
    // image upload wiring
    const imgInput = wrap.querySelector('#e-img'); let imgData = d.img || '';
    if (imgInput) imgInput.addEventListener('change', function () { readImage(this, (dt) => { imgData = dt; const pv = wrap.querySelector('#e-imgprev'); if (pv) { pv.innerHTML = `<img src="${dt}" alt="">`; } wrap.querySelector('#e-imgclear').hidden = false; }); });
    const imgClear = wrap.querySelector('#e-imgclear'); if (imgClear) imgClear.addEventListener('click', () => { imgData = ''; wrap.querySelector('#e-imgprev').innerHTML = d.emoji || '🐱'; imgClear.hidden = true; });

    $('#e-save').addEventListener('click', () => {
      let rec;
      if (kind === 'food') {
        const food = wrap.querySelector('#e-food').value.trim(); if (!food) { toast('Food name required'); return; }
        rec = { id: d.id || uid('f'), food, brand: wrap.querySelector('#e-brand').value.trim() || '—', rating: Math.max(1, Math.min(5, +wrap.querySelector('#e-rating').value || 5)), text: wrap.querySelector('#e-text').value.trim(), by: wrap.querySelector('#e-by').value.trim() || 'Anonymous', date: d.date || 'Aug 2026', emoji: wrap.querySelector('#e-emoji').value.trim() || '🍽️' };
      } else if (kind === 'lost') {
        const name = wrap.querySelector('#e-name').value.trim(); if (!name) { toast('Name required'); return; }
        rec = { id: d.id || uid('l'), name, color: wrap.querySelector('#e-color').value.trim(), loc: wrap.querySelector('#e-loc').value.trim(), time: wrap.querySelector('#e-time').value.trim(), desc: wrap.querySelector('#e-desc').value.trim(), owner: wrap.querySelector('#e-owner').value.trim(), phone: wrap.querySelector('#e-phone').value.trim(), emoji: wrap.querySelector('#e-emoji').value.trim() || '😿', img: imgData };
      } else {
        const name = wrap.querySelector('#e-name').value.trim(); if (!name) { toast('Name required'); return; }
        rec = { id: d.id || uid('c'), name, breed: wrap.querySelector('#e-breed').value.trim() || 'Cat', age: wrap.querySelector('#e-age').value.trim(), vax: wrap.querySelector('#e-vax').value === 'yes', loc: wrap.querySelector('#e-loc').value.trim(), desc: wrap.querySelector('#e-desc').value.trim(), owner: wrap.querySelector('#e-owner').value.trim(), phone: wrap.querySelector('#e-phone').value.trim(), emoji: wrap.querySelector('#e-emoji').value.trim() || '🐱', img: imgData };
      }
      if (isNew) state.content[kind].unshift(rec);
      else { const i = state.content[kind].findIndex(x => x.id === d.id); if (i > -1) state.content[kind][i] = rec; }
      save(); closeModal(); renderAdminList(); populateFilters(); renderStats(); toast(isNew ? 'Added ✓' : 'Saved ✓');
    });
  }
  const imgField = (d) => `
    <div class="field"><label>Photo (optional)</label>
      <div class="logo-preview"><div class="lp-box" id="e-imgprev">${d.img ? `<img src="${esc(d.img)}" alt="">` : (d.emoji || '🐱')}</div>
        <div><label class="file-btn">📁 Upload<input type="file" accept="image/*" id="e-img"></label>
        <button class="btn btn-danger sm" id="e-imgclear" style="margin-top:8px" ${d.img?'':'hidden'}>Remove</button></div>
      </div><p class="hint">Falls back to the emoji if no photo.</p>
    </div>`;

  /* ----- data export / import / reset ----- */
  $('#exportBtn').addEventListener('click', () => {
    collectAdmin(); const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sleepycat-setup.json'; a.click(); URL.revokeObjectURL(a.href); toast('Exported ⬇');
  });
  $('#importInput').addEventListener('change', function () {
    const f = this.files[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { try { state = deepMerge(DEFAULTS(), JSON.parse(r.result)); save(); applyEverything(); go('admin'); toast('Imported ✓'); } catch { toast('That file could not be read'); } };
    r.readAsText(f); this.value = '';
  });
  $('#resetBtn').addEventListener('click', () => { if (confirm('Reset ALL settings and listings to defaults? This cannot be undone.')) { state = DEFAULTS(); save(); applyEverything(); go('home'); toast('Reset to defaults'); } });

  /* ---------- INIT ---------- */
  function applyEverything() { applyTheme(); applyBrand(); populateFilters(); renderStats(); updateSavedCount(); }
  applyEverything();
  // react to OS theme changes when in 'system' mode
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => { if (state.theme.mode === 'system') applyTheme(); });
})();
