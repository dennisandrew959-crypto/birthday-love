/**
 * ============================================================
 *  COZY WEB AUDIO + BACKGROUND & LETTER SONG ENGINE
 *  - Plays custom `config.music.src` (or romantic music-box loop)
 *  - Plays dedicated `config.letterMusic.src` while reading the letter
 *  - Generates gentle chimes, ribbon pops, candle puffs & Happy Birthday
 * ============================================================
 */
window.BirthdayAudio = (() => {
  let ctx = null;
  let muted = false;
  let lastPullTick = 0;

  // Background music state
  let musicEnabled = true;
  let musicStarted = false;
  let musicPaused = false;
  let musicDucked = false;
  let duckTimer = null;

  let customAudio = null;
  let customAudioReady = false;
  let customAudioFailed = false;
  let synthTimer = null;
  let onStateChangeCb = null;

  // Dedicated letter song state
  let letterAudio = null;
  let letterSongActive = false;
  let letterSongPaused = false;
  let onLetterStateChangeCb = null;

  function getMusicConfig() {
    const cfg = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.music) || {};
    return {
      src: cfg.src || "",
      title: cfg.title || "Birthday Song",
      volume: typeof cfg.volume === "number" ? cfg.volume : 0.45,
    };
  }

  function getLetterMusicConfig() {
    const cfg = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.letterMusic) || {};
    return {
      src: cfg.src || "",
      title: cfg.title || "A Thousand Miles",
      volume: typeof cfg.volume === "number" ? cfg.volume : 0.55,
      startAtSeconds: typeof cfg.startAtSeconds === "number" ? cfg.startAtSeconds : 0,
    };
  }

  function isMusicActive() {
    return musicStarted && musicEnabled && !musicPaused && !muted && !letterSongActive;
  }

  function isLetterSongPlaying() {
    return letterSongActive && !letterSongPaused && !muted;
  }

  function notifyState() {
    if (typeof onStateChangeCb === "function") {
      onStateChangeCb({
        playing: isMusicActive(),
        muted,
        title: getMusicConfig().title,
      });
    }
  }

  function notifyLetterState() {
    if (typeof onLetterStateChangeCb === "function") {
      onLetterStateChangeCb({
        playing: isLetterSongPlaying(),
        title: getLetterMusicConfig().title,
      });
    }
  }

  function ensureContext() {
    if (muted) return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration = 0.25, type = "sine", volume = 0.08, delay = 0) {
    const audio = ensureContext();
    if (!audio) return;

    const now = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audio.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playNoiseBurst(duration = 0.14, cutoff = 900, volume = 0.09) {
    const audio = ensureContext();
    if (!audio) return;

    const sampleCount = Math.floor(audio.sampleRate * duration);
    const buffer = audio.createBuffer(1, sampleCount, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
    }

    const noise = audio.createBufferSource();
    noise.buffer = buffer;

    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(cutoff, audio.currentTime);
    filter.Q.setValueAtTime(1.1, audio.currentTime);

    const gain = audio.createGain();
    gain.gain.setValueAtTime(volume, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);

    noise.start();
  }

  /* ---------------------------------------------------------
     ROMANTIC BUILT-IN MUSIC-BOX SONG (14-second seamless loop)
     --------------------------------------------------------- */
  function scheduleSynthPhrase() {
    if (!musicEnabled || musicPaused || muted || musicDucked || letterSongActive) return;

    const steps = [
      // Bar 1: Fmaj7
      { t: 0.0, f: 174.61, d: 3.4, type: "sine", v: 0.024 },
      { t: 0.0, f: 349.23, d: 0.9, type: "triangle", v: 0.022 },
      { t: 0.65, f: 440.0, d: 0.85, type: "triangle", v: 0.024 },
      { t: 1.3, f: 523.25, d: 1.0, type: "triangle", v: 0.026 },
      { t: 2.0, f: 659.25, d: 1.2, type: "triangle", v: 0.028 },
      { t: 2.75, f: 523.25, d: 0.9, type: "triangle", v: 0.022 },

      // Bar 2: Dm7
      { t: 3.5, f: 146.83, d: 3.4, type: "sine", v: 0.024 },
      { t: 3.5, f: 293.66, d: 0.9, type: "triangle", v: 0.022 },
      { t: 4.15, f: 440.0, d: 0.85, type: "triangle", v: 0.024 },
      { t: 4.8, f: 523.25, d: 1.0, type: "triangle", v: 0.026 },
      { t: 5.5, f: 587.33, d: 1.2, type: "triangle", v: 0.028 },
      { t: 6.25, f: 440.0, d: 0.9, type: "triangle", v: 0.022 },

      // Bar 3: Bbmaj7
      { t: 7.0, f: 116.54, d: 3.4, type: "sine", v: 0.024 },
      { t: 7.0, f: 349.23, d: 0.9, type: "triangle", v: 0.022 },
      { t: 7.65, f: 440.0, d: 0.85, type: "triangle", v: 0.024 },
      { t: 8.3, f: 587.33, d: 1.0, type: "triangle", v: 0.026 },
      { t: 9.0, f: 698.46, d: 1.2, type: "triangle", v: 0.027 },
      { t: 9.75, f: 587.33, d: 0.9, type: "triangle", v: 0.022 },

      // Bar 4: C7sus4 -> C7
      { t: 10.5, f: 130.81, d: 3.4, type: "sine", v: 0.024 },
      { t: 10.5, f: 392.0, d: 0.9, type: "triangle", v: 0.022 },
      { t: 11.15, f: 466.16, d: 0.85, type: "triangle", v: 0.024 },
      { t: 11.8, f: 523.25, d: 1.0, type: "triangle", v: 0.026 },
      { t: 12.5, f: 659.25, d: 1.3, type: "triangle", v: 0.028 },
      { t: 13.25, f: 587.33, d: 0.95, type: "triangle", v: 0.023 },
    ];

    steps.forEach((n) => {
      playTone(n.f, n.d, n.type, n.v, n.t);
    });
  }

  function startSynthLoop() {
    stopSynthLoop();
    if (!musicEnabled || musicPaused || muted || musicDucked || letterSongActive) return;
    scheduleSynthPhrase();
    synthTimer = setInterval(scheduleSynthPhrase, 14000);
  }

  function stopSynthLoop() {
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
  }

  function initCustomAudio() {
    const cfg = getMusicConfig();
    if (!cfg.src || customAudio || customAudioFailed) return;

    customAudio = new Audio(cfg.src);
    customAudio.loop = true;
    customAudio.volume = cfg.volume;
    customAudio.preload = "auto";

    customAudio.addEventListener("canplaythrough", () => {
      customAudioReady = true;
    });

    customAudio.addEventListener("error", () => {
      customAudioFailed = true;
      customAudio = null;
      if (isMusicActive() && !musicDucked) {
        startSynthLoop();
        notifyState();
      }
    });
  }

  function syncPlayback() {
    if (musicStarted) {
      if (!musicEnabled || musicPaused || muted || musicDucked || letterSongActive) {
        stopSynthLoop();
        if (customAudio && !customAudio.paused) {
          customAudio.pause();
        }
      } else if (customAudio && !customAudioFailed) {
        customAudio.volume = getMusicConfig().volume;
        customAudio
          .play()
          .then(() => {
            customAudioReady = true;
            stopSynthLoop();
            notifyState();
          })
          .catch(() => {
            if (!customAudioReady) {
              customAudioFailed = true;
              customAudio = null;
              startSynthLoop();
              notifyState();
            }
          });
      } else {
        startSynthLoop();
      }
      notifyState();
    }

    if (letterAudio) {
      if (isLetterSongPlaying()) {
        letterAudio.volume = getLetterMusicConfig().volume;
        letterAudio.play().catch(() => {});
      } else if (!letterAudio.paused) {
        letterAudio.pause();
      }
      notifyLetterState();
    }
  }

  function duckMusicFor(ms) {
    if (!isMusicActive()) return;
    musicDucked = true;
    syncPlayback();
    clearTimeout(duckTimer);
    duckTimer = setTimeout(() => {
      musicDucked = false;
      syncPlayback();
    }, ms);
  }

  function ensureLetterAudio(seekToStart) {
    const cfg = getLetterMusicConfig();
    if (!cfg.src) return null;

    if (!letterAudio) {
      letterAudio = new Audio(cfg.src);
      letterAudio.loop = true;
      letterAudio.volume = cfg.volume;
      letterAudio.preload = "auto";
    }

    if (seekToStart && cfg.startAtSeconds > 0) {
      const seek = () => {
        try {
          if (letterAudio.duration && cfg.startAtSeconds < letterAudio.duration) {
            letterAudio.currentTime = cfg.startAtSeconds;
          }
        } catch (_) {}
      };
      if (letterAudio.readyState >= 1) {
        seek();
      } else {
        letterAudio.addEventListener("loadedmetadata", seek, { once: true });
      }
    }
    return letterAudio;
  }

  return {
    onMusicStateChange(cb) {
      onStateChangeCb = cb;
      notifyState();
    },

    onLetterMusicStateChange(cb) {
      onLetterStateChangeCb = cb;
      notifyLetterState();
    },

    isMuted() {
      return muted;
    },

    isMusicPlaying() {
      return isMusicActive();
    },

    toggleMute() {
      muted = !muted;
      if (!muted) {
        ensureContext();
        this.playSparkle();
      }
      syncPlayback();
      return muted;
    },

    startMusic() {
      if (musicStarted) return;
      musicStarted = true;
      musicPaused = false;
      ensureContext();
      initCustomAudio();
      syncPlayback();
    },

    toggleMusic() {
      if (!musicStarted) {
        musicEnabled = true;
        musicPaused = false;
        this.startMusic();
        return { playing: isMusicActive(), title: getMusicConfig().title };
      }

      if (muted) {
        muted = false;
      }

      musicPaused = !musicPaused;
      musicEnabled = !musicPaused;
      ensureContext();
      syncPlayback();
      return { playing: isMusicActive(), title: getMusicConfig().title };
    },

    startLetterSong() {
      letterSongActive = true;
      letterSongPaused = false;
      const audio = ensureLetterAudio(true);
      if (!audio) return;
      syncPlayback();
    },

    stopLetterSong() {
      letterSongActive = false;
      letterSongPaused = false;
      if (letterAudio && !letterAudio.paused) {
        letterAudio.pause();
      }
      syncPlayback();
      notifyLetterState();
    },

    toggleLetterSong() {
      if (!letterSongActive) {
        this.startLetterSong();
        return;
      }
      if (muted) {
        muted = false;
      }
      letterSongPaused = !letterSongPaused;
      syncPlayback();
    },

    unlock() {
      ensureContext();
      if (!musicStarted && musicEnabled && !musicPaused && !letterSongActive) {
        this.startMusic();
      }
    },

    playRibbonPull(progress) {
      const now = performance.now();
      if (now - lastPullTick < 90) return;
      lastPullTick = now;
      const baseFreq = 392 + progress * 240;
      playTone(baseFreq, 0.09, "triangle", 0.04);
    },

    playGiftOpen() {
      const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
      notes.forEach((n, i) => playTone(n, 0.45, "triangle", 0.075, i * 0.065));
    },

    playGiftDraw() {
      const notes = [587.33, 739.99, 880, 1174.66];
      notes.forEach((n, i) => playTone(n, 0.3, "sine", 0.065, i * 0.055));
    },

    playHoldStart() {
      playTone(440, 0.12, "sine", 0.045);
    },

    playSwipeComplete() {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((n, i) => playTone(n, 0.4, "triangle", 0.07, i * 0.06));
    },

    playSparkle() {
      playTone(880, 0.18, "sine", 0.05, 0);
      playTone(1318.5, 0.24, "sine", 0.045, 0.06);
    },

    playBlowPuff(remainingRatio) {
      const cutoff = 650 + (1 - remainingRatio) * 550;
      playNoiseBurst(0.16, cutoff, 0.11);
      playTone(300 + (1 - remainingRatio) * 180, 0.1, "sine", 0.025);
    },

    playCandleOut() {
      playNoiseBurst(0.28, 520, 0.13);
      duckMusicFor(6400);
      setTimeout(() => this.playBirthdayMelody(), 320);
    },

    playPaperDrop() {
      playTone(783.99, 0.35, "sine", 0.055, 0);
      playTone(987.77, 0.4, "sine", 0.055, 0.1);
      playTone(1174.66, 0.55, "triangle", 0.06, 0.22);
    },

    playPaperOpen() {
      playNoiseBurst(0.1, 1400, 0.04);
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((n, i) => playTone(n, 0.6, "sine", 0.05, i * 0.05));
    },

    playBirthdayMelody() {
      // Gentle music-box "Happy Birthday" opening phrase (G4 G4 A4 G4 C5 B4 | G4 G4 A4 G4 D5 C5)
      const melody = [
        { f: 392.0, d: 0.25, t: 0.0 },
        { f: 392.0, d: 0.2, t: 0.28 },
        { f: 440.0, d: 0.45, t: 0.52 },
        { f: 392.0, d: 0.45, t: 1.0 },
        { f: 523.25, d: 0.45, t: 1.48 },
        { f: 493.88, d: 0.75, t: 1.96 },

        { f: 392.0, d: 0.25, t: 2.9 },
        { f: 392.0, d: 0.2, t: 3.18 },
        { f: 440.0, d: 0.45, t: 3.42 },
        { f: 392.0, d: 0.45, t: 3.9 },
        { f: 587.33, d: 0.45, t: 4.38 },
        { f: 523.25, d: 0.85, t: 4.86 },
      ];
      melody.forEach((note) => {
        playTone(note.f, note.d, "triangle", 0.065, note.t);
      });
    },
  };
})();
