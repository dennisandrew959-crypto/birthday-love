(() => {
  const CFG = window.BIRTHDAY_CONFIG;
  const AudioFX = window.BirthdayAudio;

  /* =========================================================
     1. CONFETTI & SPARKLE PARTICLE ENGINE
     ========================================================= */
  const Confetti = (() => {
    const canvas = document.getElementById("confetti-canvas");
    const ctx = canvas.getContext("2d");
    const colors = ["#1f6b49", "#52a677", "#b993ff", "#7c4dff", "#ffd97d", "#ffffff"];
    let particles = [];
    let rafId = null;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function spawn(x, y, count = 40, spread = 7) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * spread;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: 5 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
          alpha: 1,
          shape: Math.random() > 0.35 ? "rect" : "circle",
        });
      }
      if (!rafId) tick();
    }

    function shower() {
      const w = canvas.width;
      spawn(w * 0.2, canvas.height * 0.25, 45, 9);
      spawn(w * 0.5, canvas.height * 0.2, 60, 10);
      spawn(w * 0.8, canvas.height * 0.25, 45, 9);
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.alpha > 0.02 && p.y < canvas.height + 40);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.vx *= 0.99;
        p.rot += p.vRot;
        p.alpha -= 0.0085;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return { burst: spawn, shower };
  })();

  /* =========================================================
     2. AMBIENT FLOATING PETALS & GLOBAL CONTROLS
     ========================================================= */
  function initFloatingPetals() {
    const container = document.getElementById("floating-petals");
    const icons = ["🌿", "🍃", "💜", "✨", "🌱"];
    for (let i = 0; i < 14; i++) {
      const el = document.createElement("span");
      el.className = "petal-particle";
      el.textContent = icons[i % icons.length];
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${14 + Math.random() * 10}px`;
      el.style.animationDuration = `${12 + Math.random() * 12}s`;
      el.style.animationDelay = `${-Math.random() * 16}s`;
      container.appendChild(el);
    }
  }

  function initSoundToggle() {
    const soundBtn = document.getElementById("sound-toggle");
    const soundIcon = document.getElementById("sound-icon");
    const soundText = document.getElementById("sound-text");

    const musicBtn = document.getElementById("music-toggle");
    const musicText = document.getElementById("music-text");

    AudioFX.onMusicStateChange(({ playing, muted, title }) => {
      musicBtn.classList.toggle("is-playing", playing);
      musicText.textContent = playing ? title : "Play Song";
      soundIcon.textContent = muted ? "🔇" : "🔊";
      soundText.textContent = muted ? "Muted" : "Sound On";
    });

    musicBtn.addEventListener("click", () => {
      AudioFX.toggleMusic();
    });

    soundBtn.addEventListener("click", () => {
      AudioFX.toggleMute();
    });
  }

  /* =========================================================
     3. PAGE NAVIGATION & CONFIG HYDRATION
     ========================================================= */
  let currentPage = 1;

  function goToPage(targetStep) {
    if (targetStep === currentPage) return;
    const prevEl = document.getElementById(`page-${currentPage}`);
    const nextEl = document.getElementById(`page-${targetStep}`);

    prevEl.classList.remove("is-active");
    prevEl.classList.add("is-leaving");

    document.querySelectorAll(".progress-pill").forEach((pill) => {
      const step = Number(pill.dataset.step);
      pill.classList.toggle("is-active", step === targetStep);
      pill.classList.toggle("is-done", step < targetStep);
    });

    setTimeout(() => {
      prevEl.classList.remove("is-leaving");
      nextEl.classList.add("is-active");
      currentPage = targetStep;
      if (targetStep === 2 && typeof window.__resetSwipeControl === "function") {
        window.__resetSwipeControl();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 360);
  }

  function hydrateContent() {
    document.title = CFG.pageTitle || "Happy Birthday ✨";
    document.getElementById("p1-tag").textContent = CFG.giftBox.tag;
    document.getElementById("p1-headline").textContent = CFG.giftBox.headline;
    document.getElementById("p1-subtext").textContent = CFG.giftBox.subtext;
    document.getElementById("p1-pull-hint").textContent = CFG.giftBox.pullHint;
    document.getElementById("gift-box-name").textContent = CFG.girlfriendName;

    document.getElementById("p2-gf-name").textContent = CFG.girlfriendName;
    document.getElementById("p2-gallery-heading").textContent = CFG.galleryHeading;
    document.getElementById("p2-gallery-subheading").textContent = CFG.gallerySubheading;
    document.getElementById("p2-random-pics-heading").textContent = CFG.randomPicsHeading || "Random Little Snapshots";
    document.getElementById("p2-random-pics-subheading").textContent = CFG.randomPicsSubheading || "Every picture is hidden — tap any card to open!";
    document.getElementById("swipe-label").textContent = CFG.swipeButton.idleText;

    document.getElementById("p3-heading").textContent = CFG.cake.heading;
    document.getElementById("p3-subtext").textContent = CFG.cake.subtext;
    document.getElementById("blow-count-text").textContent = `0 / ${CFG.cake.tapsRequired}`;

    document.getElementById("paper-prompt-text").textContent = CFG.letter.paperPrompt;
    document.getElementById("paper-subprompt-text").textContent = CFG.letter.paperSubPrompt || "Hold & pull down ↓ to open";
    document.getElementById("letter-stamp-text").textContent = CFG.letter.stampText;
    document.getElementById("letter-salutation").textContent = CFG.letter.salutation;
    document.getElementById("letter-closing").textContent = CFG.letter.closing;
    document.getElementById("letter-signature").textContent = CFG.letter.signature;

    const letterBody = document.getElementById("letter-body");
    letterBody.innerHTML = "";
    CFG.letter.paragraphs.forEach((p) => {
      const para = document.createElement("p");
      para.textContent = p;
      letterBody.appendChild(para);
    });
  }

  /* =========================================================
     4. PAGE 1: PULL THE RIBBON TO OPEN THE GIFT BOX
     ========================================================= */
  function initGiftRibbon() {
    const handle = document.getElementById("ribbon-pull-handle");
    const box = document.getElementById("gift-box");
    const meterFill = document.getElementById("pull-meter-fill");
    const bow = document.getElementById("gift-bow");

    const MAX_PULL = 96;
    const OPEN_THRESHOLD = 72;
    let dragging = false;
    let startY = 0;
    let currentPull = 0;
    let opened = false;

    function updateVisual(px) {
      currentPull = Math.max(0, Math.min(MAX_PULL, px));
      const pct = Math.round((currentPull / OPEN_THRESHOLD) * 100);
      handle.style.setProperty("--pull-px", `${currentPull}px`);
      handle.setAttribute("aria-valuenow", String(Math.min(100, pct)));
      meterFill.style.width = `${Math.min(100, pct)}%`;
      bow.style.transform = `translateX(-50%) scale(${1 + currentPull / 380})`;
    }

    function triggerOpen() {
      if (opened) return;
      opened = true;
      dragging = false;
      handle.classList.remove("is-pulling");
      box.classList.add("is-opening");
      meterFill.style.width = "100%";

      AudioFX.playGiftOpen();
      const rect = box.getBoundingClientRect();
      Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 75, 10);

      setTimeout(() => goToPage(2), 950);
    }

    handle.addEventListener("pointerdown", (e) => {
      if (opened) return;
      AudioFX.unlock();
      dragging = true;
      startY = e.clientY - currentPull;
      handle.classList.add("is-pulling");
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
      if (!dragging || opened) return;
      const deltaY = e.clientY - startY;
      updateVisual(deltaY);
      if (deltaY > 12) {
        AudioFX.playRibbonPull(Math.min(1, deltaY / OPEN_THRESHOLD));
      }
      if (deltaY >= OPEN_THRESHOLD) {
        triggerOpen();
      }
    });

    function endPull() {
      if (!dragging || opened) return;
      dragging = false;
      handle.classList.remove("is-pulling");
      updateVisual(0);
    }

    handle.addEventListener("pointerup", endPull);
    handle.addEventListener("pointercancel", endPull);

    // Keyboard accessibility for ribbon pull
    handle.addEventListener("keydown", (e) => {
      if (opened) return;
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        AudioFX.unlock();
        updateVisual(OPEN_THRESHOLD);
        triggerOpen();
      }
    });
  }

  /* =========================================================
     5. PAGE 2: 4 PICTURES OF US (WITH ROMANTIC SVG FALLBACKS)
     ========================================================= */
  function createFallbackArt(index) {
    const scenes = [
      { bg1: "#d5efe0", bg2: "#eadcff", icon: "🌿", title: "Us Laughing", sub: "Drop photo1.jpg in assets/" },
      { bg1: "#e6dcff", bg2: "#d8f0e2", icon: "🌅", title: "Golden Hour", sub: "Drop photo2.jpg in assets/" },
      { bg1: "#cde8d7", bg2: "#f3e8ff", icon: "🧋", title: "Cozy Dates", sub: "Drop photo3.jpg in assets/" },
      { bg1: "#efe4ff", bg2: "#c8e6d4", icon: "💚", title: "You & Me", sub: "Drop photo4.jpg in assets/" },
    ];
    const scene = scenes[index % scenes.length];
    return `
      <div class="polaroid-fallback" style="background: linear-gradient(135deg, ${scene.bg1}, ${scene.bg2});">
        <div style="font-size: 46px; margin-bottom: 8px;">${scene.icon}</div>
        <div style="font-family: var(--font-serif); font-size: 22px; font-weight: 700; color: var(--green-deep);">${scene.title}</div>
        <div style="font-size: 12px; color: var(--ink-muted); margin-top: 4px;">${scene.sub}</div>
      </div>
    `;
  }

  /* =========================================================
     5. PAGE 2: 4 PICTURES OF US + RANDOM SNAPSHOTS (TAP TO REVEAL)
     ========================================================= */
  const Lightbox = (() => {
    const modal = document.getElementById("photo-lightbox");
    const backdrop = document.getElementById("lightbox-backdrop");
    const closeBtn = document.getElementById("lightbox-close-btn");
    const img = document.getElementById("lightbox-img");
    const tag = document.getElementById("lightbox-tag");
    const caption = document.getElementById("lightbox-caption");
    const note = document.getElementById("lightbox-note");

    function open({ src, label, title, text }) {
      img.src = src;
      img.alt = title || "Birthday memory";
      tag.textContent = label || "Memory";
      caption.textContent = title || "";
      note.textContent = text || "";
      note.classList.toggle("is-hidden", !text);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        close();
      }
    });

    return { open, close };
  })();

  function initPhotoGallery() {
    const grid = document.getElementById("photo-grid");
    grid.innerHTML = "";

    CFG.photos.slice(0, 4).forEach((photo, idx) => {
      const card = document.createElement("div");
      card.className = "polaroid-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Memory ${idx + 1}: Tap to reveal picture.`);

      const washiClass = idx % 2 === 0 ? "washi-green" : "washi-purple";

      card.innerHTML = `
        <div class="polaroid-inner">
          <div class="polaroid-face polaroid-front">
            <div class="polaroid-washi ${washiClass}"></div>
            <div class="polaroid-frame">
              <img src="${photo.src}" alt="${photo.caption}" loading="lazy" />
              <div class="polaroid-cover">
                <span class="cover-seal" aria-hidden="true">📸</span>
                <span class="cover-title">${photo.date}</span>
                <span class="cover-sub">Tap to reveal photo</span>
              </div>
              <button type="button" class="polaroid-zoom-btn" aria-label="View full photo">🔍</button>
            </div>
            <div class="polaroid-meta">
              <span class="polaroid-caption">${photo.caption}</span>
              <span class="polaroid-flip-hint">Tap to open</span>
            </div>
            <span class="polaroid-date">${photo.date}</span>
          </div>
          <div class="polaroid-face polaroid-back">
            <span class="back-tag">${photo.date}</span>
            <p class="back-note">“${photo.note}”</p>
            <span class="back-footer">Tap to flip back ↺</span>
          </div>
        </div>
      `;

      const frame = card.querySelector(".polaroid-frame");
      const img = card.querySelector("img");
      img.addEventListener("error", () => {
        frame.innerHTML = createFallbackArt(idx);
      });

      const inner = card.querySelector(".polaroid-inner");
      const hint = card.querySelector(".polaroid-flip-hint");
      const zoomBtn = card.querySelector(".polaroid-zoom-btn");
      let revealed = false;

      zoomBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!revealed) return;
        AudioFX.unlock();
        AudioFX.playSparkle();
        Lightbox.open({
          src: photo.src,
          label: photo.date,
          title: photo.caption,
          text: photo.note,
        });
      });

      const handleCardTap = () => {
        AudioFX.unlock();
        if (!revealed) {
          revealed = true;
          card.classList.add("is-revealed");
          hint.textContent = "↻ note";
          card.setAttribute("aria-label", `Memory ${idx + 1}: ${photo.caption}. Tap again to flip and read note.`);
          AudioFX.playGiftDraw();
          const rect = card.getBoundingClientRect();
          Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24, 6);
          return;
        }
        AudioFX.playSparkle();
        inner.classList.toggle("is-flipped");
      };

      card.addEventListener("click", handleCardTap);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardTap();
        }
      });

      grid.appendChild(card);
    });
  }

  function initRandomPhotos() {
    const grid = document.getElementById("random-photos-grid");
    const drawBtn = document.getElementById("draw-random-photo-btn");
    const counter = document.getElementById("random-pics-counter");
    const items = [...(CFG.randomPhotos || [])];

    // Shuffle randomly on each load
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    const revealedSet = new Set();
    const cardEls = [];

    function updateCounter() {
      counter.textContent = `${revealedSet.size} / ${items.length} opened`;
    }

    function openSnapshot(idx, card) {
      AudioFX.unlock();
      const firstOpen = !revealedSet.has(idx);
      revealedSet.add(idx);
      card.classList.add("is-revealed");
      const item = items[idx];

      if (firstOpen) {
        card.querySelector(".snap-caption").textContent = item.caption;
        card.querySelector(".snap-tag").textContent = item.tag || "Memory";
        AudioFX.playGiftDraw();
        const rect = card.getBoundingClientRect();
        Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22, 6);
        updateCounter();
      } else {
        AudioFX.playSparkle();
      }

      Lightbox.open({
        src: item.src,
        label: item.tag || "Snapshot",
        title: item.caption,
        text: "",
      });
    }

    grid.innerHTML = "";
    items.forEach((item, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "snap-card";
      card.setAttribute("aria-label", `Hidden snapshot ${idx + 1}. Tap to open.`);
      card.innerHTML = `
        <div class="snap-frame">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" />
          <div class="snap-cover">
            <span class="snap-cover-icon" aria-hidden="true">📷</span>
            <span class="snap-cover-text">Tap to open</span>
          </div>
        </div>
        <span class="snap-tag">Mystery Pic #${idx + 1}</span>
        <span class="snap-caption">Tap to reveal ✨</span>
      `;
      card.addEventListener("click", () => openSnapshot(idx, card));
      grid.appendChild(card);
      cardEls.push(card);
    });

    updateCounter();

    drawBtn.addEventListener("click", () => {
      const unrevealed = items.map((_, i) => i).filter((i) => !revealedSet.has(i));
      const pool = unrevealed.length > 0 ? unrevealed : items.map((_, i) => i);
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      cardEls[chosen].scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => openSnapshot(chosen, cardEls[chosen]), 250);
    });
  }

  /* =========================================================
     6. PAGE 2 -> PAGE 3: HOLD & SWIPE BUTTON
     ========================================================= */
  function initHoldAndSwipe() {
    const track = document.getElementById("swipe-track");
    const thumb = document.getElementById("swipe-thumb");
    const fill = document.getElementById("swipe-fill");
    const label = document.getElementById("swipe-label");
    const feedback = document.getElementById("swipe-feedback");
    const ring = document.getElementById("hold-ring-progress");

    const RING_CIRCUMFERENCE = 125.66;
    const HOLD_DURATION_MS = 260;

    let isDown = false;
    let holdReady = false;
    let holdStart = 0;
    let holdRaf = null;
    let startX = 0;
    let availableSlide = 0;
    let currentX = 0;
    let unlocked = false;

    function getMaxSlide() {
      return Math.max(120, track.clientWidth - thumb.offsetWidth - 12);
    }

    function setThumbPosition(x) {
      const max = getMaxSlide();
      const clamped = Math.max(0, Math.min(max, x));
      currentX = clamped;
      thumb.style.transform = `translateX(${clamped}px)`;
      const pct = (clamped / max) * 100;
      fill.style.width = `${Math.min(100, pct + 14)}%`;
      label.style.opacity = String(Math.max(0.15, 1 - pct / 75));
      return availableSlide > 0 ? clamped / availableSlide : clamped / max;
    }

    function resetSwipe(msg) {
      isDown = false;
      holdReady = false;
      cancelAnimationFrame(holdRaf);
      track.classList.remove("is-holding");
      ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
      thumb.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
      fill.style.transition = "width 0.3s ease";
      setThumbPosition(0);
      label.textContent = CFG.swipeButton.idleText;
      if (msg) feedback.textContent = msg;
      setTimeout(() => {
        thumb.style.transition = "";
        fill.style.transition = "";
      }, 310);
    }

    window.__resetSwipeControl = () => {
      unlocked = false;
      resetSwipe("Press & hold the button, then slide right");
    };

    function completeSwipe() {
      if (unlocked) return;
      unlocked = true;
      isDown = false;
      cancelAnimationFrame(holdRaf);
      setThumbPosition(getMaxSlide());
      label.textContent = CFG.swipeButton.unlockedText;
      label.style.opacity = "1";
      feedback.textContent = "Yay! Lighting your birthday candle ✨";

      AudioFX.playSwipeComplete();
      const rect = track.getBoundingClientRect();
      Confetti.burst(rect.right - 36, rect.top + rect.height / 2, 55, 8);

      setTimeout(() => goToPage(3), 550);
    }

    function tickHold() {
      if (!isDown || unlocked) return;
      const elapsed = performance.now() - holdStart;
      const ratio = Math.min(1, elapsed / HOLD_DURATION_MS);
      ring.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - ratio));

      if (ratio >= 1 && !holdReady) {
        holdReady = true;
        label.textContent = CFG.swipeButton.holdingText;
        feedback.textContent = "Great! Now slide right all the way →";
      }
      if (ratio < 1) {
        holdRaf = requestAnimationFrame(tickHold);
      }
    }

    track.addEventListener("pointerdown", (e) => {
      if (unlocked) return;
      AudioFX.unlock();
      AudioFX.playHoldStart();
      isDown = true;
      holdReady = false;
      holdStart = performance.now();
      startX = e.clientX;
      const trackRight = track.getBoundingClientRect().right;
      availableSlide = Math.min(getMaxSlide(), Math.max(90, trackRight - startX - 18));
      track.classList.add("is-holding");
      track.setPointerCapture(e.pointerId);
      feedback.textContent = "Hold steady...";
      tickHold();
    });

    track.addEventListener("pointermove", (e) => {
      if (!isDown || unlocked) return;
      if (!holdReady) return;
      const dx = e.clientX - startX;
      const ratio = setThumbPosition(dx);
      if (ratio >= 0.84) {
        completeSwipe();
      }
    });

    function handleRelease() {
      if (!isDown || unlocked) return;
      if (!holdReady) {
        resetSwipe("Hold for a moment first, then slide right →");
      } else {
        resetSwipe("Keep holding & slide all the way to the end →");
      }
    }

    track.addEventListener("pointerup", handleRelease);
    track.addEventListener("pointercancel", handleRelease);

    // Keyboard accessibility
    track.addEventListener("keydown", (e) => {
      if (unlocked) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        AudioFX.unlock();
        completeSwipe();
      }
    });
  }

  /* =========================================================
     8. PAGE 3: CAKE, TAP-TAP-TAP FLAME & TOP PAPER LETTER
     ========================================================= */
  function initCakeAndLetter() {
    const page3 = document.getElementById("page-3");
    const stage = document.getElementById("cake-stage");
    const flameBtn = document.getElementById("flame-btn");
    const flameOuter = document.getElementById("flame-outer");
    const rippleRing = document.getElementById("tap-ripple-ring");
    const blowFill = document.getElementById("blow-bar-fill");
    const blowStatus = document.getElementById("blow-status-text");
    const blowCount = document.getElementById("blow-count-text");
    const heading = document.getElementById("p3-heading");
    const subtext = document.getElementById("p3-subtext");

    const paperWrap = document.getElementById("floating-paper-wrap");
    const openPaperBtn = document.getElementById("open-paper-btn");
    const relightBtn = document.getElementById("relight-btn");
    const backBtn = document.getElementById("back-to-p2-btn");

    const modal = document.getElementById("letter-modal");
    const backdrop = document.getElementById("letter-backdrop");
    const closeBtn = document.getElementById("letter-close-btn");
    const celebrateAgainBtn = document.getElementById("celebrate-again-btn");

    const tapsRequired = CFG.cake.tapsRequired || 6;
    const recoveryDelayMs = CFG.cake.recoveryDelayMs || 650;
    let taps = 0;
    let isBlown = false;
    let recoveryTimer = null;

    function resetFlameProgress(statusMsg) {
      taps = 0;
      flameOuter.style.setProperty("--flame-scale", "1");
      flameOuter.style.setProperty("--flame-tilt", "0deg");
      document.getElementById("flame-halo").style.setProperty("--flame-scale", "1");
      blowFill.style.width = "0%";
      blowCount.textContent = `0 / ${tapsRequired}`;
      blowStatus.textContent = statusMsg || "💨 Tap the flame!";
    }

    function updateFlameVisual() {
      const remaining = Math.max(0, tapsRequired - taps);
      const ratio = remaining / tapsRequired;
      const scale = 0.45 + ratio * 0.55;
      const tilt = (Math.random() - 0.5) * 34;

      flameOuter.style.setProperty("--flame-scale", scale.toFixed(2));
      flameOuter.style.setProperty("--flame-tilt", `${tilt.toFixed(1)}deg`);
      document.getElementById("flame-halo").style.setProperty("--flame-scale", scale.toFixed(2));

      setTimeout(() => {
        if (!isBlown) {
          flameOuter.style.setProperty("--flame-tilt", "0deg");
        }
      }, 170);

      const pct = Math.min(100, Math.round((taps / tapsRequired) * 100));
      blowFill.style.width = `${pct}%`;
      blowCount.textContent = `${Math.min(taps, tapsRequired)} / ${tapsRequired}`;

      if (taps > 0 && taps < tapsRequired - 1) {
        blowStatus.textContent = "💨 Keep tapping!";
      } else if (taps === tapsRequired - 1) {
        blowStatus.textContent = "✨ One last blow!";
      }
    }

    function blowOutCandle() {
      isBlown = true;
      stage.classList.add("is-blown");
      blowStatus.textContent = "🎉 Wish made!";
      heading.textContent = CFG.cake.blownHeadline;
      subtext.textContent = CFG.cake.blownSubtext;
      relightBtn.classList.remove("is-hidden");

      AudioFX.playCandleOut();
      Confetti.shower();

      // Drop the folded paper note at the top
      setTimeout(() => {
        paperWrap.classList.add("is-visible");
        paperWrap.setAttribute("aria-hidden", "false");
        page3.classList.add("has-paper");
        AudioFX.playPaperDrop();
      }, 850);
    }

    flameBtn.addEventListener("click", () => {
      if (isBlown) return;
      AudioFX.unlock();
      taps += 1;

      // Visual tap ripple + air puff particles
      rippleRing.classList.remove("is-pulsing");
      void rippleRing.offsetWidth;
      rippleRing.classList.add("is-pulsing");

      const rect = flameBtn.getBoundingClientRect();
      Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, 4);

      updateFlameVisual();

      if (taps >= tapsRequired) {
        clearTimeout(recoveryTimer);
        recoveryTimer = null;
        blowOutCandle();
      } else {
        AudioFX.playBlowPuff((tapsRequired - taps) / tapsRequired);
        clearTimeout(recoveryTimer);
        recoveryTimer = setTimeout(() => {
          if (!isBlown && taps > 0) {
            resetFlameProgress("🔥 It lit back up — tap fast!");
          }
        }, recoveryDelayMs);
      }
    });

    function openLetterModal() {
      AudioFX.unlock();
      AudioFX.playPaperOpen();
      AudioFX.startLetterSong();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      Confetti.shower();
    }

    function closeLetterModal() {
      AudioFX.stopLetterSong();
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    const letterMusicBtn = document.getElementById("letter-music-btn");
    const letterMusicText = document.getElementById("letter-music-text");
    AudioFX.onLetterMusicStateChange(({ playing, title }) => {
      letterMusicBtn.classList.toggle("is-playing", playing);
      letterMusicText.textContent = playing ? `Playing: ${title}` : `Paused: ${title}`;
    });
    letterMusicBtn.addEventListener("click", () => {
      AudioFX.toggleLetterSong();
    });

    // Hold & Pull Down interaction on the top hanging paper
    (() => {
      const subPrompt = document.getElementById("paper-subprompt-text");
      const holdRing = document.getElementById("paper-hold-ring-progress");
      const pullBarFill = document.getElementById("paper-pull-bar-fill");
      const RING_CIRCUMFERENCE = 125.66;
      const HOLD_MS = 220;
      const MAX_PULL = 110;
      const OPEN_PULL = 68;

      let isDown = false;
      let holdReady = false;
      let isFalling = false;
      let holdStart = 0;
      let holdRaf = null;
      let startY = 0;
      let pullPx = 0;

      function setPullVisual(px) {
        pullPx = Math.max(0, Math.min(MAX_PULL, px));
        const pct = Math.min(100, Math.round((pullPx / OPEN_PULL) * 100));
        openPaperBtn.style.setProperty("--paper-pull-px", `${pullPx}px`);
        openPaperBtn.setAttribute("aria-valuenow", String(pct));
        pullBarFill.style.width = `${pct}%`;
      }

      function resetPaperPull(msg) {
        isDown = false;
        holdReady = false;
        isFalling = false;
        cancelAnimationFrame(holdRaf);
        paperWrap.classList.remove("is-falling");
        openPaperBtn.classList.remove("is-pulling", "is-holding");
        holdRing.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
        setPullVisual(0);
        subPrompt.textContent = msg || CFG.letter.paperSubPrompt || "Hold & pull down ↓ to open";
      }

      function triggerFallAndOpen() {
        if (isFalling) return;
        isFalling = true;
        isDown = false;
        holdReady = false;
        cancelAnimationFrame(holdRaf);
        openPaperBtn.classList.remove("is-pulling", "is-holding");
        paperWrap.classList.add("is-falling");

        AudioFX.playPaperDrop();
        const rect = openPaperBtn.getBoundingClientRect();
        Confetti.burst(rect.left + rect.width / 2, rect.bottom, 32, 7);

        setTimeout(() => {
          openLetterModal();
        }, 460);
      }

      function tickHold() {
        if (!isDown || isFalling) return;
        const elapsed = performance.now() - holdStart;
        const ratio = Math.min(1, elapsed / HOLD_MS);
        holdRing.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - ratio));

        if (ratio >= 1 && !holdReady) {
          holdReady = true;
          openPaperBtn.classList.add("is-holding");
          subPrompt.textContent = "Keep holding & pull down ↓";
        }
        if (ratio < 1) {
          holdRaf = requestAnimationFrame(tickHold);
        }
      }

      openPaperBtn.addEventListener("pointerdown", (e) => {
        if (isFalling) return;
        AudioFX.unlock();
        AudioFX.playHoldStart();
        isDown = true;
        holdReady = false;
        holdStart = performance.now();
        startY = e.clientY;
        openPaperBtn.classList.add("is-pulling");
        openPaperBtn.setPointerCapture(e.pointerId);
        subPrompt.textContent = "Hold steady...";
        tickHold();
      });

      openPaperBtn.addEventListener("pointermove", (e) => {
        if (!isDown || !holdReady || isFalling) return;
        const dy = e.clientY - startY;
        setPullVisual(dy);
        if (dy > 12) {
          AudioFX.playRibbonPull(Math.min(1, dy / OPEN_PULL));
        }
        if (dy >= OPEN_PULL) {
          triggerFallAndOpen();
        }
      });

      function onRelease() {
        if (!isDown || isFalling) return;
        if (!holdReady) {
          resetPaperPull("Hold for a moment, then pull down ↓");
        } else {
          resetPaperPull("Pull down a little further ↓ to open");
        }
      }

      openPaperBtn.addEventListener("pointerup", onRelease);
      openPaperBtn.addEventListener("pointercancel", onRelease);

      openPaperBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          triggerFallAndOpen();
        }
      });

      window.__resetFloatingPaper = () => resetPaperPull();
    })();

    closeBtn.addEventListener("click", () => {
      closeLetterModal();
      if (typeof window.__resetFloatingPaper === "function") {
        window.__resetFloatingPaper();
      }
    });
    backdrop.addEventListener("click", () => {
      closeLetterModal();
      if (typeof window.__resetFloatingPaper === "function") {
        window.__resetFloatingPaper();
      }
    });
    celebrateAgainBtn.addEventListener("click", () => {
      AudioFX.playGiftDraw();
      Confetti.shower();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeLetterModal();
        if (typeof window.__resetFloatingPaper === "function") {
          window.__resetFloatingPaper();
        }
      }
    });

    relightBtn.addEventListener("click", () => {
      clearTimeout(recoveryTimer);
      recoveryTimer = null;
      isBlown = false;
      stage.classList.remove("is-blown");
      resetFlameProgress("💨 Tap the flame!");
      heading.textContent = CFG.cake.heading;
      subtext.textContent = CFG.cake.subtext;
      relightBtn.classList.add("is-hidden");
      AudioFX.playSparkle();
    });

    backBtn.addEventListener("click", () => goToPage(2));
  }

  /* =========================================================
     BOOT
     ========================================================= */
  hydrateContent();
  initFloatingPetals();
  initSoundToggle();
  initGiftRibbon();
  initPhotoGallery();
  initRandomPhotos();
  initHoldAndSwipe();
  initCakeAndLetter();
})();
