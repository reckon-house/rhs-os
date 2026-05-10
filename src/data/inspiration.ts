/**
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
  { type: "image", src: `${IMG}/tarantino-king-of-golf-robe-bedroom.jpg`, alt: "Quentin Tarantino in a printed silk robe seated in a floral-wallpapered bedroom" },
  { type: "image", src: `${IMG}/infographic-large-scale-data-ridgeline.jpeg`, alt: "Large-scale data visualization, ridgeline chart with bubble cluster heads" },
  { type: "image", src: `${IMG}/leather-bench-corner-stitching-wood-detail.jpeg`, alt: "Tan leather bench corner with whip-stitched seam against a raw wood block" },
  { type: "image", src: `${IMG}/bw-bespectacled-man-coca-cola-bottle-table.jpg`, alt: "Black-and-white portrait, young man in glasses at a table with a Coca-Cola bottle" },
  { type: "image", src: `${IMG}/bw-portrait-aviators-leather-jacket-beach.jpg`, alt: "Black-and-white portrait, man in aviator sunglasses and leather jacket at the beach" },
  { type: "image", src: `${IMG}/bw-lightnin-hopkins-cigar-archtop-guitar.jpg`, alt: "Black-and-white portrait of bluesman in fedora smoking a cigar with an archtop guitar" },
  { type: "image", src: `${IMG}/Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California25-min.jpg`, alt: "Amber Interior Design, Montana residence" },
  { type: "image", src: `${IMG}/musician-acoustic-guitar-floral-wallpaper.jpg`, alt: "Musician with acoustic guitar against peeling vintage floral wallpaper" },
  { type: "image", src: `${IMG}/bw-dead-weather-mosshart-white-fur-coat.jpg`, alt: "Black-and-white portrait of Allison Mosshart and Jack White seated on concrete" },
  { type: "image", src: `${IMG}/jack-white-red-shirt-red-guitar-stage.jpeg`, alt: "Jack White on stage in red shirt with red electric guitar" },
  { type: "image", src: `${IMG}/leather-chesterfield-armchair-fireplace-stone.jpg`, alt: "Olive leather button-tufted chair beside a stone fireplace with mounted antelope head" },
  { type: "image", src: `${IMG}/bw-bluesman-fedora-cigar-vest-doorway.jpg`, alt: "Black-and-white portrait, suited bluesman in fedora and round glasses with cigar in a doorway" },
  { type: "image", src: `${IMG}/editorial-leather-bass-helmet-portrait.jpg`, alt: "Editorial portrait, figure in motorcycle helmet and leather jacket with a bass guitar" },
  { type: "image", src: `${IMG}/red-leather-bruno-mathsson-jetson-chair.jpeg`, alt: "Red leather Bruno Mathsson Jetson swivel chair on wood floor" },
  { type: "image", src: `${IMG}/dieter-rams-palette-braun-grille-knobs.jpg`, alt: "Dieter Rams design palette, Braun speaker grille pattern with color knobs" },
  { type: "image", src: `${IMG}/vintage-transparent-solar-system-chart.jpeg`, alt: "Antique educational print, transparent solar system chart with planet orbits" },
  { type: "image", src: `${IMG}/devol-shaker-kitchen-dark-blue-cabinetry.webp`, alt: "DeVol Shaker kitchen with dark blue painted cabinetry and stacked firewood" },
  { type: "image", src: `${IMG}/calacatta-viola-marble-fluted-columns.jpg`, alt: "Calacatta viola marble fluted columns in cream and burgundy veining" },
  { type: "image", src: `${IMG}/menswear-store-deer-mount-velvet-chair.jpg`, alt: "Eclectic menswear store interior with mounted deer head, mustard velvet chair, gallery wall" },
  { type: "image", src: `${IMG}/bw-miles-davis-tweed-suit-cigarette.jpg`, alt: "Black-and-white portrait of Miles Davis in tweed suit smoking a cigarette" },
  { type: "image", src: `${IMG}/fluted-tile-kitchen-stone-counter-cutting-boards.jpeg`, alt: "Modern kitchen with fluted white tile, stone counter, dark cutting boards, brass sconce" },
  { type: "image", src: `${IMG}/painted-skeleton-cowboy-sombrero-revolver.webp`, alt: "Painted folk-art skeleton cowboy in sombrero with revolver and money sack" },
  { type: "image", src: `${IMG}/dark-wood-paneled-room-trophy-mounts-cabinet.jpg`, alt: "Dark wood-paneled hunting den with antler mounts, oil paintings, and a carved cabinet" },
  { type: "image", src: `${IMG}/bw-musicians-black-rebel-motorcycle-club-marquee.jpg`, alt: "Black-and-white street shot of two musicians under a Black Rebel Motorcycle Club marquee" },
  { type: "image", src: `${IMG}/west-texas-concrete-patio-desert-loungers.webp`, alt: "Concrete patio overlooking the West Texas desert with loungers and a fire pit" },
  { type: "image", src: `${IMG}/monument-valley-mittens-dawn-light.jpg`, alt: "Monument Valley mittens at dawn under low cloud cover" },
  { type: "image", src: `${IMG}/wabi-sabi-living-room-mushroom-mirror-beams.jpeg`, alt: "Wabi-sabi living room with exposed beams, large mushroom mirror, plaster fireplace" },
  { type: "image", src: `${IMG}/bw-3614-jackson-highway-muscle-shoals.jpg`, alt: "Black-and-white photo, four musicians outside the 3614 Jackson Highway studio" },
  { type: "image", src: `${IMG}/bw-waylon-jennings-cowboy-hat-portfolio.jpg`, alt: "Black-and-white portrait of Waylon Jennings in cowboy hat carrying a portfolio" },
  { type: "image", src: `${IMG}/rrl-cattle-ranch-store-mannequins.jpg`, alt: "Double RL Cattle Ranch store display with denim mannequins and antler chandelier" },
  { type: "image", src: `${IMG}/rrl-vintage-vest-fedora-flat-lay.jpeg`, alt: "Flat lay of vintage tweed vest, dark fedora, knit tie, and RRL striped shirt" },
  { type: "image", src: `${IMG}/denim-glasses-portrait-bookshelf-armchair.jpg`, alt: "Bearded man in denim shirt and tortoiseshell glasses, seated in a carved armchair" },
  { type: "image", src: `${IMG}/country-singer-cowboy-hat-honky-tonk-neon.jpg`, alt: "Country singer in cowboy hat with acoustic guitar, Miller High Life neon sign behind" },
  { type: "image", src: `${IMG}/charley-crockett-cowboy-hat-leather-acoustic.jpg`, alt: "Country singer in cowboy hat and leather jacket holding an acoustic guitar" },
  { type: "image", src: `${IMG}/wes-anderson-royal-tenenbaums-couch-portrait.jpg`, alt: "Royal Tenenbaums film still, two figures seated on a couch in a red-walled room" },
  { type: "image", src: `${IMG}/dieter-rams-braun-radio-product-shot.jpg`, alt: "Dieter Rams Braun radio with circular speaker grille and aluminum knob" },
  { type: "image", src: `${IMG}/sepia-waylon-jennings-cowboy-hat-bottle.jpg`, alt: "Sepia portrait of Waylon Jennings in cowboy hat smoking a cigarette beside a bottle" },
  { type: "image", src: `${IMG}/bw-cowboy-boot-maker-workshop-leather-lasts.webp`, alt: "Black-and-white photo of a cowboy boot maker shaping leather over wooden lasts" },
  { type: "image", src: `${IMG}/bw-waylon-jennings-aviators-cigarette-portrait.jpg`, alt: "Black-and-white portrait of Waylon Jennings in aviator sunglasses with a cigarette" },
  { type: "image", src: `${IMG}/bw-jack-white-pinstripe-suit-fedora-guitar.jpg`, alt: "Black-and-white live shot, man in pinstripe suit and fedora playing electric guitar" },
  { type: "image", src: `${IMG}/bw-wes-anderson-tweed-suit-leather-armchair.avif`, alt: "Black-and-white portrait of Wes Anderson in tweed suit on a tufted leather armchair" },
  { type: "image", src: `${IMG}/bw-whitey-morgan-band-honky-tonk-stage.jpg`, alt: "Black-and-white live shot of country band on a small honky-tonk stage" },
  { type: "image", src: `${IMG}/bw-dead-weather-portrait-warehouse.jpg`, alt: "Black-and-white band portrait of two musicians in a derelict warehouse" },
  { type: "image", src: `${IMG}/rrl-denim-shirt-corduroy-collar-bandana.jpeg`, alt: "Close-up of an RRL denim shirt with corduroy collar and red paisley bandana" },
  { type: "image", src: `${IMG}/organ-mountains-moonrise-orange-glow.jpg`, alt: "Organ Mountains glowing orange at sunset with the moon rising behind the peaks" },
  { type: "image", src: `${IMG}/frank-lloyd-wright-built-in-bookshelves.jpg`, alt: "Frank Lloyd Wright Usonian living room with built-in bookshelves and stone fireplace" },
  { type: "image", src: `${IMG}/brass-zippo-lighter-shotgun-shell-detail.webp`, alt: "Brass Zippo lighter open with embedded 12-gauge shotgun shell base" },
  { type: "image", src: `${IMG}/bw-portrait-glasses-clasped-hands-dark-shirt.avif`, alt: "Black-and-white portrait of a man in glasses with hands clasped in front of him" },
  { type: "image", src: `${IMG}/rrl-trading-co-store-display-blankets.jpg`, alt: "Double RL store interior with antlers, vintage trunks, knit hats, and a gallery wall" },
  { type: "image", src: `${IMG}/dead-weather-band-portrait-ornate-room.jpg`, alt: "Black-and-white band portrait, four musicians in an ornate floral-walled room" },
  { type: "image", src: `${IMG}/Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California26-min.jpg`, alt: "Amber Interior Design, Montana residence" },
  { type: "image", src: `${IMG}/bw-dead-weather-portrait-barn-siding.jpg`, alt: "Black-and-white band portrait against weathered barn siding" },
  { type: "image", src: `${IMG}/bw-wes-anderson-camera-paris-courtyard.jpg`, alt: "Black-and-white shot of Wes Anderson with camera in a Paris courtyard" },
  { type: "image", src: `${IMG}/miles-davis-suede-jacket-fur-bedspread.jpg`, alt: "Miles Davis seated on fur bedspread in suede jacket and printed silk scarf" },
  { type: "image", src: `${IMG}/bw-gruene-hall-water-tower-honky-tonk.jpg`, alt: "Black-and-white shot of Gruene Hall dance hall with water tower behind" },
  { type: "image", src: `${IMG}/infographic-italian-tv-ridgeline-chart.jpeg`, alt: "Italian-language infographic, circular ridgeline chart with bubble groupings" },
  { type: "image", src: `${IMG}/bw-jack-white-pinstripe-suit-mixing-desk.jpg`, alt: "Black-and-white portrait, man in pinstripe suit and round glasses at a studio mixing desk" },
  { type: "image", src: `${IMG}/Walden-Retreats-11-1440x960.jpg`, alt: "Walden Retreats living room with stone fireplace, stacked firewood, and chess board" },
  { type: "image", src: `${IMG}/alexander-mcqueen-skull-print-scarf.jpg`, alt: "Alexander McQueen black-and-white skull print scarf detail" },
  { type: "image", src: `${IMG}/bw-feather-headdress-indian-motorcycle.jpg`, alt: "Black-and-white photograph, figure in feather headdress arms outstretched behind an Indian motorcycle" },
  { type: "image", src: `${IMG}/denim-suede-jacket-rodeo-belt-buckle.webp`, alt: "Torso shot, suede jacket over denim shirt with engraved rodeo belt buckle" },
  { type: "image", src: `${IMG}/johnny-cash-fishing-jacket-rifle-fall.jpg`, alt: "Johnny Cash holding a transistor radio outdoors in fall, hunter beside him with a rifle" },
  { type: "image", src: `${IMG}/vintage-portrait-fedora-sunglasses-profile.jpg`, alt: "Black-and-white profile portrait, man in fedora and dark sunglasses" },
  { type: "image", src: `${IMG}/bw-dead-weather-railroad-tracks.jpg`, alt: "Black-and-white shot of band members walking along railroad tracks" },
  { type: "image", src: `${IMG}/reckonhouse-asterisk-spray-mark-on-cream.jpeg`, alt: "Black spray-paint asterisk mark centered on a cream background" },
  { type: "image", src: `${IMG}/charley-crockett-cowboy-hat-tweed-guitar-shop.jpg`, alt: "Country singer in cowboy hat and tweed suit standing inside a hanging-guitar shop" },
  { type: "image", src: `${IMG}/swiss-typographic-grid-flag-signal-poster.jpeg`, alt: "Swiss typographic poster with maritime signal flags arranged on a grid" },
  { type: "image", src: `${IMG}/bw-dead-weather-rooftop-empire-state.jpg`, alt: "Black-and-white band portrait on a rooftop with the Empire State Building behind" },
  { type: "image", src: `${IMG}/Amber-Interior-Design_Ambers-Montana-Extravaganza_Los-Angeles-California19-min.jpg`, alt: "Amber Interior Design, Montana residence" },
  { type: "image", src: `${IMG}/wes-anderson-asteroid-city-diner.jpg`, alt: "Asteroid City film still, three figures at a 1950s diner counter" },
  { type: "image", src: `${IMG}/hill-country-stone-foyer-portrait-painting.jpeg`, alt: "Texas Hill Country stone foyer with antique portrait, dark wood console, and a monstera leaf" },
  { type: "image", src: `${IMG}/vintage-turntable-stylus-balance-tool.jpg`, alt: "Vintage black-and-white photo, hand using a stylus pressure gauge on a turntable" },
  { type: "image", src: `${IMG}/engraved-silver-belt-buckle-leather.webp`, alt: "Engraved silver and copper belt buckle on a brown leather belt" },
  { type: "image", src: `${IMG}/utah-desert-canyons-sagebrush-warm-light.jpg`, alt: "Utah desert canyons in warm afternoon light with sagebrush in the foreground" },
  { type: "image", src: `${IMG}/bw-jack-white-third-man-records-piano.jpeg`, alt: "Black-and-white portrait, Jack White in studio with upright piano and Jaguar guitar" },
  { type: "image", src: `${IMG}/painted-cowgirl-orange-dress-green-sofa.webp`, alt: "Painted portrait of a cowgirl in orange dress and brown hat on a green sofa" },
  { type: "image", src: `${IMG}/sepia-three-cowboys-walking-dirt-road.jpg`, alt: "Sepia photograph, three cowboys walking down a dirt road" },
  { type: "image", src: `${IMG}/rrl-denim-leather-detail-rope-stitching.jpg`, alt: "Close-up of vintage RRL denim with leather inset and rope-tied detail" },
  { type: "image", src: `${IMG}/lee-denim-shirts-stack-button-detail.jpg`, alt: "Stack of vintage Lee denim and corduroy shirts showing button and label detail" },
  { type: "image", src: `${IMG}/bw-miles-davis-pinstripe-suit-st-george-street.jpg`, alt: "Black-and-white street portrait of Miles Davis in pinstripe suit on St. George Street" },
  { type: "image", src: `${IMG}/bw-lightnin-hopkins-suit-motorcycle.jpg`, alt: "Black-and-white portrait, suited bluesman with a motorcycle and parked cars behind" },
  { type: "image", src: `${IMG}/vintage-clothing-store-zebra-ottoman-rack.jpg`, alt: "Vintage clothing store interior with zebra-print ottoman and dark cabinetry" },
  { type: "image", src: `${IMG}/wes-anderson-budapest-doorway-frame.jpeg`, alt: "Wes Anderson film still, narrow doorway framing a small interior scene" },
  { type: "image", src: `${IMG}/Mother-Anthropic-Claude-1-1024x782.jpg`, alt: "Mother x Anthropic film still, three figures watching a model rocket launch in the desert" },
  { type: "image", src: `${IMG}/felt-cowboy-hat-horsehair-brush-flat-lay.webp`, alt: "Camel felt cowboy hat with horsehair brush flat lay" },
  { type: "image", src: `${IMG}/richie-tenenbaum-camera-headband-yacht.jpg`, alt: "Royal Tenenbaums film still, Richie with camera, headband, and beard" },
  { type: "image", src: `${IMG}/bw-cinematic-portrait-fedora-cigarette.jpg`, alt: "Black-and-white cinematic close-up, man in wide-brim hat smoking a cigarette" },
  { type: "image", src: `${IMG}/no-country-josh-brolin-kelly-macdonald-trailer.jpg`, alt: "No Country for Old Men film still, couple seated on a trailer couch with Lone Star beer" },
  { type: "image", src: `${IMG}/tricolor-cowhide-texture-brown-white.png`, alt: "Tricolor cowhide texture in brown, white, and black patches" },
  { type: "image", src: `${IMG}/bw-cowboy-rearing-horse-field.jpg`, alt: "Black-and-white photograph, cowboy rearing on a horse in a grassy field" },
  { type: "image", src: `${IMG}/bw-dead-weather-portrait-wallpaper.jpg`, alt: "Black-and-white band portrait, four musicians against patterned wallpaper" },
  { type: "image", src: `${IMG}/bw-miles-davis-cat-eye-sunglasses-cigarette.jpg`, alt: "Black-and-white portrait of Miles Davis in cat-eye sunglasses with a cigarette" },
  { type: "image", src: `${IMG}/bw-musician-studio-mic-acoustic-guitar.jpg`, alt: "Black-and-white musician at studio microphone with acoustic guitar" },
  { type: "image", src: `${IMG}/bw-southern-rock-singer-stage-spotlight.jpg`, alt: "Black-and-white live shot, long-haired singer with electric guitar in stage spotlights" },
  { type: "image", src: `${IMG}/Bert and May Kitchen5566.jpg.webp`, alt: "Bert and May kitchen with patterned tile backsplash and oak cabinetry" },
  { type: "image", src: `${IMG}/bw-dead-weather-keyboards-live-leather.jpg`, alt: "Black-and-white live shot, two band members at keyboards in leather jackets" },
  { type: "image", src: `${IMG}/ryman-auditorium-pews-stained-glass.jpg`, alt: "Empty Ryman Auditorium pews with stained-glass arched windows in primary colors" },
];
