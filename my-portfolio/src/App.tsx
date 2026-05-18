import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
} from "react";
// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS  (defined at module level – never inside render)
// ─────────────────────────────────────────────────────────────────────────────

const ROLES = [
  "Software Engineer",
  "Web Developer",
  "CS Student @ An-Najah",
  "Problem Solver",
  "React Developer",
];

// ── Floating icon data generated ONCE at module level (fixes Math.random in render) ──
const FLOAT_ICONS_DATA = ["⚛️", "🐍", "💻", "🧠", "🔷", "⚙️", "🌐", "🎨", "📊", "🔗", "🗂️", "⚡"].map(
  (icon) => ({
    icon,
    x: 5 + Math.random() * 88,
    y: 5 + Math.random() * 82,
    dur: (3 + Math.random() * 4).toFixed(1),
    delay: (Math.random() * 3).toFixed(1),
  })
);

// ── Particle data generated ONCE at module level (fixes Math.random in render) ──
const PARTICLE_DATA = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 8,
  dur: 6 + Math.random() * 8,
  size: 2 + Math.random() * 3,
  opacity: 0.15 + Math.random() * 0.4,
}));
const PARTICLE_COLORS = ["#00f5ff", "#a855f7", "#22c55e"];

const SKILLS: Record<string, { color: string; items: { name: string; icon: string; level: number }[] }> = {
  "Programming Languages": {
    color: "#00f5ff",
    items: [
      { name: "C++", icon: "⚙️", level: 85 },
      { name: "Python", icon: "🐍", level: 88 },
      { name: "JavaScript", icon: "🟡", level: 90 },
      { name: "HTML5", icon: "🌐", level: 95 },
      { name: "CSS3", icon: "🎨", level: 90 },
      { name: "Assembly", icon: "🔩", level: 60 },
    ],
  },
  "Frameworks & Tools": {
    color: "#a855f7",
    items: [
      { name: "React", icon: "⚛️", level: 88 },
      { name: "TypeScript", icon: "🔷", level: 82 },
      { name: "Tailwind CSS", icon: "💨", level: 90 },
      { name: "Git & GitHub", icon: "🗂️", level: 85 },
      { name: "REST APIs", icon: "🔗", level: 80 },
      { name: "Responsive Design", icon: "📱", level: 92 },
    ],
  },
  "Data & Analysis": {
    color: "#22c55e",
    items: [
      { name: "Data Analysis", icon: "📊", level: 78 },
      { name: "Data Visualization", icon: "📈", level: 75 },
      { name: "Problem Solving", icon: "🧩", level: 92 },
      { name: "Algorithmic Thinking", icon: "🧠", level: 88 },
    ],
  },
  "Soft Skills": {
    color: "#f59e0b",
    items: [
      { name: "Teamwork", icon: "🤝", level: 95 },
      { name: "Leadership", icon: "👑", level: 85 },
      { name: "Communication", icon: "💬", level: 88 },
      { name: "Fast Learning", icon: "⚡", level: 95 },
      { name: "Creativity", icon: "✨", level: 90 },
      { name: "Adaptability", icon: "🔄", level: 92 },
    ],
  },
};

interface Project {
  title: string;
  desc: string;
  tech: string[];
  color: string;
  github: string;
  demo: string;
}

const PROJECTS: Project[] = [
  {
    title: "Modern E-Commerce Platform",
    desc: "A full-stack e-commerce web application with user authentication, product management, shopping cart, and payment integration. Built with React, Node.js, and MongoDB.",
    tech: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind"],
    color: "#00f5ff",
    github: "https://github.com/Bara-sh",
    demo: "#",
  },
  {
    title: "Data Analytics Dashboard",
    desc: "Interactive dashboard for visualizing complex datasets using Python and modern charting libraries. Includes real-time data updates and export functionality.",
    tech: ["Python", "Pandas", "React", "D3.js", "REST API"],
    color: "#a855f7",
    github: "https://github.com/Bara-sh",
    demo: "#",
  },
  {
    title: "Algorithm Visualizer",
    desc: "A web app that visually demonstrates sorting and pathfinding algorithms step-by-step, helping CS students understand complex algorithm behavior.",
    tech: ["JavaScript", "React", "CSS3", "HTML5"],
    color: "#22c55e",
    github: "https://github.com/Bara-sh",
    demo: "#",
  },
  {
    title: "Student Management System",
    desc: "A comprehensive C++ desktop application for managing student records, grades, and course enrollments with a clean terminal UI and file persistence.",
    tech: ["C++", "OOP", "File I/O", "Data Structures"],
    color: "#f59e0b",
    github: "https://github.com/Bara-sh",
    demo: "#",
  },
];

