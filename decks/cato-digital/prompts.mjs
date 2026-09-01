/**
 * prompts.mjs — the 10-page prompt registry for the PODOS AI × Cato Digital deck.
 *
 * Single source of truth: LOCK (universal style contract) + per-page prompt + QC.
 * The runner (generate.mjs) concatenates them and sends the brand reference
 * images alongside, so every frame stays faithful to the real logo and pod.
 */

export const LOCK = `Create a premium horizontal 16:9 presentation image for PODOS AI.

VISUAL IDENTITY:
Use the established PODOS AI design language only.

- Bright porcelain-white and pale cool-gray environment
- Near-black typography: #0A0E1A
- Deep cobalt: #1B3FD9
- Electric blue: #2563EB
- Controlled cyan: #22BCEB
- Very minimal green only for positive/live status
- Matte-black PODOS modular data-center product
- Thin cobalt and cyan blueprint lines
- Soft technical grid and engineering measurement marks
- Premium translucent glass data panels
- Strong clean modern sans-serif typography
- Technical metadata and labels in a refined monospaced font
- Bright, engineered, precise, infrastructure-grade
- Apple product-page clarity combined with aerospace engineering diagrams
- Visually designed at AYESMAJ Studios level

FORMAT:
- Horizontal widescreen 16:9
- Cinematic 8K appearance
- Full-width composition
- Strong horizontal layout
- Perfect centering and balance
- Minimum 80px visual safe margin
- Large readable typography
- No narrow article layout
- No vertical poster composition
- No tiny unreadable text
- No cut-off elements
- No random decorative cards
- Every page must feel distinct while belonging to one unified system

REFERENCE CONTROL:
Use the supplied PODOS logo and PODOS pod render as exact visual references.
Preserve the real logo symbol, wordmark, pod proportions, matte-black materials, blue LED geometry, doors, vents and structural corners.
Do not redesign the logo.
Do not turn the pod into a shipping container, server cabinet, house, trailer or generic sci-fi box.

TEXT:
Render only the exact approved text provided in the specific prompt.
Do not add new slogans, random numbers, fake labels, lorem ipsum or extra paragraphs.
Maintain exact capitalization and punctuation.
Text must be sharp, correctly spelled and highly readable.

DESIGN DETAILS:
Use subtle depth, reflections, glass, blueprint geometry, dimensional data visualizations, clean shadows and restrained energy motion cues.
Use meaningful technical visuals rather than generic AI brains, glowing robots, binary code or cyberpunk imagery.

AVOID:
Full black backgrounds, dark hacker design, generic SaaS layout, editorial serif fonts, excessive glow, cheap neon, clutter, chaotic particles, random charts, stock-photo style, distorted hardware, malformed logo, misspelled text, fake certifications, excessive rounded cards and repeated layouts.`;

export const QC = `FINAL QUALITY CONTROL:

Before rendering, check:
- all requested text is present and correctly spelled
- no extra text has been added
- the PODOS logo matches the reference
- the Pod matches the same exact product family across all ten images
- all content fits safely within the 16:9 frame
- no image or headline is cut
- no narrow document layout
- no repeated composition from another page
- no fake partner logos
- no fake certifications
- no impossible engineering geometry
- no random UI metrics
- no invented measurements: if a dimension callout is drawn on the product it may
  only use the approved figures 12′ × 53′ × 12′, never a metric conversion and
  never any other length, weight, temperature or capacity value
- no black full-page background
- no cheap blue glow overload
- no generic SaaS cards
- no visual noise

The result must look like one frame from a custom $250,000 investor and enterprise presentation.`;

/* Brand reference images sent with every generation (repo-relative).
 * logo.png = the exact symbol + wordmark lockup.
 * "new pod.png" = the clean matte-black side elevation (byte-identical to
 * optimus/optimus-pod-front.png). Deliberately NOT products/pod.png — that
 * card carries spec-panel text furniture the model echoes into scenes. */
export const REFS = ["public/logo.png", "public/new pod.png"];

