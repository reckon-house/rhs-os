// Sally site header — shared context chrome for the homepage concepts.
// One source, injected at the top of every concept page so reviews see
// the content in real-site context. Utility bar → logo / search /
// account / bag → category nav. Styled with system tokens (see
// homepage.css "SITE HEADER"). Red wordmark stands in for the seasonal
// rainbow logo until that asset is supplied.
(function () {
  var h = document.createElement('header');
  h.className = 'ush';
  h.innerHTML = [
    '<div class="ush-util">',
    '  <div class="ush-util-left">',
    '    <a class="ush-store" href="#">',
    '      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 6.5 3 2.5h10l1 4M2 6.5v7h12v-7M2 6.5h12M6 13.5V9.5h4v4"/></svg>',
    '      <span>11550 Legacy Dr Ste 460</span>',
    '    </a>',
    '    <span class="ush-vsep"></span>',
    '    <span class="ush-ship">Free 2 Hour Delivery on orders over $35</span>',
    '  </div>',
    '  <nav class="ush-util-links">',
    '    <a href="#">Rewards</a><a href="#">Credit Card</a><a href="#">Find a Store</a>',
    '  </nav>',
    '</div>',
    '<div class="ush-main">',
    '  <a class="ush-logo" href="#"><img src="assets/brand/sally-logo-red.webp" alt="Sally Beauty" /></a>',
    '  <div class="ush-search">',
    '    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/><path d="m12.5 12.5 3.5 3.5"/></svg>',
    '    <span>Search</span>',
    '  </div>',
    '  <div class="ush-account">',
    '    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="7.5" r="3.5"/><path d="M4.5 18.5c1-3.4 3.5-5 6.5-5s5.5 1.6 6.5 5"/></svg>',
    '    <span class="ush-acct-copy"><b>Oh hey, Gorgeous!</b><a href="#">Sign in or Register</a></span>',
    '  </div>',
    '  <a class="ush-bag" href="#">',
    '    <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.5 7.5h13l-1 11h-11z"/><path d="M7.5 9.5v-3a3.5 3.5 0 0 1 7 0v3"/></svg>',
    '    <span class="ush-badge">0</span>',
    '  </a>',
    '</div>',
    '<nav class="ush-nav">',
    '  <a href="#">Deals</a><a href="#">Hair Color</a><a href="#">Hair Care</a><a href="#">Tools &amp; Brushes</a><a href="#">Nails</a><a href="#">Cosmetics &amp; Skin Care</a><a href="#">Fragrances</a><a href="#">Men\'s Grooming</a><a href="#">Salon Supplies</a><a href="#">Brands</a>',
    '</nav>',
  ].join('\n');
  document.body.insertBefore(h, document.body.firstChild);
})();
