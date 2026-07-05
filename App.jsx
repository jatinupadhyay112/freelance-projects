import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  MapPin, Clock, Users, Phone, MessageCircle, Instagram, Facebook,
  ChevronRight, ChevronLeft, X, Check, Star, Calendar as CalendarIcon,
  Wallet, ShieldCheck, Zap, Trophy, Dumbbell, ParkingCircle, Utensils,
  Shirt, GraduationCap, AlertCircle, Search, Menu, ArrowRight, Download,
  QrCode, LogOut, User as UserIcon, LayoutDashboard, Settings, Plus,
  Trash2, Edit3, TrendingUp, DollarSign, CalendarCheck, BarChart3,
  Heart, ImageIcon, Megaphone, ChevronDown, CircleCheck, CircleDot
} from "lucide-react";

/* =========================================================================
   MATCHBOOK ARENA — premium sports venue booking prototype
   Design tokens
   ------------------------------------------------------------------------
   Background   #0A0E13  (near-black, cool)
   Surface      #12181F  (raised panels)
   Surface-2    #1A222B  (cards on panels)
   Line         #212B35  (hairlines)
   Ink          #ECF2F6  (primary text)
   Ink-mute     #8B9AA8  (secondary text)
   Turf (green) #1FCB6E  — football / turf sports, "confirmed" state
   Court (blue) #3D7CFF  — indoor courts, primary CTA
   Whistle (orange) #FF7A2E — energy / live / urgent CTA
   Display face: "Space Grotesk" (condensed, technical, scoreboard-adjacent)
   Body face: "Inter"
   Data face: "JetBrains Mono" (slot times, prices, booking IDs — reads
              like a scoreboard/departures-board digit set)
   Signature element: the "Matchboard" — a live split-flap / scoreboard
   strip used for the hero ticker, slot pickers, and the booking summary,
   so the whole booking flow reads like watching a stadium board update.
   ========================================================================= */

const SPORTS = [
  { id: "cricket", name: "Cricket", icon: "🏏", price: 1800, capacity: "22 players", duration: "2 hrs", desc: "Full-size turf pitch with practice nets and floodlights for evening matches.", slots: ["06:00", "08:00", "16:00", "18:00", "20:00"] },
  { id: "football", name: "Football", icon: "⚽", price: 2200, capacity: "14 players", duration: "1.5 hrs", desc: "FIFA-spec 7-a-side turf, rebound boards, floodlit for night games.", slots: ["06:00", "07:30", "17:00", "18:30", "20:00"] },
  { id: "badminton", name: "Badminton", icon: "🏸", price: 500, capacity: "4 players", duration: "1 hr", desc: "Wooden-finish indoor courts with BWF-standard synthetic flooring.", slots: ["06:00", "07:00", "08:00", "18:00", "19:00", "20:00"] },
  { id: "basketball", name: "Basketball", icon: "🏀", price: 1200, capacity: "10 players", duration: "1 hr", desc: "Full-length outdoor court, acrylic surface, night lighting.", slots: ["06:00", "07:00", "17:00", "18:00", "19:00"] },
  { id: "tennis", name: "Tennis", icon: "🎾", price: 900, capacity: "4 players", duration: "1 hr", desc: "Clay-style hard courts with ball machines available on request.", slots: ["06:00", "07:00", "16:00", "17:00", "18:00"] },
  { id: "pickleball", name: "Pickleball", icon: "🥒", price: 700, capacity: "4 players", duration: "1 hr", desc: "Dedicated pickleball courts, paddles and balls included.", slots: ["06:00", "07:00", "08:00", "18:00", "19:00"] },
  { id: "volleyball", name: "Volleyball", icon: "🏐", price: 1000, capacity: "12 players", duration: "1 hr", desc: "Sand and indoor volleyball courts, nets professionally strung.", slots: ["06:00", "16:00", "17:00", "18:00", "19:00"] },
];

const TESTIMONIALS = [
  { name: "Rohan Verma", sport: "Football", rating: 5, text: "Best turf in the city. Floodlights are genuinely stadium-grade and booking took under a minute." },
  { name: "Ayesha Khan", sport: "Badminton", rating: 5, text: "Courts are spotless and the slot system never double-books, unlike every other place I've tried." },
  { name: "Karan Mehta", sport: "Cricket", rating: 4, text: "Great nets, great pitch. Only wish there were more evening slots on weekends." },
  { name: "Simran Kaur", sport: "Tennis", rating: 5, text: "The QR check-in at the gate is such a small thing but it makes the whole visit feel effortless." },
];

const GALLERY = [
  "Floodlit turf under a night sky",
  "Indoor badminton courts, wide angle",
  "Basketball court at golden hour",
  "Tennis court close-up, net detail",
  "Cricket nets practice session",
  "Clubhouse lounge and food court",
];

const FAQS = [
  { q: "Can I cancel or reschedule a booking?", a: "Yes — cancellations made more than 4 hours before your slot are fully refunded to your original payment method. Inside the 4-hour window, cancellations earn credit toward a future booking." },
  { q: "Is equipment provided?", a: "Bats, paddles, balls and bibs are available on-site for a small rental fee, shown at checkout. Bring your own footwear — non-marking soles only on indoor courts." },
  { q: "Do you offer coaching?", a: "Certified coaches are available for cricket, tennis and badminton. Add a coach when selecting your slot; availability is shown live." },
  { q: "What's your parking situation?", a: "Free parking for 120 vehicles and 40 two-wheelers, with a dedicated drop-off lane for tournament days." },
];

const AMENITIES = [
  { icon: ParkingCircle, label: "Free Parking", detail: "120 car + 40 bike spots" },
  { icon: Shirt, label: "Changing Rooms", detail: "Lockers & showers, both wings" },
  { icon: Utensils, label: "Food Court", detail: "6 outlets, open till 11 PM" },
  { icon: GraduationCap, label: "Coaching", detail: "Cricket, tennis, badminton" },
  { icon: Dumbbell, label: "Equipment Rental", detail: "Bats, paddles, bibs, balls" },
  { icon: ShieldCheck, label: "On-site Medic", detail: "First-aid staffed 6 AM–11 PM" },
];

const MEMBERSHIPS = [
  { name: "Starter", price: 999, period: "/month", perks: ["10% off every booking", "Priority slot access", "1 free equipment rental"] },
  { name: "Pro", price: 2499, period: "/month", perks: ["20% off every booking", "Priority slot access", "3 free equipment rentals", "1 free coaching session"], featured: true },
  { name: "Elite", price: 4999, period: "/month", perks: ["30% off every booking", "Guaranteed peak-hour slots", "Unlimited equipment rental", "4 coaching sessions", "Tournament entry included"] },
];

