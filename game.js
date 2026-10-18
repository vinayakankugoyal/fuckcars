// Bike Lane Dash: a Subway Surfers-style endless runner down a New York City
// bike lane. Everything is drawn on a canvas with a simple perspective
// projection. World units are roughly meters; +x is to the right and +z points
// down the street, away from the rider.

const BEST_KEY = 'bike-lane-dash-best'

// What each obstacle teaches when it takes you out, with a real number or two
// about that kind of crash. Every number links to where it came from.
const LESSONS = {
  door: {
    title: 'Doored!',
    text: "A car door swung open right in front of you. Painted bike lanes often run through the door zone of parked cars, so watch for people sitting in them and leave a door's width when you can. Opening a door into traffic is illegal in New York unless it's safe; drivers and passengers should use the Dutch reach, opening with the far hand so they turn and look.",
    facts: [
      {
        value: '6+',
        label: 'NYC cyclists killed by opening car doors from 2012 to 2019. Police wrote a ticket in just one case.',
        source: 'https://gothamist.com/news/what-is-nyc-doing-to-prevent-cyclists-from-getting-fatally-doored-basically-nothing',
      },
      {
        value: '1 in 5',
        label: 'bike crashes in Chicago in 2011 was a dooring. Illinois was the only state counting them.',
        source: 'https://wnyc.org/story/285015-data-from-only-state-that-tracks-dooring-show-its-big-problem/',
      },
    ],
  },
  police: {
    title: 'Blocked by a parked police car',
    text: "Police cars park in bike lanes all the time, pushing riders out into traffic. You're allowed to leave a blocked bike lane: look over your shoulder, signal, and merge early instead of swerving at the last second.",
    facts: [
      {
        value: '1.9%',
        label: 'of 76,000+ complaints to 311 about illegal parking in bike lanes ended in a ticket (2016 to 2023). The fine is $115.',
        source: 'https://usa.streetsblog.org/2023/04/06/cops-in-nyc-ticket-only-2-of-blocked-bike-lanes-analysis',
      },
    ],
  },
  truck: {
    title: 'Double-parked truck',
    text: "Delivery trucks double-park in the bike lane all day. They hide what's ahead, and big trucks have huge blind spots: if you can't see the driver in their mirror, they can't see you.",
    facts: [
      {
        value: '~50%',
        label: 'of the cyclists killed in NYC in 2019 died in crashes involving large trucks.',
        source: 'https://www.nyc.gov/assets/dcas/downloads/pdf/fleet/Sideguard-Letter-Final.pdf',
      },
      {
        value: '40%',
        label: 'of the time, the bike lane on one Harlem block was blocked, in a 2018 study of traffic camera footage.',
        source: 'https://www.engadget.com/2018-03-16-new-yorker-machine-learning-blocked-bike-lanes.html',
      },
    ],
  },
  taxi: {
    title: 'Cut off by a cab',
    text: 'Cabs and rideshares dive into the bike lane to pick up and drop off, often without signaling. Watch for blinkers, brake lights, and anyone waving from the curb, and keep your hands on the brakes.',
    facts: [
      {
        value: '239M',
        label: 'Uber and Lyft trips in NYC in 2024, every one of them starting and ending at a curb.',
        source: 'https://www.nyc.gov/assets/tlc/downloads/pdf/preliminary_budget_hearing_testimony_3_19_25.pdf',
      },
      {
        value: '3rd',
        label: 'place for taxis among bike lane blockers on 492 Manhattan blocks surveyed by Hunter College, behind cars and small trucks.',
        source: 'https://www.dnainfo.com/20091203/manhattan/study-finds-city-bike-lanes-blocked-by-cars-trucks-taxis/',
      },
    ],
  },
  ped: {
    title: 'Pedestrian on a phone',
    text: 'People step out from between parked cars with their eyes on their phones. Slow down near crosswalks and bus stops, ring your bell early, and always yield to people on foot.',
    facts: [
      {
        value: '105',
        label: 'of the 112 pedestrians killed in NYC in 2025 died in crashes involving motor vehicles.',
        source: 'https://cleantechnica.com/2026/10/07/nyc-ebike-deaths-motor-vehicles/',
      },
    ],
  },
  ebike: {
    title: 'Wrong-way delivery bike',
    text: "Riders coming the wrong way down the bike lane close the gap fast, especially on e-bikes. Ride with traffic, give oncoming riders room, and use your bell or voice early. Whoever's on that delivery bike is doing one of the most dangerous jobs in the city.",
    facts: [
      {
        value: '25+',
        label: 'delivery workers on bikes, e-bikes, and mopeds killed in NYC traffic since 2021.',
        source: 'https://www.nyc.gov/html/dot/downloads/pdf/delivery-safety-letter-to-apps.pdf',
      },
      {
        value: '~1 in 3',
        label: 'e-bike and moped delivery riders have been hurt on the job badly enough to miss work or need medical care.',
        source: 'https://jalopnik.com/delivery-rider-is-the-most-deadly-job-in-new-york-1851517980',
      },
    ],
  },
  pothole: {
    title: 'Pothole!',
    text: 'Potholes, steel plates, and sunken grates can send you over the handlebars. Scan the pavement ahead, not just the traffic, and report potholes to 311.',
    facts: [
      {
        value: '180,570',
        label: 'potholes NYC DOT filled in fiscal year 2025, about 500 a day.',
        source: 'https://hellgatenyc.com/mamdani-filling-holes-fast/',
      },
    ],
  },
  car: {
    title: 'Stuck in traffic',
    text: "The traffic lanes aren't an escape hatch: cars and buses stop without warning. When you have to leave the bike lane, look over your shoulder, signal, merge with plenty of room, and get back in as soon as it's clear.",
    facts: [
      {
        value: '27M',
        label: 'fewer vehicles drove into Manhattan below 60th Street in 2025, the first year of congestion pricing.',
        source: 'https://www.amny.com/news/congestion-pricing-27-million-fewer-vehicles',
      },
      {
        value: '30',
        label: 'people were killed riding bikes in NYC in 2023. Crashes with cars and trucks were the leading cause.',
        source: 'https://www.fox5ny.com/news/nyc-cyclist-deaths-hit-record-high-in-2023',
      },
    ],
  },
}

// how the crash screen names what you got past: [one, many]
const DODGE_LABELS = {
  door: ['car door', 'car doors'],
  police: ['cop car', 'cop cars'],
  truck: ['truck', 'trucks'],
  taxi: ['cab', 'cabs'],
  ped: ['pedestrian', 'pedestrians'],
  ebike: ['delivery bike', 'delivery bikes'],
  pothole: ['pothole', 'potholes'],
  car: ['stopped car', 'stopped cars'],
}

const $ = (id) => document.getElementById(id)
const wrap = $('game')
const canvas = $('canvas')
const ctx = canvas.getContext('2d')
const ui = {
  hud: $('hud'),
  hudBlocks: $('hud-blocks'),
  hudBagels: $('hud-bagels'),
  ready: $('ready'),
  readyBest: $('ready-best'),
  fullscreen: $('fullscreen'),
  bell: $('bell'),
  bellCount: $('bell-count'),
  toast: $('toast'),
  crashed: $('crashed'),
  crashCard: $('crash-card'),
  again: $('again'),
  lessonTitle: $('lesson-title'),
  lessonText: $('lesson-text'),
  facts: $('facts'),
  runBlocks: $('run-blocks'),
  runBagels: $('run-bagels'),
  runBest: $('run-best'),
  dodged: $('dodged'),
}

const LW = 1.3 // lane width
const LANES = [-LW, 0, LW] // 0 is the bike lane; 1 and 2 are traffic lanes
const PARK_L = -2 * LW // parked car centerlines on each side of the street
const PARK_R = 2 * LW
const CURB_L = PARK_L - 0.75
const CURB_R = PARK_R + 0.75
const SIDEWALK = 2.4
const D0 = 4 // camera distance behind the rider
const Z_NEAR = -D0 + 0.7
const Z_FAR = 85
const SPAWN_Z = 78

