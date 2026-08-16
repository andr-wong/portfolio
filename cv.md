# Andrew Wong
**Email:** andrwong101@gmail.com | **Phone:** +61 490 360 623
**Location:** Gilles Plains, Adelaide SA
**LinkedIn:** linkedin.com/in/andrwong | **Portfolio:** andrwong.com | **GitHub:** github.com/andr-wong

---

## Summary

I'm a Computer Science student at Adelaide University who just finished all my exams (degree conferral is expected late Sept/early Oct 2026). I build things people actually use. Replaced a church's manual WhatsApp attendance chain with a full production web app, now in live use. Won 2nd place at the CSC × UPC Hackathon 2025 with a platform pulling 100+ live events from six sources. When I see a process being done manually that shouldn't be, I tend to end up writing the software for it. Looking for a graduate role where I can do that at larger scale.

---

## Education

**Bachelor of Computer Science (Artificial Intelligence)** *(all exams completed, conferral expected late Sept/early Oct 2026)*
Adelaide University — Adelaide, SA
Semester 2, 2023 – July 2026

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
- Sold high-value items across four Level 4 departments (small electrical, manchester, kitchenware, tabletop) and kept a customer satisfaction score above 80%, including a run of 13 consecutive 9 or 10/10 reviews.
- Sold high-ticket mattresses by calmly walking customers through firmness, materials, and support at their price point, so they understood what they were paying for rather than just picking the most expensive option.
- Took on team leader duties during sale periods: printed sale tickets for the entire floor and coordinated the team to get every ticket up before close, ready for the next day's trade.
- Coordinated break schedules across the whole floor, making sure every team member got their break while sections stayed covered.
- Ran end-of-day reconciliations: verified all registers were balanced, kept cash levels within threshold by close, coordinated other floors to clear overages in time, and printed variance reports for the Store Manager.
- Conducted inventory scan counts across multiple floors. Investigated high-variance items and identified a batch of wrongly scanned coffee machines, recovering several thousand dollars in stock.
- On stock shifts, cleared caged inventory from the dock to the floor and reserve quickly, so the dock stayed clear and the team could keep moving incoming stock.
- Informally brought casual staff from other floors up to speed on Level 4, so they could work confidently without pulling a manager in.
- Solved logistics problems on the spot for customers: for items too large for bags, offered string handles, free delivery, dock pickup, or in-store holding while they arranged transport.

**Fulfilment & Operations**
Myer — Adelaide, SA
Nov 2022 – Jan 2023
- Packed and dispatched online orders, ran click-and-collect, and helped with a multi-level store refurbishment.

**Kitchen Hand & Crew Trainer**
McDonald's — Adelaide, SA
2019 – 2022
- Made it from crew to trainer, which meant running the kitchen during peak hours and showing new staff how everything worked.
- Trained new hires on procedures and food safety in a store doing a few hundred covers an hour.

---

## What I'm Building Now

**Church Management App — Hope Church Adelaide**
- Building an end-to-end, in-house app to replace the church's externally-hosted management software. It cuts the recurring yearly subscription cost and gives us a system we can actually modify and update ourselves as the church's needs change

**HCF Transport Calculator**
- Passenger-to-driver assignment was done by hand each week. Built a tool that does it automatically
- Uses Dijkstra's shortest-distance algorithm: high-priority passengers assigned first, then the rest are route-optimised by total distance (driver → passenger → destination)
- Saves driver and passenger addresses; supports multiple groups (church, lifegroup, custom) and configurable destinations
- Address autocomplete via Mapbox Geocoding API; routes rendered on an interactive MapLibre map with OpenStreetMap tiles and OSRM routing
- **Stack:** Next.js 16, React 19, TypeScript, Supabase (PostgreSQL), MapLibre GL, OSRM, Mapbox Geocoding API, Zustand, Tailwind CSS, shadcn/ui

**Reimbursement Automation — Hope Church Adelaide**
- Replacing the manual reimbursement process (emailing different people, then hand-entering every cost and GST amount into a spreadsheet) with a webapp: staff upload receipts, and an AI agent reads them and pulls out the costs automatically
- The whole process becomes a single upload, with totals and GST calculated automatically instead of typed in by hand

---

## Projects

