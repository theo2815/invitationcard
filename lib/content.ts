/**
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  EDIT EVERYTHING HERE.                                            │
 * │  All the text, dates, names and map links for the invitation     │
 * │  live in this one file. Swap the placeholder values below for     │
 * │  the client's real details — no other file needs to change.       │
 * └─────────────────────────────────────────────────────────────────┘
 */

export const content = {
  /** The little one being christened. */
  baby: {
    firstName: "Don", // nickname shown big in script on the cover
    fullName: "Don Ezeikiel V. Abellana",
    // Shown above the name on the cover.
    invitePhrase: "With grateful and joyful hearts, we invite you to the Holy Baptism of",
    // A tiny tender line used as a storybook accent ("our little blessing").
    endearment: "our little blessing",
  },

  event: {
    // ISO date+time of the ceremony — drives the countdown timer. (Local time.)
    date: "2026-06-28T11:00:00",
    // When the celebration ends — used for the Add-to-Calendar file (sweet send-off).
    endDate: "2026-06-28T16:00:00",
    dateDisplay: "Sunday, the Twenty-Eighth of June",
    yearDisplay: "Two Thousand and Twenty-Six",
    timeDisplay: "Eleven o'clock in the morning",
  },

  parents: {
    mother: "Maria Nina Villaceran",
    father: "Joshua Nathaniel Abellana",
    // A short, warm note from the parents. (Feel free to reword.)
    message:
      "It is with overflowing joy that we welcome our son into the family of God. We would be honored to have you share in this sacred and special day as our little Don receives the gift of Baptism. Your presence and prayers mean the world to us.",
  },

  ceremony: {
    label: "The Christening",
    venue: "St. Peter the Apostle Parish",
    addressLine1: "Pres. M. L. Quezon St, Bantayan",
    addressLine2: "Cebu, 6052",
    timeDisplay: "11:00 AM",
    // Map: keyless Google embed — no API key needed.
    mapEmbed:
      "https://maps.google.com/maps?q=St.%20Peter%20the%20Apostle%20Parish%20Bantayan%20Cebu&z=16&output=embed",
    mapLink:
      "https://maps.google.com/?q=St.+Peter+the+Apostle+Parish+Bantayan+Cebu",
  },

  reception: {
    label: "The Celebration",
    venue: "Villaceran Residence",
    addressLine1: "San Antonio, Kabac",
    addressLine2: "Bantayan, Cebu",
    timeDisplay: "1:00 PM",
    // Mapped by exact coordinates (it's a private residence).
    mapEmbed: "https://maps.google.com/maps?q=11.2371307,123.7156489&z=16&output=embed",
    mapLink: "https://maps.google.com/?q=11.2371307,123.7156489",
  },

  // The order of the day — drives the Timeline section. Add/remove freely.
  schedule: [
    { time: "11:00 AM", title: "Holy Mass", body: "The Rite of Baptism at St. Peter the Apostle Parish." },
    { time: "12:00 PM", title: "Picture Taking", body: "A few keepsakes with family and friends." },
    { time: "1:00 PM", title: "Lunch", body: "A warm meal together at the Villaceran Residence." },
    { time: "2:00 PM", title: "Program", body: "Toasts, well-wishes, and a few sweet surprises." },
    { time: "4:00 PM", title: "Sweet Send-off", body: "Cake, blessings, and a fond farewell." },
  ],

  godparents: {
    // Add or remove names freely — the layout adapts.
    ninong: [
  "Bernabe Comunsad",
  "Bryl Latrell Robinson",
  "Carlo Desucatan",
  "Gabriel Saragga",
  "Genno Conel",
  "Hakeem Aloba",
  "Jorge Desamparado",
  "Joshua G. Abellana",
  "Joven Villacampa",
  "Jurvic Pasquite",
  "Mark Salvado",
  "Niño Boy Layese",
  "RJ Villaceran",
  "Raniel Cababa",
  "Rannel De Leon",
  "Regil Kent Dugan",
  "Theo Cedric Chan",
],

ninang: [
  "Alyssandra Bautista",
  "Anika Rodill",
  "Ashley Layese",
  "Dessa Marie Ducay",
  "Felma Arcipe",
  "Ivie Desamparado",
  "Janica Marie Ofianga",
  "Jocevil Caracena",
  "Khristel B. Villaceran",
  "Kyle Angelie Villaceran",
  "Mary Joy Villaceran",
  "Norace Nathalie Nemenzo",
  "Rafa Ella Torrizo",
  "Romalyn Arcipe",
  "Samantha Santillan",
  "Thea Camille Chan",
  "Tiffany Rhoga Marie Pacilan",
  "Viola Pacilan",
  "Violy Villaceran",
],
  },

  // Photo gallery. Images live in /public/photos (URL paths below).
  gallery: {
    label: "A Few Sweet Moments",
    title: "Our Little One",
    note: "Photos coming soon.",
    images: [
      "/photos/little-one-1.jpg",
      "/photos/little-one-2.jpg",
      "/photos/little-one-3.jpg",
      "/photos/little-one-4.jpg",
      "/photos/little-one-5.jpg",
      "/photos/little-one-6.jpg",
    ] as string[],
  },

  // Dress code — guests vs. sponsors, each with little color swatches.
  dressCode: {
    note: "We would be delighted to see you dressed for the occasion.",
    groups: [
      {
        who: "For Our Guests",
        wear: "Neutral Colors",
        swatches: ["#EDE6DA", "#D8CBB6", "#C9B79C", "#B7A98F"],
      },
      {
        who: "For Ninong & Ninang",
        wear: "White",
        swatches: ["#FFFFFF", "#F7F4EE", "#EFEBE2"],
      },
    ],
  },

  // Safety guidelines for keeping the baby safe during the celebration.
  safety: {
    label: "For Our Little One",
    title: "Safety Guidelines",
    intro:
      "To help keep our baby safe, healthy, and comfortable during the celebration, we kindly ask everyone to observe the following guidelines:",
    items: [
      "Please sanitize your hands before holding or touching Baby Don Ezeikiel.",
      "No smoking or vaping near the baby or inside the venue.",
      "Please avoid kissing the baby to protect him from germs and infections.",
      "Handle the baby gently and carefully at all times.",
      "Please ask permission from the parents before carrying the baby.",
      "Dispose of trash properly and help keep the venue clean and safe.",
      "Respect the baby's rest time if he is sleeping or needs quiet time.",
    ],
  },

  // Gift guide — shown with product images from /public/gifts.
  gifts: {
    intro:
      "Your prayers and presence are highly appreciated. But if you were thinking of giving a gift, here are a few ideas:",
    disclaimer:
      "Sharing these ideas doesn't mean you're obliged to give. Your presence is the most precious gift you can give, aside from your love and prayers.",
    items: [
      { name: "Aveeno Body Wash & Shampoo", image: "/gifts/aveeno-body-wash-and-shampoo.png" },
      { name: "EQ Dry Newborn Diaper", image: "/gifts/eq-dry-newborn-diaper.png" },
      { name: "EQ Wipes (Unscented)", image: "/gifts/eq-wipes-unscented.png" },
      { name: "Bottle Cleanser", image: "/gifts/bottle-cleanser.png" },
      { name: "Milk — Enfamil Nura Pro", image: "/gifts/milk-enfamil-nura-pro.png" },
      { name: "Clothes (3–6 months up)", image: "/gifts/clothes-3-6-months.png" },
      { name: "Monetary Gifts for Future Needs", image: "/gifts/monetary-gifts.jpg" },
    ],
  },

  // The opening "envelope" the godparent taps before the invitation reveals.
  envelope: {
    // Shown when the link has no ?to= name (e.g. a generic shared link).
    greetingFallback: "You're Invited",
    // Small line under the greeting on the envelope front.
    frontSubtitle: "to a joyful celebration",
    // Single initial shown in the wax seal.
    monogram: "D",
    // The tap hint under the envelope.
    openHint: "Tap to open",
    // Teaser shown on the card that slides out.
    cardTitle: "You're Invited",
    cardSubtitle: "to the Christening of",
    // Maps the ?role= link value to how it's shown. Add more if needed.
    roleLabels: {
      ninong: "Ninong",
      ninang: "Ninang",
    } as Record<string, string>,
  },

  contact: {
    // Shown near the footer so guests can reach the family. Leave name empty to hide.
    name: "Tita Anika",
    phoneDisplay: "0995 294 8942",
    // For the tap-to-call / WhatsApp link (digits only, with country code).
    phoneHref: "639952948942",
  },

  // Background music. Drop your audio file in /public/audio and point `src` at
  // it (e.g. "/audio/music.mp3"). It starts softly when the envelope is opened
  // and loops, with a floating mute button. Set src to "" to disable music.
  audio: {
    src: "/audio/music.mp3",
    volume: 0.5, // target volume after the fade-in (0–1)
  },

  // Used in the browser tab + link previews (WhatsApp/Messenger share card).
  site: {
    title: "The Christening of Baby Don",
    // The PUBLIC PRODUCTION URL (no trailing slash). Used for the share preview
    // (metadataBase) AND by the host links page so every copied invitation points
    // HERE — never at a Vercel deployment-specific URL (e.g.
    // invitationcard-<hash>-<you>-projects.vercel.app), which is login-protected
    // (Facebook's crawler gets 401 → no preview card) and changes every deploy.
    // If you add a custom domain later, change this one line.
    url: "https://invitationcard-jade.vercel.app",
    description:
      "With joyful hearts, we invite you to Baby Don's Holy Baptism — June 28, 2026 · Bantayan, Cebu 🕊️",
  },
} as const;

export type SiteContent = typeof content;