const START_SPEED = 12
const MAX_SPEED = 30
const ACCEL = 0.22 // units/s per second
const ATTRACT_SPEED = 6 // how fast the street rolls behind the start screen
const BLOCK_LEN = 80 // a Manhattan street block is ~80m
const DOOR_LEN = 0.95
const EBIKE_SPEED = 4 // how much faster than the street a wrong-way rider comes at you
const BELL_RINGS = 3 // rings you get from each bell you pick up
const MAX_RINGS = 9
const BELL_CHANCE = 0.08 // chance a row has a bell floating just past it
const RING_FX = 0.6 // seconds the ring ripples around the handlebar

const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches

let W = 0
let H = 0
let focal = 1
let horizonY = 0
let camH = 2.4
let camX = 0

let last = 0
let time = 0
let roll = 0 // total distance the street has scrolled, for the paint
let onScreen = true

// 'ready' | 'playing' | 'crashing' | 'over'
let mode = 'ready'
let crashTimer = 0
let crashKind = null
let speed = START_SPEED
let dist = 0
let bagels = 0
let rowAccum = 0
let nextGap = 0
let lastBlocked = [] // lanes the previous row closed
let nextRow = null // what spawns once the street has rolled nextGap further
let dodgeCounts = {}
let rows = 0 // rows spawned this ride
let rings = 0 // bell rings left
let ringCooldown = 0
let ringFx = 0
let toastTimer = 0
let bellExplained = false

const player = { lane: 0, x: LANES[0], y: 0, vy: 0, lean: 0, pedal: 0 }

let parked = [] // left side; some of these have a door about to open
let parkedR = []
let buildings = []
let lamps = []
let obstacles = []
let treats = []
let skyline = []

// scenery generators: z where the next item starts
let parkFront = 0
let parkRFront = 0
let lampFront = 0
const buildFront = { '-1': 0, '1': 0 }

let bestDist = 0
try {
  bestDist = Number(localStorage.getItem(BEST_KEY)) || 0
} catch {}

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const chance = (p) => Math.random() < p
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

const shadeCache = new Map()
// scale a #rrggbb color's brightness by k
function shade(hex, k) {
  const key = hex + k
  let out = shadeCache.get(key)
  if (!out) {
    const n = parseInt(hex.slice(1), 16)
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => clamp(Math.round(v * k), 0, 255))
    out = `rgb(${c[0]},${c[1]},${c[2]})`
    shadeCache.set(key, out)
  }
  return out
}

function resize() {
  const rect = canvas.getBoundingClientRect()
  W = rect.width
  H = rect.height
  // on big screens keep the canvas under ~4.5M pixels so it stays smooth
  const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4.5e6 / Math.max(1, W * H)))
  canvas.width = Math.round(W * dpr)
  canvas.height = Math.round(H * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // one lane spans ~1/4.2 of the view at the rider; ground at the rider sits at 86% height
  focal = (Math.min(W, H * 1.2) * D0) / (LW * 4.2)
  horizonY = H * 0.34
  camH = ((H * 0.86 - horizonY) * D0) / focal
}

// perspective projection; s is pixels per world unit at that depth
function proj(x, y, z) {
  const s = focal / (z + D0)
  return { x: W / 2 + (x - camX) * s, y: horizonY + (camH - y) * s, s }
}

function quad(pts, fill) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

// axis-aligned box; returns the projected near face for decorating
function drawBox(x, y0, z, w, h, d, front, side, top) {
  const zf = z + d
  if (zf <= Z_NEAR) return null
  const zn = Math.max(z, Z_NEAR)
  const l = x - w / 2
  const r = x + w / 2
  const t = y0 + h
  const nlb = proj(l, y0, zn)
  const nrb = proj(r, y0, zn)
  const nlt = proj(l, t, zn)
  const nrt = proj(r, t, zn)
  const flb = proj(l, y0, zf)
  const frb = proj(r, y0, zf)
  const flt = proj(l, t, zf)
  const frt = proj(r, t, zf)
  if (top && t < camH) quad([nlt, nrt, frt, flt], top)
  if (camX > r) quad([nrb, nrt, frt, frb], side)
  else if (camX < l) quad([nlb, nlt, flt, flb], side)
  quad([nlb, nrb, nrt, nlt], front)
  return { x0: nlb.x, x1: nrb.x, y0: nlt.y, y1: nlb.y, s: nlb.s, cut: zn !== z }
}

// a ground-level rectangle from x0..x1, z0..z1
function groundRect(x0, x1, z0, z1, fill) {
  z0 = Math.max(z0, Z_NEAR)
  if (z1 <= z0) return
  quad([proj(x0, 0, z0), proj(x1, 0, z0), proj(x1, 0, z1), proj(x0, 0, z1)], fill)
}

function fogAlpha(z) {
  return clamp((Z_FAR - z) / 18, 0, 1)
}

// ---------- scenery ----------

const CAR_COLORS = ['#b8bec6', '#2e3640', '#8c1c1c', '#1f3f73', '#e9e9e9', '#4a5a3a', '#6b6f76', '#121418']
const BRICK = ['#8b4a3a', '#a0583f', '#6d5a4f', '#7a3f32', '#5f6a73', '#8a7a64', '#4e4a52']
const AWNINGS = ['#1f6f4a', '#9b2226', '#264653', '#bc6c25', '#3a0ca3']

const carGap = () => 2.2 + rand(0.4, 1.3) + (chance(0.12) ? 3 : 0)

function addBuilding(side, z) {
  const d = rand(4, 9)
  const h = rand(5.5, 14)
  const cols = Math.max(1, Math.floor((d - 0.6) / 1.3))
  const rows = Math.max(1, Math.floor((h - 2.2) / 1.5))
  const lit = []
  for (let i = 0; i < rows * cols; i++) lit.push(chance(0.45))
  const w = 6
  const face = side < 0 ? CURB_L - SIDEWALK : CURB_R + SIDEWALK
  buildings.push({
    side,
    z,
    d,
    h,
    w,
    x: face + (side * w) / 2,
    face,
    rows,
    cols,
    lit,
    color: pick(BRICK),
    awning: pick(AWNINGS),
  })
  return d
}

function fillScenery() {
  while (parkFront < Z_FAR + 5) {
    parked.push({ z: parkFront, color: pick(CAR_COLORS), door: false, open: 0 })
    parkFront += carGap()
  }
  while (parkRFront < Z_FAR + 5) {
    parkedR.push({ z: parkRFront, color: pick(CAR_COLORS) })
    parkRFront += carGap()
  }
  while (lampFront < Z_FAR + 5) {
    lamps.push({ z: lampFront, side: -1 }, { z: lampFront + 7, side: 1 })
    lampFront += 14
  }
  for (const side of [-1, 1]) {
    while (buildFront[side] < Z_FAR + 10) {
      buildFront[side] += addBuilding(side, buildFront[side]) + (chance(0.15) ? 3 : 0.05)
    }
  }
}

function makeSkyline() {
  skyline = []
  let x = -0.1
  while (x < 1.1) {
    const w = rand(0.02, 0.06)
    skyline.push({ x, w, h: rand(0.03, 0.14) })
    x += w * rand(0.7, 1.1)
  }
  // a couple of landmark-ish spires
  skyline.push({ x: 0.46, w: 0.03, h: 0.26, spire: true })
  skyline.push({ x: 0.71, w: 0.025, h: 0.2, spire: true })
}

// ---------- obstacles ----------