interface TimelineItem {
  year: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
}

const TIMELINE: TimelineItem[] = [
  { year: "2024", title: "Started CS Journey", desc: "Enrolled in Computer Science at An-Najah National University. Began mastering C++ and core programming fundamentals.", icon: "🎓", color: "#00f5ff" },
  { year: "2024", title: "Python & Data Analysis", desc: "Explored Python for scripting and data analysis. Learned Pandas, NumPy and data visualization with Matplotlib and Seaborn.", icon: "📊", color: "#22c55e" },
  { year: "2025", title: "Web Development Foundations", desc: "Dived deep into HTML, CSS, and JavaScript. Built first interactive websites and discovered a passion for frontend development.", icon: "🌐", color: "#a855f7" },
  { year: "2025", title: "Modern Frontend Stack", desc: "Mastered React, TypeScript, and Tailwind CSS. Started building production-quality web applications with modern best practices.", icon: "⚛️", color: "#f59e0b" },
  { year: "2026", title: "Third Year & Beyond", desc: "Currently deepening expertise in scalable architecture, open-source contributions, and preparing to enter the professional job market.", icon: "🚀", color: "#ec4899" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED SVG ICONS  (declared at module level – never inside a component)
// ─────────────────────────────────────────────────────────────────────────────

const GH_PATH = "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z";

// Small GitHub icon (navbar)
function GitHubIconSm(){
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d={GH_PATH} />
    </svg>
  );
}

// Medium GitHub icon (contact card)
function GitHubIconMd(){
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#a855f7">
      <path d={GH_PATH} />
    </svg>
  );
}

// Small GitHub icon (footer)
function GitHubIconFooter(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d={GH_PATH} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useTypingEffect(words: string[], speed = 90, pause = 1800): string {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx((w) => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// Fixed useReveal: returns [RefObject<HTMLElement>, boolean] — no more union type confusion
function useReveal(
  threshold = 0.12
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

function MouseGlow(){
  const [pos, setPos] = useState({ x: -400, y: -400 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div style={{
      position: "fixed", left: pos.x - 300, top: pos.y - 300,
      width: 600, height: 600, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0,245,255,0.045) 0%, transparent 70%)",
      pointerEvents: "none", zIndex: 9998,
      transition: "left 0.12s ease-out, top 0.12s ease-out",
    }} />
  );
}

function GridBackground(){
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }} />
  );
}

// Uses module-level PARTICLE_DATA — no Math.random inside render
function Particles(){
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {PARTICLE_DATA.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, bottom: "-10px",
          width: p.size, height: p.size, borderRadius: "50%",
          background: PARTICLE_COLORS[p.id % 3], opacity: p.opacity,
          animation: `floatUp ${p.dur}s ${p.delay}s infinite linear`,
        }} />
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADER
// ─────────────────────────────────────────────────────────────────────────────