function currency(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function genBookingId() {
  return "MB-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
}

/* Deterministic pseudo-QR block pattern from a string, purely decorative
   for this prototype (scan target would be generated server-side). */
function QrGlyph({ seed, size = 132 }) {
  const cells = 11;
  const grid = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const out = [];
    for (let i = 0; i < cells * cells; i++) {
      h = (h * 1103515245 + 12345) >>> 0;
      out.push((h >> 16) % 3 === 0);
    }
    return out;
  }, [seed]);
  const cell = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "#fff", borderRadius: 8 }}>
      {grid.map((on, i) => {
        if (!on) return null;
        const x = (i % cells) * cell;
        const y = Math.floor(i / cells) * cell;
        return <rect key={i} x={x} y={y} width={cell} height={cell} fill="#0A0E13" />;
      })}
      {[[0,0],[cells-3,0],[0,cells-3]].map(([cx,cy], idx) => (
        <g key={idx}>
          <rect x={cx*cell} y={cy*cell} width={cell*3} height={cell*3} fill="#0A0E13" />
          <rect x={cx*cell + cell*0.6} y={cy*cell + cell*0.6} width={cell*1.8} height={cell*1.8} fill="#fff" />
          <rect x={cx*cell + cell*1.1} y={cy*cell + cell*1.1} width={cell*0.8} height={cell*0.8} fill="#0A0E13" />
        </g>
      ))}
    </svg>
  );
}

/* A single split-flap style digit/character used across the Matchboard */
function Flap({ char }) {
  return (
    <span className="mb-flap">{char}</span>
  );
}