function addObstacle(kind, lane, z, extra = {}) {
  const o = { kind, lane, x: LANES[lane], z, ...extra }
  switch (kind) {
    case 'police':
    case 'car':
    case 'taxi':
      o.w = 1.05
      o.d = 2.2
      break
    case 'truck':
      o.w = 1.15
      o.d = 4
      break
    case 'ebike':
      o.w = 0.5
      o.d = 1.4
      break
    case 'ped':
      o.w = 0.5
      o.d = 0.4
      break
    case 'pothole':
      o.w = 0.9
      o.d = 0.8
      o.jumpable = true
      break
  }
  if (kind === 'car') o.color = pick(CAR_COLORS)
  if (kind === 'ped') {
    o.shirt = pick(['#e76f51', '#2a9d8f', '#e9c46a', '#264653', '#f4a261', '#8d99ae'])
    o.walk = 0
  }
  obstacles.push(o)
  return o
}

function clearParked(z0, z1) {
  parked = parked.filter((c) => c.z + 2.2 < z0 || c.z > z1)
}

function addTreats(lane, z) {
  for (let i = 0; i < 4; i++) treats.push({ kind: 'bagel', x: LANES[lane], z: z + i * 1.8, got: false })
}

function addBell(lane, z) {
  treats.push({ kind: 'bell', x: LANES[lane], z, got: false })
}

function freeLane(blocked) {
  return pick([0, 1, 2].filter((l) => !blocked.includes(l)))
}

// Rows of trouble. Each always leaves at least one lane clear without jumping;
// build() adds it at z and returns the lanes it closes.

// a parked car with someone inside, about to swing a door into the bike lane
function doorRow(z) {
  clearParked(z - 0.8, z + 2.6)
  parked.push({ z, color: pick(CAR_COLORS), door: true, open: 0 })
  const blocked = [0]
  if (chance(0.45)) {
    const lane = pick([1, 2])
    addObstacle('car', lane, z - 0.5)
    blocked.push(lane)
  }
  addTreats(freeLane(blocked), z - 4)
  return blocked
}

// a cop car or delivery truck parked in the bike lane, or double-parked beside it
function parkedRow(kind, z) {
  const lane = chance(0.75) ? 0 : 1
  addObstacle(kind, lane, z)
  const blocked = [lane]
  if (lane === 0 && chance(0.4)) {
    const l = pick([1, 2])
    addObstacle('car', l, z + 0.5)
    blocked.push(l)
  } else if (lane === 1 && chance(0.4)) {
    addObstacle('pothole', pick([0, 2]), z + 1)
  }
  addTreats(freeLane(blocked), z - 3)
  return blocked
}

// a cab cuts across from traffic into the bike lane for a pickup
function taxiRow(z) {
  addObstacle('taxi', 1, z, { merge: 0 })
  addTreats(2, z - 2)
  return [0, 1]
}

// someone steps out from between parked cars into the bike lane, or keeps going
function pedRow(z) {
  const target = chance(0.7) ? 0 : 1
  clearParked(z - 1.4, z + 1.4)
  const o = addObstacle('ped', target, z, { targetX: LANES[target] })
  o.x = PARK_L
  addTreats(2, z - 3)
  return target === 0 ? [0] : [0, 1]
}

// A delivery rider coming the wrong way down the bike lane, faster than the
// street scrolls. It turns up just past the row in front of it, so it can't
// come when the bike lane is that row's only way through.
function ebikeRow(z) {
  addObstacle('ebike', 0, z)
  return [0]
}

function ebikeAllowed() {
  return lastBlocked.includes(0) || lastBlocked.length < 2
}

// the gap that still leaves the rider 5m past the row in front when you get there
function ebikeGap() {
  return ((EBIKE_SPEED * SPAWN_Z) / speed + 5) / (1 + EBIKE_SPEED / speed)
}

function potholeRow(z) {
  const lanes = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, 2)
  for (const l of lanes) addObstacle('pothole', l, z + rand(-0.5, 0.5))
  addTreats(freeLane(lanes), z - 2)
  return []
}

// gridlock: both traffic lanes stopped and the bike lane wide open
function gridlockRow(z) {
  addObstacle('car', 1, z)
  addObstacle('car', 2, z + rand(-0.6, 0.6))
  addTreats(0, z - 2)
  return [1, 2]
}

const ROWS = [
  { weight: 16, build: doorRow },
  { weight: 14, build: (z) => parkedRow('police', z) },
  { weight: 14, build: (z) => parkedRow('truck', z) },
  { weight: 10, build: taxiRow },
  { weight: 12, build: pedRow },
  { weight: 10, build: ebikeRow, allowed: ebikeAllowed, minGap: ebikeGap },
  { weight: 10, build: potholeRow },
  { weight: 14, build: gridlockRow },
]

function chooseRow() {
  const options = ROWS.filter((r) => !r.allowed || r.allowed())
  let x = Math.random() * options.reduce((sum, r) => sum + r.weight, 0)
  for (const r of options) {
    x -= r.weight
    if (x < 0) return r
  }
  return options[options.length - 1]
}

function scheduleRow(gap) {
  nextRow = chooseRow()
  nextGap = Math.max(gap, nextRow.minGap ? nextRow.minGap() : 0)
}

// ---------- game flow ----------

function reset() {
  parked = []
  parkedR = []
  buildings = []
  lamps = []
  obstacles = []
  treats = []
  parkFront = Z_NEAR - 3
  parkRFront = Z_NEAR - 1.5
  lampFront = Z_NEAR + 2
  buildFront[-1] = Z_NEAR - 5
  buildFront[1] = Z_NEAR - 8
  fillScenery()
  player.lane = 0
  player.x = LANES[0]
  player.y = 0
  player.vy = 0
  player.lean = 0
  camX = player.x * 0.6
  speed = START_SPEED
  dist = 0
  bagels = 0
  rowAccum = 0
  lastBlocked = []
  scheduleRow(speed * 2.5) // a couple of calm seconds to start
  dodgeCounts = {}
  rows = 0
  rings = 0
  ringCooldown = 0
  ringFx = 0
  toastTimer = 0
  ui.toast.hidden = true
}

// Browsers only allow full screen from a click or key press, so the first
// start asks for it; the corner button toggles it after that.
const canFullscreen = Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled)
const isFullscreen = () => Boolean(document.fullscreenElement || document.webkitFullscreenElement)
let askedFullscreen = false

function setFullscreen(on) {
  try {
    const el = document.documentElement
    const call = on ? el.requestFullscreen || el.webkitRequestFullscreen : document.exitFullscreen || document.webkitExitFullscreen
    call?.call(on ? el : document)?.catch?.(() => {})
  } catch {}
}

function syncFullscreenButton() {
  const on = isFullscreen()
  ui.fullscreen.classList.toggle('is-full', on)
  ui.fullscreen.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen')
}

function startGame() {
  if (canFullscreen && !askedFullscreen && !isFullscreen()) {
    askedFullscreen = true
    setFullscreen(true)
  }
  reset()
  mode = 'playing'
  ui.ready.hidden = true
  ui.crashed.hidden = true
  ui.hud.hidden = false
  updateHud()
  updateBellUi()
  wrap.focus({ preventScroll: true })
}

function crash(kind) {
  mode = 'crashing'
  crashTimer = 0.8
  crashKind = kind
  updateBellUi()
  ui.toast.hidden = true
  if (dist > bestDist) {
    bestDist = dist
    try {
      localStorage.setItem(BEST_KEY, String(Math.floor(bestDist)))
    } catch {}
  }
}

function setText(el, text) {
  if (el.textContent !== text) el.textContent = text
}

function updateHud() {
  setText(ui.hudBlocks, `${(dist / BLOCK_LEN).toFixed(1)} blocks`)
  setText(ui.hudBagels, `🥯 ${bagels}`)
}

