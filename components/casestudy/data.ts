export interface CaseStudySection {
  heading: string;
  paragraphs: string[];
}

export interface CaseStudy {
  slug: string;
  name: string;
  tagline: string;
  meta: string;
  liveUrl: string;
  host: string;
  stack: string[];
  sections: CaseStudySection[];
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  headcount: {
    slug: 'headcount',
    name: 'Headcount',
    tagline:
      "Replacing a church's manual WhatsApp attendance count with a tool the staff actually kept using.",
    meta: 'Live in production',
    liveUrl: 'https://headcount.andrwong.com',
    host: 'headcount.andrwong.com',
    stack: [
      'Vanilla JS',
      'Supabase (Postgres, Auth, Edge Functions)',
      'Resend',
      'Cloudflare Turnstile',
      'GitHub Pages',
    ],
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          "Hope Church Adelaide runs two Sunday services. Every week, someone had to add up attendance across both by hand and type the totals into a WhatsApp message so the rest of the team could see them. There was no history, no way to search for a name from a few weeks back, and no way for two people counting the same service to know if they'd double-counted a row.",
        ],
      },
      {
        heading: 'What I built',
        paragraphs: [
          "The easiest way to get people to switch tools is to not make them learn a new one. Headcount's import parser matches the three WhatsApp message formats staff were already typing, so the switch from the old process was basically invisible — paste the message you'd normally send, and it's imported.",
          'The rest is a multi-area form with live auto-calculating totals, a tap-to-count modal for the people on the door, and one-tap WhatsApp message generation so the output still looks like the message everyone was already used to reading.',
        ],
      },
      {
        heading: 'What changed after launch',
        paragraphs: [
          "Shipping it wasn't the end. Two counters working the same service kept independently losing track of who'd counted which row, so I added live paired-counting — both counters now see each other's tallies update in real time. A pastor asked for a way to spot who hadn't been in for a while, so I built a searchable attendance lookup. Someone else wanted a breakdown by week, month, and year instead of a running total, so that became its own stats view.",
          "I also added Google SSO and a privileged-accounts system, so the people on the door can use the app day to day without being able to touch the settings that could break it for everyone else.",
        ],
      },
      {
        heading: 'Stack',
        paragraphs: [
          "Vanilla JS, HTML, and CSS, with Supabase for the database, auth, and edge functions, deployed on GitHub Pages. No framework — the app is small enough that a build step would have cost more than it saved, and GitHub Pages' static hosting doesn't need one.",
        ],
      },
    ],
  },
  mapster: {
    slug: 'mapster',
    name: 'Mapster',
    tagline:
      "Pulling Adelaide's scattered event listings — six sources, plus paper posters — onto one map.",
    meta: '2nd Place, CSC × UPC Hackathon 2025',
    liveUrl: 'https://mapster.city',
    host: 'mapster.city',
    stack: [
      'SvelteKit',
      'TypeScript',
      'Python',
      'FastAPI',
      'Supabase',
      'Mapbox GL JS',
      'OpenAI Vision API',
      'Selenium',
      'BeautifulSoup',
    ],
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          "Finding out what's on in Adelaide means checking Eventbrite, Ticketmaster, Experience Adelaide, SA Tourism, the Adelaide Festival Centre, and Google Events separately — and that's before you get to the flyer stapled to a pole outside a cafe, which isn't on any of them.",
        ],
      },
      {
        heading: 'What I built',
        paragraphs: [
          "Mapster pulls 100+ live events from six sources onto one interactive map. The harder problem wasn't fetching the data — it was that the same event routinely showed up from more than one source with a slightly different title, time, or venue name, so a meaningful chunk of the work was the dedup logic that decides two listings are actually the same event.",
          "The map also reads paper posters: point a photo at OpenAI's Vision API, and it returns a structured event — name, date, time, venue — that goes onto the map the same way a scraped listing would.",
        ],
      },
      {
        heading: 'Under the deadline',
        paragraphs: [
          'Built in one hackathon weekend with the HackerCodex team. My part was the interactive map, the Ticketmaster API integration, and the scraper dedup logic. It placed 2nd at the CSC × UPC Hackathon 2025.',
        ],
      },
      {
        heading: 'Stack',
        paragraphs: [
          'SvelteKit and TypeScript on the frontend, a Python/FastAPI backend running the scrapers (Selenium and BeautifulSoup) and the OpenAI Vision calls, Supabase for storage, and Mapbox GL JS for the map. Deployed on Vercel and Railway.',
        ],
      },
    ],
  },
};

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDIES);
