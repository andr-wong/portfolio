# Andrew Wong
**Email:** andrwong101@gmail.com | **Phone:** +61 490 360 623
**Location:** Gilles Plains, Adelaide SA
**LinkedIn:** linkedin.com/in/andrwong | **Portfolio:** andrwong.com | **GitHub:** github.com/andr-wong

---

## Summary

Final-year CS student at the University of Adelaide. I build things people actually use. Replaced a church's manual WhatsApp attendance chain with a full production web app, now in live use. Won 2nd place at the CSC × UPC Hackathon 2025 with a platform pulling 100+ live events from six sources. When I see a process being done manually that shouldn't be, I tend to end up writing the software for it. Looking for a graduate role where I can do that at larger scale.

---

## Education

**Bachelor of Computer Science**
University of Adelaide — Adelaide, SA
Semester 2, 2023 – July 2026 (Expected)

**Bachelor of Mechanical Engineering** *(transferred to CS after Semester 1)*
University of Adelaide — Adelaide, SA
Semester 1, 2023

**South Australian Certificate of Education (SACE)**
Modbury High School — Adelaide, SA
2018 – 2022

---

## Experience

**Retail Team Member**
JB Hi-Fi — Adelaide, SA
May 2024 – Present
- Helped customers find technology that actually suited what they needed, and hit sales targets doing it.
- Sorted out customer problems that crossed departments, mostly under time pressure.

**Sales & Customer Service**
Myer — Adelaide, SA
Oct 2024 – Present
- Sold high-value items across four Level 4 departments (small electrical, manchester, kitchenware, tabletop), maintaining a customer satisfaction score of 80%+ — with a run of 13 consecutive 9 or 10/10 reviews.
- Ran end-of-day reconciliations: verified all registers were balanced, kept cash levels within threshold by close, coordinated other floors to clear overages in time, and printed variance reports for the Store Manager.
- Conducted inventory scan counts across multiple floors. Investigated high-variance items and identified a batch of wrongly scanned coffee machines, recovering several thousand dollars in stock.
- On stock shifts, cleared caged inventory from the dock to the floor and reserve quickly — keeping the dock clear so the team could keep moving incoming stock.
- Informally brought casual staff from other floors up to speed on Level 4, so they could work confidently without pulling a manager in.
- Solved logistics problems on the spot for customers — for items too large for bags, offered string handles, free delivery, dock pickup, or in-store holding while they arranged transport.

**Fulfilment & Operations**
Myer — Adelaide, SA
Nov 2022 – Jan 2023
- Packed and dispatched online orders, ran click-and-collect, and helped with a multi-level store refurbishment.

**Kitchen Hand & Crew Trainer**
McDonald's — Adelaide, SA
2019 – 2022
- Made it from crew to trainer — which meant running the kitchen during peak hours and showing new staff how everything worked.
- Trained new hires on procedures and food safety in a store doing a few hundred covers an hour.

---

## Projects

**Mapster — Event Aggregation Platform**
https://mapster.city
- **2nd Place, CSC × UPC Hackathon 2025** — built with the HackerCodex team
- Pulled 100+ events from 6 live sources (Eventbrite, Ticketmaster, Experience Adelaide, SA Tourism, Adelaide Festival Centre, Google Events) at launch
- Built the interactive map, Ticketmaster API integration, and dark/light map themes
- Wrote backend deduplication logic to handle the same events coming in from multiple scrapers
- Used OpenAI's Vision API to extract event details from photos of physical posters
- **Stack:** SvelteKit, TypeScript, Python, FastAPI, Supabase (PostgreSQL), Mapbox GL JS, OpenAI Vision API, Selenium, BeautifulSoup, Vercel, Railway

**Hope Church Adelaide — Headcount Tool**
https://headcount.andrwong.com
- Church receptionists were coordinating Sunday attendance across two services by manually crafting WhatsApp messages. Built and shipped a web app that replaced the whole process, now in live use
- Multi-area form with live auto-calculating totals and a tap-to-count modal; one-tap WhatsApp generation so staff didn't have to change how they were already working
- Paste-to-import parser for the three WhatsApp message formats already in use, so the switch from the old system was basically invisible
- Cloud storage with calendar-based reports, attendance trend charts, and locked historical entries
- Full auth: Google SSO + email/password, admin approval flow, role-based access control, and account linking
- Automated changelog via Supabase Edge Function on git commits; transactional email via Resend
- **Stack:** Vanilla JS, HTML, CSS, Supabase (PostgreSQL + Auth + Edge Functions), Resend, Cloudflare Turnstile, GitHub Pages

**HCF Transport Calculator**
- Passenger-to-driver assignment was done by hand each week. Built a tool that does it automatically
- Uses Dijkstra's shortest-distance algorithm: high-priority passengers assigned first, then the rest are route-optimised by total distance (driver → passenger → destination)
- Saves driver and passenger addresses; supports multiple groups (church, lifegroup, custom) and configurable destinations
- Address autocomplete via Mapbox Geocoding API; routes rendered on an interactive MapLibre map with OpenStreetMap tiles and OSRM routing
- **Stack:** Next.js 16, React 19, TypeScript, Supabase (PostgreSQL), MapLibre GL, OSRM, Mapbox Geocoding API, Zustand, Tailwind CSS, shadcn/ui

**Recipe Website with Cheapest Ingredients Lookup**
- Full-stack web app that scrapes live supermarket pricing and shows the cheapest place to buy each ingredient for a given recipe
- **Stack:** HTML, CSS, JavaScript

**Statistical Analysis of Factors Affecting Fertility**
- Built a multiple regression model to find which variables in a multi-factor dataset had statistically significant effects on fertility rates
- **Stack:** R

**Platformer Game**
- Tile-based platformer using OOP — class hierarchies, polymorphism for entity types, and custom collision detection
- **Stack:** C++

**Scrabble Solver**
- Finds all valid word placements from a given tile rack against a dictionary, tuned for speed
- **Stack:** MATLAB

---

## Skills

**Languages:** JavaScript, TypeScript, Python, R, C++, MATLAB
**Frameworks & Libraries:** SvelteKit, Next.js, React, FastAPI, Node.JS, HTML, CSS, Tailwind CSS, shadcn/ui, AJAX
**Databases:** Supabase (PostgreSQL), MySQL
**Tools:** Git, GitHub, Figma, Vercel, Railway, Selenium, BeautifulSoup, Zustand
**APIs & Services:** OpenAI API, Mapbox GL JS, MapLibre GL, OSRM, Ticketmaster API, OpenCage API, Resend, Cloudflare Turnstile, Google OAuth
**Other:** Data analysis, regression modelling, systems design, web scraping, REST APIs, auth & access control, algorithm design

---

## Certifications & Awards

- **2nd Place — CSC × UPC Hackathon 2025** (Mapster, HackerCodex team)
