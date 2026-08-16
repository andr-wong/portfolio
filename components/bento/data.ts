export type StatItem = { n: number | string; suffix: string; cap: string };
export type Skill = [string, number];
export type TimelineEntry = [string, string];
export type NowEntry = [string, string];
export type PrincipleEntry = [string, string];

export interface ProjectData {
  tag: string;
  name: string;
  desc: string;
  stack: string[];
  url?: string;
  host?: string;
  award?: string;
  live?: boolean;
  github?: string;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
}

export interface InterestItem {
  tag: string;
  name: string;
  desc: string;
  chips: string[];
}

export const BENTO = {
  name: ['Andrew', 'Wong'] as const,
  status: '● Open to graduate roles — 2026',
  tagline:
    "Final-year CS student at the University of Adelaide. When I see a process being done by hand that shouldn't be, I tend to end up writing the software for it — event platforms, civic tooling, and the small apps that quietly retire a WhatsApp chain.",
  location: { city: 'Adelaide, SA', meta: 'Adelaide, SA · UTC+9:30' },
  stats: [
    { n: 3, suffix: 'yr', cap: 'writing production code' },
    { n: 7, suffix: '', cap: 'projects shipped or completed' },
    { n: 3, suffix: '', cap: 'apps live in production' },
    { n: '2nd', suffix: '', cap: 'CSC × UPC Hackathon 2025' },
  ] as StatItem[],
  skills: [
    ['TypeScript / JS', 96],
    ['Python', 92],
    ['React / Next.js', 84],
    ['SvelteKit', 80],
    ['Supabase / Postgres', 82],
    ['Maps · GL / OSRM', 78],
    ['C++ · R', 62],
  ] as Skill[],
  projects: {
    mapster: {
      tag: 'PRJ_001',
      award: '2nd · CSC × UPC 2025',
      name: 'Mapster',
      desc: "Adelaide's events, pulled onto one map — 100+ listings from six live sources (Eventbrite, Ticketmaster, Adelaide Festival Centre, SA Tourism, and more), deduped against each other so the same gig doesn't show up six times. Also reads paper posters: point OpenAI Vision at a photo of a flyer stapled to a pole, get a structured event out the other end. Built the map, the Ticketmaster integration, and the scraper dedup logic myself, with the HackerCodex team, in one hackathon weekend.",
      stack: ['SvelteKit', 'FastAPI', 'Supabase', 'Mapbox GL', 'OpenAI'],
      url: 'https://mapster.city',
      host: 'mapster.city',
      github: 'https://github.com/andr-wong',
    } as ProjectData,
    headcount: {
      tag: 'PRJ_002',
      name: 'Headcount',
      live: true,
      desc: "Two Sunday services, attendance tracked by someone typing it into WhatsApp by hand. Built the app that replaced it — paste-to-import for the exact message formats staff already used, so nobody had to change how they worked. Kept growing since launch: two counters can now see each other's tallies live so nobody double-counts a row, there's a searchable lookup for returning visitors, and pastors get a stats view broken down by week, month, and year.",
      stack: ['Vanilla JS', 'Supabase', 'Edge Fns'],
      url: 'https://headcount.andrwong.com',
      host: 'headcount.andrwong.com',
      github: 'https://github.com/andr-wong',
    } as ProjectData,
    hcf: {
      tag: 'PRJ_003',
      name: 'HCF Router',
      desc: 'Someone used to sit down every week and manually match passengers to drivers. Now Dijkstra\'s algorithm does it — high-priority passengers seated first, everyone else route-optimised by total distance. Addresses save between runs, groups and destinations are configurable, and the whole thing renders on a live map with autocomplete on the address fields.',
      stack: ['Next.js', 'MapLibre', 'OSRM', 'Supabase', 'Mapbox Geocoding', 'Zustand'],
    } as ProjectData,
  },
  timeline: [
    ['2026', 'Final year. Open to grad roles.'],
    ['2025', 'Mapster — 2nd at CSC × UPC Hackathon.'],
    ['2024', 'Retail at JB Hi-Fi & Myer. Shipped Headcount.'],
    ['2023', 'Switched Mech Eng → Computer Science, UofA.'],
  ] as TimelineEntry[],
  now: [
    ['reading', 'The Pragmatic Programmer'],
    ['cooking', 'Cantonese, on a budget'],
    ['weekend', 'Mapbox styles & church'],
    ['study', "BCS · UofA · '26"],
  ] as NowEntry[],
  contact: {
    email: 'andrwong101@gmail.com',
    github: 'https://github.com/andr-wong',
    linkedin: 'https://linkedin.com/in/andrwong',
  } as ContactInfo,
};

export const BENTO_PERSONAL = {
  status: '● Off the clock',
  headline: ['The other', 'half.'] as const,
  headlinePress: 'The other half',
  tagline:
    "Coffee, code, and church on Sundays. Adelaide is home. Here's what I do when nothing's shipping — the books, the food, and the volunteering that quietly produced half the projects on the other page.",
  location: { city: 'Adelaide, SA', meta: 'Adelaide, AU · GMT+9:30' },
  stats: [
    { n: 3, suffix: '', cap: 'yrs on the sales floor' },
    { n: 6, suffix: '', cap: 'languages dabbled in' },
    { n: 3, suffix: '', cap: 'projects with a map' },
    { n: 1, suffix: '', cap: 'home — Adelaide' },
  ] as StatItem[],
  cook: {
    tag: 'OFF-CLOCK 01',
    name: 'Cooking on a budget',
    desc: "My first real web app scraped supermarket prices to find the cheapest ingredients per recipe. Cantonese home-style most nights — plus whatever's on special.",
    chips: ['Cantonese', 'price-scraper', 'cast iron'],
  } as InterestItem,
  maps: {
    tag: 'OFF-CLOCK 02',
    name: 'Maps & routes',
    desc: "I'll happily lose a Saturday to Mapbox styles. Three of my projects involve a map. This is not a coincidence.",
    chips: ['Mapbox', 'OSRM', 'cartography'],
  } as InterestItem,
  faith: {
    tag: 'OFF-CLOCK 03',
    name: 'Church community',
    desc: 'Hope Church Adelaide. Most of my software lands here first — Headcount and the transport router both live in this orbit.',
    chips: ['Hope Church', 'Sundays', 'volunteer'],
  } as InterestItem,
  now: [
    ['reading', 'The Pragmatic Programmer'],
    ['listening', 'Lo-fi house & film scores'],
    ['cooking', 'Cantonese, on special'],
    ['home', 'Adelaide · GMT+9:30'],
  ] as NowEntry[],
  principles: [
    ['on shipping', 'A tool is a tool when someone uses it on Sunday without asking me how.'],
    ['on stack', 'Pick the smallest thing that makes the next six months pleasant.'],
    ['on Adelaide', 'Quietly the best place to build software in.'],
  ] as PrincipleEntry[],
  retail: {
    label: 'Plot twist',
    line: "3 years on the sales floor — JB Hi-Fi, Myer, Macca's. Best engineering-communication training I've had.",
  },
  contactLine: 'Coffee, or code review.',
  contact: {
    email: 'andrwong101@gmail.com',
    github: 'https://github.com/andr-wong',
    linkedin: 'https://linkedin.com/in/andrwong',
  } as ContactInfo,
};