function Matchboard({ text, tone = "ink" }) {
  return (
    <div className={`mb-board mb-board--${tone}`}>
      {text.split("").map((c, i) => <Flap key={i} char={c} />)}
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');

      .mb-root {
        --bg: #0A0E13;
        --surface: #12181F;
        --surface2: #1A222B;
        --line: #212B35;
        --ink: #ECF2F6;
        --ink-mute: #8B9AA8;
        --turf: #1FCB6E;
        --court: #3D7CFF;
        --whistle: #FF7A2E;
        background: var(--bg);
        color: var(--ink);
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
      }
      .mb-root * { box-sizing: border-box; }
      .f-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
      .f-mono { font-family: 'JetBrains Mono', monospace; }

      .mb-glow-court { background: radial-gradient(circle at 30% 20%, rgba(61,124,255,0.28), transparent 60%); }
      .mb-glow-turf { background: radial-gradient(circle at 70% 30%, rgba(31,203,110,0.22), transparent 60%); }
      .mb-glow-whistle { background: radial-gradient(circle at 50% 80%, rgba(255,122,46,0.16), transparent 60%); }

      .mb-glass {
        background: rgba(26,34,43,0.55);
        border: 1px solid rgba(255,255,255,0.06);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .mb-card {
        background: var(--surface2);
        border: 1px solid var(--line);
        transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
      }
      .mb-card:hover {
        border-color: rgba(61,124,255,0.45);
        transform: translateY(-3px);
        box-shadow: 0 16px 40px -20px rgba(61,124,255,0.35);
      }
      .mb-line { border-color: var(--line); }

      .mb-btn-primary {
        background: linear-gradient(135deg, var(--court), #2557C7);
        color: #fff;
        box-shadow: 0 10px 30px -10px rgba(61,124,255,0.6);
        transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
      }
      .mb-btn-primary:hover { transform: translateY(-1px); filter: brightness(1.08); }
      .mb-btn-whistle {
        background: linear-gradient(135deg, var(--whistle), #C8501A);
        color: #fff;
        box-shadow: 0 10px 30px -10px rgba(255,122,46,0.55);
        transition: transform .2s ease, filter .2s ease;
      }
      .mb-btn-whistle:hover { transform: translateY(-1px); filter: brightness(1.08); }
      .mb-btn-ghost {
        background: transparent;
        border: 1px solid var(--line);
        color: var(--ink);
        transition: border-color .2s ease, background .2s ease;
      }
      .mb-btn-ghost:hover { border-color: var(--court); background: rgba(61,124,255,0.08); }

      .mb-pill {
        border: 1px solid var(--line);
        background: var(--surface2);
        color: var(--ink-mute);
        transition: all .2s ease;
      }
      .mb-pill[data-active="true"] {
        border-color: var(--court);
        color: #fff;
        background: rgba(61,124,255,0.16);
      }

      .mb-board {
        display: inline-flex;
        gap: 3px;
        padding: 10px 14px;
        background: #05070A;
        border: 1px solid var(--line);
        border-radius: 6px;
      }
      .mb-flap {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        font-size: 15px;
        color: var(--turf);
        background: #0D1219;
        border-radius: 3px;
        padding: 4px 2px;
        min-width: 16px;
        text-align: center;
        box-shadow: inset 0 -1px 0 rgba(255,255,255,0.05), inset 0 1px 0 rgba(0,0,0,0.4);
      }
      .mb-board--whistle .mb-flap { color: var(--whistle); }
      .mb-board--court .mb-flap { color: var(--court); }
      .mb-board--ink .mb-flap { color: var(--ink); }

      .mb-scroll-x::-webkit-scrollbar { height: 6px; }
      .mb-scroll-x::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }

      .mb-skel {
        background: linear-gradient(90deg, var(--surface2) 25%, #222c37 37%, var(--surface2) 63%);
        background-size: 400% 100%;
        animation: mbShimmer 1.4s ease infinite;
      }
      @keyframes mbShimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

      @keyframes mbFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      .mb-fade-up { animation: mbFadeUp .5s ease both; }

      @media (prefers-reduced-motion: reduce) {
        .mb-fade-up, .mb-card, .mb-btn-primary, .mb-btn-whistle { animation: none !important; transition: none !important; }
      }

      .mb-focus:focus-visible { outline: 2px solid var(--court); outline-offset: 2px; }
    `}</style>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function Navbar({ view, setView, user, onAuthOpen }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "sports", label: "Sports" },
    { id: "venue", label: "Venue" },
    { id: "about", label: "About" },
  ];
  return (
    <div className="mb-glass sticky top-0 z-40" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <button onClick={() => setView("home")} className="flex items-center gap-2 mb-focus" aria-label="MatchBook Arena home">
          <div className="w-8 h-8 rounded-md flex items-center justify-center f-display font-bold" style={{ background: "linear-gradient(135deg, var(--court), var(--turf))" }}>M</div>
          <span className="f-display font-bold text-lg tracking-tight">MATCHBOOK</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.id} onClick={() => setView(l.id)} className={`mb-focus px-4 py-2 rounded-full text-sm font-medium transition-colors`} style={{ color: view === l.id ? "#fff" : "var(--ink-mute)", background: view === l.id ? "rgba(61,124,255,0.14)" : "transparent" }}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button onClick={() => setView("dashboard")} className="mb-btn-ghost px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 mb-focus">
              <UserIcon size={16} /> {user.name.split(" ")[0]}
            </button>
          ) : (
            <button onClick={onAuthOpen} className="mb-btn-ghost px-4 py-2 rounded-full text-sm font-medium mb-focus">Log in</button>
          )}
          <button onClick={() => setView("booking")} className="mb-btn-primary px-5 py-2 rounded-full text-sm font-semibold mb-focus">Book Now</button>
        </div>

        <button className="md:hidden mb-focus" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-1" style={{ borderTop: "1px solid var(--line)" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => { setView(l.id); setOpen(false); }} className="text-left px-2 py-3 text-sm font-medium mb-focus" style={{ color: view === l.id ? "#fff" : "var(--ink-mute)" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { user ? setView("dashboard") : onAuthOpen(); setOpen(false); }} className="text-left px-2 py-3 text-sm font-medium mb-focus">
            {user ? "My Dashboard" : "Log in"}
          </button>
          <button onClick={() => { setView("booking"); setOpen(false); }} className="mb-btn-primary mt-2 px-4 py-3 rounded-full text-sm font-semibold text-center mb-focus">Book Now</button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Home ---------------------------------- */

function Hero({ setView }) {
  const tickerItems = ["FOOTBALL 18:30 OPEN", "CRICKET 20:00 OPEN", "BADMINTON 07:00 2 LEFT", "TENNIS 17:00 OPEN"];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 mb-glow-court" />
      <div className="absolute inset-0 mb-glow-turf" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 relative">
        <div className="mb-fade-up flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--turf)" }} />
          <span className="text-xs f-mono tracking-widest" style={{ color: "var(--ink-mute)" }}>LIVE SLOT BOARD</span>
        </div>

        <div className="mb-fade-up mb-8 overflow-hidden max-w-full">
          <Matchboard text={tickerItems[0]} tone="turf" />
        </div>

        <h1 className="mb-fade-up f-display font-bold leading-[1.02] text-[13vw] sm:text-6xl lg:text-7xl max-w-4xl">
          Your game.<br />Your time. <span style={{ color: "var(--court)" }}>Booked.</span>
        </h1>
        <p className="mb-fade-up mt-6 max-w-xl text-base sm:text-lg" style={{ color: "var(--ink-mute)" }}>
          Seven sports, real floodlit turf and courts, and a booking board that updates live — no double-bookings, no phone calls, no waiting on hold.
        </p>

        <div className="mb-fade-up mt-9 flex flex-wrap gap-4">
          <button onClick={() => setView("booking")} className="mb-btn-primary px-7 py-3.5 rounded-full font-semibold flex items-center gap-2 mb-focus">
            Book a slot <ArrowRight size={18} />
          </button>
          <button onClick={() => setView("sports")} className="mb-btn-ghost px-7 py-3.5 rounded-full font-semibold mb-focus">
            Browse sports
          </button>
        </div>

        <div className="mb-fade-up mt-14 grid grid-cols-3 gap-6 max-w-lg">
          {[["7", "sports on-site"], ["4.8", "avg. rating"], ["24hr", "slot booking"]].map(([n, l]) => (
            <div key={l}>
              <div className="f-display font-bold text-3xl">{n}</div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-mute)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryStrip({ setView, setPreselectSport }) {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
      <div className="flex gap-3 overflow-x-auto mb-scroll-x pb-2">
        {SPORTS.map(s => (
          <button key={s.id} onClick={() => { setPreselectSport(s.id); setView("sports"); }} className="mb-pill mb-focus shrink-0 px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2">
            <span>{s.icon}</span>{s.name}
          </button>
        ))}
      </div>
    </section>
  );
}

function FeaturedGrounds({ setView, setPreselectSport }) {
  const featured = SPORTS.slice(0, 3);
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs f-mono tracking-widest" style={{ color: "var(--turf)" }}>FEATURED</span>
          <h2 className="f-display font-bold text-3xl mt-1">Grounds worth the drive</h2>
        </div>
        <button onClick={() => setView("sports")} className="hidden sm:flex items-center gap-1 text-sm font-medium mb-focus" style={{ color: "var(--court)" }}>
          View all <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map(s => (
          <div key={s.id} className="mb-card rounded-2xl p-6">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="f-display font-semibold text-xl">{s.name}</h3>
            <p className="text-sm mt-2" style={{ color: "var(--ink-mute)" }}>{s.desc}</p>
            <div className="flex items-center justify-between mt-6">
              <span className="f-mono font-semibold" style={{ color: "var(--turf)" }}>{currency(s.price)}<span className="text-xs" style={{ color: "var(--ink-mute)" }}>/slot</span></span>
              <button onClick={() => { setPreselectSport(s.id); setView("booking"); }} className="mb-btn-ghost px-4 py-2 rounded-full text-xs font-semibold mb-focus">Book</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tournaments() {
  const items = [
    { name: "Monsoon Football Cup", date: "12–14 Jul 2026", fee: 4500 },
    { name: "Weekend Badminton Open", date: "19 Jul 2026", fee: 800 },
    { name: "Night Cricket Premier League", date: "25 Jul – 2 Aug 2026", fee: 6000 },
  ];
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--whistle)" }}>UPCOMING</span>
      <h2 className="f-display font-bold text-3xl mt-1 mb-8">Tournaments</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {items.map(t => (
          <div key={t.name} className="mb-card rounded-2xl p-6 flex flex-col">
            <Trophy size={22} style={{ color: "var(--whistle)" }} />
            <h3 className="f-display font-semibold text-lg mt-3">{t.name}</h3>
            <div className="text-sm mt-1" style={{ color: "var(--ink-mute)" }}>{t.date}</div>
            <div className="mt-auto pt-5 flex items-center justify-between">
              <span className="f-mono text-sm">{currency(t.fee)} entry</span>
              <button className="mb-btn-whistle px-4 py-2 rounded-full text-xs font-semibold mb-focus">Register</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Memberships({ setView }) {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--court)" }}>MEMBERSHIP</span>
      <h2 className="f-display font-bold text-3xl mt-1 mb-8">Play more, pay less</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {MEMBERSHIPS.map(m => (
          <div key={m.name} className="rounded-2xl p-7 relative" style={{ background: m.featured ? "linear-gradient(160deg, rgba(61,124,255,0.16), var(--surface2))" : "var(--surface2)", border: `1px solid ${m.featured ? "var(--court)" : "var(--line)"}` }}>
            {m.featured && <span className="absolute -top-3 left-7 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--court)" }}>Most popular</span>}
            <h3 className="f-display font-semibold text-xl">{m.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="f-mono font-bold text-3xl">{currency(m.price)}</span>
              <span className="text-sm" style={{ color: "var(--ink-mute)" }}>{m.period}</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {m.perks.map(p => (
                <li key={p} className="text-sm flex items-start gap-2" style={{ color: "var(--ink-mute)" }}>
                  <Check size={16} style={{ color: "var(--turf)", marginTop: 2, flexShrink: 0 }} /> {p}
                </li>
              ))}
            </ul>
            <button onClick={() => setView("booking")} className={`mt-7 w-full py-2.5 rounded-full text-sm font-semibold mb-focus ${m.featured ? "mb-btn-primary" : "mb-btn-ghost"}`}>Choose {m.name}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { icon: Zap, title: "Live availability", text: "The slot board updates in real time — what you see is what you get, no overbooking." },
    { icon: ShieldCheck, title: "Secure payments", text: "Every payment is verified server-side before your slot is confirmed." },
    { icon: Trophy, title: "Tournament-grade turf", text: "The same surfaces used for our monthly leagues, maintained weekly." },
    { icon: QrCode, title: "QR check-in", text: "Skip the front desk — scan in and your slot is verified in seconds." },
  ];
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <h2 className="f-display font-bold text-3xl mb-8">Why players come back</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="p-6 rounded-2xl mb-card">
            <Icon size={22} style={{ color: "var(--court)" }} />
            <h3 className="f-display font-semibold mt-4">{title}</h3>
            <p className="text-sm mt-2" style={{ color: "var(--ink-mute)" }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <h2 className="f-display font-bold text-3xl mb-8">What players say</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.name} className="mb-card rounded-2xl p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill={i < t.rating ? "var(--whistle)" : "none"} stroke="var(--whistle)" />
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--ink-mute)" }}>"{t.text}"</p>
            <div className="mt-4 text-sm font-semibold">{t.name} <span className="font-normal" style={{ color: "var(--ink-mute)" }}>· {t.sport}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GallerySection() {
  const [active, setActive] = useState(null);
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <h2 className="f-display font-bold text-3xl mb-8">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {GALLERY.map((g, i) => (
          <button key={i} onClick={() => setActive(i)} className="mb-focus aspect-square rounded-xl flex items-end p-3 text-left" style={{ background: `linear-gradient(155deg, ${["#3D7CFF33","#1FCB6E33","#FF7A2E33"][i % 3]}, var(--surface2))`, border: "1px solid var(--line)" }}>
            <span className="text-xs" style={{ color: "var(--ink-mute)" }}>{g}</span>
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(5,7,10,0.85)" }} onClick={() => setActive(null)}>
          <div className="mb-card rounded-2xl p-10 max-w-lg text-center" onClick={e => e.stopPropagation()}>
            <ImageIcon size={40} style={{ color: "var(--court)", margin: "0 auto" }} />
            <p className="mt-4 font-medium">{GALLERY[active]}</p>
            <p className="text-xs mt-1" style={{ color: "var(--ink-mute)" }}>Lightbox preview — connect gallery media in production.</p>
            <button onClick={() => setActive(null)} className="mb-btn-ghost mt-6 px-5 py-2 rounded-full text-sm mb-focus">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <h2 className="f-display font-bold text-3xl mb-8">Frequently asked</h2>
      <div className="max-w-2xl space-y-3">
        {FAQS.map((f, i) => (
          <div key={f.q} className="mb-card rounded-xl overflow-hidden">
            <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 text-left mb-focus">
              <span className="font-medium text-sm">{f.q}</span>
              <ChevronDown size={16} style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
            </button>
            {openIdx === i && <p className="px-5 pb-4 text-sm" style={{ color: "var(--ink-mute)" }}>{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
      <h2 className="f-display font-bold text-3xl mb-8">Get in touch</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[[Phone, "Call us", "+91 98765 43210"], [MessageCircle, "WhatsApp", "+91 98765 43210"], [MapPin, "Visit", "Sector 62, Noida, UP"]].map(([Icon, l, v]) => (
            <div key={l} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--surface2)", border: "1px solid var(--line)" }}><Icon size={17} /></div>
              <div><div className="text-xs" style={{ color: "var(--ink-mute)" }}>{l}</div><div className="text-sm font-medium">{v}</div></div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <a href="#" className="mb-btn-ghost w-10 h-10 rounded-full flex items-center justify-center mb-focus"><Instagram size={17} /></a>
            <a href="#" className="mb-btn-ghost w-10 h-10 rounded-full flex items-center justify-center mb-focus"><Facebook size={17} /></a>
          </div>
        </div>
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="mb-card rounded-2xl p-6 space-y-3">
          {sent ? (
            <div className="text-center py-6">
              <CircleCheck size={30} style={{ color: "var(--turf)", margin: "0 auto" }} />
              <p className="mt-3 font-medium">Message sent</p>
              <p className="text-sm" style={{ color: "var(--ink-mute)" }}>We'll get back to you within a day.</p>
            </div>
          ) : (
            <>
              <input required placeholder="Your name" className="mb-focus w-full px-4 py-2.5 rounded-lg text-sm" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
              <input required placeholder="Mobile number" className="mb-focus w-full px-4 py-2.5 rounded-lg text-sm" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
              <textarea required placeholder="Message" rows={3} className="mb-focus w-full px-4 py-2.5 rounded-lg text-sm resize-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
              <button type="submit" className="mb-btn-primary w-full py-2.5 rounded-lg text-sm font-semibold mb-focus">Send message</button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function HomeView({ setView, setPreselectSport }) {
  return (
    <>
      <Hero setView={setView} />
      <CategoryStrip setView={setView} setPreselectSport={setPreselectSport} />
      <FeaturedGrounds setView={setView} setPreselectSport={setPreselectSport} />
      <Tournaments />
      <Memberships setView={setView} />
      <WhyChooseUs />
      <TestimonialsSection />
      <GallerySection />
      <FaqSection />
      <ContactSection />
    </>
  );
}

/* -------------------------------- About view ------------------------------ */

function AboutView() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--court)" }}>ABOUT</span>
      <h1 className="f-display font-bold text-4xl mt-2 mb-6">Built for people who actually play</h1>
      <p className="max-w-2xl" style={{ color: "var(--ink-mute)" }}>
        MatchBook Arena opened as a single turf and grew into a seven-sport complex because the neighborhood kept asking for more courts. We still run it the way we started: fair slot pricing, real maintenance schedules, and a booking system that never overcommits a ground.
      </p>
      <div className="grid sm:grid-cols-3 gap-6 mt-12">
        {[["Mission", "Make quality sports facilities bookable in under a minute, for anyone."], ["Vision", "Become the default sports venue for every serious weekend player in the city."], ["History", "Founded from one turf in 2019, now seven sports across seven acres."]].map(([t, d]) => (
          <div key={t} className="mb-card rounded-2xl p-6">
            <h3 className="f-display font-semibold text-lg">{t}</h3>
            <p className="text-sm mt-2" style={{ color: "var(--ink-mute)" }}>{d}</p>
          </div>
        ))}
      </div>
      <h2 className="f-display font-bold text-2xl mt-16 mb-6">Facilities</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AMENITIES.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="mb-card rounded-xl p-5 flex items-start gap-3">
            <Icon size={20} style={{ color: "var(--turf)", flexShrink: 0, marginTop: 2 }} />
            <div><div className="font-medium text-sm">{label}</div><div className="text-xs mt-0.5" style={{ color: "var(--ink-mute)" }}>{detail}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Sports view ------------------------------ */

function SportsView({ setView, setPreselectSport }) {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--court)" }}>ALL SPORTS</span>
      <h1 className="f-display font-bold text-4xl mt-2 mb-10">Pick your sport</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPORTS.map(s => (
          <div key={s.id} className="mb-card rounded-2xl p-6 flex flex-col">
            <div className="text-4xl">{s.icon}</div>
            <h3 className="f-display font-semibold text-xl mt-4">{s.name}</h3>
            <p className="text-sm mt-2" style={{ color: "var(--ink-mute)" }}>{s.desc}</p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs" style={{ color: "var(--ink-mute)" }}>
              <div className="flex items-center gap-1.5"><Users size={13} /> {s.capacity}</div>
              <div className="flex items-center gap-1.5"><Clock size={13} /> {s.duration}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {s.slots.slice(0, 4).map(t => <span key={t} className="f-mono text-[11px] px-2 py-1 rounded" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink-mute)" }}>{t}</span>)}
            </div>
            <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid var(--line)" }}>
              <span className="f-mono font-semibold" style={{ color: "var(--turf)" }}>{currency(s.price)}</span>
              <button onClick={() => { setPreselectSport(s.id); setView("booking"); }} className="mb-btn-primary px-5 py-2 rounded-full text-xs font-semibold mb-focus">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Venue view ------------------------------- */

function VenueView() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--court)" }}>VENUE</span>
      <h1 className="f-display font-bold text-4xl mt-2 mb-10">Find us, know before you go</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="mb-card rounded-2xl overflow-hidden aspect-video flex items-center justify-center" style={{ background: "linear-gradient(155deg, #3D7CFF22, var(--surface2))" }}>
          <div className="text-center">
            <MapPin size={30} style={{ color: "var(--court)", margin: "0 auto" }} />
            <p className="mt-3 text-sm" style={{ color: "var(--ink-mute)" }}>Map embed placeholder — plug in Google Maps embed URL in production</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--ink-mute)" }}>Address</h3>
            <p className="mt-1">MatchBook Arena, Plot 14, Sector 62, Noida, Uttar Pradesh 201309</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--ink-mute)" }}>Opening hours</h3>
            <p className="mt-1 f-mono text-sm">05:30 – 23:00, all days</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--ink-mute)" }}>Emergency contact</h3>
            <p className="mt-1 f-mono text-sm">+91 98765 43210</p>
          </div>
        </div>
      </div>
      <h2 className="f-display font-bold text-2xl mt-14 mb-6">On-site facilities</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AMENITIES.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="mb-card rounded-xl p-5 flex items-start gap-3">
            <Icon size={20} style={{ color: "var(--court)", flexShrink: 0, marginTop: 2 }} />
            <div><div className="font-medium text-sm">{label}</div><div className="text-xs mt-0.5" style={{ color: "var(--ink-mute)" }}>{detail}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Auth modal -------------------------------- */

function AuthModal({ onClose, onAuthed }) {
  const [stage, setStage] = useState("phone"); // phone -> otp -> profile
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const isReturning = phone === "9876543210"; // demo returning-user shortcut

  function sendOtp(e) {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setError(""); setSending(true);
    setTimeout(() => { setSending(false); setStage("otp"); }, 700);
  }
  function verifyOtp(e) {
    e.preventDefault();
    if (otp !== "1234") { setError("Incorrect OTP — use 1234 for this prototype"); return; }
    setError("");
    if (isReturning) {
      onAuthed({ name: "Rohan Verma", phone, age: 27, gender: "Male" });
    } else {
      setStage("profile");
    }
  }
  function completeProfile(e) {
    e.preventDefault();
    if (!name || !age || !gender) { setError("Please fill in all fields"); return; }
    onAuthed({ name, phone, age, gender });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5" style={{ background: "rgba(5,7,10,0.85)" }} onClick={onClose}>
      <div className="mb-card rounded-2xl w-full max-w-sm p-7 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 mb-focus" aria-label="Close"><X size={18} style={{ color: "var(--ink-mute)" }} /></button>

        {stage === "phone" && (
          <form onSubmit={sendOtp}>
            <h2 className="f-display font-bold text-xl">Log in to book</h2>
            <p className="text-sm mt-1" style={{ color: "var(--ink-mute)" }}>We'll text you a one-time code — no password needed.</p>
            <label className="block mt-6 text-xs font-medium" style={{ color: "var(--ink-mute)" }}>Mobile number</label>
            <div className="flex items-center gap-2 mt-1.5 px-4 py-3 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
              <span className="f-mono text-sm" style={{ color: "var(--ink-mute)" }}>+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" className="mb-focus f-mono bg-transparent flex-1 outline-none text-sm" style={{ color: "var(--ink)" }} />
            </div>
            {error && <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--whistle)" }}><AlertCircle size={13} /> {error}</p>}
            <button type="submit" disabled={sending} className="mb-btn-primary w-full mt-5 py-3 rounded-full text-sm font-semibold mb-focus">{sending ? "Sending code…" : "Send OTP"}</button>
            <p className="text-[11px] mt-4 text-center" style={{ color: "var(--ink-mute)" }}>Demo: try 9876543210 for a returning-user login</p>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={verifyOtp}>
            <h2 className="f-display font-bold text-xl">Enter the code</h2>
            <p className="text-sm mt-1" style={{ color: "var(--ink-mute)" }}>Sent to +91 {phone}. (Prototype code: 1234)</p>
            <input value={otp} onChange={e => setOtp(e.target.value)} maxLength={4} placeholder="• • • •" className="mb-focus f-mono w-full mt-6 px-4 py-3 rounded-lg text-center text-2xl tracking-[0.5em] outline-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
            {error && <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--whistle)" }}><AlertCircle size={13} /> {error}</p>}
            <button type="submit" className="mb-btn-primary w-full mt-5 py-3 rounded-full text-sm font-semibold mb-focus">Verify & continue</button>
            <button type="button" onClick={() => setStage("phone")} className="w-full mt-3 text-xs mb-focus" style={{ color: "var(--ink-mute)" }}>Change number</button>
          </form>
        )}

        {stage === "profile" && (
          <form onSubmit={completeProfile}>
            <h2 className="f-display font-bold text-xl">Just a few details</h2>
            <p className="text-sm mt-1" style={{ color: "var(--ink-mute)" }}>First time here — this takes 20 seconds.</p>
            <div className="space-y-3 mt-6">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="mb-focus w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
              <div className="flex gap-3">
                <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" type="number" className="mb-focus w-1/2 px-4 py-3 rounded-lg text-sm outline-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
                <select value={gender} onChange={e => setGender(e.target.value)} className="mb-focus w-1/2 px-4 py-3 rounded-lg text-sm outline-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }}>
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            {error && <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--whistle)" }}><AlertCircle size={13} /> {error}</p>}
            <button type="submit" className="mb-btn-primary w-full mt-5 py-3 rounded-full text-sm font-semibold mb-focus">Create account</button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Booking flow -------------------------------- */

function BookingFlow({ preselectSport, user, onAuthOpen, bookings, setBookings }) {
  const [step, setStep] = useState(1);
  const [sportId, setSportId] = useState(preselectSport || SPORTS[0].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [players, setPlayers] = useState(2);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paying, setPaying] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => { if (preselectSport) setSportId(preselectSport); }, [preselectSport]);

  const sport = SPORTS.find(s => s.id === sportId);
  const bookedSlots = useMemo(() =>
    bookings.filter(b => b.sportId === sportId && b.date === date).map(b => b.slot),
  [bookings, sportId, date]);

  const discount = couponApplied ? 0.1 : 0;
  const subtotal = sport.price;
  const total = Math.round(subtotal * (1 - discount));

  const todayISO = new Date().toISOString().slice(0, 10);
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  function applyCoupon(e) {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "MATCH10") setCouponApplied(true);
  }

  function pay() {
    setPaying(true);
    setTimeout(() => {
      const booking = {
        id: genBookingId(),
        sportId, sportName: sport.name, date, slot, players, total,
        userName: user.name, status: "Confirmed",
      };
      setBookings(prev => [...prev, booking]);
      setConfirmedBooking(booking);
      setPaying(false);
      setStep(6);
    }, 1400);
  }

  const steps = ["Sport", "Date", "Slot", "Summary", "Payment", "Done"];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--court)" }}>BOOK A SLOT</span>
      <h1 className="f-display font-bold text-4xl mt-2 mb-8">Reserve your ground</h1>

      <div className="flex items-center gap-2 mb-10 overflow-x-auto mb-scroll-x pb-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs f-mono font-semibold" style={{ background: step > i ? "var(--turf)" : step === i + 1 ? "var(--court)" : "var(--surface2)", border: step <= i + 1 ? "1px solid var(--line)" : "none" }}>
              {step > i + 1 ? <Check size={13} /> : i + 1}
            </div>
            <span className="text-xs" style={{ color: step === i + 1 ? "var(--ink)" : "var(--ink-mute)" }}>{s}</span>
            {i < steps.length - 1 && <div className="w-6 h-px" style={{ background: "var(--line)" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="f-display font-semibold text-xl mb-5">Choose your sport</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {SPORTS.map(s => (
              <button key={s.id} onClick={() => setSportId(s.id)} className="mb-pill mb-focus rounded-xl p-4 text-left" data-active={sportId === s.id}>
                <div className="text-2xl">{s.icon}</div>
                <div className="font-medium text-sm mt-2">{s.name}</div>
                <div className="f-mono text-xs mt-1" style={{ color: "var(--turf)" }}>{currency(s.price)}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="mb-btn-primary mt-8 px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus">Continue <ChevronRight size={16} /></button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="f-display font-semibold text-xl mb-5">Pick a date</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {dateOptions.map(d => {
              const dt = new Date(d);
              return (
                <button key={d} onClick={() => setDate(d)} className="mb-pill mb-focus rounded-xl py-3 text-center" data-active={date === d}>
                  <div className="text-[10px]" style={{ color: "var(--ink-mute)" }}>{dt.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="f-mono font-semibold text-sm mt-1">{dt.getDate()}</div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(1)} className="mb-btn-ghost px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus"><ChevronLeft size={16} /> Back</button>
            <button disabled={!date} onClick={() => setStep(3)} className="mb-btn-primary px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus disabled:opacity-40">Continue <ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="f-display font-semibold text-xl mb-2">Pick a time slot</h2>
          <p className="text-sm mb-5" style={{ color: "var(--ink-mute)" }}>Live availability for {sport.name} on {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {sport.slots.map(t => {
              const taken = bookedSlots.includes(t);
              return (
                <button key={t} disabled={taken} onClick={() => setSlot(t)} className="mb-pill mb-focus rounded-xl py-3 f-mono text-sm disabled:opacity-30 disabled:cursor-not-allowed" data-active={slot === t}>
                  {t}
                  {taken && <div className="text-[9px] mt-0.5">BOOKED</div>}
                </button>
              );
            })}
          </div>
          <div className="mt-6">
            <label className="text-xs font-medium" style={{ color: "var(--ink-mute)" }}>Number of players</label>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => setPlayers(p => Math.max(1, p - 1))} className="mb-btn-ghost w-9 h-9 rounded-full mb-focus">−</button>
              <span className="f-mono w-8 text-center">{players}</span>
              <button onClick={() => setPlayers(p => p + 1)} className="mb-btn-ghost w-9 h-9 rounded-full mb-focus">+</button>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(2)} className="mb-btn-ghost px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus"><ChevronLeft size={16} /> Back</button>
            <button disabled={!slot} onClick={() => setStep(4)} className="mb-btn-primary px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus disabled:opacity-40">Continue <ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="f-display font-semibold text-xl mb-5">Booking summary</h2>
          <div className="mb-card rounded-2xl p-6">
            <Matchboard text={`${sport.name.toUpperCase().slice(0,8)} ${slot}`} tone="court" />
            <div className="mt-5 space-y-3 text-sm">
              {[["Sport", sport.name], ["Date", new Date(date).toDateString()], ["Slot", slot + " · " + sport.duration], ["Players", players]].map(([l, v]) => (
                <div key={l} className="flex justify-between"><span style={{ color: "var(--ink-mute)" }}>{l}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
            <form onSubmit={applyCoupon} className="flex gap-2 mt-5">
              <input value={coupon} onChange={e => setCoupon(e.target.value)} disabled={couponApplied} placeholder="Coupon code (try MATCH10)" className="mb-focus flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
              <button type="submit" disabled={couponApplied} className="mb-btn-ghost px-4 py-2 rounded-lg text-xs font-semibold mb-focus">{couponApplied ? "Applied" : "Apply"}</button>
            </form>
            <div className="mt-5 pt-5 space-y-2 text-sm" style={{ borderTop: "1px solid var(--line)" }}>
              <div className="flex justify-between"><span style={{ color: "var(--ink-mute)" }}>Subtotal</span><span className="f-mono">{currency(subtotal)}</span></div>
              {couponApplied && <div className="flex justify-between"><span style={{ color: "var(--turf)" }}>MATCH10 discount</span><span className="f-mono" style={{ color: "var(--turf)" }}>−{currency(Math.round(subtotal * 0.1))}</span></div>}
              <div className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span className="f-mono">{currency(total)}</span></div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(3)} className="mb-btn-ghost px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus"><ChevronLeft size={16} /> Back</button>
            <button onClick={() => user ? setStep(5) : onAuthOpen()} className="mb-btn-primary px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus">
              {user ? "Proceed to payment" : "Log in to pay"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="f-display font-semibold text-xl mb-5">Payment</h2>
          <div className="mb-card rounded-2xl p-6 max-w-md">
            <div className="flex items-center gap-2 mb-5">
              <Wallet size={18} style={{ color: "var(--court)" }} />
              <span className="font-medium text-sm">Razorpay secure checkout</span>
            </div>
            <p className="text-xs" style={{ color: "var(--ink-mute)" }}>UPI · Cards · Net Banking · Wallets — this prototype simulates the checkout; a production build verifies payment_id and signature server-side before confirming.</p>
            <div className="flex justify-between items-center mt-6 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
              <span className="text-sm" style={{ color: "var(--ink-mute)" }}>Amount payable</span>
              <span className="f-mono font-bold text-xl">{currency(total)}</span>
            </div>
            <button onClick={pay} disabled={paying} className="mb-btn-whistle w-full mt-6 py-3 rounded-full text-sm font-semibold mb-focus">
              {paying ? "Verifying payment…" : `Pay ${currency(total)}`}
            </button>
          </div>
          {!paying && (
            <button onClick={() => setStep(4)} className="mb-btn-ghost mt-6 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus"><ChevronLeft size={16} /> Back</button>
          )}
        </div>
      )}

      {step === 6 && confirmedBooking && (
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(31,203,110,0.15)" }}>
            <Check size={28} style={{ color: "var(--turf)" }} />
          </div>
          <h2 className="f-display font-bold text-2xl mt-5">Booking confirmed</h2>
          <p className="text-sm mt-1" style={{ color: "var(--ink-mute)" }}>Show this QR at the front desk to check in.</p>
          <div className="mb-card rounded-2xl p-6 mt-6 flex flex-col items-center">
            <QrGlyph seed={confirmedBooking.id} />
            <div className="f-mono text-xs mt-4" style={{ color: "var(--ink-mute)" }}>{confirmedBooking.id}</div>
            <div className="w-full mt-5 pt-5 space-y-2 text-sm text-left" style={{ borderTop: "1px solid var(--line)" }}>
              <div className="flex justify-between"><span style={{ color: "var(--ink-mute)" }}>Sport</span><span>{confirmedBooking.sportName}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--ink-mute)" }}>Date</span><span>{new Date(confirmedBooking.date).toDateString()}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--ink-mute)" }}>Slot</span><span className="f-mono">{confirmedBooking.slot}</span></div>
              <div className="flex justify-between font-semibold"><span>Paid</span><span className="f-mono">{currency(confirmedBooking.total)}</span></div>
            </div>
          </div>
          <button className="mb-btn-ghost mt-6 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 mx-auto mb-focus"><Download size={16} /> Download invoice</button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ User dashboard ------------------------------ */

function UserDashboard({ user, bookings, setBookings, onLogout }) {
  const myBookings = bookings.filter(b => b.userName === user.name);
  function cancel(id) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
  }
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-xs f-mono tracking-widest" style={{ color: "var(--court)" }}>DASHBOARD</span>
          <h1 className="f-display font-bold text-3xl mt-1">Hey, {user.name.split(" ")[0]}</h1>
        </div>
        <button onClick={onLogout} className="mb-btn-ghost px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 mb-focus"><LogOut size={15} /> Log out</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[["Upcoming", myBookings.filter(b => b.status === "Confirmed").length], ["Total bookings", myBookings.length], ["Member since", "2026"]].map(([l, v]) => (
          <div key={l} className="mb-card rounded-xl p-5">
            <div className="text-xs" style={{ color: "var(--ink-mute)" }}>{l}</div>
            <div className="f-display font-bold text-2xl mt-1">{v}</div>
          </div>
        ))}
      </div>

      <h2 className="f-display font-semibold text-xl mb-4">Your bookings</h2>
      {myBookings.length === 0 ? (
        <div className="mb-card rounded-2xl p-10 text-center">
          <CalendarIcon size={26} style={{ color: "var(--ink-mute)", margin: "0 auto" }} />
          <p className="mt-3 text-sm" style={{ color: "var(--ink-mute)" }}>No bookings yet — head to Book Now to reserve your first slot.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myBookings.map(b => (
            <div key={b.id} className="mb-card rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-medium text-sm">{b.sportName} · {new Date(b.date).toDateString()}</div>
                <div className="f-mono text-xs mt-1" style={{ color: "var(--ink-mute)" }}>{b.slot} · {b.id} · {currency(b.total)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: b.status === "Confirmed" ? "rgba(31,203,110,0.15)" : "rgba(255,122,46,0.15)", color: b.status === "Confirmed" ? "var(--turf)" : "var(--whistle)" }}>{b.status}</span>
                {b.status === "Confirmed" && <button onClick={() => cancel(b.id)} className="mb-btn-ghost px-3 py-1.5 rounded-full text-xs mb-focus">Cancel</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Admin dashboard ------------------------------ */

function AdminDashboard({ bookings }) {
  const [tab, setTab] = useState("overview");
  const revenue = bookings.filter(b => b.status === "Confirmed").reduce((s, b) => s + b.total, 0);
  const tabs = [["overview", "Overview", BarChart3], ["sports", "Sports", Dumbbell], ["bookings", "Bookings", CalendarCheck], ["gallery", "Gallery", ImageIcon], ["announce", "Announcements", Megaphone]];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
      <span className="text-xs f-mono tracking-widest" style={{ color: "var(--whistle)" }}>ADMIN</span>
      <h1 className="f-display font-bold text-3xl mt-1 mb-8 flex items-center gap-2"><LayoutDashboard size={26} /> Control panel</h1>

      <div className="flex gap-2 mb-8 overflow-x-auto mb-scroll-x pb-1">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className="mb-pill mb-focus shrink-0 px-4 py-2 rounded-full text-sm flex items-center gap-2" data-active={tab === id}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid sm:grid-cols-4 gap-4">
          {[["Revenue", currency(revenue), TrendingUp, "turf"], ["Bookings", bookings.length, CalendarCheck, "court"], ["Sports listed", SPORTS.length, Dumbbell, "whistle"], ["Avg rating", "4.8", Star, "turf"]].map(([l, v, Icon, c]) => (
            <div key={l} className="mb-card rounded-xl p-5">
              <Icon size={18} style={{ color: `var(--${c})` }} />
              <div className="f-display font-bold text-2xl mt-3">{v}</div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-mute)" }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "sports" && (
        <div className="space-y-3">
          {SPORTS.map(s => (
            <div key={s.id} className="mb-card rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="f-mono text-xs mt-0.5" style={{ color: "var(--ink-mute)" }}>{currency(s.price)} · {s.slots.length} slots/day</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="mb-btn-ghost w-8 h-8 rounded-full flex items-center justify-center mb-focus"><Edit3 size={14} /></button>
                <button className="mb-btn-ghost w-8 h-8 rounded-full flex items-center justify-center mb-focus"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          <button className="mb-btn-primary px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 mb-focus"><Plus size={16} /> Add sport</button>
        </div>
      )}

      {tab === "bookings" && (
        bookings.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-mute)" }}>No bookings yet — they'll appear here as customers book slots.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="mb-card rounded-lg p-4 flex items-center justify-between flex-wrap gap-2 text-sm">
                <span className="f-mono text-xs" style={{ color: "var(--ink-mute)" }}>{b.id}</span>
                <span>{b.sportName}</span>
                <span style={{ color: "var(--ink-mute)" }}>{b.userName}</span>
                <span className="f-mono">{b.slot}</span>
                <span className="f-mono">{currency(b.total)}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: b.status === "Confirmed" ? "rgba(31,203,110,0.15)" : "rgba(255,122,46,0.15)", color: b.status === "Confirmed" ? "var(--turf)" : "var(--whistle)" }}>{b.status}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "gallery" && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {GALLERY.map(g => (
            <div key={g} className="mb-card rounded-lg aspect-square flex items-center justify-center p-3 text-center text-xs" style={{ color: "var(--ink-mute)" }}>{g}</div>
          ))}
          <button className="mb-btn-ghost rounded-lg aspect-square flex flex-col items-center justify-center gap-2 text-xs mb-focus"><Plus size={18} /> Upload</button>
        </div>
      )}

      {tab === "announce" && (
        <div className="mb-card rounded-xl p-6 max-w-lg">
          <textarea placeholder="Write an announcement for all users…" rows={3} className="mb-focus w-full px-4 py-3 rounded-lg text-sm resize-none outline-none" style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }} />
          <button className="mb-btn-primary mt-4 px-5 py-2.5 rounded-full text-sm font-semibold mb-focus">Publish announcement</button>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Footer ---------------------------------- */

function Footer({ setView }) {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center f-display font-bold text-sm" style={{ background: "linear-gradient(135deg, var(--court), var(--turf))" }}>M</div>
            <span className="f-display font-bold">MATCHBOOK</span>
          </div>
          <p className="text-xs mt-3 max-w-xs" style={{ color: "var(--ink-mute)" }}>Seven sports, one booking board. Sector 62, Noida.</p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="space-y-2">
            <div className="font-medium mb-1">Explore</div>
            {["home", "sports", "venue", "about"].map(v => (
              <button key={v} onClick={() => setView(v)} className="block mb-focus" style={{ color: "var(--ink-mute)" }}>{v[0].toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
          <div className="space-y-2">
            <div className="font-medium mb-1">Contact</div>
            <div style={{ color: "var(--ink-mute)" }}>+91 98765 43210</div>
            <div style={{ color: "var(--ink-mute)" }}>hello@matchbookarena.in</div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs py-5" style={{ color: "var(--ink-mute)", borderTop: "1px solid var(--line)" }}>© 2026 MatchBook Arena. Prototype build.</div>
    </footer>
  );
}

/* ----------------------------------- App ------------------------------------ */

export default function App() {
  const [view, setView] = useState("home");
  const [preselectSport, setPreselectSport] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const handleAuthed = useCallback((u) => {
    setUser(u);
    setAuthOpen(false);
    setView(v => (v === "booking" ? "booking" : v));
  }, []);

  return (
    <div className="mb-root">
      <GlobalStyles />
      <Navbar view={view} setView={setView} user={user} onAuthOpen={() => setAuthOpen(true)} />

      {view === "home" && <HomeView setView={setView} setPreselectSport={setPreselectSport} />}
      {view === "about" && <AboutView />}
      {view === "sports" && <SportsView setView={setView} setPreselectSport={setPreselectSport} />}
      {view === "venue" && <VenueView />}
      {view === "booking" && (
        <BookingFlow preselectSport={preselectSport} user={user} onAuthOpen={() => setAuthOpen(true)} bookings={bookings} setBookings={setBookings} />
      )}
      {view === "dashboard" && (
        user ? <UserDashboard user={user} bookings={bookings} setBookings={setBookings} onLogout={() => { setUser(null); setView("home"); }} />
             : <div className="max-w-md mx-auto px-5 py-24 text-center"><p style={{ color: "var(--ink-mute)" }}>Log in to view your dashboard.</p><button onClick={() => setAuthOpen(true)} className="mb-btn-primary mt-5 px-6 py-3 rounded-full text-sm font-semibold mb-focus">Log in</button></div>
      )}
      {view === "admin" && <AdminDashboard bookings={bookings} />}

      <Footer setView={setView} />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuthed={handleAuthed} />}

      {/* Prototype-only admin access shortcut */}
      <button onClick={() => setView("admin")} className="fixed bottom-5 right-5 mb-btn-ghost px-4 py-2 rounded-full text-xs font-medium mb-focus z-30" style={{ background: "var(--surface)" }}>
        <Settings size={12} className="inline mr-1.5" /> Admin view
      </button>
    </div>
  );
}
