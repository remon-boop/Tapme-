/* ============================================================
   SleepyCat — app logic (vanilla JS, no build step)
   In-memory sample data + localStorage for saves & user posts.
   No matching / AI — direct contact only.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- tiny helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem('sleepycat.' + k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('sleepycat.' + k, JSON.stringify(v)); } catch {} }
  };

  /* soft gradient backgrounds cycled for cat photo placeholders */
  const GRADS = [
    'linear-gradient(135deg,#ffd7ba,#ffb385)',
    'linear-gradient(135deg,#d9c7ff,#b49dff)',
    'linear-gradient(135deg,#bde7d6,#8fe0bf)',
    'linear-gradient(135deg,#ffe3a8,#ffcf6b)',
    'linear-gradient(135deg,#ffc9c9,#ff9a9a)',
    'linear-gradient(135deg,#c3e5ff,#93cdff)'
  ];
  const CATS = ['🐱', '🐈', '🐈‍⬛', '😺', '😸', '😻', '🙀', '😽'];

  /* ==================== SAMPLE DATA ==================== */
  const breedData = [
    { id: 'b1', name: 'Mochi', breed: 'British Shorthair', age: '2 yrs', vax: true, loc: 'Dhaka', emoji: '😺', desc: 'Chunky, calm and endlessly cuddly. Loves sunbeams and being carried like a loaf.', owner: 'Rima', phone: '+8801700000001' },
    { id: 'b2', name: 'Pixel', breed: 'Bengal', age: '1 yr', vax: true, loc: 'Chittagong', emoji: '😸', desc: 'Wild rosettes, wilder energy. A tiny leopard who thinks the curtains are a jungle gym.', owner: 'Tanvir', phone: '+8801700000002' },
    { id: 'b3', name: 'Luna', breed: 'Persian', age: '3 yrs', vax: true, loc: 'Sylhet', emoji: '😻', desc: 'A fluffy cloud with opinions. Requires daily brushing and constant admiration.', owner: 'Nabila', phone: '+8801700000003' },
    { id: 'b4', name: 'Sootie', breed: 'Bombay', age: '4 yrs', vax: false, loc: 'Dhaka', emoji: '🐈‍⬛', desc: 'A little panther with copper eyes. Velvet coat, dog-like loyalty, huge appetite.', owner: 'Farhan', phone: '+8801700000004' },
    { id: 'b5', name: 'Ginger', breed: 'Maine Coon', age: '2 yrs', vax: true, loc: 'Khulna', emoji: '🦁', desc: 'Gentle giant, the size of a small dog. Chirps instead of meows. Absolute unit.', owner: 'Sadia', phone: '+8801700000005' },
    { id: 'b6', name: 'Boba', breed: 'Scottish Fold', age: '1 yr', vax: true, loc: 'Dhaka', emoji: '😽', desc: 'Folded ears, folded into your heart. Sits like a person, judges like one too.', owner: 'Imran', phone: '+8801700000006' },
    { id: 'b7', name: 'Miso', breed: 'Siamese', age: '5 yrs', vax: true, loc: 'Rajshahi', emoji: '😼', desc: 'Chatty, clever and very loud about dinner being 4 minutes late. Blue-eyed diva.', owner: 'Anika', phone: '+8801700000007' },
    { id: 'b8', name: 'Cloud', breed: 'Ragdoll', age: '2 yrs', vax: true, loc: 'Chittagong', emoji: '😻', desc: 'Goes fully limp when you pick him up. Pure floppy affection in cat form.', owner: 'Zayed', phone: '+8801700000008' }
  ];

  const adoptData = [
    { id: 'a1', name: 'Peanut', breed: 'Domestic Shorthair', age: '8 mo', vax: true, loc: 'Dhaka', emoji: '😺', desc: 'Rescued from a rooftop. Now the friendliest goofball. Great with kids & other cats.', owner: 'Paws Shelter', phone: '+8801711111111' },
    { id: 'a2', name: 'Coco', breed: 'Tuxedo', age: '1.5 yrs', vax: true, loc: 'Chittagong', emoji: '🐈‍⬛', desc: 'Dressed for a wedding 24/7. Litter-trained, spayed, ready for a calm home.', owner: 'Nadia', phone: '+8801711111112' },
    { id: 'a3', name: 'Marmalade', breed: 'Orange Tabby', age: '3 yrs', vax: true, loc: 'Sylhet', emoji: '😸', desc: 'One brain cell, infinite love. Will headbutt you until you accept the friendship.', owner: 'Kittyhaven', phone: '+8801711111113' },
    { id: 'a4', name: 'Shadow', breed: 'Grey DSH', age: '6 mo', vax: false, loc: 'Dhaka', emoji: '🐱', desc: 'Shy at first, velcro-cat once he trusts you. Needs a patient, quiet family.', owner: 'Rafi', phone: '+8801711111114' },
    { id: 'a5', name: 'Honey', breed: 'Calico', age: '2 yrs', vax: true, loc: 'Khulna', emoji: '😻', desc: 'Tri-color queen. Independent but loves an evening lap session. Spayed & chipped.', owner: 'StreetCats BD', phone: '+8801711111115' },
    { id: 'a6', name: 'Pumpkin', breed: 'Orange Tabby', age: '4 mo', vax: true, loc: 'Dhaka', emoji: '😽', desc: 'A tiny orange menace with the zoomies. Bottle-raised, adores humans.', owner: 'Mariam', phone: '+8801711111116' }
  ];

  const lostSeed = [
    { id: 'l1', name: 'Simba', color: 'Orange & white', loc: 'Dhanmondi, Dhaka', time: '2 days ago', emoji: '😿', desc: 'Slipped out the balcony. Answers to Simba, has a red collar with a bell. Very food-motivated.', owner: 'Sabbir', phone: '+8801722222221' },
    { id: 'l2', name: 'Nova', color: 'Grey tabby', loc: 'Agrabad, Chittagong', time: '5 days ago', emoji: '🙀', desc: 'Micro-chipped. Shy around strangers, may be hiding under cars. Please do not chase.', owner: 'Elham', phone: '+8801722222222' },
    { id: 'l3', name: 'Coco', color: 'Black', loc: 'Uttara Sector 7, Dhaka', time: '1 week ago', emoji: '🐈‍⬛', desc: 'Small black cat, white chest patch, one notched ear. Reward for safe return 🙏', owner: 'Junaid', phone: '+8801722222223' }
  ];

  const foodSeed = [
    { id: 'f1', food: 'Royal Canin Kitten', brand: 'Royal Canin', rating: 5, emoji: '🍗', text: "My kittens demolish this and their coats got noticeably shinier in 3 weeks. Kibble size is perfect for tiny mouths. Pricey but worth it.", by: 'Rima', date: 'Jul 2026' },
    { id: 'f2', food: 'Whiskas Tuna Pouch', brand: 'Whiskas', rating: 4, emoji: '🐟', text: 'Great value wet food, my two go nuts for the tuna. Marked down one star because the gravy can be a bit watery.', by: 'Tanvir', date: 'Jul 2026' },
    { id: 'f3', food: 'Sheba Prime Chicken', brand: 'Sheba', rating: 5, emoji: '🍖', text: 'The fussiest cat I own actually finished a whole tray. Smells rich, no weird fillers. This is our new treat-night food.', by: 'Nabila', date: 'Jun 2026' },
    { id: 'f4', food: 'Me-O Persian Adult', brand: 'Me-O', rating: 3, emoji: '🥣', text: 'Affordable and my cats eat it fine, but I noticed more shedding vs premium brands. Fine as a budget everyday option.', by: 'Farhan', date: 'Jun 2026' },
    { id: 'f5', food: 'Purina Fancy Feast', brand: 'Purina', rating: 4, emoji: '🐾', text: 'Classic for a reason. So many flavors that even picky Miso stays interested. Wish the cans were slightly bigger.', by: 'Anika', date: 'May 2026' },
    { id: 'f6', food: 'Reflex Plus Sterilised', brand: 'Reflex', rating: 2, emoji: '🥫', text: 'My neutered cat just would not touch this one, and it upset his stomach. Might work for others but not for us.', by: 'Zayed', date: 'May 2026' }
  ];

  /* merge user-added posts from localStorage */
  const userLost = store.get('userLost', []);
  const userFood = store.get('userFood', []);
  let lostData = [...userLost, ...lostSeed];
  let foodData = [...userFood, ...foodSeed];

  /* saved (liked) cat ids */
  let saved = new Set(store.get('saved', []));
  const allCatsById = {};
  [...breedData, ...adoptData].forEach((c) => (allCatsById[c.id] = c));

  /* ==================== LOADER ==================== */
  const loader = $('#loader');
  function showLoader() {
    loader.classList.remove('hide');
    loader.setAttribute('aria-hidden', 'false');
  }
  function hideLoader() {
    loader.classList.add('hide');
    loader.setAttribute('aria-hidden', 'true');
  }
  // initial load — let the sleepy cat breathe a moment
  window.addEventListener('load', () => setTimeout(hideLoader, 1100));
  // safety: never trap the user behind the loader
  setTimeout(hideLoader, 2600);

  /* ==================== TOAST ==================== */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ==================== NAVIGATION ==================== */
  const views = {
    home: $('#view-home'), breed: $('#view-breed'), adopt: $('#view-adopt'),
    lost: $('#view-lost'), food: $('#view-food'), saved: $('#view-saved')
  };
  let current = 'home';
  const rendered = { home: true };

  function go(section) {
    if (!views[section] || section === current) {
      closeMobileNav();
      return;
    }
    // brief sleepy-cat loader on section switch
    showLoader();
    closeMobileNav();
    setTimeout(() => {
      views[current].hidden = true;
      views[section].hidden = false;
      // re-trigger view-in animation
      views[section].style.animation = 'none';
      void views[section].offsetWidth;
      views[section].style.animation = '';
      current = section;
      renderSection(section);
      updateNavActive();
      window.scrollTo({ top: 0, behavior: 'auto' });
      hideLoader();
    }, 650);
  }

  function updateNavActive() {
    $$('.nav-link').forEach((b) =>
      b.classList.toggle('active', b.dataset.section === current));
  }

  function renderSection(section) {
    if (section === 'breed') renderCats('breedGrid', breedData);
    else if (section === 'adopt') renderCats('adoptGrid', adoptData);
    else if (section === 'lost') renderLost();
    else if (section === 'food') renderFood();
    else if (section === 'saved') renderSaved();
  }

  // delegate all [data-section] clicks
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-section]');
    if (btn) {
      e.preventDefault();
      go(btn.dataset.section);
    }
  });

  /* mobile menu */
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  function closeMobileNav() { menuToggle.classList.remove('open'); mobileNav.classList.remove('open'); }
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  /* ==================== CAT CARDS (breed / adopt / saved) ==================== */
  function catCard(c, i) {
    const card = el('article', 'card');
    card.style.animationDelay = (i % 12) * 0.05 + 's';
    const grad = GRADS[i % GRADS.length];
    const isSaved = saved.has(c.id);
    const vaxBadge = c.vax
      ? '<span class="badge vax">💉 Vaccinated</span>'
      : '<span class="badge novax">Not vaccinated</span>';
    card.innerHTML = `
      <div class="card-photo" style="background:${grad}">
        ${vaxBadge}
        <button class="like-btn ${isSaved ? 'liked' : ''}" data-like="${c.id}" aria-label="Save ${esc(c.name)}">${isSaved ? '♥' : '♡'}</button>
        <span class="emoji">${c.emoji}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${esc(c.name)}</h3>
        <p class="card-meta">${esc(c.breed)}</p>
        <div class="chips">
          <span class="chip age">${esc(c.age)}</span>
          <span class="chip loc">${esc(c.loc)}</span>
        </div>
        <p class="card-desc">${esc(c.desc)}</p>
        <div class="card-actions">
          <button class="btn-contact" data-contact="${c.id}">Message ${esc(c.owner.split(' ')[0])}</button>
          <button class="btn-save-out ${isSaved ? 'saved' : ''}" data-like="${c.id}">${isSaved ? '♥ Saved' : '♡ Save'}</button>
        </div>
      </div>`;
    return card;
  }

  function renderCats(gridId, data) {
    const grid = $('#' + gridId);
    grid.innerHTML = '';
    if (!data.length) { grid.appendChild(emptyState('No cats match that search 🐾', 'Try a different breed or city.')); return; }
    data.forEach((c, i) => grid.appendChild(catCard(c, i)));
  }

  function renderSaved() {
    const grid = $('#savedGrid');
    grid.innerHTML = '';
    const list = [...saved].map((id) => allCatsById[id]).filter(Boolean);
    if (!list.length) {
      grid.appendChild(emptyState('No saved cats yet', 'Tap the ♥ on any breed or adopt listing to keep it here.'));
      return;
    }
    list.forEach((c, i) => grid.appendChild(catCard(c, i)));
  }

  function emptyState(title, sub) {
    return el('div', 'empty', `<span class="em">😽</span><h3>${esc(title)}</h3><p>${esc(sub)}</p>`);
  }

  /* like / save toggle (delegated) */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-like]');
    if (!b) return;
    const id = b.dataset.like;
    const nowSaved = !saved.has(id);
    if (nowSaved) saved.add(id); else saved.delete(id);
    store.set('saved', [...saved]);
    updateSavedCount();
    toast(nowSaved ? 'Saved to your cats ♥' : 'Removed from saved');
    // update every control for this id currently on screen
    $$(`[data-like="${CSS.escape(id)}"]`).forEach((elm) => {
      if (elm.classList.contains('like-btn')) {
        elm.classList.toggle('liked', nowSaved);
        elm.textContent = nowSaved ? '♥' : '♡';
        elm.classList.remove('pop'); void elm.offsetWidth; elm.classList.add('pop');
      } else {
        elm.classList.toggle('saved', nowSaved);
        elm.textContent = nowSaved ? '♥ Saved' : '♡ Save';
      }
    });
    if (current === 'saved') renderSaved();
  });

  function updateSavedCount() { $('#savedCount').textContent = saved.size; }

  /* ==================== LOST CATS ==================== */
  function renderLost(filter) {
    const grid = $('#lostGrid');
    grid.innerHTML = '';
    let data = lostData;
    if (filter) {
      const q = filter.toLowerCase();
      data = data.filter((c) => [c.name, c.color, c.loc, c.desc].join(' ').toLowerCase().includes(q));
    }
    if (!data.length) { grid.appendChild(emptyState('No lost cats found here', 'That could be good news! Try another search.')); return; }
    data.forEach((c, i) => {
      const card = el('article', 'card');
      card.style.animationDelay = (i % 12) * 0.05 + 's';
      const grad = GRADS[(i + 2) % GRADS.length];
      card.innerHTML = `
        <div class="card-photo" style="background:${grad}">
          <span class="badge lost">🔍 Lost</span>
          <span class="emoji">${c.emoji || '😿'}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${esc(c.name)}</h3>
          <p class="card-meta">${esc(c.color)}</p>
          <div class="chips">
            <span class="chip loc">${esc(c.loc)}</span>
            <span class="chip time">${esc(c.time)}</span>
          </div>
          <p class="card-desc">${esc(c.desc)}</p>
          <div class="card-actions">
            <button class="btn-contact" data-contact-lost="${c.id}">I've seen this cat</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ==================== FOOD REVIEWS ==================== */
  function starHTML(n) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += `<span class="${i <= n ? 'on' : 'off'}">★</span>`;
    return s;
  }
  function renderFood() {
    const list = $('#foodList');
    const q = ($('#foodSearch').value || '').toLowerCase();
    const sort = $('#foodSort').value;
    let data = foodData.filter((f) =>
      [f.food, f.brand, f.text].join(' ').toLowerCase().includes(q));
    if (sort === 'top') data = [...data].sort((a, b) => b.rating - a.rating);
    else if (sort === 'low') data = [...data].sort((a, b) => a.rating - b.rating);
    else data = [...data]; // newest = insertion order (user posts are prepended)
    list.innerHTML = '';
    if (!data.length) { list.appendChild(emptyState('No reviews match', 'Be the first to review it!')); return; }
    data.forEach((f, i) => {
      const r = el('article', 'review');
      r.style.animationDelay = (i % 12) * 0.05 + 's';
      r.innerHTML = `
        <div class="review-top">
          <div class="food-avatar" style="background:${GRADS[i % GRADS.length]}">${f.emoji || '🍽️'}</div>
          <div>
            <div class="review-food">${esc(f.food)}</div>
            <div class="review-brand">${esc(f.brand)}</div>
          </div>
          <div class="stars">${starHTML(f.rating)}<span class="rating-num">${f.rating.toFixed(1)}</span></div>
        </div>
        <p class="review-text">"${esc(f.text)}"</p>
        <div class="review-foot"><span>— ${esc(f.by)}</span><span>${esc(f.date)}</span></div>`;
      list.appendChild(r);
    });
  }

  /* ==================== SEARCH / FILTER WIRING ==================== */
  // breed & adopt live search + filter
  $$('.search[data-grid]').forEach((input) => {
    if (input.dataset.grid !== 'breedGrid' && input.dataset.grid !== 'adoptGrid') return;
    input.addEventListener('input', () => {
      const gridId = input.dataset.grid;
      const src = gridId === 'breedGrid' ? breedData : adoptData;
      const filterSel = gridId === 'breedGrid' ? '#breedFilter' : '#adoptFilter';
      const fv = $(filterSel).value;
      const q = input.value.toLowerCase();
      const data = src.filter((c) =>
        (fv === 'all' || c.breed === fv) &&
        [c.name, c.breed, c.loc, c.desc].join(' ').toLowerCase().includes(q));
      renderCats(gridId, data);
    });
  });
  $$('.filter[data-field]').forEach((sel) => {
    sel.addEventListener('change', () => {
      const gridId = sel.dataset.grid;
      const src = gridId === 'breedGrid' ? breedData : adoptData;
      const searchSel = `.search[data-grid="${gridId}"]`;
      const q = ($(searchSel).value || '').toLowerCase();
      const fv = sel.value;
      const data = src.filter((c) =>
        (fv === 'all' || c.breed === fv) &&
        [c.name, c.breed, c.loc, c.desc].join(' ').toLowerCase().includes(q));
      renderCats(gridId, data);
    });
  });
  // populate breed filters
  function populateFilter(sel, data) {
    const breeds = [...new Set(data.map((c) => c.breed))].sort();
    sel.innerHTML = '<option value="all">All breeds</option>' +
      breeds.map((b) => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
  }
  populateFilter($('#breedFilter'), breedData);
  populateFilter($('#adoptFilter'), adoptData);

  // lost search
  $('.search[data-grid="lostGrid"]').addEventListener('input', (e) => renderLost(e.target.value));
  // food search + sort
  $('#foodSearch').addEventListener('input', renderFood);
  $('#foodSort').addEventListener('change', renderFood);

  /* ==================== MODAL ==================== */
  const modalRoot = $('#modalRoot');
  const modalContent = $('#modalContent');
  function openModal(html) {
    modalContent.innerHTML = '';
    modalContent.appendChild(html);
    modalRoot.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalRoot.hidden = true;
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
  }
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modalRoot.hidden) closeModal(); });

  /* contact a cat owner (breed/adopt) */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-contact]');
    if (!b) return;
    const c = allCatsById[b.dataset.contact];
    if (!c) return;
    openContactModal(c.name, c.owner, c.phone, `Hi ${c.owner.split(' ')[0]}! I saw ${c.name} (${c.breed}) on SleepyCat and I'd love to know more 🐱`);
  });
  /* contact a lost-cat poster */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-contact-lost]');
    if (!b) return;
    const c = lostData.find((x) => x.id === b.dataset.contactLost);
    if (!c) return;
    openContactModal(c.name, c.owner, c.phone, `Hi ${c.owner}! I think I saw ${c.name} near ${c.loc}. Here's what I noticed…`, true);
  });

  function openContactModal(catName, owner, phone, prefill, isLost) {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">${isLost ? 'Help find ' : 'Message about '}${esc(catName)}</h3>
      <p class="modal-p">Reach out to <b>${esc(owner)}</b> directly — no middle-man, no algorithm.</p>
      <div class="contact-row">
        <span class="ci">📱</span>
        <div><div class="cv">${esc(phone)}</div><div class="cl">Tap “Message on WhatsApp” to open a chat</div></div>
      </div>
      <div class="field">
        <label>Your message</label>
        <textarea id="cMsg">${esc(prefill)}</textarea>
      </div>
      <button class="btn btn-primary" id="cSend">Message on WhatsApp 💬</button>`;
    openModal(wrap);
    $('#cSend').addEventListener('click', () => {
      const msg = encodeURIComponent($('#cMsg').value || prefill);
      const num = phone.replace(/[^\d]/g, '');
      window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener');
      closeModal();
      toast('Opening WhatsApp…');
    });
  }

  /* ==================== POST A LOST CAT ==================== */
  $('#openLostForm').addEventListener('click', () => {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">Post a lost cat 🔍</h3>
      <p class="modal-p">Free for everyone. The more detail, the better the chances.</p>
      <div class="field"><label>Cat's name</label><input id="lName" placeholder="e.g. Simba"></div>
      <div class="field"><label>Color / markings</label><input id="lColor" placeholder="e.g. Orange with white paws"></div>
      <div class="field"><label>Last seen location</label><input id="lLoc" placeholder="e.g. Dhanmondi, Dhaka"></div>
      <div class="field"><label>When?</label><input id="lTime" placeholder="e.g. 2 days ago"></div>
      <div class="field"><label>Description</label><textarea id="lDesc" placeholder="Collar, behavior, chip, reward…"></textarea></div>
      <div class="field"><label>Your name</label><input id="lOwner" placeholder="Who to contact"></div>
      <div class="field"><label>Contact number</label><input id="lPhone" placeholder="+8801…"></div>
      <button class="btn btn-primary" id="lSubmit">Post lost cat</button>`;
    openModal(wrap);
    $('#lSubmit').addEventListener('click', () => {
      const name = $('#lName').value.trim();
      const loc = $('#lLoc').value.trim();
      if (!name || !loc) { toast('Add at least a name and location 🙏'); return; }
      const rec = {
        id: 'ul' + Date.now(),
        name,
        color: $('#lColor').value.trim() || 'Unknown',
        loc,
        time: $('#lTime').value.trim() || 'Just now',
        desc: $('#lDesc').value.trim() || 'No extra details provided.',
        owner: $('#lOwner').value.trim() || 'Anonymous',
        phone: $('#lPhone').value.trim() || '+880',
        emoji: CATS[Math.floor((Date.now() / 1000) % CATS.length)]
      };
      const stored = store.get('userLost', []);
      stored.unshift(rec);
      store.set('userLost', stored);
      lostData = [rec, ...lostData];
      closeModal();
      renderLost();
      toast('Posted 💛 hope they come home soon');
    });
  });

  /* ==================== WRITE A FOOD REVIEW ==================== */
  $('#openFoodForm').addEventListener('click', () => {
    const wrap = el('div');
    wrap.innerHTML = `
      <h3 class="modal-h">Write a review 🍽️</h3>
      <p class="modal-p">Real talk for fellow cat parents. Rating + a few honest words.</p>
      <div class="field"><label>Food name</label><input id="rFood" placeholder="e.g. Royal Canin Kitten"></div>
      <div class="field"><label>Brand</label><input id="rBrand" placeholder="e.g. Royal Canin"></div>
      <div class="field"><label>Your rating</label>
        <div class="star-pick" id="rStars">${[1,2,3,4,5].map((n)=>`<span data-n="${n}">★</span>`).join('')}</div>
      </div>
      <div class="field"><label>Your review</label><textarea id="rText" placeholder="Did your cat love it? Coat, digestion, value…"></textarea></div>
      <div class="field"><label>Your name</label><input id="rBy" placeholder="Signed…"></div>
      <button class="btn btn-primary" id="rSubmit">Post review</button>`;
    openModal(wrap);
    let picked = 0;
    const stars = $$('#rStars span');
    stars.forEach((s) => {
      s.addEventListener('click', () => {
        picked = +s.dataset.n;
        stars.forEach((x) => x.classList.toggle('on', +x.dataset.n <= picked));
      });
      s.addEventListener('mouseenter', () => {
        stars.forEach((x) => x.classList.toggle('on', +x.dataset.n <= +s.dataset.n));
      });
    });
    $('#rStars').addEventListener('mouseleave', () => {
      stars.forEach((x) => x.classList.toggle('on', +x.dataset.n <= picked));
    });
    $('#rSubmit').addEventListener('click', () => {
      const food = $('#rFood').value.trim();
      const text = $('#rText').value.trim();
      if (!food) { toast('What food are you reviewing? 🐟'); return; }
      if (!picked) { toast('Pick a star rating ⭐'); return; }
      if (!text) { toast('Add a few words about it 🙂'); return; }
      const FOOD_EMO = ['🍗','🐟','🍖','🥣','🐾','🥫'];
      const rec = {
        id: 'uf' + Date.now(),
        food,
        brand: $('#rBrand').value.trim() || '—',
        rating: picked,
        text,
        by: $('#rBy').value.trim() || 'Anonymous cat parent',
        date: 'Aug 2026',
        emoji: FOOD_EMO[picked % FOOD_EMO.length]
      };
      const stored = store.get('userFood', []);
      stored.unshift(rec);
      store.set('userFood', stored);
      foodData = [rec, ...foodData];
      closeModal();
      $('#foodSort').value = 'new';
      renderFood();
      toast('Thanks for the review! ⭐');
    });
  });

  /* ==================== INIT ==================== */
  updateSavedCount();
  updateNavActive();
})();
