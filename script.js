	const products = [
			{ id: 1, name: "Café Irish", origin: "Irlanda • Tostado Medio", price: 4.60, oldPrice: 5.30, rating: 4, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80", badge: "-13%", filter: "hot" },
			{ id: 2, name: "Café Inglés", origin: "Inglaterra • Tostado Oscuro", price: 5.70, oldPrice: 7.30, rating: 3, img: "https://images.unsplash.com/photo-1494314671902-399b18174975?w=500&q=80", badge: "-22%", filter: "hot" },
			{ id: 3, name: "Café Australiano", origin: "Australia • Tostado Claro", price: 3.20, rating: 5, img: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&q=80", badge: "new", filter: "cold" },
			{ id: 4, name: "Café Helado", origin: "Brasil • Cold Brew", price: 5.60, rating: 4, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80", badge: "", filter: "cold" },
			{ id: 5, name: "Café Viena", origin: "Austria • Especial", price: 3.85, oldPrice: 5.50, rating: 5, img: "https://www.recetas-judias.com/base/stock/Recipe/cafe-de-viena/cafe-de-viena_web.jpg.webp", badge: "-30%", filter: "special" },
			{ id: 6, name: "Café Liqueurs", origin: "Francia • Premium", price: 5.60, rating: 4, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8RCPxtCkiKhFkw66Lq8UcuGHIRG0VjBkOQg&s", badge: "", filter: "special" },
			{ id: 7, name: "Ethiopian Yirgacheffe", origin: "Etiopía • Monoorigen", price: 6.80, rating: 5, img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&q=80", badge: "new", filter: "hot" },
			{ id: 8, name: "Cold Brew Naranja", origin: "Colombia • Cítrico", price: 4.90, rating: 4, img: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80", badge: "new", filter: "cold" },
		];

		let cart = [];
		let activeFilter = 'all';

	
		function renderProducts(filter = 'all') {
			const grid = document.getElementById('productsGrid');
			const filtered = filter === 'all' ? products : products.filter(p => p.filter === filter);
			grid.innerHTML = filtered.map(p => `
    <div class="product-card reveal" data-id="${p.id}">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge ${p.badge === 'new' ? 'new' : ''}">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="product-action-btn" title="Ver"><i class="fa-regular fa-eye"></i></button>
          <button class="product-action-btn" title="Favorito" onclick="toggleWishlist(this)"><i class="fa-regular fa-heart"></i></button>
        </div>
      </div>
      <div class="product-body">
        <div class="product-stars">${renderStars(p.rating)}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-origin">${p.origin}</p>
        <div class="product-footer">
          <div class="product-price">
            $${p.price.toFixed(2)}
            ${p.oldPrice ? `<span class="old">$${p.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Añadir</button>
        </div>
      </div>
    </div>
  `).join('');
		
			setTimeout(() => {
				grid.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
			}, 50);
		}

		function renderStars(n) {
			return Array.from({ length: 5 }, (_, i) =>
				`<i class="fa fa-star${i < n ? '' : ' empty'}"></i>`
			).join('');
		}

		document.querySelectorAll('.filter-tab').forEach(tab => {
			tab.addEventListener('click', () => {
				document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
				tab.classList.add('active');
				activeFilter = tab.dataset.filter;
				const grid = document.getElementById('productsGrid');
				grid.style.opacity = '0';
				grid.style.transform = 'translateY(20px)';
				setTimeout(() => {
					renderProducts(activeFilter);
					grid.style.transition = 'opacity 0.4s, transform 0.4s';
					grid.style.opacity = '1';
					grid.style.transform = 'translateY(0)';
				}, 300);
			});
		});

	
		function addToCart(id) {
			const product = products.find(p => p.id === id);
			const existing = cart.find(i => i.id === id);
			if (existing) {
				existing.qty++;
			} else {
				cart.push({ ...product, qty: 1 });
			}
			updateCart();
			showToast(`<i class="fa fa-mug-hot"></i> <span>${product.name} añadido al carrito</span>`);
	
			const badge = document.getElementById('cartBadge');
			badge.classList.remove('bump');
			void badge.offsetWidth;
			badge.classList.add('bump');
		}

		function updateCart() {
			const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
			const count = cart.reduce((s, i) => s + i.qty, 0);
			document.getElementById('cartBadge').textContent = count;
			document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
			renderCartItems();
		}

		function renderCartItems() {
			const container = document.getElementById('cartItems');
			if (!cart.length) {
				container.innerHTML = `<div class="cart-empty"><i class="fa fa-mug-hot"></i><p>Tu carrito está vacío</p></div>`;
				return;
			}
			container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fa fa-trash"></i></button>
    </div>
  `).join('');
		}

		function changeQty(id, delta) {
			const item = cart.find(i => i.id === id);
			if (!item) return;
			item.qty += delta;
			if (item.qty <= 0) removeFromCart(id);
			else updateCart();
		}

		function removeFromCart(id) {
			cart = cart.filter(i => i.id !== id);
			updateCart();
		}

		const cartBtn = document.getElementById('cartBtn');
		const cartPanel = document.getElementById('cartPanel');
		const cartOverlay = document.getElementById('cartOverlay');
		const cartClose = document.getElementById('cartClose');

		function openCart() {
			cartPanel.classList.add('open');
			cartOverlay.classList.add('open');
			document.body.style.overflow = 'hidden';
		}
		function closeCart() {
			cartPanel.classList.remove('open');
			cartOverlay.classList.remove('open');
			document.body.style.overflow = '';
		}
		cartBtn.addEventListener('click', openCart);
		cartClose.addEventListener('click', closeCart);
		cartOverlay.addEventListener('click', closeCart);

		function checkout() {
			if (!cart.length) {
				showToast('<i class="fa fa-exclamation-circle"></i> <span>Tu carrito está vacío</span>');
				return;
			}
			closeCart();
			setTimeout(() => {
				showToast('<i class="fa fa-check-circle"></i> <span>¡Pedido realizado con éxito! 🎉</span>');
				cart = [];
				updateCart();
			}, 500);
		}

		function toggleWishlist(btn) {
			const icon = btn.querySelector('i');
			if (icon.classList.contains('fa-regular')) {
				icon.classList.replace('fa-regular', 'fa-solid');
				btn.style.background = 'var(--gold)';
				btn.style.color = 'var(--espresso)';
				showToast('<i class="fa fa-heart"></i> <span>Añadido a favoritos</span>');
			} else {
				icon.classList.replace('fa-solid', 'fa-regular');
				btn.style.background = '';
				btn.style.color = '';
			}
		}

		function showToast(html) {
			const container = document.getElementById('toastContainer');
			const toast = document.createElement('div');
			toast.className = 'toast';
			toast.innerHTML = html + `<button class="toast-close" onclick="this.parentElement.remove()"><i class="fa fa-times"></i></button>`;
			container.appendChild(toast);
			requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
			setTimeout(() => {
				toast.classList.remove('show');
				setTimeout(() => toast.remove(), 400);
			}, 3500);
		}

		function subscribeNewsletter(e) {
			e.preventDefault();
			const email = document.getElementById('newsletterEmail').value;
			showToast(`<i class="fa fa-envelope"></i> <span>¡Suscrito con ${email}! 🎉</span>`);
			e.target.reset();
		}

		document.querySelectorAll('.gallery-item').forEach(item => {
			item.addEventListener('click', () => {
				const img = item.querySelector('img');
				document.getElementById('lightboxImg').src = img.src;
				document.getElementById('lightbox').classList.add('open');
				document.body.style.overflow = 'hidden';
			});
		});
		document.getElementById('lightboxClose').addEventListener('click', () => {
			document.getElementById('lightbox').classList.remove('open');
			document.body.style.overflow = '';
		});
		document.getElementById('lightbox').addEventListener('click', e => {
			if (e.target === e.currentTarget) {
				e.currentTarget.classList.remove('open');
				document.body.style.overflow = '';
			}
		});

		let currentSlide = 0;
		const slides = document.querySelectorAll('.testimonial-slide');
		const track = document.getElementById('testimonialsTrack');
		const dotsContainer = document.getElementById('sliderDots');

		slides.forEach((_, i) => {
			const dot = document.createElement('button');
			dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
			dot.addEventListener('click', () => goToSlide(i));
			dotsContainer.appendChild(dot);
		});

		function goToSlide(n) {
			currentSlide = n;
			track.style.transform = `translateX(-${n * 100}%)`;
			document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === n));
		}

		setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);


		function updateCountdown() {
			const target = new Date(); target.setHours(target.getHours() + 8, 35, 0, 0);
			const stored = sessionStorage.getItem('countdownEnd') || target.toISOString();
			if (!sessionStorage.getItem('countdownEnd')) sessionStorage.setItem('countdownEnd', stored);
			const end = new Date(sessionStorage.getItem('countdownEnd'));
			const now = new Date();
			const diff = Math.max(0, end - now);
			const h = Math.floor(diff / 3600000);
			const m = Math.floor((diff % 3600000) / 60000);
			const s = Math.floor((diff % 60000) / 1000);
			document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
			document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
			document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
		}
		setInterval(updateCountdown, 1000);
		updateCountdown();


		window.addEventListener('load', () => {
			setTimeout(() => {
				document.getElementById('loader').classList.add('hidden');
				document.body.style.overflow = '';
				startCounters();
			}, 2200);
		});
		document.body.style.overflow = 'hidden';

		function startCounters() {
			document.querySelectorAll('[data-count]').forEach(el => {
				const target = parseInt(el.dataset.count);
				const duration = 2000;
				const step = target / (duration / 16);
				let current = 0;
				const timer = setInterval(() => {
					current = Math.min(current + step, target);
					el.textContent = target >= 1000 ? Math.floor(current / 1000) + 'K+' : Math.floor(current) + '+';
					if (current >= target) clearInterval(timer);
				}, 16);
			});
		}

		const revealObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) entry.target.classList.add('visible');
			});
		}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

		function observeReveal() {
			document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
		}

		window.addEventListener('scroll', () => {
			document.getElementById('siteHeader').classList.toggle('scrolled', window.scrollY > 80);
		});

		const cursor = document.getElementById('cursor');
		const follower = document.getElementById('cursorFollower');
		let fx = 0, fy = 0, mx = 0, my = 0;

		document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });

		function animateFollower() {
			fx += (mx - fx) * 0.12;
			fy += (my - fy) * 0.12;
			follower.style.left = fx + 'px';
			follower.style.top = fy + 'px';
			requestAnimationFrame(animateFollower);
		}
		animateFollower();

		document.querySelectorAll('a, button, .cat-card, .product-card, .blog-card, .gallery-item').forEach(el => {
			el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
			el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
		});

		const mobileToggle = document.getElementById('mobileToggle');
		const mobileMenu = document.getElementById('mobileMenu');
		mobileToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
		function closeMobile() { mobileMenu.classList.remove('open'); }

	
		renderProducts('all');
		observeReveal();

	
		setTimeout(observeReveal, 200);