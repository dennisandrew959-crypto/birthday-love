/**
 * ============================================================
 *  BIRTHDAY SURPRISE CONFIGURATION
 *  Edit the details below to personalize the website for her!
 * ============================================================
 */
window.BIRTHDAY_CONFIG = {
  girlfriendName: "For you, Mariella lovelove",
  senderName: "Forever Yours",
  pageTitle: "Happy Birthday, My Love ✨",

  // Background Song
  // Optional: drop your own song file in `assets/song.mp3` (or change `src`).
  // If no MP3 file is added, a gentle romantic music-box song plays automatically!
  music: {
    src: "assets/song.mp3",
    title: "Birthday Song",
    volume: 0.45,
  },

  // Dedicated Song While Reading the Letter
  letterMusic: {
    src: "assets/letter-song.mp3",
    title: "A Thousand Miles",
    volume: 0.55,
    startAtSeconds: 18.5, // Starts right as the piano begins (set to 0 for the footsteps intro)
  },

  // Page 1: Gift Box
  giftBox: {
    tag: "Special Delivery",
    headline: "A little birthday surprise awaits you",
    subtext: "Pull the lavender ribbon down to untie your gift",
    pullHint: "Drag the ribbon bow down ↓",
  },

  // Page 2: 4 Pictures of Us
  // Put your real photos in an `assets/` folder (e.g. "assets/photo1.jpg")
  // and update `src` below. If a photo file isn't added yet, a cute
  // custom illustration will display automatically as a placeholder.
  galleryHeading: "Four Little Moments I Adore",
  gallerySubheading: "Tap each sealed polaroid to reveal the picture — tap again to read the note",
  photos: [
    {
      src: "assets/moment1.jpg",
      caption: "Our Favorite Laugh",
      date: "Memory #01",
      note: "first time picture natin magkasama dito na masaya and sobrang cute mo",
      accent: "sage",
    },
    {
      src: "assets/moment2.jpg",
      caption: "Mirador Heritage and Eco-Spirituality Park",
      date: "Memory #02",
      note: "With you right beside me, every view feels brighter and every moment feels like our own little adventure.",
      accent: "lavender",
    },
    {
      src: "assets/moment3.jpg",
      caption: "Church Picture muna",
      date: "Memory #03",
      note: "Being blessed with you is the greatest gift of all.",
      accent: "emerald",
    },
    {
      src: "assets/moment4.jpg",
      caption: "Pine Tree Adventures",
      date: "Memory #04",
      note: "Whether we're exploring somewhere chilly or doing nothing at all, anywhere with you is my favorite place to be.",
      accent: "plum",
    },
  ],

  // Page 2: Random Little Snapshots (Hidden until tapped)
  randomPicsHeading: "Random Little Snapshots",
  randomPicsSubheading: "Every picture is hidden — tap any card to open and see what's inside!",
  randomPhotos: [
    { src: "assets/snap1.jpg", caption: "Cozy Auditorium Moment", tag: "Snapshot" },
    { src: "assets/snap2.jpg", caption: "Cpoint Villa Green Wall", tag: "Us 💚" },
    { src: "assets/snap3.jpg", caption: "Nighttime Pool Lights", tag: "Late Night" },
    { src: "assets/snap4.jpg", caption: "Glowing In Green", tag: "Prettiest" },
    { src: "assets/snap5.jpg", caption: "Writing Little Notes", tag: "Candid" },
    { src: "assets/snap6.jpg", caption: "Bookstore Daydream", tag: "Soft Moment" },
    { src: "assets/snap7.jpg", caption: "Cinema Date Tickets", tag: "Date Night" },
    { src: "assets/snap8.jpg", caption: "Sunshine & Yellow Blooms", tag: "So Pretty" },
    { src: "assets/snap9.jpg", caption: "Silly Mountain Selfie", tag: "Roadtrip" },
    { src: "assets/snap10.jpg", caption: "Stone Castle Views", tag: "Adventure" },
    { src: "assets/snap11.jpg", caption: "Colorful Hillside", tag: "Memories" },
    { src: "assets/snap12.jpg", caption: "Close To You", tag: "Sweet Moment" },
  ],

  // Page 2 -> 3 Swipe Control
  swipeButton: {
    idleText: "Hold & slide to light your cake",
    holdingText: "Keep holding & slide →",
    unlockedText: "Opening your birthday cake...",
  },

  // Page 3: Cake & Candle
  cake: {
    heading: "Make a Birthday Wish",
    subtext: "Tap, tap, tap fast without stopping to blow out the flame!",
    tapsRequired: 6,
    recoveryDelayMs: 650,
    blownHeadline: "Happy Birthday, Beautiful! ✨",
    blownSubtext: "Look up! Hold & pull down the paper to read your letter.",
  },

  // Page 3: Secret Paper Letter
  letter: {
    paperPrompt: "A letter drifted down for you",
    paperSubPrompt: "Hold & pull down ↓ to open",
    stampText: "Made With Love",
    salutation: "Dearest Love,",
    paragraphs: [
      "Happy Birthday, lovelove! I know sobrang hirap ng mga challenges na pinagdaanan mo this week, but still, nakaya mo pa rin lahat ipanalo. Sobrang proud ako sa'yo, lovelove ko. I'm so happy for you, and I want you to enjoy your day, love. Sorry kung 'di ako makakadalo sa birthday mo, but I know you understand why hehe—that's why I already gave some of my gifts for you in advance.",
      "Thank you so much ulit, love, sa lahat ng effort and sacrifices mo sa family mo, sa studies and work mo, at lalo na sa mga pangarap mo. Always remember Isaiah 41:10 (NIV): \"So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.\"",
      "God is always with us—let's always cherish every moment we have together.",
      "On your special day, I wish you endless joy, gentle mornings, dreams coming true, and all the love you so generously give to everyone around you. Thank you for being wonderfully, uniquely you.",
      "No matter how many birthdays pass, I'll always be right here cheering for you, holding your hand, and finding new ways to make you smile.",
    ],
    closing: "Happy Birthday once again, my favorite person.",
    signature: "With all my love,\nYours Always 💚💜",
  },
};
