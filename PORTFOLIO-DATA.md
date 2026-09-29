# finny. — Portfolio Data (Khalid Atthoriq)

> Extracted from `finny-1` on 2026-08-08, before the full reset. This file is the single source of truth for rebuilding the portfolio site. All content below was captured verbatim from `src/data/static-seed.ts` (D1 mirror) and the site components.

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Khalid Atthoriq |
| Title | Fullstack Creative Developer |
| About headline | Fullstack work, but I also do creative projects. |
| About profile | I build fullstack apps, design interfaces, and create visual content. |
| About study | I study Informatics Engineering at State Polytechnic of Malang. My work blends engineering with creative direction, so the result is functional and still has personality. |
| Approach | Build it clean. Make it readable. Give it character. |
| Approach detail | I keep layouts editorial and structured, but still easy for people to use. |
| Approach detail 2 | I care about clear hierarchy, strong visuals, and smooth interactions. |

## 2. Social Links

1. GitHub — https://github.com/khalidfinny
2. LinkedIn — https://linkedin.com/in/khalidatthoriq
3. Instagram (designs) — https://instagram.com/finnn.designs
4. Instagram (personal) — https://instagram.com/ffiinn.yy
5. Instagram (photography) — https://instagram.com/finny.picss

## 3. Technical Arsenal

**Programming:** React, JavaScript, TypeScript, Next.js, Tailwind CSS, Angular, Python, Astro, Laravel, PostgreSQL

**Design & UI/UX:** Figma, Photoshop

**Video & Motion:** After Effects, Premiere Pro, Capcut

## 4. Portfolio Categories

| Category | "See more" link |
|---|---|
| Programming | https://drive.google.com/drive/folders/1GKB7l--fYM1Pk6oBs9qdE7w8sXbMIDRM?usp=sharing |
| UI/UX Design | https://drive.google.com/file/d/1chC-iyWf599BFjHn7WU3EnQocImydr4s/view?usp=sharing |
| Videography | https://drive.google.com/drive/folders/1nJ36224aH9--g42N2PEbcAlc2ipyWLwo?usp=sharing |
| Photography | https://instagram.com/finny.picss |

## 5. Projects

### Programming

| Title | Image | Link | Notes |
|---|---|---|---|
| Novaris | `/pics/Novaris.webp` | https://novaris-six.vercel.app/ | |
| Sehatin | `/pics/Sehatin.webp` | https://sehatin-malang.vercel.app/ | |
| Honeypot | `/pics/honeypot.webp` | https://honey-pot-ugmg.vercel.app/ | |
| Self Studio Machine Learning | `/portofolio/self.webp` | — | |
| Laskaraya | `/pics/laskaraya1.webp` | — | |

### UI/UX Design

| Title | Image | Description | Link |
|---|---|---|---|
| Novella | `/portofolio/novella.webp` | A novel library design with a focus on timeless, old money, and clean aesthetics. | — |
| ISFOR | `/portofolio/Isfor.webp` | A design for a researchers website, with the institution color palette and a clean modern design. | — |
| Whether | `/portofolio/Wheter.webp` | A weather app UI with a modern and unique design and clear data visualization. | — |
| Novaris | `/pics/Novaris.webp` | | https://novaris-six.vercel.app/ |
| Honeypot | `/pics/honeypot.webp` | | https://honey-pot-ugmg.vercel.app/ |

### Videography

| Title | Image | Description | YouTube embed | Instagram | Google Drive |
|---|---|---|---|---|---|
| WRI in a nutshell | `/portofolio/wriinanutshell.webp` | Overview video showcasing WRI organization activities and achievements. | https://www.youtube.com/embed/fH4F6tah8PY?si=Uv_ckR8tj0VvITXb | https://instagram.com/yourvideography | https://drive.google.com/drive/folders/videography1 |
| Maba Arc part 1 | `/portofolio/touraday.webp` | Freshman orientation video capturing new student journey and experiences. | https://www.youtube.com/embed/a-H6iiEsaqg?si=Bx9O8S9rgmccsWjL | https://instagram.com/yourvideography | https://drive.google.com/drive/folders/videography2 |
| Makrab WRI 2025 | `/portofolio/makrab.webp` | Event documentation video capturing student organization activities and celebrations. | https://www.youtube.com/embed/wF6YHu1eA-Y?si=qYJ4dflpsxy6o7Q4 | https://instagram.com/yourvideography | https://drive.google.com/drive/folders/videography3 |

