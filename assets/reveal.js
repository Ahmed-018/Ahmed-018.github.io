// Smooth fade-and-rise as sections scroll into view (works scrolling down and up).
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sel = '.sec-head, .featured, .proj, .job, .info, .case-head, .meta, .prose, .wide, .pair, .table-scroll, .case-end, footer .wrap';
  var items = document.querySelectorAll(sel);
  if (!items.length) return;
  document.documentElement.classList.add('reveal-on');
  items.forEach(function (el) {
    el.classList.add('reveal');
    // stagger cards that sit side by side in a grid
    var parent = el.parentElement;
    if (parent && (parent.classList.contains('grid3') || parent.classList.contains('cols'))) {
      var i = Array.prototype.indexOf.call(parent.children, el) % 3;
      el.style.transitionDelay = (i * 0.12) + 's';
    }
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      } else {
        e.target.classList.remove('in');
        // remember which side it left from so it slides back in from that side
        e.target.classList.toggle('above', e.boundingClientRect.top < 0);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();


// Each "next section" hint fades out once the section it points to comes into view.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.next-link'));
  if (!links.length) return;
  var pairs = links.map(function (a) { return { a: a, t: document.querySelector(a.getAttribute('href')) }; })
                   .filter(function (p) { return p.t; });
  function update() {
    var h = window.innerHeight;
    pairs.forEach(function (p) {
      p.a.classList.toggle('gone', p.t.getBoundingClientRect().top < h * 0.55);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Cards with a video preview: on hover (or focus/tap) show video and text together.
// The card grows a little, and a matching negative margin keeps the page from shifting.
(function () {
  var cards = document.querySelectorAll('.proj.has-preview');
  cards.forEach(function (card) {
    function open() {
      if (card.classList.contains('open')) return;
      var before = card.offsetHeight;
      card.classList.add('open');
      var grow = card.offsetHeight - before;
      card.style.marginBottom = (-grow) + 'px';
      var v = card.querySelector('video'); if (v && v.paused) { v.play().catch(function () {}); }
    }
    function close() {
      card.classList.remove('open');
      card.style.marginBottom = '';
    }
    card.addEventListener('mouseenter', open);
    card.addEventListener('mouseleave', close);
    card.addEventListener('focusin', open);
    card.addEventListener('focusout', function (e) { if (!card.contains(e.relatedTarget)) close(); });
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      if (window.matchMedia('(hover: none)').matches) { card.classList.contains('open') ? close() : open(); }
    });
  });
})();