function showCrashCard() {
  const lesson = LESSONS[crashKind]
  ui.lessonTitle.textContent = lesson.title
  ui.lessonText.textContent = lesson.text
  ui.facts.replaceChildren(...lesson.facts.map(factItem))
  ui.runBlocks.textContent = (dist / BLOCK_LEN).toFixed(1)
  ui.runBagels.textContent = String(bagels)
  ui.runBest.textContent = (bestDist / BLOCK_LEN).toFixed(1)

  // "You got past 3 cop cars, 2 trucks and 1 pothole before this one."
  const passed = Object.entries(dodgeCounts).sort((a, b) => b[1] - a[1])
  const parts = ['You got past ']
  passed.forEach(([kind, n], i) => {
    const strong = document.createElement('strong')
    strong.textContent = `${n} ${DODGE_LABELS[kind][n === 1 ? 0 : 1]}`
    parts.push(strong)
    if (i < passed.length - 2) parts.push(', ')
    else if (i === passed.length - 2) parts.push(' and ')
  })
  parts.push(' before this one.')
  ui.dodged.replaceChildren(...parts)
  ui.dodged.hidden = !passed.length

  ui.hud.hidden = true
  ui.crashed.hidden = false
  ui.crashCard.scrollTop = 0
  ui.again.focus({ preventScroll: true })
}

function moveLane(dir) {
  if (mode !== 'playing') return
  player.lane = clamp(player.lane + dir, 0, 2)
}

function jump() {
  if (mode !== 'playing' || player.y > 0.01) return
  player.vy = 7.2
}

// Ring the bell: pedestrians ahead look up from their phones and step back to
// the curb. Ring early; someone already right in front of you can't get clear.
function ringBell() {
  if (mode !== 'playing' || rings <= 0 || ringCooldown > 0) return
  rings--
  ringCooldown = 0.3
  ringFx = RING_FX
  playBell()
  const reach = Math.max(30, speed * 2.5)
  for (const o of obstacles) {
    if (o.kind === 'ped' && !o.startled && o.z > -0.5 && o.z < reach) {
      o.startled = true
      o.startledAt = time
    }
  }
  updateBellUi()
}

function pickUpBell() {
  rings = Math.min(MAX_RINGS, rings + BELL_RINGS)
  updateBellUi()
  ui.bell.classList.remove('pop')
  void ui.bell.offsetWidth // restarts the animation
  ui.bell.classList.add('pop')
  if (!bellExplained) {
    bellExplained = true
    showToast(coarsePointer ? 'Got a bell! Swipe down or tap it to warn pedestrians' : 'Got a bell! Press B to warn pedestrians')
  }
}

function updateBellUi() {
  ui.bell.hidden = !(mode === 'playing' && rings > 0)
  setText(ui.bellCount, `×${rings}`)
}

function showToast(text) {
  ui.toast.textContent = text
  ui.toast.hidden = false
  toastTimer = 3
}

let audio = null
// a bike bell's ding-ding: two strikes, each a few inharmonic partials ringing down
function playBell() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)()
    if (audio.state === 'suspended') audio.resume()
    const out = audio.createGain()
    out.gain.value = 0.16
    out.connect(audio.destination)
    for (const t of [audio.currentTime, audio.currentTime + 0.14]) {
      for (const [ratio, level] of [
        [1, 0.6],
        [2.32, 0.22],
        [4.25, 0.1],
      ]) {
        const osc = audio.createOscillator()
        const env = audio.createGain()
        osc.frequency.value = 1900 * ratio
        env.gain.setValueAtTime(0.0001, t)
        env.gain.exponentialRampToValueAtTime(level, t + 0.005)
        env.gain.exponentialRampToValueAtTime(0.0001, t + 0.8 / ratio)
        osc.connect(env).connect(out)
        osc.start(t)
        osc.stop(t + 0.85)
      }
    }
  } catch {}
}

function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return
  const k = e.key
  if (mode === 'playing') {
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') moveLane(-1)
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') moveLane(1)
    else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === ' ') jump()
    else if (k === 'b' || k === 'B' || k === 'ArrowDown' || k === 's' || k === 'S') {
      if (!e.repeat) ringBell()
    } else return
    e.preventDefault()
  } else if ((mode === 'ready' || mode === 'over') && (k === ' ' || k === 'Enter')) {
    // links and buttons handle their own keys
    if (e.target.closest?.('a, button')) return
    e.preventDefault()
    startGame()
  }
}

// swipes, or taps on the left/middle/right of the screen
let down = null
function onPointerDown(e) {
  if (mode !== 'playing') return
  down = { x: e.clientX, y: e.clientY }
}
function onPointerUp(e) {
  if (mode !== 'playing' || !down) return
  const dx = e.clientX - down.x
  const dy = e.clientY - down.y
  down = null
  if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) moveLane(dx > 0 ? 1 : -1)
  else if (dy < -30) jump()
  else if (dy > 30) ringBell()
  else if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
    const rect = canvas.getBoundingClientRect()
    const fx = (e.clientX - rect.left) / rect.width
    if (fx < 0.33) moveLane(-1)
    else if (fx > 0.67) moveLane(1)
    else jump()
  }
}

// ---------- update ----------

function overlaps(a0, a1, b0, b1) {
  return a0 < b1 && b0 < a1
}

function countDodged() {
  for (const o of obstacles) {
    if (!o.passed && o.z + o.d < -0.5) {
      o.passed = true
      dodgeCounts[o.kind] = (dodgeCounts[o.kind] || 0) + 1
    }
  }
  for (const c of parked) {
    if (c.door && !c.passed && c.z + 2.2 < -0.5) {
      c.passed = true
      dodgeCounts.door = (dodgeCounts.door || 0) + 1
    }
  }
}

function update(dt) {
  time += dt

  if (mode === 'crashing') {
    crashTimer -= dt
    if (crashTimer <= 0) {
      mode = 'over'
      showCrashCard()
    }
    return
  }
  if (mode === 'over') return

  const v = mode === 'playing' ? speed : ATTRACT_SPEED
  const dz = v * dt
  roll += dz
  if (mode === 'playing') {
    speed = Math.min(MAX_SPEED, speed + ACCEL * dt)
    dist += dz
  }

  for (const list of [parked, parkedR, buildings, lamps, obstacles, treats]) {
    for (const o of list) o.z -= dz
  }
  parkFront -= dz
  parkRFront -= dz
  lampFront -= dz
  buildFront[-1] -= dz
  buildFront[1] -= dz
  if (mode === 'playing') countDodged()
  parked = parked.filter((c) => c.z + 2.2 > Z_NEAR - 1)
  parkedR = parkedR.filter((c) => c.z + 2.2 > Z_NEAR - 1)
  buildings = buildings.filter((b) => b.z + b.d > Z_NEAR - 1)
  lamps = lamps.filter((l) => l.z > Z_NEAR - 1)
  obstacles = obstacles.filter((o) => o.z + o.d > Z_NEAR - 1)
  treats = treats.filter((t) => t.z > Z_NEAR - 1 && !t.got)
  fillScenery()

  if (mode === 'playing') {
    rowAccum += dz
    if (rowAccum >= nextGap) {
      rowAccum = 0
      lastBlocked = nextRow.build(SPAWN_Z)
      rows++
      // A bell floats in the lane this row leaves open, just past it. The third
      // row always brings one, so you find out about bells early.
      if (rings < MAX_RINGS && (rows === 3 || chance(BELL_CHANCE))) addBell(freeLane(lastBlocked), SPAWN_Z + 5.5)
      scheduleRow(Math.max(9, speed * rand(1.0, 1.5)))
    }
  }

  // obstacles that move or react as you get close
  for (const o of obstacles) {
    if (o.kind === 'ebike') o.z -= EBIKE_SPEED * dt
    if (o.kind === 'taxi' && o.z < speed * 1.7) {
      o.merge = Math.min(1, o.merge + dt / 0.7)
      o.x = LANES[1] + (LANES[0] - LANES[1]) * (1 - (1 - o.merge) ** 2)
    }
    if (o.kind === 'ped') {
      if (o.startled) {
        // heard the bell: back to the curb, quick
        if (o.x > PARK_L) {
          o.x = Math.max(PARK_L, o.x - 3.5 * dt)
          o.walk += dt * 12
        }
      } else if (o.z < speed * 2.3 && o.x < o.targetX) {
        o.x = Math.min(o.targetX, o.x + 2.1 * dt)
        o.walk += dt * 8
      }
    }
  }
  for (const c of parked) {
    if (c.door && c.z < speed * 0.85) c.open = Math.min(1, c.open + dt / 0.2)
  }

  // rider
  const tx = LANES[player.lane]
  const step = 12 * dt
  player.x += clamp(tx - player.x, -step, step)
  player.lean += (clamp((tx - player.x) * -0.35, -0.3, 0.3) - player.lean) * Math.min(1, dt * 12)
  if (player.y > 0 || player.vy > 0) {
    player.vy -= 24 * dt
    player.y = Math.max(0, player.y + player.vy * dt)
    if (player.y === 0) player.vy = 0
  }
  player.pedal += dz * 1.4
  camX += (player.x * 0.6 - camX) * Math.min(1, dt * 6)

  ringCooldown = Math.max(0, ringCooldown - dt)
  ringFx = Math.max(0, ringFx - dt)
  if (toastTimer > 0) {
    toastTimer -= dt
    if (toastTimer <= 0) ui.toast.hidden = true
  }

  if (mode !== 'playing') return

  // collisions: the rider occupies x±0.28, z -0.5..0.5
  const px0 = player.x - 0.28
  const px1 = player.x + 0.28
  for (const o of obstacles) {
    if (o.jumpable && player.y > 0.25) continue
    if (overlaps(o.z, o.z + o.d, -0.5, 0.5) && overlaps(o.x - o.w / 2, o.x + o.w / 2, px0, px1)) {
      crash(o.kind)
      return
    }
  }
  for (const c of parked) {
    if (!c.door || c.open < 0.3) continue
    const { hx, hz, ex, ez } = doorGeom(c)
    if (overlaps(ez, hz, -0.5, 0.5) && overlaps(hx, ex, px0, px1)) {
      crash('door')
      return
    }
  }
  for (const t of treats) {
    if (!t.got && Math.abs(t.z) < 0.6 && Math.abs(t.x - player.x) < 0.6) {
      t.got = true
      if (t.kind === 'bell') pickUpBell()
      else bagels++
    }
  }
  updateHud()
}