> Note: the videography instagram/drive links above are placeholders in the seed data — replace with real URLs when rebuilding.

### Photography

| Title | Image | Description |
|---|---|---|
| Sports and Photography | `/portofolio/bball.webp` | captures using the sony A6300, this picture captured the sense of speed on playing basketball. |
| Pink Flowers | `/portofolio/flower.webp` | captured using the Xiaomi 14T, this picture captured the beauty of a girl holding pink flowers. |
| Horse | `/portofolio/horse.webp` | captured using the sony a6300, this picture captured a horse head person on top of a trunk of a 1994 Toyota Great Corolla. |

## 6. Experience

### Work

**Fullstack Web Developer Internship** — PT Surabaya Autocomp Indonesia, Ngoro, Indonesia — January 2026 — Present
- Developed a simulator to efficiency in production preparation.
- Optimized website performance to ensure users work smoothly in preparing mass production documents.
- Optimized workers workflow in automating documents generation.

**Freelance Web Developer & UI/UX Designer** — Self-Employed, Malang, Indonesia — February 2024 — February 2026
- Developed and launched responsive client websites praised for clarity, speed, and strong brand alignment.
- Optimized front-end performance and accessibility, improving user satisfaction and SEO visibility.
- Delivered a food security system recognized for its reliability and ease of data handling.

**UI/UX Designer Internship** — PT Molca Teknologi Nusantara, Surabaya, Indonesia — August 2025 — October 2025
- Created Digital Twin dashboards that enhanced monitoring flow and simplified industrial decision-making.
- Collaborated closely with developers to refine design consistency, building a unified system.

### Organization

**Creative Team Lead** — Workshop Riset Informatika, Malang, Indonesia — February 2024 — February 2026
- Led the creative division to build a unified and professional brand identity across WRI's platforms.
- Developed an adaptable content framework that encouraged consistent output and team collaboration.
- Produced and directed video campaigns well-received for storytelling and visual quality.

### Education

**Informatics Engineering (BAS)** — Politeknik Negeri Malang, Malang, Indonesia — August 2023 — Present
- Focusing on Applied Informatics with a cumulative GPA of 3.7/4.0.
- Engaging in various software development projects and research workshops.

## 7. Site & Stack Facts

- **Repo**: `finny` — https://github.com/KhalidFinny/finny.git (branch `master`)
- **Framework**: TanStack Start (Vite 8 + React 19 + TanStack Router), SSR + server functions
- **Runtime**: Cloudflare Workers (`@cloudflare/vite-plugin`, wrangler 4)
- **Database**: Cloudflare D1 `finny-db` — tables: `profile`, `categories`, `projects`, `experiences`, `socials`, `techs`
- **Storage**: Cloudflare R2 bucket `finny-media` (binding `MEDIA`)
- **Styling**: Tailwind CSS 4 + `@tailwindcss/typography`
- **Fonts**: Montserrat (sans), IBM Plex Mono (mono) — self-hosted in `public/fonts/`
- **Navigation sections**: Home (`#home`), About (`#about`), Experience (`#experience`), Portfolio (`#portfolio`)
- **Footer**: © {year} Khalid Atthoriq + social hosts
- **Migrations**: `migrations/0001_init.sql`, `migrations/seed.sql` (D1 seed, mirrors this data)

## 8. Design Reference

Liminal theme — pale institutional walls, near-black ink, one sodium accent.

| Token | Value |
|---|---|
| `--wall` | `#e9e7e1` |
| `--wall-dim` | `#dedbd3` |
| `--ink` | `#1b1b19` |
| `--ink-soft` | `#45443f` |
| `--line` | `#c9c6bc` |
| `--accent` | `#8a7a2f` |
| `--accent-ink` | `#5c5120` |
| `--signal` | `#b3422c` |

- Hero: full-screen dark `#0d0d0c` with layered liminal background/foreground images, cream `#F3F1EA` type, uppercase huge name split into two lines (e.g. "KHALID" / "ATTHORIQ"), title eyebrow in uppercase letterspaced mono.
- Hero background layers: `/Finny's Space (1)/bg-liminal.webp` (backdrop) + `/Finny's Space (1)/fg-liminal.webp` (foreground overlay).