export const PAGES = [
  {
    id: "01-cover",
    title: "Cover — The Modular AI Factory",
    prompt: `Apply the universal PODOS visual lock.

Create the opening cover image for a premium PODOS AI presentation prepared for Cato Digital.

COMPOSITION:
A dramatic but bright California advanced-manufacturing environment at early morning.

On the right, show one large matte-black PODOS modular AI data-center unit emerging from a pristine modern factory through enormous open doors. The Pod is positioned on its road-legal chassis, with a premium heavy transport vehicle waiting outside. Preserve the exact PODOS product design and blue LED edge lighting.

Inside the factory, show a subtle production line with additional PODOS units at different stages of assembly. Keep the factory realistic, controlled and clean — not futuristic fantasy.

Use a soft white-to-blue atmospheric background. Add thin blueprint geometry extending from the factory floor into the open environment, suggesting that a physical building has become a manufactured product.

Place the text on the left with generous empty space.

TEXT TO RENDER EXACTLY:

Top eyebrow:
PREPARED FOR CATO DIGITAL

Main headline:
THE MODULAR
AI FACTORY

Supporting line:
A complete AI data center,
built in a factory and
delivered on a truck.

Bottom-left:
PODOS AI Inc.

Bottom-right:
CONFIDENTIAL · AUGUST 2026

Place the exact PODOS AI logo in the upper-left corner.

TYPOGRAPHY:
Main headline in a bold, tightly tracked modern grotesk.
"AI FACTORY" may use a controlled cobalt-to-cyan metallic treatment.
Supporting copy in dark slate.
Metadata in small technical mono lettering.

FINAL FEEL:
A serious manufactured-infrastructure category reveal — not a construction company brochure and not a generic startup presentation.`,
  },
  {
    id: "02-product",
    title: "The Product — One Integrated Unit",
    prompt: `Apply the universal PODOS visual lock.

Create a premium product architecture image showing one PODOS modular AI data-center unit as a complete integrated machine.

LAYOUT:
Use a wide, bright, technical product-reveal composition.

Place a large three-quarter front-side view of the matte-black PODOS Pod in the center-right on a white engineering floor with subtle cobalt blueprint lines.

Create a controlled partial cutaway through the Pod — not fully transparent — revealing organized rack positions, cooling manifolds, power infrastructure, fire detection, security access and telemetry systems.

Around the Pod, use five precise callout lines with restrained icons:
POWER
COOLING
FIRE
SECURITY
CONTROLS

Place four large horizontal metric modules beneath the headline. They should feel built into the page, not like generic SaaS cards.

TEXT TO RENDER EXACTLY:

Eyebrow:
THE PRODUCT

Headline:
ONE UNIT.
EVERY SYSTEM.

Supporting line:
Power, cooling, fire, security and controls —
integrated before the Pod leaves the factory.

Metric 1:
500 kW–1 MW
IT CAPACITY PER UNIT

Metric 2:
12′ × 53′ × 12′
ROAD-LEGAL FORM

Metric 3:
ZERO
WATER CONSUMED

Metric 4:
≤ 1.20
PUE BY DESIGN

Lower-left label:
ARRIVES INTEGRATED

Lower-left supporting line:
Cooling · electrical · atmosphere · detection · suppression · telemetry

Lower-right label:
CUSTOMER-SPECIFIED

Lower-right supporting line:
Servers · GPUs · racks · network · external thermal module

Place the exact PODOS logo subtly on the Pod and in the page header.

FINAL FEEL:
One complete product, engineered before delivery. The page must immediately communicate that PODOS is a manufactured AI data center — not a collection of separate components.`,
  },
  {
    id: "03-how-built",
    title: "How It Is Built — Machine, Not Box",
    prompt: `Apply the universal PODOS visual lock.

Create an ultra-premium horizontal engineering cutaway titled around the idea that PODOS is engineered as a machine, not a converted box.

VISUAL:
Show the exact PODOS Pod in a wide exploded axonometric presentation on a bright cool-gray background.

Separate the physical layers only slightly so the construction remains understandable:
- structural rail-car chassis
- crossmembers beneath rack positions
- external fluoropolymer skin
- drained cavity
- continuous air barrier
- thermally broken framing
- non-combustible mineral wool
- decoupled perforated inner skin
- internal rack and service architecture

Use thin cobalt leader lines and numbered engineering nodes. Add realistic material samples floating near the relevant layers: steel, coating, insulation and perforated inner skin.

Across the lower third, create five differentiated engineering load-case modules with refined icons and diagram fragments.

TEXT TO RENDER EXACTLY:

Eyebrow:
HOW IT IS BUILT

Headline:
ENGINEERED AS A MACHINE.
NOT A CONVERTED BOX.

Primary callouts:
A572 Gr50
STEEL CHASSIS

EIGHT-LAYER
THERMAL ENVELOPE

UNIT-LEVEL
VERIFICATION

Lower engineering domains:
TRANSPORT
3 g road shock

SEISMIC
Engineered per site class

ATMOSPHERE
Sealed and pressure-holding

ACOUSTIC
≤ 55 dBA at 50 feet

DURABILITY
25-year coating system

Bottom metadata:
ENV-001 · ENVELOPE ENGINEERING STANDARD

Bottom-right:
20+ PATENTS PENDING

Do not use a dark background. Let the black product create the contrast.

FINAL FEEL:
Aerospace-grade product engineering, factory documentation and physical resilience. It should feel more like a high-value industrial machine than architecture.`,
  },
  {
    id: "04-thermal",
    title: "Thermal Architecture — One Loop, Two Rack Types",
    prompt: `Apply the universal PODOS visual lock.

Create a premium technical visualization of the PODOS thermal architecture.

COMPOSITION:
Use a wide semi-cutaway side view of the PODOS Pod across the center of the image.

Divide the Pod interior visually into two coordinated zones:

LEFT ZONE:
Air-cooled racks with transparent rear-door heat exchangers.
Show warm rack airflow entering the rear-door exchanger and transferring into the liquid loop.

RIGHT ZONE:
Liquid-cooled GPU racks with copper cold plates, clean coolant couplings and rear-door capture for remaining heat.

A single luminous cyan warm-water loop must connect both zones. Use physically logical piping, flow arrows and restrained temperature transitions. The coolant loop should be the main visual path from left to right.

Show an external dry-cooler thermal module in the far-right background connected to the Pod, while keeping it secondary.

TEXT TO RENDER EXACTLY:

Eyebrow:
THERMAL ARCHITECTURE

Headline:
ONE LOOP.
TWO RACK TYPES.

Subheadline:
Warm water, not chilled water.

Left label:
AIR-COOLED RACKS

Left supporting line:
Rear-door capture transfers rack heat
directly into the liquid loop.

Right label:
LIQUID-COOLED GPU RACKS

Right supporting line:
Cold plates remove 75–90% at the silicon.
The rear door captures the remainder.

Metric rail:
45°C
SUPPLY

60°C
RETURN

UP TO 125 kW
PER POSITION

ZERO
WATER CONSUMED

Bottom line:
A mixed fleet runs in one Pod, on one loop.

Keep the page bright, clean and physically credible. Do not use generic liquid splashes, floating water droplets or fantasy cooling effects.

FINAL FEEL:
A highly engineered closed-loop thermal system made understandable in one glance.`,
  },
  {
    id: "05-economics",
    title: "Operating Economics — $187 per kW-Month",
    prompt: `Apply the universal PODOS visual lock.

Create a premium horizontal operating-economics visualization for PODOS AI.

Do not create a boring spreadsheet.

LAYOUT:
Use a large central financial visualization on a bright technical background.

On the left, place one large dominant number:
$187

Directly beneath:
PER kW-MONTH
FULLY LOADED · OWNER-OPERATED

To the right, build a precise horizontal stacked cost bar with seven proportional segments. Use cool gray for standard operating categories, cobalt for energy and a small cyan accent for monitoring. Use restrained green only for the heat-reuse credit.

Label each segment with its exact value:

CAPITAL RECOVERY
$74

ENERGY
$72

DEMAND CHARGES
$12

PROPERTY TAX + INSURANCE
$9

MAINTENANCE + MONITORING
$11

LAND + NETWORK + INTERCONNECTION
$9

WATER
$0

Below the bar, show a clean subtraction interaction:

$187
OWNER-OPERATED

− $17
HEAT OFFTAKE

= $170
WITH HEAT MONETISED

Add a small photorealistic matte-black PODOS Pod along the bottom edge, connected through a subtle cyan thermal line to a neighboring industrial or district-heating load.

TEXT TO RENDER EXACTLY:

Eyebrow:
OPERATING ECONOMICS

Headline:
WHAT A POD COSTS TO RUN

Bottom footnote:
Indicative for this comparison. A firm figure is issued against a specific site.
Excludes servers, racks and network equipment.

Design the composition so the viewer understands the total, the breakdown and the heat credit in less than three seconds.

FINAL FEEL:
Institutional financial clarity combined with technical infrastructure — not a finance-app dashboard.`,
  },
  {
    id: "06-side-by-side",
    title: "Side by Side — Colocation vs Ownership",
    prompt: `Apply the universal PODOS visual lock.

Create a powerful horizontal cost-comparison page for one megawatt of AI capacity.

LAYOUT:
Build three large vertical comparison zones across the image, but avoid generic pricing cards.

ZONE 1 — COLOCATION:
Show a large conventional data-center building in cool desaturated gray.
Use a dark-gray cost line rising steeply above it.

ZONE 2 — POD, OWNER-OPERATED:
Show one matte-black PODOS Pod on a clean engineered pad.
Use a cobalt cost line that is clearly much flatter than the colocation line.

ZONE 3 — POD + HEAT MONETISED:
Show the Pod connected by a warm-water loop to a neighboring usable heat load.
Use cobalt with a restrained green efficiency accent, flattest of the three.

THE THREE COST LINES MUST NOT LOOK ALIKE. Their relative slopes carry the whole
argument: colocation rent escalates steeply, an owned Pod stays nearly flat, and
a heat-monetised Pod is flatter still. A steeply rising line above the Pod
columns would contradict the page and must not appear.

TEXT TO RENDER EXACTLY:

Eyebrow:
SIDE BY SIDE

Headline:
OWN THE MEGAWATT.
CHANGE THE ECONOMICS.

Column 1:
COLOCATION REFERENCE

$230
PER kW-MONTH

$2,760,000
PER MW · PER YEAR

Column 2:
POD · OWNER-OPERATED

$187
PER kW-MONTH

$2,242,000
PER MW · PER YEAR

Column 3:
POD · HEAT MONETISED

$170
PER kW-MONTH

$2,042,000
PER MW · PER YEAR

Lower metric band:
≈ $81
ONGOING CASH COST AFTER PURCHASE

2.3–2.8 YEARS
SIMPLE PAYBACK

$8.6M
TEN-YEAR DIFFERENCE PER MW

Bottom line:
Capital once. Then power and maintenance.

Bottom footnote:
Ohio-class power at $0.09/kWh. Indicative — reissued against a specific site package.

Make the three economic models visually easy to compare without reading long paragraphs.

FINAL FEEL:
Decisive infrastructure economics, presented with institutional seriousness.`,
  },
  {
    id: "07-ten-year",
    title: "The Ten-Year View",
    prompt: `Apply the universal PODOS visual lock.

Create a premium horizontal ten-year cumulative-cost visualization.

COMPOSITION:
Use a large, elegant line chart as the central visual, occupying approximately two-thirds of the page.

The chart must feel integrated into an engineered spatial grid, not pasted from spreadsheet software.

Show:
- horizontal axis: YEAR 1 through YEAR 10
- vertical axis: $ MILLIONS · CUMULATIVE
- dark slate line: COLOCATION · ESCALATING 4%
- cobalt-to-cyan line: POD · OWNER-OPERATED · 2%

The colocation line should rise faster and finish visibly above the PODOS line. Between the final endpoints, create a restrained highlighted difference zone.

On the right, place a large glass insight panel.

TEXT TO RENDER EXACTLY:

Eyebrow:
THE TEN-YEAR VIEW

Headline:
CUMULATIVE COST
OF ONE MEGAWATT

Right-panel main number:
$8.6M

Right-panel label:
DIFFERENCE PER MEGAWATT
OVER TEN YEARS

Supporting copy:
Rent rises every year.
Owned capital does not.

Closing statement:
THE ASSET IS STILL THERE IN YEAR ELEVEN —
RELOCATABLE, WITH RESIDUAL VALUE.

Chart legend:
COLOCATION · 4% ESCALATOR
POD · 2% OPERATING-COST ESCALATOR

Footnote:
Both models fully loaded.

Add a very subtle photorealistic PODOS Pod silhouette behind the lower part of the chart, but do not obstruct the data.

The chart composition must be visually accurate and readable. Do not generate random intermediate values or extra labels.

FINAL FEEL:
A clear long-term ownership thesis expressed through one unforgettable graph.`,
  },
  {
    id: "08-siting",
    title: "Siting — Deploy Where Power Exists",
    prompt: `Apply the universal PODOS visual lock.

Create a cinematic horizontal deployment and siting page.

MAIN VISUAL:
A wide photorealistic aerial-to-ground composition showing one PODOS Pod arriving at a clean energy or industrial site where electrical capacity already exists.

Show:
- an existing substation or energy plant in the distance
- a precisely prepared pad
- the PODOS unit on its road-legal chassis
- six self-levelling jacks engaging with the pad
- factory-fitted power, cooling and fiber couplings
- an optional external Power Module positioned nearby
- no permanent traditional data-center building

Across the lower half, create a horizontal four-step deployment sequence using large numbers and blueprint transition lines.

TEXT TO RENDER EXACTLY:

Eyebrow:
SITING

Headline:
DEPLOYED WHERE
THE POWER ALREADY IS.

Step 01:
POWER IDENTIFIED

Subtext:
Substation headroom, curtailed generation
or campus capacity.

Step 02:
SITE PREPARED

Subtext:
Pad, anchors and service run.

Step 03:
POD DELIVERED

Subtext:
Road-legal chassis.
Six self-levelling jacks.

Step 04:
ENERGISED

Subtext:
Commissioned against the
factory acceptance test.

Supporting line:
BEHIND THE METER
OR ALONGSIDE UTILITY SERVICE

Small technical note:
Generator-ready inlet · no fuel stored aboard

Use a subtle geographic map or energy-routing diagram behind the scene, but do not clutter it with random city labels.

FINAL FEEL:
Site work reduced to preparation, connection and commissioning. It must feel real, logistically credible and deployable.`,
  },
  {
    id: "09-assurance",
    title: "Assurance — Factory-Measured, Recorded for Life",
    prompt: `Apply the universal PODOS visual lock.

Create a premium assurance and verification page for PODOS AI.

VISUAL:
Show a complete matte-black PODOS unit inside a bright California factory acceptance-test bay.

The unit is powered and running under full simulated load.

Around the Pod, show controlled technical verification layers:
- infrared thermal scan
- electrical acceptance trace
- acoustic boundary measurement
- envelope pressure test
- atmosphere baseline
- live telemetry stream
- serialized digital model of frame, bolts and welds

Do not make the room dark. Use a clean white industrial test environment with cobalt blueprint overlays and high-quality diagnostic screens.

On the right, show a refined "Birth Certificate" data document associated with the exact physical unit. The document should look official and technical but should not contain fake certifications.

CRITICAL CONSTRAINT ON THE CERTIFICATE AND THE DIAGNOSTIC SCREENS:
This is a real investor document, so no measurement may be invented. The certificate shows its field labels only — UNIT ID, SERIAL NUMBER, MODEL, RATED CAPACITY, TEST LOCATION, COMPLETED, TEST RESULT — each followed by a neutral placeholder of light gray dashes or a blank rule, never a fabricated value. Do not print any specific serial, city, factory name, country, calendar date, time or signature anywhere on the page. Do not draw a handwritten signature.

The diagnostic screens likewise carry titles, waveforms, thermal gradients and wireframes but NO numeric readouts: no voltages, currents, power figures, decibel values, pressure values, gas percentages, temperatures or percentage-verified badges. Visual instrumentation only, with the numbers deliberately absent.

TEXT TO RENDER EXACTLY:

Eyebrow:
ASSURANCE

Headline:
MEASURED AT THE FACTORY.
RECORDED FOR LIFE.

Module 1:
BORN READY ACCEPTANCE

Supporting line:
Full-load thermal, sound, air-tightness,
electrical and atmosphere testing before shipment.

Module 2:
THE BIRTH CERTIFICATE

Supporting line:
A measured record of the exact unit —
not a value inherited from a datasheet.

Module 3:
LIVE TELEMETRY

Supporting line:
Operation compared continuously
against the factory baseline.

Large bottom statement, set in near-black type directly on the bright porcelain-white background — this band must NOT be filled with navy, dark blue or any dark colour, because every other page in the deck is bright and this one has to match them:
A SUSTAINABILITY CLAIM THAT CAN BE
EVIDENCED — NOT ASSERTED.

Secondary bottom band:
AND THE HEAT IS A SECOND PRODUCT

Supporting line:
One megawatt of compute becomes
one megawatt of 60°C water.

FINAL FEEL:
Trust created through measurement, serialisation and permanent evidence — not marketing claims.`,
  },
  {
    id: "10-working-together",
    title: "Working Together — Commercial Structures",
    prompt: `Apply the universal PODOS visual lock.

Create the final commercial partnership page for PODOS AI.

LAYOUT:
Use a refined horizontal composition with one matte-black PODOS unit positioned in the center background, surrounded by three distinct commercial pathways represented through clean architectural structures and connected blueprint lines.

Do not use generic pricing cards.

Create three premium panels:

PANEL 1:
PURCHASE

Supporting copy:
Configured Pods bought outright.
Lowest cost per kilowatt-month.
Factory-test acceptance and ownership.

PANEL 2:
CAPACITY AGREEMENT

Supporting copy:
PODOS owns and operates the Pod.
Capacity purchased by the kilowatt.
No customer capital requirement.

PANEL 3:
FRAMEWORK

Supporting copy:
Reference configuration across a pipeline.
Reserved build slots.
Terms improve with fleet volume.

Below, create a wide project-input rail.

TEXT TO RENDER EXACTLY:

Eyebrow:
WORKING TOGETHER

Headline:
THREE STRUCTURES.
ONE PRODUCT.

Lower headline:
TO PUT A REAL NUMBER
IN FRONT OF YOU

Input 1:
FLEET PROFILE
Rack mix and measured draw

Input 2:
SITE
Power, voltage and ambient conditions

Input 3:
TIMING
Capacity increments and required dates

Input 4:
MUTUAL NDA
Full engineering package

Primary CTA:
START THE ENGINEERING CONVERSATION

Contact line:
Yosef Elimlich · Founder & CEO, PODOS AI Inc.
josef@podosai.com

Footer:
PODOS AI · CONFIDENTIAL

Place the exact PODOS logo in the top-left and a subtle product blueprint watermark behind the commercial options.

FINAL FEEL:
A confident final invitation to move from concept into an engineered site-specific commercial package.`,
  },

  /* ---------------------------------------------------------------------
   * PLATE VARIANTS for pages 5 and 7.
   *
   * The image model renders the words and the art beautifully but draws the
   * DATA wrong — on page 5 it sized the stacked bar decoratively ($74 came out
   * narrower than $72), and on page 7 it put the Pod line at ~$16.6M instead of
   * $24.5M, so the drawn gap contradicted the $8.6M headline.
   *
   * So these plates render everything EXCEPT the data graphic and hold a
   * defined region empty; overlay.py then composites a pixel-exact chart into
   * it. Art from the model, numbers from arithmetic.
   * ------------------------------------------------------------------- */
  {
    id: "05-economics-plate",
    title: "Operating Economics — art plate (bar composited separately)",
    prompt: `Apply the universal PODOS visual lock.

Create a premium horizontal operating-economics page for PODOS AI — this is an ART PLATE. A precise data graphic will be composited into it afterwards, so one region must be left completely empty.

BACKGROUND:
A bright porcelain-white technical environment with a soft cool-gray gradient, faint blueprint geometry and restrained engineering measurement marks. Calm and uncluttered.

LEFT COLUMN — render fully, occupying roughly the left quarter of the frame:

Eyebrow:
OPERATING ECONOMICS

Headline:
WHAT A POD COSTS TO RUN

One very large dominant number beneath the headline:
$187

Directly beneath that number:
PER kW-MONTH
FULLY LOADED · OWNER-OPERATED

RESERVED EMPTY REGION — THIS IS THE MOST IMPORTANT INSTRUCTION:
Everything to the right of the left column, in the upper two-thirds of the frame, must be COMPLETELY EMPTY — clean, bright, uninterrupted background only.

In that region there must be absolutely NO bar, NO chart, NO stacked segments, NO coloured rectangles, NO category labels, NO dollar amounts, NO icons, NO callout lines and NO panels. It is deliberately blank space held for a graphic that will be added later. Treat it as a large empty area of pure background.

LOWER BAND — render fully:
Along the bottom of the frame, place a photorealistic matte-black PODOS Pod in the lower left, connected by a subtle luminous cyan thermal line running to the right into a neighbouring industrial or district-heating building. Keep this band clean and below the reserved region.

Bottom footnote, small, lower left:
Indicative for this comparison. A firm figure is issued against a specific site.
Excludes servers, racks and network equipment.

Place the exact PODOS logo in the upper-left corner.

FINAL FEEL:
Institutional financial clarity — a beautifully composed page that is deliberately waiting for its central data graphic.`,
  },
  {
    id: "07-ten-year-plate",
    title: "The Ten-Year View — art plate (chart composited separately)",
    prompt: `Apply the universal PODOS visual lock.

Create a premium horizontal ten-year cost page for PODOS AI — this is an ART PLATE. A precise line chart will be composited into it afterwards, so one region must be left completely empty.

BACKGROUND:
A bright porcelain-white technical environment with a soft cool-gray gradient, faint blueprint geometry and restrained engineering measurement marks.

UPPER LEFT — render fully:

Eyebrow:
THE TEN-YEAR VIEW

Headline:
CUMULATIVE COST
OF ONE MEGAWATT

RIGHT PANEL — render fully as a premium translucent glass panel occupying roughly the right quarter of the frame, with a thin cobalt border:

Large number at the top of the panel:
$8.6M

Label beneath it:
DIFFERENCE PER MEGAWATT
OVER TEN YEARS

Supporting copy in the middle of the panel:
Rent rises every year.
Owned capital does not.

Closing statement lower in the panel, in cobalt:
THE ASSET IS STILL THERE IN YEAR ELEVEN —
RELOCATABLE, WITH RESIDUAL VALUE.

RESERVED EMPTY REGION — THIS IS THE MOST IMPORTANT INSTRUCTION:
The large central-left area beneath the headline and to the left of the glass panel must be COMPLETELY EMPTY — clean, bright, uninterrupted background only.

In that region there must be absolutely NO chart, NO plotted lines, NO axes, NO gridlines, NO year labels, NO numbers, NO legend, NO data points, NO shaded area and NO product render. It is deliberately blank space held for a graphic that will be added later. Do not place the Pod there. Treat it as a large empty area of pure background.

BOTTOM EDGE — render fully:
A thin cobalt rule across the lower edge with small technical mono metadata at the far left:
[ DATA MODEL ]
Both models fully loaded.

Place the exact PODOS logo in the upper-left corner.

FINAL FEEL:
A confident, quiet, institutional page that is deliberately waiting for its central graph.`,
  },
];

/** Full prompt for a page id = LOCK + page prompt + QC. */
export const fullPrompt = (page) => `${LOCK}\n\n---\n\n${page.prompt}\n\n---\n\n${QC}`;