function Loader({ onDone }: { onDone: () => void }){
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 100) { clearInterval(t); setTimeout(onDone, 300); return 100; }
        return p + 2;
      });
    }, 25);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#05050f", zIndex: 10000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: "2.8rem", fontWeight: 900,
        letterSpacing: "8px", marginBottom: "2.5rem",
        background: "linear-gradient(135deg, #00f5ff, #a855f7)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        animation: "orbPulse 1.5s ease-in-out infinite alternate",
      }}>BS</div>
      <div style={{ width: 260, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg, #00f5ff, #a855f7)",
          transition: "width 0.08s linear",
          boxShadow: "0 0 12px rgba(0,245,255,0.6)",
        }} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>
        INITIALIZING... {pct}%
      </div>
      <style>{`@keyframes orbPulse { from{opacity:.7;transform:scale(1)} to{opacity:1;transform:scale(1.05)} }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["About", "Skills", "Projects", "Experience", "Contact"];
  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  // Use CSSProperties to avoid the `position: string` TS error
  const navStyle: CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    height: "64px", display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 2rem",
    background: scrolled ? "rgba(5,5,15,0.88)" : "transparent",
    backdropFilter: scrolled ? "blur(22px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(0,245,255,0.08)" : "none",
    transition: "all 0.3s ease",
  };

  const linkStyle: CSSProperties = {
    background: "none", border: "none", color: "rgba(255,255,255,0.65)",
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem",
    cursor: "pointer", letterSpacing: "1px", padding: "4px 0", transition: "color 0.2s",
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            fontFamily: "'Orbitron', monospace", fontSize: "1.2rem", fontWeight: 800,
            background: "linear-gradient(135deg, #00f5ff, #a855f7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            cursor: "pointer", letterSpacing: "3px",
          }}
        >BS</div>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00f5ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >{l}</button>
          ))}
          {/* GitHub — uses module-level GitHubIconSm, not defined inside render */}
          <a href="https://github.com/Bara-sh" target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.35rem 0.85rem",
              border: "1px solid rgba(0,245,255,0.3)", borderRadius: "8px",
              color: "#00f5ff", fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem", textDecoration: "none", transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,245,255,0.08)"; e.currentTarget.style.borderColor = "#00f5ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; }}
          >
            <GitHubIconSm /> GitHub
          </a>
        </div>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setOpen(!open)} style={{
          display: "none", background: "none", border: "none", color: "#00f5ff",
          fontSize: "1.6rem", cursor: "pointer", lineHeight: 1,
        }}>{open ? "✕" : "☰"}</button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 999,
          background: "rgba(5,5,15,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,245,255,0.1)",
          padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem",
        }}>
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.85)",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem",
              cursor: "pointer", textAlign: "left", padding: "0.5rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>{l}</button>
          ))}
          <a href="https://github.com/Bara-sh" target="_blank" rel="noopener noreferrer"
            style={{ color: "#00f5ff", textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem", padding: "0.5rem 0" }}>
            ⬡ GitHub
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────

function Hero(){
  const typed = useTypingEffect(ROLES);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "80px 2rem 4rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Orb glows */}
      <div style={{ position: "absolute", top: "15%", right: "8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,.11) 0%,transparent 70%)", filter: "blur(45px)", pointerEvents: "none", animation: "orbPulse 7s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "4%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,255,.09) 0%,transparent 70%)", filter: "blur(45px)", pointerEvents: "none", animation: "orbPulse 9s ease-in-out infinite alternate-reverse" }} />

      {/* Floating tech icons — uses module-level FLOAT_ICONS_DATA, no useRef needed */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {FLOAT_ICONS_DATA.map((f, i) => (
          <div key={i} style={{
            position: "absolute", left: `${f.x}%`, top: `${f.y}%`,
            fontSize: "1.1rem", opacity: 0.16,
            animation: `floatIcon ${f.dur}s ${f.delay}s ease-in-out infinite alternate`,
          }}>{f.icon}</div>
        ))}
      </div>

      <div style={{ maxWidth: 1100, width: "100%", display: "flex", alignItems: "center", gap: "4rem", flexWrap: "wrap" }}>
        {/* Text */}
        <div style={{ flex: "1 1 380px", minWidth: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.2)",
            borderRadius: "100px", padding: "0.35rem 1rem", marginBottom: "1.5rem",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
            color: "#00f5ff", letterSpacing: "1.5px",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "blink 1.5s infinite" }} />
            AVAILABLE FOR OPPORTUNITIES
          </div>

          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, lineHeight: 1.05,
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Bara Shurab</h1>

          <div style={{ height: 3, width: 80, background: "linear-gradient(90deg, #00f5ff, #a855f7)", borderRadius: 2, marginBottom: "1.2rem" }} />

          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)", color: "#00f5ff",
            minHeight: "2.2rem", display: "flex", alignItems: "center", gap: "2px", marginBottom: "1.5rem",
          }}>
            <span>{typed}</span>
            <span style={{ animation: "blink 1s infinite", color: "#a855f7" }}>|</span>
          </div>

          <p style={{
            color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.9rem,1.5vw,1rem)",
            lineHeight: 1.85, maxWidth: 500, marginBottom: "2.5rem",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Software Engineer specialized in building modern web applications,
            solving real-world problems, and creating scalable digital solutions
            with clean and efficient code.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "0.75rem 1.8rem",
                background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                border: "none", borderRadius: "8px", color: "#05050f", fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", cursor: "pointer",
                boxShadow: "0 0 28px rgba(0,245,255,0.25)", transition: "all 0.25s ease",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 50px rgba(0,245,255,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(0,245,255,0.25)"; }}
            >⬡ View Projects</button>

            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "0.75rem 1.8rem", background: "transparent",
                border: "1px solid rgba(0,245,255,0.4)", borderRadius: "8px",
                color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem", cursor: "pointer", transition: "all 0.25s ease",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00f5ff"; e.currentTarget.style.color = "#00f5ff"; e.currentTarget.style.background = "rgba(0,245,255,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; e.currentTarget.style.background = "transparent"; }}
            >✉ Contact Me</button>

            <a href="/Bara_Shurab_CV.pdf" download
              style={{
                padding: "0.75rem 1.8rem", background: "transparent",
                border: "1px solid rgba(168,85,247,0.4)", borderRadius: "8px",
                color: "#a855f7", fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem", cursor: "pointer", transition: "all 0.25s ease",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a855f7"; e.currentTarget.style.background = "rgba(168,85,247,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >↓ Download CV</a>
          </div>
        </div>

        {/* Profile image */}
        <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "clamp(210px,28vw,285px)", height: "clamp(210px,28vw,285px)" }}>
            <div style={{ position: "absolute", inset: -18, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#00f5ff", borderRightColor: "#a855f7", animation: "spin 4s linear infinite" }} />
            <div style={{ position: "absolute", inset: -30, borderRadius: "50%", border: "1px solid transparent", borderBottomColor: "rgba(0,245,255,0.3)", borderLeftColor: "rgba(168,85,247,0.3)", animation: "spin 8s linear infinite reverse" }} />
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(168,85,247,0.08))",
              border: "1px solid rgba(0,245,255,0.15)", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem",
              boxShadow: "0 0 60px rgba(0,245,255,0.1), 0 0 120px rgba(168,85,247,0.06)",
            }}>
              {/* Put your photo at /public/profile.png */}
              <img src="/public/my.jpeg" alt="Bara Shurab"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <div style={{ display: "none", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "3.5rem" }}>👤</span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px" }}>PHOTO COMING SOON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        animation: "bounceY 2s ease-in-out infinite", opacity: 0.4,
      }}>
        <span style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "2px", color: "rgba(255,255,255,0.5)" }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: "linear-gradient(180deg, rgba(0,245,255,0.7), transparent)" }} />
      </div>

      <style>{`
        @keyframes orbPulse  { from{transform:scale(1)}  to{transform:scale(1.15)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes bounceY   { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
        @keyframes floatIcon { from{transform:translate(0,0) rotate(-5deg)} to{transform:translate(0,-18px) rotate(5deg)} }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Section({ id, children, style: extraStyle = {} }: { id: string; children: React.ReactNode; style?: CSSProperties }) {
  const [revealRef, visible] = useReveal();
  return (
    <section
      id={id}
      ref={revealRef as React.RefObject<HTMLElement>}
      style={{
        padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        ...extraStyle,
      }}
    >{children}</section>
  );
}

function SectionHeader({ label, title, sub = "" }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
        color: "#00f5ff", letterSpacing: "3px", textTransform: "uppercase",
        background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.15)",
        borderRadius: "100px", padding: "0.3rem 1rem", marginBottom: "1rem",
      }}>{label}</div>
      <h2 style={{
        fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800,
        background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,.6) 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.75rem",
      }}>{title}</h2>
      {sub && <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontSize: "0.93rem" }}>{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────

function About() {
  const stats = [
    { label: "Year", val: "3rd" },
    { label: "Major", val: "CS" },
    { label: "Projects", val: "10+" },
    { label: "Skills", val: "20+" },
  ];

  return (
    <Section id="about">
      <SectionHeader label="// WHO I AM" title="About Me" />
      <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px" }}>
          <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.9, marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem" }}>
            I'm <strong style={{ color: "#00f5ff" }}>Bara Shurab</strong>, a passionate Computer Science student at{" "}
            <strong style={{ color: "#a855f7" }}>An-Najah National University</strong>, currently in my third year.
            My fascination with software engineering goes beyond coursework — I'm driven by the challenge of turning
            complex problems into elegant, efficient solutions.
          </p>
          <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.9, marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem" }}>
            My core focus lies in <strong style={{ color: "#22c55e" }}>modern web development</strong> and{" "}
            <strong style={{ color: "#f59e0b" }}>data analysis</strong> — crafting interfaces that users love and
            pipelines that reveal insight. I thrive at the intersection of design and logic.
          </p>
          <p style={{ color: "rgba(255,255,255,0.68)", lineHeight: 1.9, fontFamily: "'DM Sans', sans-serif", fontSize: "0.97rem" }}>
            I believe in <strong style={{ color: "#ec4899" }}>continuous learning</strong>, clean code principles,
            and building things that matter. Whether it's a polished React app or a Python analysis script,
            I bring the same curiosity and attention to detail to every project.
          </p>
        </div>
        <div style={{ flex: "0 1 300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px", padding: "1.2rem", textAlign: "center",
                backdropFilter: "blur(10px)", cursor: "default", transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "1.6rem", fontWeight: 800, color: "#00f5ff" }}>{s.val}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", marginTop: "0.25rem" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(0,245,255,0.03)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: "12px", padding: "1.25rem" }}>
            {[
              { icon: "🎓", text: "An-Najah National University" },
              { icon: "💻", text: "Computer Science (CAP)" },
              { icon: "📍", text: "West Bank, Palestine" },
              { icon: "🎯", text: "3rd Year Student" },
            ].map((row, i, arr) => (
              <div key={row.text} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.45rem 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span>{row.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.87rem", fontFamily: "'DM Sans', sans-serif" }}>{row.text}</span>
              </div>
            ))}
            {/* GitHub row */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.45rem 0" }}>
              <span>⬡</span>
              <a href="https://github.com/Bara-sh" target="_blank" rel="noopener noreferrer"
                style={{ color: "#00f5ff", textDecoration: "none", fontSize: "0.87rem", fontFamily: "'DM Sans', sans-serif" }}>
                github.com/Bara-sh
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────

function SkillBar({ name, icon, level, color, delay = 0 }: { name: string; icon: string; level: number; color: string; delay?: number }){
  // Fixed: useReveal returns [RefObject<HTMLElement>, boolean] — cast ref properly
  const [revealRef, visible] = useReveal();
  return (
    <div ref={revealRef as React.RefObject<HTMLDivElement>} style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>{icon}</span>{name}
        </span>
        <span style={{ color, fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace" }}>{level}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: visible ? `${level}%` : "0%",
          background: "linear-gradient(90deg, #00f5ff, #a855f7)", borderRadius: 10,
          boxShadow: `0 0 10px ${color}66`,
          transition: `width 1s ease ${delay * 0.08}s`,
        }} />
      </div>
    </div>
  );
}

function Skills(){
  return (
    <Section id="skills">
      <SectionHeader label="// CAPABILITIES" title="Skills & Expertise" sub="Technologies I work with and competencies I've built." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {Object.entries(SKILLS).map(([cat, { color, items }]) => (
          <div key={cat} style={{
            background: "rgba(255,255,255,0.02)", border: `1px solid ${color}20`,
            borderRadius: "16px", padding: "1.75rem", backdropFilter: "blur(10px)",
            transition: "border-color 0.25s, box-shadow 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color + "44"; e.currentTarget.style.boxShadow = `0 8px 40px ${color}10`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = color + "20"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color, marginBottom: "1.5rem" }}>{cat}</h3>
            {items.map((s, i) => <SkillBar key={s.name} {...s} color={color} delay={i} />)}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — 3-D tilt on hover
// ─────────────────────────────────────────────────────────────────────────────

function ProjectCard({ project, idx }: { project: Project; idx: number }){
  // Fixed: separate reveal ref (section visibility) and card ref (3-D tilt)
  const [revealRef, visible] = useReveal();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    card.style.boxShadow = `0 25px 60px ${project.color}22`;
    card.style.borderColor = project.color + "44";
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(600px) rotateY(0) rotateX(0) translateY(0)";
    card.style.boxShadow = "none";
    card.style.borderColor = "rgba(255,255,255,0.07)";
  };

  return (
    // Attach reveal ref to a wrapper div, card ref directly to the card div
    <div ref={revealRef as React.RefObject<HTMLDivElement>} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.6s ease ${idx * 0.1}s, transform 0.6s ease ${idx * 0.1}s`,
    }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", overflow: "hidden", cursor: "default",
          backdropFilter: "blur(10px)", transformStyle: "preserve-3d",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Thumbnail */}
        <div style={{
          height: 175, display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          background: `linear-gradient(135deg, ${project.color}10, ${project.color}04)`,
          borderBottom: `1px solid ${project.color}15`,
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(${project.color}08 1px, transparent 1px), linear-gradient(90deg, ${project.color}08 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }} />
          <div style={{ textAlign: "center", zIndex: 1, position: "relative" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.35rem" }}>🖥️</div>
            <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px" }}>PROJECT PREVIEW</div>
          </div>
          <div style={{ position: "absolute", top: "1rem", right: "1rem", width: 10, height: 10, borderRadius: "50%", background: project.color, boxShadow: `0 0 10px ${project.color}` }} />
        </div>

        <div style={{ padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.93rem", fontWeight: 700, color: "#fff", marginBottom: "0.7rem", letterSpacing: "0.5px" }}>{project.title}</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.83rem", lineHeight: 1.7, marginBottom: "1rem", fontFamily: "'DM Sans', sans-serif" }}>{project.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
            {project.tech.map((t) => (
              <span key={t} style={{
                padding: "0.2rem 0.6rem", borderRadius: "6px",
                background: `${project.color}12`, border: `1px solid ${project.color}28`,
                fontSize: "0.68rem", color: project.color, fontFamily: "'JetBrains Mono', monospace",
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, textAlign: "center", padding: "0.6rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", color: "rgba(255,255,255,0.7)",
              fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", transition: "background 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >⬡ GitHub ↗</a>
            <a href={project.demo} style={{
              flex: 1, textAlign: "center", padding: "0.6rem",
              background: `${project.color}18`, border: `1px solid ${project.color}35`,
              borderRadius: "8px", color: project.color,
              fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", transition: "background 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${project.color}30`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = `${project.color}18`)}
            >▶ Live Demo ↗</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects(){
  return (
    <Section id="projects">
      <SectionHeader label="// MY WORK" title="Featured Projects" sub="A selection of projects I've built, exploring different technologies and problem spaces." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(285px, 1fr))", gap: "1.5rem" }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} idx={i} />)}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE — responsive timeline with proper CSS classes
// ─────────────────────────────────────────────────────────────────────────────

function Experience(){
  return (
    <Section id="experience">
      <SectionHeader label="// MY JOURNEY" title="Experience & Timeline" sub="Key milestones in my growth as a software engineer." />

      <style>{`
        .timeline-container { position: relative; max-width: 720px; margin: 0 auto; }
        .timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, rgba(0,245,255,.15), rgba(168,85,247,.3), rgba(0,245,255,.15)); transform: translateX(-50%); }
        .timeline-item { display: flex; margin-bottom: 2.5rem; position: relative; }
        .timeline-item.left  { justify-content: flex-start; padding-right: 50%; }
        .timeline-item.right { justify-content: flex-end;   padding-left:  50%; }
        .timeline-dot { position: absolute; left: 50%; transform: translateX(-50%); width: 14px; height: 14px; border-radius: 50%; border: 2px solid #05050f; margin-top: 1.25rem; z-index: 2; }
        .timeline-card { border-radius: 12px; padding: 1.25rem; backdrop-filter: blur(10px); transition: border-color 0.25s; }
        .timeline-item.left  .timeline-card { margin-right: 2rem; max-width: calc(100% - 2rem); }
        .timeline-item.right .timeline-card { margin-left:  2rem; max-width: calc(100% - 2rem); }

        @media (max-width: 600px) {
          .timeline-line { left: 18px; transform: none; }
          .timeline-item.left,
          .timeline-item.right { justify-content: flex-start; padding-left: 44px; padding-right: 0; }
          .timeline-dot { left: 18px; transform: translateX(-50%); }
          .timeline-item.left  .timeline-card,
          .timeline-item.right .timeline-card { margin: 0; max-width: 100%; }
        }
      `}</style>

      <div className="timeline-container">
        <div className="timeline-line" />
        {TIMELINE.map((item, i) => (
          <div key={i} className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
            <div className="timeline-dot" style={{ background: item.color, boxShadow: `0 0 15px ${item.color}` }} />
            <div
              className="timeline-card"
              style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${item.color}25` }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = item.color + "55")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = item.color + "25")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span>{item.icon}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: item.color, letterSpacing: "1px" }}>{item.year}</span>
              </div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.84rem", color: "#fff", marginBottom: "0.45rem", fontWeight: 700 }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "0.81rem", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// Uses module-level GitHubIconMd — NOT defined inside the component
// ─────────────────────────────────────────────────────────────────────────────

interface ContactItem {
  label: string;
  sub: string;
  icon: React.ReactNode;
  href: string;
  target: string;
  color: string;
}

// Defined outside Contact so it's stable and not recreated every render
const CONTACT_ITEMS: ContactItem[] = [
  { label: "LinkedIn", sub: "linkedin.com/in/bara-shurab-59483b40b", icon: "💼", href: "https://www.linkedin.com/in/bara-shurab-59483b40b/", target: "_blank", color: "#0ea5e9" },
  { label: "GitHub",   sub: "github.com/Bara-sh",                    icon: <GitHubIconMd />, href: "https://github.com/Bara-sh",                                  target: "_blank", color: "#a855f7" },
  { label: "Email",    sub: "baralink06@gmail.com",                  icon: "✉️",             href: "mailto:baralink06@gmail.com",                                 target: "_self",  color: "#00f5ff" },
  { label: "Phone",    sub: "+972 569 660 684",                      icon: "📱",             href: "tel:+972569660684",                                           target: "_self",  color: "#22c55e" },
];

function Contact() {
  return (
    <Section id="contact">
      <SectionHeader label="// LET'S CONNECT" title="Contact Me" sub="Open to opportunities, collaborations, and interesting conversations." />
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 760, margin: "0 auto" }}>
        {CONTACT_ITEMS.map((c) => (
          <a key={c.label} href={c.href} target={c.target} rel="noopener noreferrer"
            style={{
              flex: "1 1 160px", textDecoration: "none",
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "2rem 1.5rem", textAlign: "center",
              transition: "all 0.3s ease", display: "block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = c.color + "66";
              e.currentTarget.style.background   = c.color + "0a";
              e.currentTarget.style.transform    = "translateY(-5px)";
              e.currentTarget.style.boxShadow    = `0 20px 40px ${c.color}18`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.background   = "rgba(255,255,255,0.025)";
              e.currentTarget.style.transform    = "translateY(0)";
              e.currentTarget.style.boxShadow    = "none";
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>{c.icon}</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.76rem", fontWeight: 700, color: c.color, letterSpacing: "2px", marginBottom: "0.4rem" }}>{c.label}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontFamily: "'DM Sans', sans-serif", wordBreak: "break-all", lineHeight: 1.5 }}>{c.sub}</div>
          </a>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — uses module-level GitHubIconFooter
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { href: "https://github.com/Bara-sh",                             icon: <GitHubIconFooter />, hoverColor: "#a855f7" },
  { href: "https://www.linkedin.com/in/bara-shurab-59483b40b/",     icon: "in",                  hoverColor: "#0ea5e9" },
  { href: "mailto:baralink06@gmail.com",                            icon: "✉",                   hoverColor: "#00f5ff" },
];

function Footer(){
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2.5rem 2rem", textAlign: "center", position: "relative", zIndex: 2 }}>
      <div style={{
        fontFamily: "'Orbitron', monospace", fontSize: "1rem", fontWeight: 700,
        letterSpacing: "3px", marginBottom: "0.75rem",
        background: "linear-gradient(135deg, #00f5ff, #a855f7)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>BARA SHURAB</div>
      <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", marginBottom: "0.75rem" }}>
        {SOCIAL_LINKS.map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", display: "flex", alignItems: "center", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = s.hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >{s.icon}</a>
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px" }}>
        Designed & Built with ❤️ · © {new Date().getFullYear()}
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App(){
  const [loading, setLoading] = useState(true);
  const handleDone = useCallback(() => setLoading(false), []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #05050f; color: #fff; overflow-x: hidden; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #05050f; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#00f5ff, #a855f7); border-radius: 10px; }
        section { position: relative; z-index: 2; }
      `}</style>

      {loading && <Loader onDone={handleDone} />}

      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s ease" }}>
        <GridBackground />
        <Particles />
        <MouseGlow />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}