// the passenger door hinges at its front edge and swings out into the bike lane
function doorGeom(c) {
  const a = c.open * 1.2
  const hx = PARK_L + 0.525
  const hz = c.z + 1.45
  return { hx, hz, ex: hx + DOOR_LEN * Math.sin(a), ez: hz - DOOR_LEN * Math.cos(a) }
}

// ---------- drawing ----------

function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, horizonY)
  g.addColorStop(0, '#272a5a')
  g.addColorStop(0.6, '#8a4f7d')
  g.addColorStop(1, '#f2a46d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, horizonY + 1)

  ctx.fillStyle = '#4a3f6b'
  for (const b of skyline) {
    const x = b.x * W
    const h = b.h * H
    ctx.fillRect(x, horizonY - h, b.w * W, h + 1)
    if (b.spire) ctx.fillRect(x + b.w * W * 0.4, horizonY - h - H * 0.04, b.w * W * 0.2, H * 0.04)
  }
}

function drawGround() {
  const far = Z_FAR + 10
  groundRect(-60, CURB_L, Z_NEAR, far, '#8d8a86') // sidewalks
  groundRect(CURB_R, 60, Z_NEAR, far, '#8d8a86')
  groundRect(CURB_L, CURB_R, Z_NEAR, far, '#3b3d42') // asphalt
  groundRect(-1.5 * LW, -0.5 * LW, Z_NEAR, far, '#2f7d4f') // the bike lane
  groundRect(CURB_L - 0.12, CURB_L, Z_NEAR, far, '#b5b1aa') // curbs
  groundRect(CURB_R, CURB_R + 0.12, Z_NEAR, far, '#b5b1aa')
  for (const x of [-1.5 * LW, -0.5 * LW]) groundRect(x - 0.06, x + 0.06, Z_NEAR, far, '#e8e8e8')

  // dashes between the two traffic lanes, scrolling with the street
  const off = roll % 6
  for (let z = -off - 6; z < far; z += 6) groundRect(0.5 * LW - 0.05, 0.5 * LW + 0.05, z, z + 3, '#d8d8d8')

  const moff = roll % 24
  for (let z = -moff - 24; z < far; z += 24) drawMarking(LANES[0], z + 10)

  // haze at the horizon hides things popping in
  const g = ctx.createLinearGradient(0, horizonY, 0, horizonY + H * 0.12)
  g.addColorStop(0, 'rgba(242,164,109,0.9)')
  g.addColorStop(1, 'rgba(242,164,109,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, horizonY, W, H * 0.12)
}

// The bike lane marking: a rider on a bike with an arrow ahead of it, painted
// flat on the road. Shapes are in marking units (u across the lane, v down the
// street) and every vertex is projected, so the paint foreshortens like real
// paint. Like real road markings it's stretched along the street so it reads
// upright in perspective.
const MARK_SX = 0.55
const MARK_SZ = 2.6

// All shapes wind clockwise so a single nonzero fill paints their union; a
// wheel's inner edge winds the other way to cut out the hole.
function circlePts(u, v, r, clockwise, n = 18) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = ((clockwise ? -i : i) / n) * Math.PI * 2
    pts.push([u + r * Math.cos(a), v + r * Math.sin(a)])
  }
  return pts
}

function barPts([u0, v0], [u1, v1], w) {
  const len = Math.hypot(u1 - u0, v1 - v0)
  const nu = (-(v1 - v0) / len) * (w / 2)
  const nv = ((u1 - u0) / len) * (w / 2)
  return [
    [u0 + nu, v0 + nv],
    [u1 + nu, v1 + nv],
    [u1 - nu, v1 - nv],
    [u0 - nu, v0 - nv],
  ]
}

// a polyline painted w wide, with round joints; each piece is its own shape
function brush(points, w) {
  const shapes = []
  for (let i = 0; i < points.length - 1; i++) shapes.push([barPts(points[i], points[i + 1], w)])
  for (const [u, v] of points) shapes.push([circlePts(u, v, w / 2, true, 10)])
  return shapes
}

const wheel = (u, v) => [circlePts(u, v, 0.34, true), circlePts(u, v, 0.21, false)]

// The rider faces left, like the standard bicyclist symbol. The bike and the
// arrow each fade out as they slide under you; v0 is where each one starts.
const MARKING = [
  {
    v0: 0,
    shapes: [
      wheel(-0.6, 0.33),
      wheel(0.6, 0.33),
      ...brush([[0.6, 0.33], [0, 0.33], [0.24, 0.8], [0.6, 0.33]], 0.12), // chain stay, seat tube, seat stay
      ...brush([[0.24, 0.8], [-0.36, 0.82], [0, 0.33]], 0.12), // top tube, down tube
      ...brush([[-0.36, 0.82], [-0.6, 0.33]], 0.12), // fork
      ...brush([[-0.36, 0.82], [-0.41, 0.97], [-0.27, 1.01]], 0.11), // stem and handlebar
      ...brush([[0.22, 0.96], [-0.13, 1.37]], 0.24), // torso
      ...brush([[-0.13, 1.37], [-0.25, 1.17], [-0.28, 1.0]], 0.13), // arm
      ...brush([[0.22, 0.96], [-0.08, 0.68], [0.05, 0.35]], 0.15), // leg
      [circlePts(-0.29, 1.62, 0.17, true)], // head
    ],
  },
  {
    v0: 2.05,
    shapes: [
      ...brush([[0, 2.15], [0, 2.62]], 0.2), // arrow shaft
      [[[-0.4, 2.58], [0, 3.1], [0.4, 2.58]]], // arrow head
    ],
  },
]

