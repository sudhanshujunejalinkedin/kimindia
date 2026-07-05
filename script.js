document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Mobile Drawer Toggle ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('open');
            
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('open')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        navLinks.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('open');
                menuToggle.querySelectorAll('.bar').forEach(bar => bar.style.transform = 'none');
                menuToggle.querySelectorAll('.bar')[1].style.opacity = '1';
            });
        });
    }

    // --- Dynamic Target Smooth Scroll ---
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerOffset = 84;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Trigger Reveal Logic ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.86;
        
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // --- Modern Validation Setup ---
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            const formGroups = contactForm.querySelectorAll('.form-group-modern');
            formGroups.forEach(group => group.classList.remove('invalid'));

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const reason = document.getElementById('reason');
            const message = document.getElementById('message');
            const statusMsg = document.getElementById('formStatus');

            if (!name.value.trim()) {
                name.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                email.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            if (!phone.value.trim()) {
                phone.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            if (!reason.value) {
                reason.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            if (!message.value.trim()) {
                message.parentElement.classList.add('invalid');
                isFormValid = false;
            }

            if (isFormValid) {
                statusMsg.textContent = "Thank you. Your message has been received. Our team will contact you soon.";
                statusMsg.className = "form-status-msg success";
                
                contactForm.reset();
                
                setTimeout(() => {
                    statusMsg.style.display = 'none';
                }, 6000);
            }
        });
    }

    // --- Data-driven Program Cards and Media Galleries ---
    const siteData = window.KIN_DATA || {};

    const createImage = (src, alt, className = '') => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.loading = 'lazy';
        img.decoding = 'async';
        if (className) img.className = className;
        return img;
    };

    const programOverview = document.getElementById('programOverview');
    if (programOverview && Array.isArray(siteData.programs)) {
        siteData.programs.forEach(program => {
            const card = document.createElement('a');
            card.className = 'program-overview-card';
            card.href = `programs.html#${program.slug}`;
            card.appendChild(createImage(program.images[0], program.title));

            const body = document.createElement('div');
            body.className = 'program-overview-body';
            body.innerHTML = `
                <span>${program.images.length} photos</span>
                <h3>${program.title}</h3>
                <p>${program.summary}</p>
            `;
            card.appendChild(body);
            programOverview.appendChild(card);
        });
    }

    const programSections = document.getElementById('programSections');
    if (programSections && Array.isArray(siteData.programs)) {
        const nav = document.getElementById('programCategoryNav');
        siteData.programs.forEach(program => {
            if (nav) {
                const link = document.createElement('a');
                link.href = `#${program.slug}`;
                link.textContent = program.title;
                nav.appendChild(link);
            }

            const section = document.createElement('section');
            section.className = 'program-detail-block';
            section.id = program.slug;

            const gallery = document.createElement('div');
            gallery.className = 'program-photo-grid';
            program.images.forEach((imagePath, index) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'media-thumb';
                item.setAttribute('aria-label', `Open ${program.title} photo ${index + 1}`);
                item.appendChild(createImage(imagePath, `${program.title} photo ${index + 1}`));
                item.addEventListener('click', () => openLightbox(imagePath, `${program.title} photo ${index + 1}`));
                gallery.appendChild(item);
            });

            section.innerHTML = `
                <div class="program-detail-copy">
                    <span class="sub-title">${program.focus}</span>
                    <h2>${program.title}</h2>
                    <p>${program.summary}</p>
                    <p>These field activities help KIN India stay close to high-risk communities, strengthen partner response, and support survivors through practical, people-centred follow-up.</p>
                </div>
            `;
            section.appendChild(gallery);
            programSections.appendChild(section);
        });
    }

    const galleryPhotos = document.getElementById('galleryPhotos');
    if (galleryPhotos && Array.isArray(siteData.galleryPhotos)) {
        siteData.galleryPhotos.forEach((imagePath, index) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'media-thumb gallery-photo-thumb';
            item.setAttribute('aria-label', `Open gallery photo ${index + 1}`);
            item.appendChild(createImage(imagePath, `KIN India gallery photo ${index + 1}`));
            item.addEventListener('click', () => openLightbox(imagePath, `KIN India gallery photo ${index + 1}`));
            galleryPhotos.appendChild(item);
        });
    }

    const galleryVideos = document.getElementById('galleryVideos');
    if (galleryVideos && Array.isArray(siteData.galleryVideos)) {
        siteData.galleryVideos.forEach((videoPath, index) => {
            const wrap = document.createElement('div');
            wrap.className = 'video-card';
            const video = document.createElement('video');
            video.src = videoPath;
            video.controls = true;
            video.preload = 'metadata';
            video.setAttribute('playsinline', '');
            wrap.appendChild(video);
            const label = document.createElement('p');
            label.textContent = `Field video ${index + 1}`;
            wrap.appendChild(label);
            galleryVideos.appendChild(wrap);
        });
    }

    const galleryTabs = document.querySelectorAll('[data-gallery-tab]');
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.galleryTab;
            galleryTabs.forEach(item => item.classList.toggle('active', item === tab));
            document.querySelectorAll('[data-gallery-panel]').forEach(panel => {
                panel.classList.toggle('active', panel.dataset.galleryPanel === target);
            });
        });
    });

    const newsArticle = document.getElementById('newsArticle');
    if (newsArticle && siteData.article) {
        const article = siteData.article;
        newsArticle.innerHTML = `
            <article class="news-feature-card">
                <img src="${article.image}" alt="${article.title}" loading="lazy" decoding="async">
                <div class="news-feature-copy">
                    <span class="sub-title">${article.source} | ${article.date}</span>
                    <h2>${article.title}</h2>
                    <p>${article.summary}</p>
                    <a class="btn btn-primary" href="${article.url}" target="_blank" rel="noopener noreferrer">Read Source Article</a>
                </div>
            </article>
        `;
    }

    function openLightbox(src, alt) {
        const existing = document.querySelector('.media-lightbox');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'media-lightbox';
        overlay.innerHTML = `
            <button type="button" class="lightbox-close" aria-label="Close image">x</button>
            <img src="${src}" alt="${alt}">
        `;
        overlay.addEventListener('click', event => {
            if (event.target === overlay || event.target.classList.contains('lightbox-close')) {
                overlay.remove();
            }
        });
        document.body.appendChild(overlay);
    }
});
