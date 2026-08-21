Prompt-time guidance for finny-1 work:

## Stack
TanStack Start + React 19 + Tailwind CSS 4 + Cloudflare Workers (D1) + TypeScript. Dev: `bun run dev` (port 3000), typecheck: `bun run typecheck`, routes: `bun run generate-routes`.

## What's done (this session)
- **About section**: Square tech badges (w-20 h-20 / size-20 md:size-24), bigger icons (h-7 w-7), bigger text (text-xs/text-sm), gap-1 between badges, gap-2 inside badges. Section has bg-canvas, scroll-mt-28, pt-12 md:pt-16 for scroll offset. Grid centered with mx-auto max-w-5xl. Headline: line-clamp-2 font-serif text-4xl md:text-[3.5rem]. Description: text-sm md:text-base max-w-md. Connect sidebar 480px wide with bigger cards (h-14 w-14 icons, text-lg labels). Em dash removed from about_study via .replace(/—/g, ',').
- **Navigation**: Floating pill (max-w-[1600px]) with transparent default + opacity-70, hover activates (bg-canvas/95, opacity-100, border-line, backdrop-blur-sm). Uses useState + useEffect scroll listener (scrollY > 40). Links gap-6 md:gap-12. Top-2 md:top-4.
- **Experience section**: Left col lg:col-span-3, sticky lg:top-32 lg:self-start. Timeline lg:col-span-9. Each entry: period/location above card (text-sm md:text-lg / text-xs md:text-sm), card fills full width, p-4 md:p-5, role text-lg md:text-2xl, company text-sm md:text-base, bullets text-xs md:text-sm (min text-sm everywhere). "Years on the field" computed from CAREER_START = new Date('2024-03-01'). Scroll-mt-28, bg-canvas, py-12 md:py-16. SectionHeader label/text aligned with About (text-base md:text-xl, font-serif text-4xl md:text-[3.5rem]). "Scroll down" link removed.
- **Portfolio section**: Simplified to project list (no carousel). Two-column grid on desktop. Each row: initial tile (size-14, border, font-serif text-3xl) + title + truncated description + tags. Tags built from role + stack (split on ,/|) + year. All rows link to /projects/$projectId via TanStack Router <Link>. Header: "Projects" label + activeCategoryTitle as serif headline + border-b. Category filter: was dropdown, NOW BEING CHANGED to 2 tabs (Programming + Creative). py-12 md:py-16, scroll-mt-28, bg-canvas.
- **Project detail page**: New route src/routes/projects.$projectId.tsx. Loader fetches all SiteData, finds project by id. Layout: Back link, category label, title (font-serif text-4xl md:text-[3.5rem]), role+year, description, stack chips, source/website/video/drive buttons. Right side: images from gallery JSON array + main image. Creative categories (photography/videography) use 2-col grid (aspect-[4/3]), others single col (aspect-[924/491]). Footer included.
- **DB migrations**: 0002 (role, stack, year on projects), 0003 (source_link, gallery on projects). Project type has source_link?: string | null, gallery?: string | null.
- **Static seed**: All 18 projects have empty role/stack/year defaults (from ast_edit). User needs to provide actual values per project.

## What's pending (do tomorrow)
1. **Portfolio tabs**: Replace dropdown with 2 tabs: "Programming" (category_id === 'programming') and "Creative" (everything else: ui-ux, videography, photography). Currently activeCategory state is 'programming' — 'creative' is not a real DB category, so Portfolio filter needs to handle `activeCategory === 'creative'` → include all non-programming projects. Also update Hero onSelectCategory to set 'programming' or 'creative'.
2. **Footer redesign**: Use public/bg/footer.webp as background image. Text left and right of the door in the image. Current Footer component at src/components/site/Footer.tsx — needs full rewrite with bg image overlay.
3. **GitHub activities widget**: Add git push activity indicators (like GitHub contribution graph or recent pushes). User wants this somewhere on the page — likely Experience section or a new section. Needs GitHub API integration or static data.
4. **Project detail data**: Need actual role/stack/year/source_link/gallery values per project. User will provide. Current seed has empty strings.
5. **Route tree regeneration**: After creating projects.$projectId.tsx, need `bun run generate-routes` to update routeTree.gen.ts.
6. **Typecheck everything**: Final verification after all changes.

## Key patterns
- Section padding: scroll-mt-28 bg-canvas py-12 md:py-16
- Section label: text-base font-medium text-graphite md:text-xl
- Headlines: font-serif text-4xl leading-tight text-ink md:text-[3.5rem]
- Body text: text-sm leading-relaxed text-ink md:text-base
- Minimum text size: text-sm (no text-xs except location text)
- All sections need bg-canvas to prevent hero leaking through
