# Immersive Hero Landing & Off-White Project Dossier Modal Plan

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your reference image and clarification (*"no not portfolio heading that photo is for reference"*), we are redesigning the hero experience to be visual-first with minimal words, a dark sky overlay for crisp legibility, and interactive clickable project locks.

- **Hero Visual Architecture**: Transitioning from the split-column layout (54% burgundy text box + 46% right image) to a **full-bleed, 100vh cinematic architectural hero photograph**. The top portion of the photograph utilizes a smooth dark gradient/vignette overlay ensuring white and gold typography remains razor-sharp and legible.
- **Hero Typography (No "PORTFOLIO" Heading)**: Instead of the reference's placeholder "PORTFOLIO" word, the hero will feature clean, restrained luxury typography with **"CRAFTING SPACES. BUILDING EXPERIENCES."** (or *"Designing Homes With Character"*), the disciplines lockup (`architecture · interiors · landscapes`), and an interactive **FEATURED PROJECT: VILLA IN SIOLIM · NORTH GOA** section.
- **Interactive Clickability**: The featured project block on the hero image is directly interactive—clicking it instantly opens the full Casa Sylva / Villa in Siolim architectural dossier modal. The hero also includes smooth exploration controls (`EXPLORE WORKS ↓` and `BOOK CONSULTATION ↗`).
- **Off-White Project Modal Atmosphere**: Replacing the pitch-black backdrop (`bg-black/90`) in `ProjectDossierModal.tsx` with an **elegant warm off-white / architectural linen frosted wash** (`bg-[#F4EFEB]/85 backdrop-blur-2xl` with subtle warm vignette). This frames the rich burgundy and gold project card with gallery-grade contrast while keeping all controls, close buttons, and photo navigation crisp and prominent.

---

## 1. Overview & Core Concept

### What It Delivers
1. **Cinematic Full-Bleed Hero Section**:
   - Replaces the segmented split-screen with an expansive full-viewport photograph of a signature modern tropical villa at dusk with illuminated architectural geometry, lush landscaping, and warm interior lighting.
   - Applies an atmospheric dark top-down gradient (`from-[#16080B]/90 via-[#1E0B10]/60 to-transparent`) specifically over the text zone so that all typographic elements are high-contrast, effortless to read, and seamless.
   - Minimalist typographic composition: Disciplines kicker (`architecture | interiors | landscapes`), studio statement (`CRAFTING SPACES. BUILDING EXPERIENCES.`), and a featured project lockup (`FEATURED PROJECT` · `VILLA IN SIOLIM` · `NORTH GOA`) with a fine gold hairline accent.
   - Full clickability: Clicking the featured project lockup opens its complete photo dossier, and clicking the secondary action smoothly scrolls to the works gallery or consultation modal.

2. **Off-White Gallery Backdrop for Project Dossier Modal**:
   - When a user opens any project card, the background overlay transforms from stark jet black into a warm, museum-grade off-white translucent atmosphere (`bg-[#F5F1EC]/85 backdrop-blur-2xl`).
   - The deep burgundy and brushed gold project card sits at the center with rich depth, subtle drop-shadows, and crisp tactile legibility.
   - Control buttons (Close `✕`, Next/Previous photo arrows, Lightbox button) are adjusted with dark-tinted glass and gold borders for accessibility against the light backdrop.

---

## 2. User Experience & Visual Design

### Hero Section UX Flow & Visual Composition
```
┌────────────────────────────────────────────────────────────────────────┐
│  M.A.D STUDIO                     architecture | interiors | landscapes│
│                                                                        │
│  [ Atmospheric Dark Vignette Overlay ]                                 │
│                                                                        │
│  CRAFTING SPACES.                                                      │
│  BUILDING EXPERIENCES.                                                 │
│                                                                        │
│  FEATURED PROJECT [clickable ↗]                                        │
│  VILLA IN SIOLIM                                                       │
│  NORTH GOA                                                             │
│  ──────────────────                                                    │
│                                                                        │
│  [EXPLORE WORKS ↓]     [BOOK CONSULTATION ↗]                           │
│                                                                        │
│  [ Full-Bleed Architectural Dusk Photograph with Interior Lighting ]   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Color Palette & Mood Tokens
- **Hero Canvas**: Full-bleed architectural photograph featuring twilight sky, warm interior illumination, and lush landscape.
- **Hero Dark Overlay**: Linear gradient `linear-gradient(180deg, rgba(20, 7, 10, 0.92) 0%, rgba(30, 11, 16, 0.65) 45%, rgba(0, 0, 0, 0.15) 80%, rgba(62, 29, 35, 1) 100%)`.
- **Typographic Accents**: Specular warm gold (`#C5A06B`), champagne gold (`#EBD2AC`), pure white (`#FFFFFF`), and soft linen (`#D8C7B5`).
- **Modal Backdrop**: Warm off-white architectural wash (`rgba(245, 241, 236, 0.88)` with `backdrop-blur-2xl` and subtle darkening at edges for focal depth).
- **Modal Card**: Deep burgundy liquid glass (`#2E1217` / `#3E1D23`) with 1px border (`rgba(197, 160, 107, 0.3)`), creating museum monograph contrast against the light backdrop.

