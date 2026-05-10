#!/usr/bin/env python3
import os
import random
import sys

IMG_DIR = "/Volumes/ReckonHouse/RHS/OS/public/case-studies/inspiration"

# Collect all image files, excluding macOS metadata (._*)
exts = (".jpg", ".jpeg", ".png", ".webp", ".avif")
files = sorted(
    f for f in os.listdir(IMG_DIR)
    if f.lower().endswith(exts) and not f.startswith("._")
)

# Deterministic shuffle so the order is consistent across builds.
random.seed(42)
random.shuffle(files)

# Preserve known captions; everything else gets the placeholder.
alt_overrides = {
    "Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California19-min.jpg":
        "Amber Interior Design, Montana residence",
    "Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California25-min.jpg":
        "Amber Interior Design, Montana residence",
    "Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California26-min.jpg":
        "Amber Interior Design, Montana residence",
    "Bert and May Kitchen5566.jpg.webp":
        "Bert and May kitchen with patterned tile backsplash and oak cabinetry",
    "Mother-Anthropic-Claude-1-1024x782.jpg":
        "Mother x Anthropic film still, three figures watching a model rocket launch in the desert",
    "Walden-Retreats-11-1440x960.jpg":
        "Walden Retreats living room with stone fireplace, stacked firewood, and chess board",
    "vintage-portrait-fedora-sunglasses-profile.jpg":
        "Black-and-white profile portrait, man in fedora and dark sunglasses",
    "reckonhouse-asterisk-spray-mark-on-cream.jpeg":
        "Black spray-paint asterisk mark centered on a cream background",
    "jack-white-red-shirt-red-guitar-stage.jpeg":
        "Jack White on stage in red shirt with red electric guitar",
    "editorial-leather-bass-helmet-portrait.jpg":
        "Editorial portrait, figure in motorcycle helmet and leather jacket with a bass guitar",
    "bw-musician-studio-mic-acoustic-guitar.jpg":
        "Black-and-white musician at studio microphone with acoustic guitar",
    "musician-acoustic-guitar-floral-wallpaper.jpg":
        "Musician with acoustic guitar against peeling vintage floral wallpaper",
    "dieter-rams-palette-braun-grille-knobs.jpg":
        "Dieter Rams design palette, Braun speaker grille pattern with color knobs",
    "bw-portrait-aviators-leather-jacket-beach.jpg":
        "Black-and-white portrait, man in aviator sunglasses and leather jacket at the beach",
    "bw-cinematic-portrait-fedora-cigarette.jpg":
        "Black-and-white cinematic close-up, man in wide-brim hat smoking a cigarette",
    "vintage-clothing-store-zebra-ottoman-rack.jpg":
        "Vintage clothing store interior with zebra-print ottoman and dark cabinetry",
    "wes-anderson-royal-tenenbaums-couch-portrait.jpg":
        "Royal Tenenbaums film still, two figures seated on a couch in a red-walled room",
    "bw-waylon-jennings-aviators-cigarette-portrait.jpg":
        "Black-and-white portrait of Waylon Jennings in aviator sunglasses with a cigarette",
    "bw-bespectacled-man-coca-cola-bottle-table.jpg":
        "Black-and-white portrait, young man in glasses at a table with a Coca-Cola bottle",
    "utah-desert-canyons-sagebrush-warm-light.jpg":
        "Utah desert canyons in warm afternoon light with sagebrush in the foreground",
    "rrl-denim-leather-detail-rope-stitching.jpg":
        "Close-up of vintage RRL denim with leather inset and rope-tied detail",
    "dead-weather-band-portrait-ornate-room.jpg":
        "Black-and-white band portrait, four musicians in an ornate floral-walled room",
    "country-singer-cowboy-hat-honky-tonk-neon.jpg":
        "Country singer in cowboy hat with acoustic guitar, Miller High Life neon sign behind",
    "bw-feather-headdress-indian-motorcycle.jpg":
        "Black-and-white photograph, figure in feather headdress arms outstretched behind an Indian motorcycle",
    "bw-whitey-morgan-band-honky-tonk-stage.jpg":
        "Black-and-white live shot of country band on a small honky-tonk stage",
    "bw-jack-white-pinstripe-suit-mixing-desk.jpg":
        "Black-and-white portrait, man in pinstripe suit and round glasses at a studio mixing desk",
    "rrl-vintage-vest-fedora-flat-lay.jpeg":
        "Flat lay of vintage tweed vest, dark fedora, knit tie, and RRL striped shirt",
    "sepia-waylon-jennings-cowboy-hat-bottle.jpg":
        "Sepia portrait of Waylon Jennings in cowboy hat smoking a cigarette beside a bottle",
    "ryman-auditorium-pews-stained-glass.jpg":
        "Empty Ryman Auditorium pews with stained-glass arched windows in primary colors",
    "menswear-store-deer-mount-velvet-chair.jpg":
        "Eclectic menswear store interior with mounted deer head, mustard velvet chair, gallery wall",
    "miles-davis-suede-jacket-fur-bedspread.jpg":
        "Miles Davis seated on fur bedspread in suede jacket and printed silk scarf",
    "monument-valley-mittens-dawn-light.jpg":
        "Monument Valley mittens at dawn under low cloud cover",
    "richie-tenenbaum-camera-headband-yacht.jpg":
        "Royal Tenenbaums film still, Richie with camera, headband, and beard",
    "bw-dead-weather-portrait-wallpaper.jpg":
        "Black-and-white band portrait, four musicians against patterned wallpaper",
    "bw-dead-weather-rooftop-empire-state.jpg":
        "Black-and-white band portrait on a rooftop with the Empire State Building behind",
    "leather-bench-corner-stitching-wood-detail.jpeg":
        "Tan leather bench corner with whip-stitched seam against a raw wood block",
    "hill-country-stone-foyer-portrait-painting.jpeg":
        "Texas Hill Country stone foyer with antique portrait, dark wood console, and a monstera leaf",
    "bw-gruene-hall-water-tower-honky-tonk.jpg":
        "Black-and-white shot of Gruene Hall dance hall with water tower behind",
    "bw-dead-weather-portrait-barn-siding.jpg":
        "Black-and-white band portrait against weathered barn siding",
    "wabi-sabi-living-room-mushroom-mirror-beams.jpeg":
        "Wabi-sabi living room with exposed beams, large mushroom mirror, plaster fireplace",
    "infographic-italian-tv-ridgeline-chart.jpeg":
        "Italian-language infographic, circular ridgeline chart with bubble groupings",
    "bw-miles-davis-tweed-suit-cigarette.jpg":
        "Black-and-white portrait of Miles Davis in tweed suit smoking a cigarette",
    "no-country-josh-brolin-kelly-macdonald-trailer.jpg":
        "No Country for Old Men film still, couple seated on a trailer couch with Lone Star beer",
    "bw-dead-weather-portrait-warehouse.jpg":
        "Black-and-white band portrait of two musicians in a derelict warehouse",
    "bw-lightnin-hopkins-cigar-archtop-guitar.jpg":
        "Black-and-white portrait of bluesman in fedora smoking a cigar with an archtop guitar",
    "bw-dead-weather-railroad-tracks.jpg":
        "Black-and-white shot of band members walking along railroad tracks",
    "calacatta-viola-marble-fluted-columns.jpg":
        "Calacatta viola marble fluted columns in cream and burgundy veining",
    "bw-musicians-black-rebel-motorcycle-club-marquee.jpg":
        "Black-and-white street shot of two musicians under a Black Rebel Motorcycle Club marquee",
    "bw-miles-davis-pinstripe-suit-st-george-street.jpg":
        "Black-and-white street portrait of Miles Davis in pinstripe suit on St. George Street",
    "organ-mountains-moonrise-orange-glow.jpg":
        "Organ Mountains glowing orange at sunset with the moon rising behind the peaks",
    "bw-waylon-jennings-cowboy-hat-portfolio.jpg":
        "Black-and-white portrait of Waylon Jennings in cowboy hat carrying a portfolio",
    "vintage-transparent-solar-system-chart.jpeg":
        "Antique educational print, transparent solar system chart with planet orbits",
    "rrl-trading-co-store-display-blankets.jpg":
        "Double RL store interior with antlers, vintage trunks, knit hats, and a gallery wall",
    "bw-lightnin-hopkins-suit-motorcycle.jpg":
        "Black-and-white portrait, suited bluesman with a motorcycle and parked cars behind",
    "denim-glasses-portrait-bookshelf-armchair.jpg":
        "Bearded man in denim shirt and tortoiseshell glasses, seated in a carved armchair",
    "rrl-denim-shirt-corduroy-collar-bandana.jpeg":
        "Close-up of an RRL denim shirt with corduroy collar and red paisley bandana",
    "leather-chesterfield-armchair-fireplace-stone.jpg":
        "Olive leather button-tufted chair beside a stone fireplace with mounted antelope head",
    "rrl-cattle-ranch-store-mannequins.jpg":
        "Double RL Cattle Ranch store display with denim mannequins and antler chandelier",
    "lee-denim-shirts-stack-button-detail.jpg":
        "Stack of vintage Lee denim and corduroy shirts showing button and label detail",
    "johnny-cash-fishing-jacket-rifle-fall.jpg":
        "Johnny Cash holding a transistor radio outdoors in fall, hunter beside him with a rifle",
    "tarantino-king-of-golf-robe-bedroom.jpg":
        "Quentin Tarantino in a printed silk robe seated in a floral-wallpapered bedroom",
    "wes-anderson-asteroid-city-diner.jpg":
        "Asteroid City film still, three figures at a 1950s diner counter",
    "bw-southern-rock-singer-stage-spotlight.jpg":
        "Black-and-white live shot, long-haired singer with electric guitar in stage spotlights",
    "dark-wood-paneled-room-trophy-mounts-cabinet.jpg":
        "Dark wood-paneled hunting den with antler mounts, oil paintings, and a carved cabinet",
    "charley-crockett-cowboy-hat-tweed-guitar-shop.jpg":
        "Country singer in cowboy hat and tweed suit standing inside a hanging-guitar shop",
    "bw-cowboy-rearing-horse-field.jpg":
        "Black-and-white photograph, cowboy rearing on a horse in a grassy field",
    "infographic-large-scale-data-ridgeline.jpeg":
        "Large-scale data visualization, ridgeline chart with bubble cluster heads",
    "sepia-three-cowboys-walking-dirt-road.jpg":
        "Sepia photograph, three cowboys walking down a dirt road",
    "fluted-tile-kitchen-stone-counter-cutting-boards.jpeg":
        "Modern kitchen with fluted white tile, stone counter, dark cutting boards, brass sconce",
    "red-leather-bruno-mathsson-jetson-chair.jpeg":
        "Red leather Bruno Mathsson Jetson swivel chair on wood floor",
    "bw-jack-white-third-man-records-piano.jpeg":
        "Black-and-white portrait, Jack White in studio with upright piano and Jaguar guitar",
    "bw-dead-weather-keyboards-live-leather.jpg":
        "Black-and-white live shot, two band members at keyboards in leather jackets",
    "charley-crockett-cowboy-hat-leather-acoustic.jpg":
        "Country singer in cowboy hat and leather jacket holding an acoustic guitar",
    "bw-dead-weather-mosshart-white-fur-coat.jpg":
        "Black-and-white portrait of Allison Mosshart and Jack White seated on concrete",
    "tricolor-cowhide-texture-brown-white.png":
        "Tricolor cowhide texture in brown, white, and black patches",
    "vintage-turntable-stylus-balance-tool.jpg":
        "Vintage black-and-white photo, hand using a stylus pressure gauge on a turntable",
    "bw-jack-white-pinstripe-suit-fedora-guitar.jpg":
        "Black-and-white live shot, man in pinstripe suit and fedora playing electric guitar",
    "alexander-mcqueen-skull-print-scarf.jpg":
        "Alexander McQueen black-and-white skull print scarf detail",
    "bw-bluesman-fedora-cigar-vest-doorway.jpg":
        "Black-and-white portrait, suited bluesman in fedora and round glasses with cigar in a doorway",
    "bw-3614-jackson-highway-muscle-shoals.jpg":
        "Black-and-white photo, four musicians outside the 3614 Jackson Highway studio",
    "dieter-rams-braun-radio-product-shot.jpg":
        "Dieter Rams Braun radio with circular speaker grille and aluminum knob",
    "swiss-typographic-grid-flag-signal-poster.jpeg":
        "Swiss typographic poster with maritime signal flags arranged on a grid",
    "frank-lloyd-wright-built-in-bookshelves.jpg":
        "Frank Lloyd Wright Usonian living room with built-in bookshelves and stone fireplace",
    "bw-miles-davis-cat-eye-sunglasses-cigarette.jpg":
        "Black-and-white portrait of Miles Davis in cat-eye sunglasses with a cigarette",
    "bw-portrait-glasses-clasped-hands-dark-shirt.avif":
        "Black-and-white portrait of a man in glasses with hands clasped in front of him",
    "wes-anderson-budapest-doorway-frame.jpeg":
        "Wes Anderson film still, narrow doorway framing a small interior scene",
    "bw-cowboy-boot-maker-workshop-leather-lasts.webp":
        "Black-and-white photo of a cowboy boot maker shaping leather over wooden lasts",
    "brass-zippo-lighter-shotgun-shell-detail.webp":
        "Brass Zippo lighter open with embedded 12-gauge shotgun shell base",
    "bw-wes-anderson-camera-paris-courtyard.jpg":
        "Black-and-white shot of Wes Anderson with camera in a Paris courtyard",
    "denim-suede-jacket-rodeo-belt-buckle.webp":
        "Torso shot, suede jacket over denim shirt with engraved rodeo belt buckle",
    "engraved-silver-belt-buckle-leather.webp":
        "Engraved silver and copper belt buckle on a brown leather belt",
    "felt-cowboy-hat-horsehair-brush-flat-lay.webp":
        "Camel felt cowboy hat with horsehair brush flat lay",
    "painted-cowgirl-orange-dress-green-sofa.webp":
        "Painted portrait of a cowgirl in orange dress and brown hat on a green sofa",
    "west-texas-concrete-patio-desert-loungers.webp":
        "Concrete patio overlooking the West Texas desert with loungers and a fire pit",
    "devol-shaker-kitchen-dark-blue-cabinetry.webp":
        "DeVol Shaker kitchen with dark blue painted cabinetry and stacked firewood",
    "painted-skeleton-cowboy-sombrero-revolver.webp":
        "Painted folk-art skeleton cowboy in sombrero with revolver and money sack",
    "bw-wes-anderson-tweed-suit-leather-armchair.avif":
        "Black-and-white portrait of Wes Anderson in tweed suit on a tufted leather armchair",
}

header = '''/**
 * Inspiration board — manual list of saved images for House*Staples.
 *
 * V1 is a flat array of image filenames. Add new ones by dropping the
 * file in /public/case-studies/inspiration/ and re-running
 * scripts/build-inspiration.py (a deterministic shuffle keeps related
 * images from clustering — seed 42).
 *
 * Computer vision rename pass is pending — alt text and meaningful
 * filenames will land later. Hash filenames are placeholders.
 *
 * When this list grows past ~150 items, migrate to Supabase + admin
 * upload.
 */

const IMG = "/case-studies/inspiration";

export type InspirationImage = {
  type: "image";
  src: string;
  alt: string;
};

export const inspiration: InspirationImage[] = [
'''

lines = [header]
for f in files:
    alt = alt_overrides.get(f, "Saved image")
    # Use template literal with ${IMG} interpolation.
    lines.append(f'  {{ type: "image", src: `${{IMG}}/{f}`, alt: "{alt}" }},\n')
lines.append("];\n")

out_path = "/Volumes/ReckonHouse/RHS/OS/src/data/inspiration.ts"
with open(out_path, "w") as f:
    f.writelines(lines)

print(f"Wrote {len(files)} entries to {out_path}", file=sys.stderr)
