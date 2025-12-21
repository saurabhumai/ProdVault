export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  priceCents: number;
  category: string;
  badge?: string;
  highlights: string[];
  popularityScore: number;
  image?: string;
};

export const PRODUCTS: Product[] = [
  // Manga Series
  {
    id: "manga_berserk_1",
    slug: "berserk-volume-1",
    title: "Berserk Volume 1",
    description: "The legendary dark fantasy manga that defined a genre.",
    longDescription: "Guts, a lone swordsman, wields a giant sword as he battles demons in a medieval-inspired dark fantasy world. A masterpiece of storytelling and art.",
    priceCents: 89900,
    category: "Manga",
    badge: "Classic",
    highlights: [
      "Complete first volume",
      "High-quality translation",
      "Dark fantasy masterpiece",
      "Kentaro Miura's legendary art"
    ],
    popularityScore: 98,
    image: "https://w0.peakpx.com/wallpaper/617/107/HD-wallpaper-berserk-french-cover-berserk-cover-art-manga.jpg"
  },
  {
    id: "manga_onepiece_1",
    slug: "one-piece-volume-1",
    title: "One Piece Volume 1",
    description: "The beginning of the greatest pirate adventure ever told.",
    longDescription: "Monkey D. Luffy wants to become King of the Pirates, but first he needs to find the legendary treasure One Piece. The journey begins here!",
    priceCents: 79900,
    category: "Manga",
    badge: "Best Seller",
    highlights: [
      "Start of an epic adventure",
      "Over 1000+ chapters ongoing",
      "Eiichiro Oda's masterpiece",
      "Perfect for new readers"
    ],
    popularityScore: 95,
    image: "https://m.media-amazon.com/images/I/71S+UDVRGjL._UF1000,1000_QL80_.jpg"
  },
  {
    id: "manga_vagabond_1",
    slug: "vagabond-volume-1",
    title: "Vagabond Volume 1",
    description: "The journey of Japan's greatest swordsman, Miyamoto Musashi.",
    longDescription: "A masterful retelling of the life of legendary swordsman Miyamoto Musashi. Stunning artwork and profound storytelling.",
    priceCents: 89900,
    category: "Manga",
    badge: "Award Winner",
    highlights: [
      "Takehiko Inoue's art",
      "Historical fiction masterpiece",
      "Philosophical depth",
      "Samurai culture"
    ],
    popularityScore: 92,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrtcn-vwjVd0zrNq-PkDtLg4lHkAw6iQcPcg&s"
  },
  {
    id: "manga_opm_1",
    slug: "one-punch-man-volume-1",
    title: "One-Punch Man Volume 1",
    description: "The hero who can defeat any enemy with a single punch.",
    longDescription: "Saitama is a hero who can defeat any enemy with one punch, but he's bored because there's no challenge left. A hilarious deconstruction of superhero tropes.",
    priceCents: 79900,
    category: "Manga",
    highlights: [
      "Action comedy masterpiece",
      "Unique art style",
      "Superhero satire",
      "WEBTOON phenomenon"
    ],
    popularityScore: 88,
    image: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421585642/one-punch-man-vol-1-9781421585642_hr.jpg"
  },
  {
    id: "manga_attack_titan_1",
    slug: "attack-on-titan-volume-1",
    title: "Attack on Titan Volume 1",
    description: "Humanity's last stand against giant man-eating Titans.",
    longDescription: "In a world where humanity hides behind enormous walls, giant Titans threaten to devour mankind. Eren Yeager joins the fight to reclaim their world.",
    priceCents: 89900,
    category: "Manga",
    badge: "Popular",
    highlights: [
      "Intense action and mystery",
      "Post-apocalyptic setting",
      "Complex political themes",
      "Global phenomenon"
    ],
    popularityScore: 94,
    image: "https://resizing.flixster.com/mFcpzy4Wi9wzoGiIzC7BqegRYxQ=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10873160_b_v8_aa.jpg"
  },
  {
    id: "manga_death_note_1",
    slug: "death-note-volume-1",
    title: "Death Note Volume 1",
    description: "The notebook that kills anyone whose name is written inside.",
    longDescription: "Light Yagami finds a supernatural notebook that can kill anyone whose name is written in it. A cat-and-mouse game with genius detective L begins.",
    priceCents: 79900,
    category: "Manga",
    highlights: [
      "Psychological thriller",
      "Moral dilemmas",
      "Genius vs genius",
      "Suspense masterpiece"
    ],
    popularityScore: 90,
    image: "https://dailyanimeart.com/wp-content/uploads/2018/03/death-note.jpg"
  },
  
  // Light Novels
  {
    id: "novel_reverend_insanity_1",
    slug: "reverend-insanity-volume-1",
    title: "Reverend Insanity Volume 1",
    description: "A cunning demon lord's journey to defy fate and achieve immortality.",
    longDescription: "Fang Yuan, a 500-year-old demon lord, is reborn with his memories intact. Using his wisdom and cunning, he'll stop at nothing to achieve true immortality.",
    priceCents: 99900,
    category: "Light Novel",
    badge: "Dark Fantasy",
    highlights: [
      "Anti-hero protagonist",
      "Strategic genius",
      "Cultivation world",
      "Moral complexity"
    ],
    popularityScore: 96,
    image: "https://i.pinimg.com/736x/dc/8f/29/dc8f29cf078952672dcf1c12ec834f74.jpg"
  },
  {
    id: "Pattern_omniscient_1",
    slug: "omniscient-readers-viewpoint-volume-1",
    title: "Omniscient Reader's Viewpoint Volume 1",
    description: "The only reader who knows how the world ends.",
    longDescription: "Kim Dokja is the only reader of a web novel that becomes reality. With his knowledge of the future, he must navigate a world of scenarios and survive.",
    priceCents: 99900,
    category: "Light Novel",
    badge: "Best Seller",
    highlights: [
      "Meta-fiction concept",
      "Survival game world",
      "Knowledge is power",
      "Unique storytelling"
    ],
    popularityScore: 97,
    image: "https://anitrendz.net/news/wp-content/uploads/2023/07/ORV.jpg"
  },
  {
    id: "novel_solo_leveling_1",
    slug: "solo-leveling-volume-1",
    title: "Solo Leveling Volume 1",
    description: "The weakest hunter becomes the strongest S-rank hunter.",
    longDescription: "In a world where hunters fight monsters, Sung Jinwoo is the weakest E-rank hunter. After a near-death experience, he gains a unique power to level up.",
    priceCents: 89900,
    category: "Light Novel",
    badge: "Action",
    highlights: [
      "Power progression fantasy",
      "Stunning artwork",
      "Webtoon adaptation",
      "Satisfying growth"
    ],
    popularityScore: 93,
    image: "https://bookstation.ie/cdn/shop/files/9781975336516_grande.jpg?v=1752679412"
  },
  {
    id: "novel_lookism_1",
    slug: "lookism-volume-1",
    title: "Lookism Volume 1",
    description: "A weak high school student wakes up in a handsome new body.",
    longDescription: "Daniel Park is an overweight high school student who gets bullied. One day, he wakes up in a new, handsome, and strong body while his original body continues to exist. A story of self-discovery and dual lives.",
    priceCents: 89900,
    category: "Web Novel",
    highlights: [
      "Body swap concept",
      "School life drama",
      "Action and comedy",
      "Korean webtoon phenomenon"
    ],
    popularityScore: 89,
    image: "https://images-cdn.ubuy.com.mm/65bf6b9a3ba34526460a001f-lookism-vol-20-korean-comics-line-naver.jpg"
  },
  {
    id: "novel_tbate_1",
    slug: "the-beginning-after-the-end-volume-1",
    title: "The Beginning After The End Volume 1",
    description: "A king reincarnated into a world of magic and monsters.",
    longDescription: "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power. Beneath the glamorous exterior of a powerful king lurks the shell of a man, devoid of purpose and will.",
    priceCents: 79900,
    category: "Web Novel",
    highlights: [
      "Reincarnation fantasy",
      "Strong protagonist",
      "Magic and adventure",
      "Web novel sensation"
    ],
    popularityScore: 89,
    image: "https://us-a.tapas.io/sa/f7/16e8def2-901b-45ea-8d86-2aa4b05cc86b_z.jpg"
  },
  {
    id: "novel_mushoku_tensei_1",
    slug: "mushoku-tensei-volume-1",
    title: "Mushoku Tensei: Jobless Reincarnation Volume 1",
    description: "A 34-year-old NEET gets a second chance at life in a fantasy world.",
    longDescription: "A hopeless man dies and is reborn as Rudeus Greyrat in a fantasy world. Determined to live his new life without regrets, he begins his journey of growth and redemption.",
    priceCents: 89900,
    category: "Light Novel",
    badge: "Isekai Masterpiece",
    highlights: [
      "Character development focus",
      "Detailed world-building",
      "Mature themes",
      "Beautiful illustrations"
    ],
    popularityScore: 91,
    image: "https://a.storyblok.com/f/178900/1500x2138/cdd69b1418/mushokutenseirecollections-cover.jpg/m/filters:quality(95)format(webp)"
  },
  
  // Web Novels
  {
    id: "manga_bleach_1",
    slug: "bleach-volume-1",
    title: "Bleach Volume 1",
    description: "A teenager becomes a Soul Reaper and protects humans from evil spirits.",
    longDescription: "Ichigo Kurosaki is a teenager with the ability to see ghosts. When his family is attacked by a Hollow, a malevolent lost soul, he obtains the powers of a Soul Reaper and must protect the human world.",
    priceCents: 89900,
    category: "Manga",
    highlights: [
      "Shonen classic",
      "Soul Reapers and Hollows",
      "Action-packed battles",
      "Long-running series"
    ],
    popularityScore: 85,
    image: "https://i.pinimg.com/736x/27/fd/62/27fd623919d5de8bc46ee437b1b4a45f.jpg"
  },
  {
    id: "anime_dbz_super_1",
    slug: "dragon-ball-super-volume-1",
    title: "Dragon Ball Super Volume 1",
    description: "Goku and friends face new threats beyond their wildest imagination.",
    longDescription: "After the defeat of Majin Buu, a new power awakens from beyond the cosmos. Beerus, the God of Destruction, sets his sights on Earth, forcing Goku and the Z Fighters to push their limits like never before.",
    priceCents: 79900,
    category: "Anime",
    highlights: [
      "God of Destruction arc",
      "Super Saiyan God transformation",
      "Epic battles",
      "Akira Toriyama's masterpiece"
    ],
    popularityScore: 84,
    image: "https://imusic.b-cdn.net/images/item/original/149/5022366709149.jpg?2020-dragon-ball-super-part-10-episodes-118-131-dvd&class=scaled&v=1582124316"
  }
];

export const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort(
  (a, b) => a.localeCompare(b),
);

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
