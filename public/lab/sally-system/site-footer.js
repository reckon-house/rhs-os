// Sally site footer — shared context chrome for the homepage concepts.
// Injected at the end of every concept page by one source file, like
// site-header.js. Close to sallybeauty.com: blush field, newsletter
// band, five link columns, Follow Us social row, ghost SALLY watermark,
// copyright. Styled via homepage.css "SITE FOOTER".
(function () {
  var f = document.createElement('footer');
  f.className = 'usf';
  var col = function (title, links) {
    return '<div class="usf-col"><h4>' + title + '</h4>' +
      links.map(function (l) { return '<a href="#">' + l + '</a>'; }).join('') + '</div>';
  };
  f.innerHTML = [
    '<div class="usf-news">',
    '  <h3>Sign up for news &amp; special offers</h3>',
    '  <div class="usf-news-form">',
    '    <span class="usf-email">Enter your email address</span>',
    '    <span class="usf-signup">Sign up</span>',
    '  </div>',
    '  <div class="usf-news-sep"></div>',
    '  <div class="usf-sms">',
    '    <p class="big">Get 15% off your next online order</p>',
    '    <a href="#">Sign up for text updates &rsaquo;</a>',
    '  </div>',
    '</div>',
    '<div class="usf-cols">',
    col('Help', ['FAQ', 'Orders', 'Check Order Status', 'Shipping Information', 'Returns', 'Contact Us', 'Find Your Nearest Store']),
    col('Popular', ['Free Hair Color Advice', 'DIY University', 'Earn Rewards', 'Rewards Credit Card', 'Pro Member Pricing', 'Gift Cards']),
    col('Shop', ['Hair Color', 'Hair Care', 'Tools &amp; Brushes', 'Nails', 'Cosmetics &amp; Skin Care', 'Salon Supplies', 'Shop by Brand']),
    col('About', ['Business with Sally', 'Sally Newsroom', 'Careers', 'Sally Beauty Holdings, Inc.', 'Investor Relations', 'History']),
    col('Terms &amp; Privacy', ['Privacy Policy', 'Terms of Use', 'Coupon Policy', 'Your Privacy Choices', 'Cookie Settings', 'Accessibility Statement']),
    '</div>',
    '<div class="usf-social">',
    '  <span class="lbl">Follow Us:</span>',
    '  <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.3 1.8 1.5 3.2 3.4 3.4v3c-1.4 0-2.6-.4-3.6-1.1v5.8c0 3.3-2.2 5.4-5.2 5.4-2.9 0-5.2-2.1-5.2-5 0-2.8 2.1-4.9 5-5 .3 0 .7 0 1 .1v3.1a2.6 2.6 0 0 0-1-.2 2 2 0 0 0-2 2c0 1.2.9 2 2.1 2 1.3 0 2.2-.9 2.2-2.6V3h3.3z"/></svg></a>',
    '  <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>',
    '  <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H8.5v3h2.8v7h2.2z"/></svg></a>',
    '  <a href="#" aria-label="Pinterest"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.8-.2-2 0-2.8l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.6 2.1-4.6 4.4 0 .9.3 1.8.8 2.3l-.3 1.1c-.1.4-.3.5-.6.3-1.2-.6-1.9-2.3-1.9-3.8 0-3.1 2.2-5.9 6.5-5.9 3.4 0 6 2.4 6 5.7 0 3.4-2.1 6.1-5.1 6.1-1 0-1.9-.5-2.3-1.1l-.6 2.3c-.2.9-.8 1.9-1.2 2.6A9 9 0 1 0 12 3z"/></svg></a>',
    '  <a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h3.6l4.1 5.7L16.6 4H20l-6.5 7.5L20.4 20h-3.6l-4.5-6.2L7 20H3.6l7-8L4 4z"/></svg></a>',
    '  <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.3 8.1c-.2-1.3-.9-2.1-2.2-2.3C17.3 5.5 12 5.5 12 5.5s-5.3 0-7.1.3C3.6 6 2.9 6.8 2.7 8.1 2.5 9.6 2.5 12 2.5 12s0 2.4.2 3.9c.2 1.3.9 2.1 2.2 2.3 1.8.3 7.1.3 7.1.3s5.3 0 7.1-.3c1.3-.2 2-1 2.2-2.3.2-1.5.2-3.9.2-3.9s0-2.4-.2-3.9zM10 15V9l5.2 3L10 15z"/></svg></a>',
    '</div>',
    '<p class="usf-copy">&copy; 2026 Sally Beauty Supply LLC</p>',
    '<div class="usf-ghost" aria-hidden="true">SALLY</div>',
  ].join('\n');
  document.body.appendChild(f);
})();