function drawMarking(cx, cz) {
  if (cz > Z_FAR) return
  ctx.fillStyle = '#efefe9'
  for (const part of MARKING) {
    const alpha = 0.9 * fogAlpha(cz) * clamp((cz + part.v0 * MARK_SZ - 0.3) / 2.5, 0, 1)
    if (alpha <= 0) continue
    ctx.beginPath()
    for (const shape of part.shapes) {
      for (const loop of shape) {
        loop.forEach(([u, v], i) => {
          const p = proj(cx + u * MARK_SX, 0, cz + v * MARK_SZ)
          if (i) ctx.lineTo(p.x, p.y)
          else ctx.moveTo(p.x, p.y)
        })
        ctx.closePath()
      }
    }
    ctx.globalAlpha = alpha
    ctx.fill('nonzero')
  }
  ctx.globalAlpha = 1
}

function drawBuilding(b) {
  if (b.z > Z_FAR + 5) return
  ctx.globalAlpha = fogAlpha(b.z)
  drawBox(b.x, 0, b.z, b.w, b.h, b.d, shade(b.color, 0.7), b.color, shade(b.color, 0.55))
  const fx = b.face
  // awning along the storefronts
  const z0 = Math.max(b.z + 0.2, Z_NEAR)
  const z1 = b.z + b.d - 0.2
  if (z1 > z0) {
    quad([proj(fx, 0, z0), proj(fx, 1.1, z0), proj(fx, 1.1, z1), proj(fx, 0, z1)], '#2a3442')
    quad([proj(fx, 1.1, z0), proj(fx, 1.5, z0), proj(fx, 1.5, z1), proj(fx, 1.1, z1)], b.awning)
  }
  if (b.z < 60) {
    for (let row = 0; row < b.rows; row++) {
      for (let col = 0; col < b.cols; col++) {
        const wz0 = b.z + 0.5 + col * 1.3
        const wz1 = wz0 + 0.7
        if (wz1 <= Z_NEAR) continue
        const y = 2.2 + row * 1.5
        const zz0 = Math.max(wz0, Z_NEAR)
        quad(
          [proj(fx, y, zz0), proj(fx, y + 0.9, zz0), proj(fx, y + 0.9, wz1), proj(fx, y, wz1)],
          b.lit[row * b.cols + col] ? '#ffd27a' : '#2b2f3a',
        )
      }
    }
  }
  ctx.globalAlpha = 1
}

function drawLamp(l) {
  const x = l.side < 0 ? CURB_L - 0.4 : CURB_R + 0.4
  drawBox(x, 0, l.z, 0.12, 3.4, 0.12, '#2d3138', '#24272c', '#2d3138')
  if (l.z > Z_NEAR + 0.5) {
    const p = proj(x - l.side * 0.35, 3.35, l.z)
    const r = Math.max(2, 0.5 * p.s)
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
    g.addColorStop(0, 'rgba(255,230,160,0.95)')
    g.addColorStop(1, 'rgba(255,230,160,0)')
    ctx.fillStyle = g
    ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)
  }
}

function wheelPair(x, z, w) {
  if (z <= Z_NEAR) return
  ctx.fillStyle = '#111'
  for (const sx of [-1, 1]) {
    const cx = x + sx * (w / 2 - 0.12)
    const a = proj(cx - 0.1, 0.38, z)
    const b = proj(cx + 0.1, 0, z)
    ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y)
  }
}

// tail light rectangles on a car's rear face
function tailLights(f, color) {
  if (!f || f.cut) return
  const s = f.s
  ctx.fillStyle = color
  const h = 0.1 * s
  const y = f.y1 - 0.42 * s
  ctx.fillRect(f.x0 + 0.04 * s, y, 0.16 * s, h)
  ctx.fillRect(f.x1 - 0.2 * s, y, 0.16 * s, h)
}