### Responsive Behavior (Desktop, iPad, iPhone)
- **Desktop (1440px+)**: Left-aligned typography with spacious breathing room over the twilight sky; villa architecture prominently centered/right.
- **Tablet / iPad (768px - 1024px)**: Comfortable scaling of headlines (`clamp(2rem, 3.5vw, 3rem)`) with touch-friendly tap targets.
- **Mobile (360px - 430px)**: Compact vertical stack with safe padding below the fixed navbar; text positioned gracefully over the dark upper sky; featured project badge easily tapable with thumb.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Full-Bleed Photograph with Dark Gradient vs. Split Column
- **Chosen Approach**: Full-bleed background photograph spanning `100vw` and `100vh` with an integrated CSS gradient that darkens only the text zone.
- **Why**: Eliminates layout boxiness, matches the user's reference visual language, and creates an immediate high-end architectural impression.
- **Alternatives Considered**: Keeping a side-by-side split was rejected because the user specifically requested a "big photo on which the text is merged properly visible and clickable".

### Decision 2: Typography Selection (Refined Studio Statement vs. "PORTFOLIO" Heading)
- **Chosen Approach**: Prominent, confident architectural statement `"CRAFTING SPACES. BUILDING EXPERIENCES."` paired with `"FEATURED PROJECT: VILLA IN SIOLIM · NORTH GOA"`, directly adhering to user's instruction (*"no not portfolio heading that photo is for reference"*).
- **Why**: Keeps word count minimal while grounding the page in real studio identity rather than placeholder cover text.

### Decision 3: Modal Backdrop Color Balance
- **Chosen Approach**: Warm off-white frosted glass wash (`bg-[#F5F1EC]/88 backdrop-blur-2xl` with subtle radial vignette) paired with dark floating close control and rich burgundy card.
- **Why**: Satisfies the user's request for an off-white combination behind the project card while maintaining the established burgundy and gold brand identity of the card itself.

---

## 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│  - Controls selectedDossierProject state               │
│  - Supplies onOpenDossier to HeroSection & Works       │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            ▼                                ▼
┌───────────────────────┐        ┌───────────────────────┐
│    HeroSection.tsx    │        │ProjectDossierModal.tsx│
│ - Full-bleed photo    │        │ - Warm off-white blur │
│ - Top-down dark scrim │        │   backdrop            │
│ - Clickable featured  │        │ - High-contrast modal │
│   project lockup      │        │   controls            │
│ - Minimal actions     │        │ - Burgundy card       │
└───────────────────────┘        └───────────────────────┘
```

### Files Targeted for Update
1. **`src/sections/HeroSection.tsx`**:
   - Re-architect from flex row / split container to a full-bleed absolute image layout with dynamic dark vignette scrim.
   - Add `onOpenDossier` prop and wire up the featured project ("Villa in Siolim, North Goa") to launch the Casa Sylva dossier directly on click.
   - Render minimalist luxury typography matching the reference layout.
2. **`src/components/ProjectDossierModal.tsx`**:
   - Update overlay container styling from `bg-black/90` to warm architectural off-white (`bg-[#F5F1EC]/85 backdrop-blur-2xl`).
   - Enhance the outer dismiss button (`✕`) and navigation arrows with high-contrast burgundy/gold liquid glass framing so they are legible against the off-white background.
3. **`src/App.tsx`**:
   - Pass `onOpenDossier={(project) => setSelectedDossierProject(project)}` to `HeroSection` so clicking the featured project opens the dossier modal directly.
