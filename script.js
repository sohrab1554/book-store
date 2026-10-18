// =========================================================
// کتاب‌سرا — app logic
// =========================================================
(() => {
  'use strict';

  /* ---------- Persian number helpers ---------- */
  const faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  const toFa = (num) => String(num).replace(/[0-9]/g, d => faDigits[d]);
  const formatPrice = (num) => toFa(num.toLocaleString('en-US')) + ' تومان';
  const pad2 = (n) => toFa(String(n).padStart(2, '0'));

  /* ---------- Book data ---------- */
  const BOOKS = [
    { id: 1,  title: 'کوچه‌ی بی‌انتها',              author: 'حامد نوری',        cat: 'novel',      cls: 'g-novel',      price: 285000, old: 340000, rating: 4.7, badge: 'پرفروش', deal: true },
    { id: 2,  title: 'باران آخر پاییز',               author: 'سارا احمدی',       cat: 'novel',      cls: 'g-novel',      price: 245000, old: null,   rating: 4.5, badge: null,      deal: false },
    { id: 3,  title: 'زمزمه‌های نیمه‌شب',              author: 'مهدی رستمی',       cat: 'poetry',     cls: 'g-poetry',     price: 165000, old: 195000, rating: 4.6, badge: '۱۵٪ تخفیف', deal: true },
    { id: 4,  title: 'دیوان دل‌های عاشق',              author: 'فرزانه امیری',     cat: 'poetry',     cls: 'g-poetry',     price: 190000, old: null,   rating: 4.4, badge: null,      deal: false },
    { id: 5,  title: 'تاریخ ناگفته ایران باستان',      author: 'دکتر علیرضا کاظمی', cat: 'history',    cls: 'g-history',    price: 320000, old: null,   rating: 4.8, badge: 'جدید',    deal: false },
    { id: 6,  title: 'امپراتوری‌های فراموش‌شده',       author: 'دکتر کاوه رضایی',   cat: 'history',    cls: 'g-history',    price: 275000, old: 330000, rating: 4.5, badge: '۱۷٪ تخفیف', deal: true },
    { id: 7,  title: 'آینه‌ی ذهن آرام',                author: 'دکتر نگار حسینی',   cat: 'psychology', cls: 'g-psychology', price: 210000, old: null,   rating: 4.6, badge: null,      deal: false },
    { id: 8,  title: 'قدرت عادت‌های کوچک',             author: 'دکتر شیوا محمدی',   cat: 'psychology', cls: 'g-psychology', price: 230000, old: 275000, rating: 4.7, badge: '۱۶٪ تخفیف', deal: true },
    { id: 9,  title: 'قصه‌های شب‌های مهتابی',           author: 'لیلا صادقی',        cat: 'kids',       cls: 'g-kids',       price: 140000, old: null,   rating: 4.9, badge: 'محبوب کودکان', deal: false },
    { id: 10, title: 'ماجراهای کاپیتان ستاره',          author: 'آرمین کیانی',       cat: 'kids',       cls: 'g-kids',       price: 155000, old: 180000, rating: 4.6, badge: '۱۴٪ تخفیف', deal: true },
    { id: 11, title: 'سفر به سیاره‌ی نور',              author: 'بهراد یوسفی',       cat: 'scifi',      cls: 'g-scifi',      price: 260000, old: null,   rating: 4.5, badge: null,      deal: false },
    { id: 12, title: 'در جست‌وجوی معنا',                author: 'دکتر آرش فرهادی',   cat: 'philosophy', cls: 'g-philosophy', price: 220000, old: null,   rating: 4.7, badge: null,      deal: false },
    { id: 13, title: 'خط و رنگ در نگارگری ایرانی',      author: 'مریم توکلی',        cat: 'art',        cls: 'g-art',        price: 340000, old: 390000, rating: 4.8, badge: '۱۳٪ تخفیف', deal: true },
  ];

  const GENRES = [
    { name: 'رمان و داستان',       icon: 'fa-feather',         cls: 'g-novel',      filter: 'novel' },
    { name: 'شعر و ادبیات کلاسیک', icon: 'fa-quote-right',     cls: 'g-poetry',     filter: 'poetry' },
    { name: 'تاریخ و زندگی‌نامه',   icon: 'fa-landmark',        cls: 'g-history',    filter: 'history' },
    { name: 'روان‌شناسی',           icon: 'fa-brain',           cls: 'g-psychology', filter: 'psychology' },
    { name: 'کودک و نوجوان',       icon: 'fa-child-reaching',  cls: 'g-kids',       filter: 'kids' },
    { name: 'علمی‌تخیلی و فانتزی', icon: 'fa-meteor',          cls: 'g-scifi',      filter: 'all' },
    { name: 'فلسفه و اندیشه',      icon: 'fa-yin-yang',        cls: 'g-philosophy', filter: 'all' },
    { name: 'هنر و طراحی',         icon: 'fa-palette',         cls: 'g-art',        filter: 'all' },
  ];

  const state = {
    library: new Set(), // wishlist-equivalent
    cart: new Map(),
    filter: 'all',
  };

  function genreLabel(cat) {
    return { novel: 'رمان و داستان', poetry: 'شعر و ادبیات', history: 'تاریخ', psychology: 'روان‌شناسی', kids: 'کودک و نوجوان', scifi: 'علمی‌تخیلی', philosophy: 'فلسفه', art: 'هنر و طراحی' }[cat] || '';
  }

  function bookCard(b) {
    const isSaved = state.library.has(b.id);
    const inCart = state.cart.has(b.id);
    return `
      <article class="book-card reveal in-view" data-category="${b.cat}" data-id="${b.id}">
        <button class="fav-btn ${isSaved ? 'active' : ''}" data-id="${b.id}" aria-label="افزودن به کتابخانه من">
          <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
        ${b.badge ? `<span class="badge-tag">${b.badge}</span>` : ''}
        <div class="book-cover ${b.cls}">
          <i class="fa-solid fa-book"></i>
          <span class="cover-title">${b.title}</span>
        </div>
        <div class="book-info">
          <span class="book-genre">${genreLabel(b.cat)}</span>
          <h3>${b.title}</h3>
          <span class="book-author">نویسنده: ${b.author}</span>
          <div class="rating"><i class="fa-solid fa-star"></i> ${toFa(b.rating)} <span>(امتیاز خوانندگان)</span></div>
          <div class="price-row">
            ${b.old ? `<span class="old-price">${formatPrice(b.old)}</span>` : ''}
            <span class="price">${formatPrice(b.price)}</span>
          </div>
          <button class="btn-add-cart ${inCart ? 'added' : ''}" data-id="${b.id}">
            <i class="fa-solid ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'در سبد خرید' : 'افزودن به سبد'}
          </button>
        </div>
      </article>`;
  }

  const bookGrid = document.getElementById('bookGrid');
  const bestsellersGrid = document.getElementById('bestsellersGrid');
  const genreGrid = document.getElementById('genreGrid');

  function renderGenres() {
    genreGrid.innerHTML = GENRES.map(g => `
      <div class="genre-card reveal in-view" data-filter="${g.filter}">
        <div class="genre-icon ${g.cls}"><i class="fa-solid ${g.icon}"></i></div>
        <span>${g.name}</span>
      </div>`).join('');

    genreGrid.querySelectorAll('.genre-card').forEach(card => {
      card.addEventListener('click', () => {
        setFilter(card.dataset.filter);
        document.getElementById('books').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function renderBooks() {
    bookGrid.innerHTML = BOOKS.map(bookCard).join('');
    bindCardEvents(bookGrid);
    applyFilter();
  }

  function renderBestsellers() {
    const deals = BOOKS.filter(b => b.deal);
    bestsellersGrid.innerHTML = deals.map(bookCard).join('');
    bindCardEvents(bestsellersGrid);
  }

  function bindCardEvents(container) {
    container.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleLibrary(Number(btn.dataset.id)));
    });
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
    });
  }

  function refreshAllCardStates() {
    document.querySelectorAll('.book-card').forEach(card => {
      const id = Number(card.dataset.id);
      const favBtn = card.querySelector('.fav-btn');
      const cartBtn = card.querySelector('.btn-add-cart');
      const isSaved = state.library.has(id);
      const inCart = state.cart.has(id);
      favBtn.classList.toggle('active', isSaved);
      favBtn.querySelector('i').className = `fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`;
      cartBtn.classList.toggle('added', inCart);
      cartBtn.innerHTML = `<i class="fa-solid ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'در سبد خرید' : 'افزودن به سبد'}`;
    });
  }

  /* ---------- Filters ---------- */
  function setFilter(filter) {
    state.filter = filter;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === filter));
    applyFilter();
  }
  function applyFilter() {
    document.querySelectorAll('#bookGrid .book-card').forEach(card => {
      const show = state.filter === 'all' || card.dataset.category === state.filter;
      card.classList.toggle('hidden-item', !show);
    });
  }
  document.getElementById('filterChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) setFilter(chip.dataset.filter);
  });

  /* ---------- Library (wishlist) ---------- */
  function toggleLibrary(id) {
    const book = BOOKS.find(b => b.id === id);
    if (state.library.has(id)) {
      state.library.delete(id);
      showToast(`«${book.title}» از کتابخانه‌ی من حذف شد`, 'fa-bookmark');
    } else {
      state.library.add(id);
      showToast(`«${book.title}» به کتابخانه‌ی من اضافه شد`, 'fa-bookmark');
    }
    refreshAllCardStates();
    updateCounts();
    renderLibraryDrawer();
    document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(b => {
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    });
  }

  function renderLibraryDrawer() {
    const container = document.getElementById('libraryItems');
    if (state.library.size === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-regular fa-bookmark"></i>کتابخانه‌ی شما هنوز خالی است</div>`;
      return;
    }
    container.innerHTML = [...state.library].map(id => {
      const b = BOOKS.find(x => x.id === id);
      return `
        <div class="wish-item">
          <div class="item-thumb ${b.cls}"><i class="fa-solid fa-book"></i></div>
          <div class="item-info">
            <h4>${b.title}</h4>
            <span class="price">${formatPrice(b.price)}</span><br>
            <a href="#" class="remove-item" data-id="${b.id}">حذف از کتابخانه</a>
          </div>
        </div>`;
    }).join('');
    container.querySelectorAll('.remove-item').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); toggleLibrary(Number(a.dataset.id)); });
    });
  }

  /* ---------- Cart ---------- */
  function addToCart(id) {
    const book = BOOKS.find(b => b.id === id);
    const currentQty = state.cart.get(id) || 0;
    state.cart.set(id, currentQty + 1);
    showToast(`«${book.title}» به سبد خرید اضافه شد`, 'fa-cart-plus');
    refreshAllCardStates();
    updateCounts();
    renderCartDrawer();
  }
  function changeQty(id, delta) {
    const current = state.cart.get(id) || 0;
    const next = current + delta;
    if (next <= 0) { state.cart.delete(id); } else { state.cart.set(id, next); }
    refreshAllCardStates();
    updateCounts();
    renderCartDrawer();
  }
  function removeFromCart(id) {
    state.cart.delete(id);
    refreshAllCardStates();
    updateCounts();
    renderCartDrawer();
  }

  function renderCartDrawer() {
    const container = document.getElementById('cartItems');
    if (state.cart.size === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-basket-shopping"></i>سبد خرید شما خالی است</div>`;
      document.getElementById('cartTotal').textContent = formatPrice(0);
      return;
    }
    let total = 0;
    container.innerHTML = [...state.cart.entries()].map(([id, qty]) => {
      const b = BOOKS.find(x => x.id === id);
      total += b.price * qty;
      return `
        <div class="cart-item">
          <div class="item-thumb ${b.cls}"><i class="fa-solid fa-book"></i></div>
          <div class="item-info">
            <h4>${b.title}</h4>
            <span class="price">${formatPrice(b.price)}</span>
            <div class="qty-control">
              <button data-id="${b.id}" data-delta="-1" aria-label="کاهش">−</button>
              <span>${toFa(qty)}</span>
              <button data-id="${b.id}" data-delta="1" aria-label="افزایش">+</button>
              <a href="#" class="remove-item" data-id="${b.id}" style="margin-inline-start:auto;">حذف</a>
            </div>
          </div>
        </div>`;
    }).join('');
    document.getElementById('cartTotal').textContent = formatPrice(total);

    container.querySelectorAll('.qty-control button').forEach(btn => {
      btn.addEventListener('click', () => changeQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
    });
    container.querySelectorAll('.remove-item').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); removeFromCart(Number(a.dataset.id)); });
    });
  }

  function updateCounts() {
    const cartCount = [...state.cart.values()].reduce((a, b) => a + b, 0);
    const libCount = state.library.size;
    [document.getElementById('cartCount'), document.getElementById('mobileCartCount')].forEach(el => {
      el.textContent = toFa(cartCount);
      el.classList.toggle('show', cartCount > 0);
    });
    [document.getElementById('libraryCount'), document.getElementById('mobileLibraryCount')].forEach(el => {
      el.textContent = toFa(libCount);
      el.classList.toggle('show', libCount > 0);
    });
  }

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (state.cart.size === 0) { showToast('سبد خرید شما خالی است', 'fa-circle-exclamation'); return; }
    showToast('این بخش صرفاً نمایشی است — نمونه‌کار طراحی 📚', 'fa-circle-info');
  });

  /* ---------- Theme toggle (session only — no storage per artifact rules) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  function setTheme(isDark) {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    themeToggle.querySelector('i').className = `fa-solid ${icon}`;
    themeToggleMobile.querySelector('i').className = `fa-solid ${icon}`;
    themeToggleMobile.querySelector('span').textContent = isDark ? 'حالت روز' : 'حالت شب';
  }
  function toggleTheme() {
    const isDark = root.getAttribute('data-theme') !== 'dark';
    setTheme(isDark);
    themeToggle.classList.add('spin');
    setTimeout(() => themeToggle.classList.remove('spin'), 500);
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark);
  themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile.addEventListener('click', toggleTheme);

  /* ---------- Hamburger / mobile menu ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    hamburgerBtn.classList.add('active'); hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active'); mobileMenu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active'); document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    hamburgerBtn.classList.remove('active'); hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active'); mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active'); document.body.style.overflow = '';
  }
  hamburgerBtn.addEventListener('click', () => { mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu(); });
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', () => { closeMobileMenu(); closeCart(); closeLibrary(); closeAuth(); });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (!link.id) closeMobileMenu(); });
  });

  /* ---------- Auth modal ---------- */
  const authOverlay = document.getElementById('authOverlay');
  const authClose = document.getElementById('authClose');
  function openAuth() { authOverlay.classList.add('active'); }
  function closeAuth() { authOverlay.classList.remove('active'); }
  document.getElementById('loginBtn').addEventListener('click', openAuth);
  document.getElementById('mobileLogin').addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); openAuth(); });
  authClose.addEventListener('click', closeAuth);
  authOverlay.addEventListener('click', (e) => { if (e.target === authOverlay) closeAuth(); });

  function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
  }
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  document.querySelectorAll('[data-tab-switch]').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); switchTab(link.dataset.tabSwitch); });
  });
  document.getElementById('loginPanel').addEventListener('submit', (e) => {
    e.preventDefault(); closeAuth(); showToast('این بخش صرفاً نمایشی است — خوش آمدید!', 'fa-face-smile');
  });
  document.getElementById('registerPanel').addEventListener('submit', (e) => {
    e.preventDefault(); closeAuth(); showToast('حساب کاربری با موفقیت ساخته شد (نمایشی)', 'fa-circle-check');
  });

  /* ---------- Cart / library drawers ---------- */
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  function openCart() { cartDrawer.classList.add('active'); cartOverlay.classList.add('active'); cartDrawer.setAttribute('aria-hidden', 'false'); }
  function closeCart() { cartDrawer.classList.remove('active'); cartOverlay.classList.remove('active'); cartDrawer.setAttribute('aria-hidden', 'true'); }
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('mobileCart').addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); openCart(); });
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  const libraryDrawer = document.getElementById('libraryDrawer');
  const libraryOverlay = document.getElementById('libraryOverlay');
  function openLibrary() { libraryDrawer.classList.add('active'); libraryOverlay.classList.add('active'); libraryDrawer.setAttribute('aria-hidden', 'false'); }
  function closeLibrary() { libraryDrawer.classList.remove('active'); libraryOverlay.classList.remove('active'); libraryDrawer.setAttribute('aria-hidden', 'true'); }
  document.getElementById('libraryBtn').addEventListener('click', openLibrary);
  document.getElementById('mobileLibrary').addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); openLibrary(); });
  document.getElementById('libraryClose').addEventListener('click', closeLibrary);
  libraryOverlay.addEventListener('click', closeLibrary);

  /* ---------- Countdown timer (to end of week — Friday midnight, Iran) ---------- */
  function startCountdown() {
    function getTarget() {
      const t = new Date();
      // Friday is day 5 in JS getDay() (0=Sunday). Find next Friday 24:00.
      const day = t.getDay();
      const daysUntilFriday = (5 - day + 7) % 7 || 7;
      t.setDate(t.getDate() + daysUntilFriday);
      t.setHours(0, 0, 0, 0);
      return t;
    }
    let target = getTarget();
    function tick() {
      const now = new Date();
      let diff = target - now;
      if (diff <= 0) { target = getTarget(); diff = target - now; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cdDays').textContent = pad2(d);
      document.getElementById('cdHours').textContent = pad2(h);
      document.getElementById('cdMinutes').textContent = pad2(m);
      document.getElementById('cdSeconds').textContent = pad2(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Toasts ---------- */
  function showToast(message, icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  /* ---------- Newsletter ---------- */
  document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('عضویت شما با موفقیت ثبت شد', 'fa-envelope-circle-check');
    e.target.reset();
  });

  /* ---------- Search (demo filter across title) ---------- */
  document.getElementById('searchBtn').addEventListener('click', doSearch);
  document.getElementById('searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
  function doSearch() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;
    document.getElementById('books').scrollIntoView({ behavior: 'smooth' });
    setFilter('all');
    document.querySelectorAll('#bookGrid .book-card').forEach(card => {
      const title = card.querySelector('h3').textContent;
      card.classList.toggle('hidden-item', !title.includes(q));
    });
    showToast(`نتایج جستجو برای «${q}»`, 'fa-magnifying-glass');
  }

  /* ---------- Header scroll shadow + scroll progress + scroll-to-top ---------- */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 8);
    scrollTopBtn.classList.toggle('show', scrollY > 500);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  function setupReveal() {
    const items = document.querySelectorAll('.reveal:not(.in-view)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(item => io.observe(item));
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderGenres();
    renderBooks();
    renderBestsellers();
    renderCartDrawer();
    renderLibraryDrawer();
    updateCounts();
    startCountdown();
    setupReveal();
    onScroll();
  });
})();