function drawCar(x, z, body, opts = {}) {
  wheelPair(x, z + 0.05, 1.05)
  const f = drawBox(x, 0.28, z, 1.05, 0.55, 2.2, shade(body, 0.92), shade(body, 0.72), shade(body, 1.08))
  const c = drawBox(x, 0.83, z + 0.55, 0.9, 0.45, 1.15, '#33414f', shade(body, 0.6), shade(body, 1.02))
  tailLights(f, opts.brake ? '#ff2a1a' : '#8a1d16')
  if (opts.passenger && c && !c.cut) {
    // someone sitting in the car: a cue that a door might open
    const s = c.s
    ctx.fillStyle = '#121820'
    ctx.beginPath()
    ctx.arc(c.x1 - 0.22 * s, c.y1 - 0.18 * s, 0.11 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  return { f, c }
}

function drawParked(c, x) {
  ctx.globalAlpha = fogAlpha(c.z)
  drawCar(x, c.z, c.color, { passenger: c.door })
  if (c.door && c.open > 0) {
    const { hx, hz, ex, ez } = doorGeom(c)
    if (ez > Z_NEAR) {
      quad([proj(hx, 0.3, hz), proj(ex, 0.3, ez), proj(ex, 0.85, ez), proj(hx, 0.85, hz)], shade(c.color, 1.05))
      quad([proj(hx, 0.85, hz), proj(ex, 0.85, ez), proj(ex, 1.2, ez), proj(hx, 1.2, hz)], '#55697d')
    }
  }
  ctx.globalAlpha = 1
}

function flashing(rate) {
  return Math.floor(time * rate) % 2 === 0
}

function glow(x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
}

function drawPolice(o) {
  const { f } = drawCar(o.x, o.z, '#f1f3f5')
  const bar = drawBox(o.x, 1.28, o.z + 1.0, 0.7, 0.1, 0.25, '#222', '#222', '#333')
  if (f && !f.cut) {
    const s = f.s
    ctx.fillStyle = '#1d3f8f'
    ctx.fillRect(f.x0, f.y1 - 0.25 * s, f.x1 - f.x0, 0.07 * s)
    ctx.font = `bold ${Math.max(6, 0.15 * s)}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('NYPD', (f.x0 + f.x1) / 2, f.y0 + 0.2 * s)
  }
  if (bar && !bar.cut) {
    const s = bar.s
    const on = flashing(6)
    const mid = (bar.x0 + bar.x1) / 2
    const y = (bar.y0 + bar.y1) / 2
    ctx.fillStyle = on ? '#ff2a2a' : '#5a1010'
    ctx.fillRect(bar.x0, bar.y0, mid - bar.x0, bar.y1 - bar.y0)
    ctx.fillStyle = on ? '#14204a' : '#3a7bff'
    ctx.fillRect(mid, bar.y0, bar.x1 - mid, bar.y1 - bar.y0)
    glow(
      on ? bar.x0 + (mid - bar.x0) / 2 : mid + (bar.x1 - mid) / 2,
      y,
      0.9 * s,
      on ? 'rgba(255,40,40,0.55)' : 'rgba(60,120,255,0.55)',
    )
  }
}

function drawTaxi(o) {
  const { f } = drawCar(o.x, o.z, '#f4c20d', { brake: o.merge > 0 })
  const sign = drawBox(o.x, 1.28, o.z + 1.0, 0.4, 0.14, 0.2, '#fff6cc', '#e0d9b0', '#fff')
  if (f && !f.cut && o.z < speed * 1.9 && flashing(4)) {
    // left blinker: it's coming into the bike lane
    const s = f.s
    ctx.fillStyle = '#ffb000'
    ctx.fillRect(f.x0 + 0.04 * s, f.y1 - 0.3 * s, 0.16 * s, 0.07 * s)
    glow(f.x0 + 0.12 * s, f.y1 - 0.27 * s, 0.4 * s, 'rgba(255,176,0,0.6)')
  }
  if (sign && !sign.cut) glow((sign.x0 + sign.x1) / 2, sign.y0, 0.4 * sign.s, 'rgba(255,240,180,0.4)')
}

function drawTruck(o) {
  wheelPair(o.x, o.z + 0.2, 1.15)
  drawBox(o.x, 0.3, o.z + 3.2, 1.1, 1.5, 1.2, '#d9d9d9', '#b5b5b5', '#e5e5e5') // cab
  const f = drawBox(o.x, 0.45, o.z, 1.15, 2.2, 3.3, '#ececec', '#c9c9c9', '#f5f5f5')
  if (f && !f.cut) {
    const s = f.s
    // roll-up door
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'
    ctx.lineWidth = Math.max(1, 0.02 * s)
    for (let i = 1; i < 8; i++) {
      const y = f.y0 + ((f.y1 - f.y0) * i) / 8
      ctx.beginPath()
      ctx.moveTo(f.x0 + 0.08 * s, y)
      ctx.lineTo(f.x1 - 0.08 * s, y)
      ctx.stroke()
    }
    ctx.fillStyle = '#c0392b'
    ctx.fillRect(f.x0, f.y1 - 0.1 * s, f.x1 - f.x0, 0.1 * s)
    const on = flashing(3)
    ctx.fillStyle = on ? '#ffb000' : '#6b4a00'
    ctx.fillRect(f.x0 + 0.04 * s, f.y1 - 0.3 * s, 0.14 * s, 0.12 * s)
    ctx.fillRect(f.x1 - 0.18 * s, f.y1 - 0.3 * s, 0.14 * s, 0.12 * s)
    if (on) {
      glow(f.x0 + 0.11 * s, f.y1 - 0.24 * s, 0.45 * s, 'rgba(255,176,0,0.5)')
      glow(f.x1 - 0.11 * s, f.y1 - 0.24 * s, 0.45 * s, 'rgba(255,176,0,0.5)')
    }
  }
}

function drawPothole(o) {
  if (o.z + o.d <= Z_NEAR + 0.2) return
  const a = proj(o.x, 0, Math.max(o.z, Z_NEAR))
  const b = proj(o.x, 0, o.z + o.d)
  const cy = (a.y + b.y) / 2
  const ry = Math.max(1, (a.y - b.y) / 2)
  const rx = (o.w / 2) * ((a.s + b.s) / 2)
  ctx.fillStyle = '#5c5e63'
  ctx.beginPath()
  ctx.ellipse(a.x, cy, rx * 1.1, ry * 1.15, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#141416'
  ctx.beginPath()
  ctx.ellipse(a.x, cy + ry * 0.1, rx * 0.85, ry * 0.8, 0, 0, Math.PI * 2)
  ctx.fill()
}

// person facing the camera, drawn as a flat billboard
function drawPed(o) {
  if (o.z <= Z_NEAR + 0.3) return
  const p = proj(o.x, 0, o.z)
  const s = p.s
  const swing = Math.sin(o.walk) * 0.12
  ctx.strokeStyle = '#2b2d42'
  ctx.lineCap = 'round'
  ctx.lineWidth = 0.12 * s
  ctx.beginPath()
  ctx.moveTo(p.x - 0.08 * s, p.y - 0.85 * s)
  ctx.lineTo(p.x - 0.1 * s + swing * s, p.y)
  ctx.moveTo(p.x + 0.08 * s, p.y - 0.85 * s)
  ctx.lineTo(p.x + 0.1 * s - swing * s, p.y)
  ctx.stroke()
  ctx.fillStyle = o.shirt
  ctx.fillRect(p.x - 0.2 * s, p.y - 1.45 * s, 0.4 * s, 0.65 * s)
  ctx.fillStyle = '#c68e6b'
  ctx.beginPath()
  ctx.arc(p.x, p.y - 1.58 * s, 0.13 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2b1d14'
  ctx.beginPath()
  ctx.arc(p.x, p.y - 1.63 * s, 0.13 * s, Math.PI, 0)
  ctx.fill()
  if (o.startled) {
    // heard the bell and looked up
    if (time - o.startledAt < 1.2) {
      ctx.fillStyle = '#ffd65a'
      ctx.font = `800 ${Math.max(8, 0.42 * s)}px Overpass, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText('!', p.x, p.y - 1.8 * s)
    }
  } else {
    // head down, staring at a phone
    ctx.fillStyle = '#dff3ff'
    ctx.fillRect(p.x + 0.04 * s, p.y - 1.32 * s, 0.1 * s, 0.14 * s)
    glow(p.x + 0.09 * s, p.y - 1.27 * s, 0.25 * s, 'rgba(200,235,255,0.5)')
  }
}

// delivery rider coming straight at you
function drawEbike(o) {
  if (o.z <= Z_NEAR + 0.3) return
  const p = proj(o.x, 0, o.z)
  const s = p.s
  ctx.fillStyle = '#111'
  ctx.fillRect(p.x - 0.05 * s, p.y - 0.68 * s, 0.1 * s, 0.68 * s)
  ctx.strokeStyle = '#222'
  ctx.lineWidth = 0.05 * s
  ctx.beginPath()
  ctx.moveTo(p.x - 0.3 * s, p.y - 1.1 * s)
  ctx.lineTo(p.x + 0.3 * s, p.y - 1.1 * s)
  ctx.stroke()
  // insulated delivery bag
  ctx.fillStyle = '#1aa38a'
  ctx.fillRect(p.x - 0.28 * s, p.y - 2.05 * s, 0.56 * s, 0.5 * s)
  ctx.fillStyle = '#324a5f'
  ctx.fillRect(p.x - 0.2 * s, p.y - 1.55 * s, 0.4 * s, 0.5 * s)
  ctx.fillStyle = '#9c6644'
  ctx.beginPath()
  ctx.arc(p.x, p.y - 1.66 * s, 0.12 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#e63946'
  ctx.beginPath()
  ctx.arc(p.x, p.y - 1.7 * s, 0.13 * s, Math.PI, 0)
  ctx.fill()
  ctx.fillStyle = '#fffbe6'
  ctx.beginPath()
  ctx.arc(p.x, p.y - 0.8 * s, 0.07 * s, 0, Math.PI * 2)
  ctx.fill()
  glow(p.x, p.y - 0.8 * s, 0.7 * s, 'rgba(255,250,220,0.6)')
}

function drawTreat(t) {
  if (t.z <= Z_NEAR + 0.3 || t.got) return
  if (t.kind === 'bell') {
    drawBellPickup(t)
    return
  }
  const p = proj(t.x, 0.55 + Math.sin(time * 4 + t.z) * 0.06, t.z)
  const s = p.s
  ctx.strokeStyle = '#c98a45'
  ctx.lineWidth = 0.11 * s
  ctx.beginPath()
  ctx.ellipse(p.x, p.y, 0.2 * s, 0.15 * s, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#e6b77a'
  ctx.lineWidth = 0.04 * s
  ctx.beginPath()
  ctx.ellipse(p.x, p.y - 0.02 * s, 0.2 * s, 0.14 * s, 0, Math.PI * 1.1, Math.PI * 1.9)
  ctx.stroke()
}

// a gold bell floating over the lane
function drawBellPickup(t) {
  const p = proj(t.x, 0.8 + Math.sin(time * 3 + t.z) * 0.08, t.z)
  const s = p.s
  ctx.globalAlpha = fogAlpha(t.z)
  glow(p.x, p.y, 0.55 * s, 'rgba(255,214,90,0.5)')
  ctx.fillStyle = '#f2c94c'
  ctx.beginPath()
  ctx.moveTo(p.x - 0.22 * s, p.y + 0.12 * s)
  ctx.quadraticCurveTo(p.x - 0.2 * s, p.y - 0.24 * s, p.x, p.y - 0.26 * s)
  ctx.quadraticCurveTo(p.x + 0.2 * s, p.y - 0.24 * s, p.x + 0.22 * s, p.y + 0.12 * s)
  ctx.closePath()
  ctx.fill()
  ctx.fillRect(p.x - 0.26 * s, p.y + 0.1 * s, 0.52 * s, 0.06 * s) // lip
  ctx.beginPath()
  ctx.arc(p.x, p.y - 0.29 * s, 0.045 * s, 0, Math.PI * 2) // knob
  ctx.fill()
  ctx.fillStyle = '#b8892a'
  ctx.beginPath()
  ctx.arc(p.x, p.y + 0.2 * s, 0.05 * s, 0, Math.PI * 2) // clapper
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillRect(p.x - 0.12 * s, p.y - 0.15 * s, 0.04 * s, 0.18 * s) // shine
  ctx.globalAlpha = 1
}

// you, from behind
function drawPlayer() {
  const g = proj(player.x, 0, 0)
  const p = proj(player.x, player.y, 0)
  const s = p.s
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.beginPath()
  ctx.ellipse(g.x, g.y, 0.32 * s, 0.07 * s, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.translate(p.x, p.y)
  if (mode === 'crashing' || mode === 'over') ctx.rotate(0.9)
  else ctx.rotate(player.lean)

  ctx.fillStyle = '#151515'
  ctx.fillRect(-0.045 * s, -0.7 * s, 0.09 * s, 0.7 * s)
  ctx.fillStyle = flashing(4) ? '#ff3b30' : '#6e1a16'
  ctx.fillRect(-0.06 * s, -0.66 * s, 0.12 * s, 0.07 * s)

  const k = Math.sin(player.pedal) * 0.12
  ctx.strokeStyle = '#1f2a37'
  ctx.lineCap = 'round'
  ctx.lineWidth = 0.11 * s
  ctx.beginPath()
  ctx.moveTo(-0.1 * s, -1.02 * s)
  ctx.lineTo(-0.13 * s, (-0.42 + k) * s)
  ctx.moveTo(0.1 * s, -1.02 * s)
  ctx.lineTo(0.13 * s, (-0.42 - k) * s)
  ctx.stroke()

  ctx.strokeStyle = '#222'
  ctx.lineWidth = 0.05 * s
  ctx.beginPath()
  ctx.moveTo(-0.32 * s, -1.12 * s)
  ctx.lineTo(0.32 * s, -1.12 * s)
  ctx.stroke()

  ctx.fillStyle = '#e4572e'
  ctx.beginPath()
  ctx.moveTo(-0.18 * s, -0.98 * s)
  ctx.lineTo(0.18 * s, -0.98 * s)
  ctx.lineTo(0.24 * s, -1.55 * s)
  ctx.lineTo(-0.24 * s, -1.55 * s)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#e4572e'
  ctx.lineWidth = 0.08 * s
  ctx.beginPath()
  ctx.moveTo(-0.22 * s, -1.5 * s)
  ctx.lineTo(-0.3 * s, -1.13 * s)
  ctx.moveTo(0.22 * s, -1.5 * s)
  ctx.lineTo(0.3 * s, -1.13 * s)
  ctx.stroke()

  ctx.fillStyle = '#2d3e50'
  ctx.fillRect(-0.16 * s, -1.5 * s, 0.32 * s, 0.36 * s)
  ctx.fillStyle = '#d9f99d'
  ctx.fillRect(-0.16 * s, -1.3 * s, 0.32 * s, 0.04 * s)

  ctx.fillStyle = '#f4f4f4'
  ctx.beginPath()
  ctx.ellipse(0, -1.68 * s, 0.15 * s, 0.13 * s, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1f2a37'
  ctx.fillRect(-0.15 * s, -1.66 * s, 0.3 * s, 0.03 * s)

  // a little gold bell on the handlebar while you have rings, rippling when rung
  if (rings > 0 || ringFx > 0) {
    ctx.fillStyle = '#ffd65a'
    ctx.beginPath()
    ctx.arc(0.25 * s, -1.17 * s, 0.05 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  if (ringFx > 0) {
    const grow = 1 - ringFx / RING_FX
    ctx.strokeStyle = `rgba(255,214,90,${ringFx / RING_FX})`
    ctx.lineWidth = Math.max(1.5, 0.03 * s)
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(0.25 * s, -1.17 * s, (0.14 + grow * 0.5 + i * 0.12) * s, -0.8, 0.8)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawObstacle(o) {
  if (o.z > Z_FAR) return
  ctx.globalAlpha = fogAlpha(o.z)
  switch (o.kind) {
    case 'police':
      drawPolice(o)
      break
    case 'taxi':
      drawTaxi(o)
      break
    case 'truck':
      drawTruck(o)
      break
    case 'car':
      drawCar(o.x, o.z, o.color, { brake: true })
      break
    case 'pothole':
      drawPothole(o)
      break
    case 'ped':
      drawPed(o)
      break
    case 'ebike':
      drawEbike(o)
      break
  }
  ctx.globalAlpha = 1
}

function draw() {
  ctx.save()
  if (mode === 'crashing' && !reduceMotion) {
    const k = crashTimer * 10
    ctx.translate(rand(-k, k), rand(-k, k))
  }
  drawSky()
  drawGround()

  // potholes lie flat on the road, so draw them before anything standing up
  for (const o of obstacles) if (o.kind === 'pothole') drawObstacle(o)

  for (const side of [-1, 1]) {
    buildings
      .filter((b) => b.side === side)
      .sort((a, b) => b.z - a.z)
      .forEach(drawBuilding)
  }

  // painter's algorithm, far to near
  const items = []
  for (const l of lamps) items.push({ z: l.z, fn: () => drawLamp(l) })
  for (const c of parked) items.push({ z: c.z + 1.1, fn: () => drawParked(c, PARK_L) })
  for (const c of parkedR) items.push({ z: c.z + 1.1, fn: () => drawParked(c, PARK_R) })
  for (const o of obstacles) if (o.kind !== 'pothole') items.push({ z: o.z + o.d / 2, fn: () => drawObstacle(o) })
  for (const t of treats) items.push({ z: t.z, fn: () => drawTreat(t) })
  items.push({ z: 0, fn: drawPlayer })
  items.sort((a, b) => b.z - a.z)
  for (const it of items) it.fn()

  if (mode === 'crashing') {
    ctx.fillStyle = `rgba(255,60,40,${clamp(crashTimer, 0, 0.5) * 0.6})`
    ctx.fillRect(-20, -20, W + 40, H + 40)
  }
  ctx.restore()
}

function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0)
  last = t
  if (onScreen && W > 0) {
    update(dt)
    draw()
  }
  requestAnimationFrame(frame)
}

// ---------- setup ----------

function link(href, text, className) {
  const a = document.createElement('a')
  a.href = href
  a.target = '_blank'
  a.rel = 'noopener'
  a.textContent = text
  if (className) a.className = className
  return a
}

function factItem(f) {
  const li = document.createElement('li')
  const value = document.createElement('span')
  value.className = 'fact-value'
  value.textContent = f.value
  const label = document.createElement('span')
  label.append(`${f.label} `, link(f.source, 'source'))
  li.append(value, label)
  return li
}

makeSkyline()
resize()
reset()

if (bestDist > 0) {
  ui.readyBest.textContent = `Best: ${(bestDist / BLOCK_LEN).toFixed(1)} blocks`
  ui.readyBest.hidden = false
}

ui.fullscreen.hidden = !canFullscreen
ui.fullscreen.addEventListener('click', () => {
  setFullscreen(!isFullscreen())
  // so space and arrows go back to the game, not this button
  wrap.focus({ preventScroll: true })
})
document.addEventListener('fullscreenchange', syncFullscreenButton)
ui.bell.addEventListener('click', () => {
  ringBell()
  wrap.focus({ preventScroll: true })
})
document.addEventListener('webkitfullscreenchange', syncFullscreenButton)

new ResizeObserver(resize).observe(canvas)
new IntersectionObserver(([entry]) => {
  onScreen = entry.isIntersecting
}).observe(canvas)

canvas.addEventListener('pointerdown', onPointerDown)
canvas.addEventListener('pointerup', onPointerUp)
canvas.addEventListener('pointercancel', () => {
  down = null
})
window.addEventListener('keydown', onKey)
for (const button of document.querySelectorAll('[data-start]')) button.addEventListener('click', startGame)

requestAnimationFrame(frame)