### finny palette (2026-08-08) — current design direction

Labeled, with usage mapping:

| Label | Token | Hex | Usage |
|---|---|---|---|
| Canvas | `--canvas` | `#F2F0EA` | Main background |
| Paper | `--paper` | `#FAF9F5` | Project surfaces / floating artifacts |
| Ink | `--ink` | `#181816` | Primary text |
| Graphite | `--graphite` | `#565650` | Secondary text |
| Mist | `--mist` | `#A8A79F` | Metadata, numbering, inactive text |
| Line | `--line` | `#D8D6CF` | Dividers, subtle borders |
| Deep Line | `--deep-line` | `#B9B7AF` | Hover/strong borders |
| Sky | `--sky` | `#AFC8D5` | Atmospheric accent |
| Field | `--field` | `#89977B` | Secondary atmospheric accent |

Mapping from the old liminal palette:

| Old token | Old hex | → New token | Notes |
|---|---|---|---|
| `--wall` | `#e9e7e1` | Canvas | background, lightened |
| `--wall-dim` | `#dedbd3` | Paper | surfaces |
| `--ink` | `#1b1b19` | Ink | primary text (unchanged role) |
| `--ink-soft` | `#45443f` | Graphite | secondary text, lightened |
| `--line` | `#c9c6bc` | Line | dividers, lightened |
| — | — | Deep Line | new hover/strong-border tier |
| — | — | Mist | new metadata tier |
| `--accent`/`--signal` | `#8a7a2f`/`#b3422c` | Sky + Field | sodium accent retired → atmospheric accents |

Contrast notes (against Canvas `#F2F0EA` / Paper `#FAF9F5`):

- Ink ≈ 15:1 — passes WCAG AA (4.5:1) for all text.
- Graphite ≈ 7:1 — passes AA for normal text.
- Mist ≈ 2.3:1 — fails AA: metadata/numbering/inactive only, never body copy.
- Sky ≈ 2.1:1 — decorative accent only, not text.
- Field ≈ 3.1:1 — large text / UI accents only, not body copy.
- Line / Deep Line — non-text (borders, dividers), exempt from text contrast rules.

Tailwind mapping: `bg-canvas`, `bg-paper`, `text-ink`, `text-graphite`, `text-mist`, `border-line`, `border-deep-line`, `text-sky`, `text-field` (defined in `src/styles.css` `@theme`).

## 9. Media / Asset Inventory

These files lived under `public/` (deleted with the reset; originals also on R2 `finny-media` and/or Google Drive):

**Hero layers** (`public/Finny's Space (1)/`): `bg-liminal.png`, `bg-liminal.webp`, `fg-liminal.png`, `fg-liminal.webp`

**Pics** (`public/pics/`): Chaser.webp, DancingDoodle.svg, Logo.webp, Novaris.webp, Sehatin.webp, Sehatin2.webp, Sirepang.webp, SitReadingDoodle.svg, astroboy.svg, chery.webp, chery1.webp, chery2.webp, chery3.webp, chilling.svg, desain.webp, design.jpg, honeypot.webp, isfor.webp, laskaraya1.webp, laskaraya2.webp, logo2.png, main.webp, ngoding.jpg, photography.webp, rocket.svg, sehatin3.webp

**Portfolio** (`public/portofolio/`): Isfor.webp, Sirepang.webp, Wheter.webp, bball.webp, flower.webp, horse.webp, makrab.webp, novella.webp, self.webp, touraday.webp, wriinanutshell.webp

**Other**: `public/CV - Muhammad Khalid Atthoriq - Politeknik Negeri Malang.pdf` (114 KB resume), `public/assets/noise.svg`, `public/icons/favicon.ico`, `public/icons/logo.webp`, `public/images/dokter.svg`, `public/images/sehatin.svg`, `public/manifest.json`, `public/robots.txt`, `public/sitemap.xml` (placeholder `yourdomain.com`), `public/fonts/`

## 10. CV

- File: `CV - Muhammad Khalid Atthoriq - Politeknik Negeri Malang.pdf` (114.2 KB)
- Hosted at `/CV - Muhammad Khalid Atthoriq - Politeknik Negeri Malang.pdf` on the old site