**Mapster — Event Aggregation Platform**
https://mapster.city
- **2nd Place, CSC × UPC Hackathon 2025**, built with the HackerCodex team
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
- Automated changelog via Supabase Edge Function on git commits; transactional email via Resend
- Kept iterating after launch based on user feedback and complaints: added a live paired-counting mode so two counters can see each other's tallies in real time and catch mismatches, a searchable attendance lookup to flag returning visitors, and a statistics overview for pastors covering average headcount by week, month, and year
- Added Google SSO and a privileged-accounts system so only admins can change destructive settings
- **Stack:** Vanilla JS, HTML, CSS, Supabase (PostgreSQL + Auth + Edge Functions), Resend, Cloudflare Turnstile, GitHub Pages

**AI-Generated Text Detector — NNDL Group Project**
- **High Distinction.** One of a 4-person team, but I built and iterated the final model on my own, working through five full versions (1.0 to 1.5) before landing on the one that worked
- Traced a 0.877 AUROC plateau to a preprocessing bug: obfuscated text (invisible Unicode characters, homoglyph substitution) was reaching the model uncleaned at inference. Fixed it with a "defang" normalisation step plus adversarial data augmentation, which pushed the public Kaggle AUROC to 0.9101
- Final architecture is a two-branch ensemble: a fine-tuned RoBERTa-base classifier blended with a GPT-2 perplexity and stylometry logistic regression head, with the blend weighted by cross-domain validation instead of in-domain accuracy
- Built a leave-domains-out validation protocol, holding out three entire text domains from training, since a same-domain train/test split can't catch that kind of over-fitting
- Caught and discarded two shortcuts that looked good on paper: a pseudo-labelling trick that scored 0.988 through data leakage, and a higher-capacity model that collapsed to 0.61 AUROC once evaluated cross-domain
- **Stack:** Python, PyTorch, Hugging Face Transformers (RoBERTa, GPT-2), scikit-learn, Kaggle

**Piano Music Generation — LSTM with Self-Attention**
- Built an attention-augmented LSTM (three LSTM layers plus four-head causal self-attention with a residual connection, 7.1M parameters) that generates 60 seconds of piano music from a seed MIDI file
- Trained on 400 files sampled from the MAESTRO dataset (roughly 200 hours of classical piano recordings), using an event-based MIDI encoding (390-token vocabulary for note timing, pitch, and velocity) and pitch transposition across six keys to get more out of a limited sample
- Fixed exposure bias, the mismatch between training on ground-truth tokens and generating from the model's own output, using scheduled sampling; tuned generation quality (temperature, nucleus sampling, a penalty against too much silence) via grid search
- Validated output against the MAESTRO corpus on pitch content and rhythm (0.78 and 0.81 overlap) and note density (4.39 notes/beat, within the real corpus range); perplexity (75.07) is the main open weakness, and the report traces it to dataset scale and context window length
- **Stack:** Python, PyTorch

**Recipe Website with Cheapest Ingredients Lookup**
- Full-stack web app that scrapes live supermarket pricing and shows the cheapest place to buy each ingredient for a given recipe
- **Stack:** HTML, CSS, JavaScript

**Statistical Analysis of Factors Affecting Fertility**
- Built a multiple regression model to find which variables in a multi-factor dataset had statistically significant effects on fertility rates
- **Stack:** R

**Platformer Game**
- Tile-based platformer using OOP: class hierarchies, polymorphism for entity types, and custom collision detection
- **Stack:** C++

**Scrabble Solver**
- Finds all valid word placements from a given tile rack against a dictionary, tuned for speed
- **Stack:** MATLAB

---

## Skills

**Languages:** JavaScript, TypeScript, Python, R, C++, MATLAB
**Frameworks & Libraries:** SvelteKit, Next.js, React, FastAPI, Node.JS, HTML, CSS, Tailwind CSS, shadcn/ui, AJAX, PyTorch, Hugging Face Transformers, scikit-learn
**Databases:** Supabase (PostgreSQL), MySQL
**Tools:** Git, GitHub, Figma, Vercel, Railway, Selenium, BeautifulSoup, Zustand, Kaggle, Ollama
**APIs & Services:** OpenAI API, Mapbox GL JS, MapLibre GL, OSRM, Ticketmaster API, OpenCage API, Resend, Cloudflare Turnstile, Google OAuth
**Other:** Data analysis, regression modelling, systems design, web scraping, REST APIs, auth & access control, algorithm design, deep learning, NLP, ensemble methods

---

## Certifications & Awards

- **2nd Place, CSC × UPC Hackathon 2025** (Mapster, HackerCodex team)
