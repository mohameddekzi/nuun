(function () {
	var header = document.querySelector('.tu-header');
	var firstBlock = document.querySelector('.tu-main .wp-block-post-content > *:first-child');
	var hasHero = !!(firstBlock && firstBlock.classList.contains('tu-hero'));
	if (!hasHero) document.body.classList.add('tu-no-hero');
	function onScroll() {
		if (!header) return;
		var menuOpen = !!document.querySelector('.tu-nav .is-menu-open');
		header.classList.toggle('is-solid', !hasHero || menuOpen || window.scrollY > 40);
	}
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });
	document.addEventListener('click', function () { setTimeout(onScroll, 30); });

	// Reveal sections on scroll.
	var targets = document.querySelectorAll('.tu-main .wp-block-post-content > *:not(.tu-hero), .tu-reveal');
	if (!('IntersectionObserver' in window)) return;
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
		});
	}, { threshold: 0.08 });
	targets.forEach(function (el) {
		if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
		el.classList.add('tu-reveal-on');
		io.observe(el);
	});
	setTimeout(function () { targets.forEach(function (el) { el.classList.add('is-visible'); }); }, 4000);
})();
