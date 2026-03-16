import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const THEME_STORAGE_KEY = "ppw.theme";

/**
 * Returns the user's preferred theme:
 * 1) localStorage override, else
 * 2) OS preference, else
 * 3) light.
 */
function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Ignore storage access issues (e.g., privacy mode).
  }

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "idle", message: "" });

  // Example content (deploy-ready defaults). Replace with your real data anytime.
  const profile = useMemo(
    () => ({
      name: "Your Name",
      title: "Frontend Developer",
      tagline:
        "I build fast, accessible web experiences with modern React and thoughtful UI.",
      location: "City, Country",
      email: "you@example.com",
      socials: [
        { label: "GitHub", href: "https://github.com/", display: "@username" },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/",
          display: "linkedin.com/in/username",
        },
        { label: "X", href: "https://x.com/", display: "@handle" },
      ],
      highlights: [
        "Accessible, responsive UI",
        "Component-driven development",
        "Performance-minded implementation",
      ],
    }),
    []
  );

  const skills = useMemo(
    () => ({
      primary: [
        "React",
        "JavaScript (ES202x)",
        "TypeScript",
        "HTML",
        "CSS",
        "Accessibility (a11y)",
      ],
      secondary: [
        "Testing Library",
        "Jest",
        "Git",
        "REST APIs",
        "Performance",
        "Responsive Design",
      ],
      tools: ["VS Code", "Figma", "Vite/Cra", "Chrome DevTools"],
    }),
    []
  );

  const projects = useMemo(
    () => [
      {
        title: "Project One",
        description:
          "A clean, responsive web app with reusable components, thoughtful UX, and deploy-ready build pipeline.",
        tech: ["React", "CSS", "Accessibility"],
        links: [
          { label: "Live", href: "https://example.com" },
          { label: "Code", href: "https://github.com/" },
        ],
      },
      {
        title: "Project Two",
        description:
          "A dashboard-style UI with cards, filters, and a polished visual system for light/dark mode.",
        tech: ["React", "Hooks", "UI System"],
        links: [{ label: "Code", href: "https://github.com/" }],
      },
      {
        title: "Project Three",
        description:
          "A performance-focused landing page with SEO-friendly metadata and smooth navigation patterns.",
        tech: ["SEO Basics", "Performance", "Responsive"],
        links: [{ label: "Live", href: "https://example.com" }],
      },
    ],
    []
  );

  const experience = useMemo(
    () => [
      {
        heading: "Frontend Developer — Company Name",
        period: "2023 — Present",
        bullets: [
          "Built accessible UI components and maintained design consistency across the app.",
          "Improved performance and reduced layout shifts by refining rendering and styling.",
          "Collaborated with designers and stakeholders to ship polished features.",
        ],
      },
      {
        heading: "Education — Degree / Program",
        period: "2019 — 2023",
        bullets: [
          "Relevant coursework: web development, UI design, data structures.",
          "Delivered capstone project with modern frontend tooling and best practices.",
        ],
      },
    ],
    []
  );

  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    contact: useRef(null),
  };

  // Apply theme & persist.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  // SEO basics: keep meta theme-color aligned with theme for supported browsers.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute("content", theme === "dark" ? "#0b1220" : "#f9fafb");
  }, [theme]);

  // Track active section for nav highlighting.
  useEffect(() => {
    const entries = Object.entries(sectionRefs)
      .map(([id, ref]) => ({ id, el: ref.current }))
      .filter((x) => Boolean(x.el));

    if (entries.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (obsEntries) => {
        // Choose the most visible intersecting section.
        const visible = obsEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id);
      },
      {
        // Encourage "sticky nav" offset awareness by requiring more visibility.
        threshold: [0.15, 0.25, 0.4, 0.6],
        rootMargin: "-20% 0px -65% 0px",
      }
    );

    for (const { el } of entries) observer.observe(el);

    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close mobile nav on Escape.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const scrollToSection = (id) => {
    const el = sectionRefs[id]?.current || document.getElementById(id);
    if (!el) return;

    // Close mobile nav first for a smoother feel.
    setNavOpen(false);

    // Allow state to update before scroll (mainly for mobile overlay).
    window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash (helps sharing + basic SEO semantics).
      if (id === "home") {
        window.history.replaceState(null, "", "#");
      } else {
        window.history.replaceState(null, "", `#${id}`);
      }
    });
  };

  const onSubmitContact = (e) => {
    e.preventDefault();
    setFormStatus({ type: "idle", message: "" });

    const name = formState.name.trim();
    const email = formState.email.trim();
    const message = formState.message.trim();

    if (!name || !email || !message) {
      setFormStatus({
        type: "error",
        message: "Please fill in your name, email, and message.",
      });
      return;
    }

    // No backend requested: we provide a mailto fallback so the site is deploy-ready.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );
    const mailto = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setFormStatus({
      type: "success",
      message: "Opening your email client…",
    });

    window.location.href = mailto;

    // Keep user input around if mail client is blocked; otherwise we can clear.
    setTimeout(() => {
      setFormState({ name: "", email: "", message: "" });
    }, 400);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="App">
      <a className="skip-link" href="#home">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <button
            className="brand"
            type="button"
            onClick={() => scrollToSection("home")}
            aria-label="Go to top"
          >
            <span className="brand-mark" aria-hidden="true">
              ◼
            </span>
            <span className="brand-text">{profile.name}</span>
          </button>

          <nav className="nav" aria-label="Primary">
            <button
              className="icon-button nav-toggle"
              type="button"
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-controls="primary-nav"
              aria-expanded={navOpen ? "true" : "false"}
              onClick={() => setNavOpen((v) => !v)}
            >
              <span className="nav-toggle-lines" aria-hidden="true" />
            </button>

            <div
              id="primary-nav"
              className={`nav-links ${navOpen ? "is-open" : ""}`}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-link ${
                    activeSection === item.id ? "is-active" : ""
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              ))}

              <button
                className="btn btn-ghost theme-toggle"
                onClick={toggleTheme}
                type="button"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                <span className="theme-toggle-icon" aria-hidden="true">
                  {theme === "light" ? "🌙" : "☀️"}
                </span>
                <span className="theme-toggle-text">
                  {theme === "light" ? "Dark" : "Light"}
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        {/* Hero */}
        <section
          id="home"
          ref={sectionRefs.home}
          className="section hero"
          aria-label="Hero"
        >
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Hello, I’m</p>
              <h1 className="h1">
                {profile.name}
                <span className="dot" aria-hidden="true">
                  .
                </span>
              </h1>
              <p className="lead">
                <span className="lead-title">{profile.title}</span> —{" "}
                {profile.tagline}
              </p>

              <div className="hero-meta">
                <div className="chip" title="Location">
                  <span className="chip-icon" aria-hidden="true">
                    📍
                  </span>
                  <span>{profile.location}</span>
                </div>
                <a className="chip" href={`mailto:${profile.email}`}>
                  <span className="chip-icon" aria-hidden="true">
                    ✉️
                  </span>
                  <span>{profile.email}</span>
                </a>
              </div>

              <div className="hero-cta">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => scrollToSection("projects")}
                >
                  View Projects
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => scrollToSection("contact")}
                >
                  Contact Me
                </button>
              </div>

              <ul className="hero-highlights" aria-label="Highlights">
                {profile.highlights.map((h) => (
                  <li key={h} className="bullet">
                    <span className="bullet-icon" aria-hidden="true">
                      ✓
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-card" aria-label="Quick links">
              <div className="card surface">
                <h2 className="h3">Find me online</h2>
                <p className="muted">
                  Links are placeholders—swap with your real profiles.
                </p>
                <div className="link-grid">
                  {profile.socials.map((s) => (
                    <a
                      key={s.label}
                      className="card-link"
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${s.label} profile`}
                    >
                      <span className="card-link-title">{s.label}</span>
                      <span className="card-link-sub">{s.display}</span>
                      <span className="card-link-arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  ))}
                </div>

                <div className="divider" role="separator" />

                <button
                  className="btn btn-ghost btn-full"
                  type="button"
                  onClick={() => scrollToSection("about")}
                >
                  Learn more about me
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" ref={sectionRefs.about} className="section">
          <div className="container">
            <header className="section-header">
              <h2 className="h2">About</h2>
              <p className="muted">
                A short introduction and what I value when building products.
              </p>
            </header>

            <div className="grid-2">
              <div className="card surface">
                <h3 className="h3">Who I am</h3>
                <p>
                  I’m a developer who enjoys turning complex requirements into
                  clear, maintainable interfaces. I focus on clean UI, strong
                  fundamentals, and an attention to detail that improves the
                  user experience.
                </p>
                <p className="muted">
                  This website is a single-page React app with smooth scrolling,
                  responsive layout, and persisted theme selection.
                </p>
              </div>

              <div className="card surface">
                <h3 className="h3">What I do</h3>
                <ul className="list">
                  <li>Build responsive UI with modern React patterns.</li>
                  <li>Make accessibility a default, not an afterthought.</li>
                  <li>Design clean CSS systems (tokens, surfaces, spacing).</li>
                  <li>Optimize for performance and a pleasant user journey.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" ref={sectionRefs.skills} className="section">
          <div className="container">
            <header className="section-header">
              <h2 className="h2">Skills</h2>
              <p className="muted">
                A snapshot of technologies I’m comfortable using.
              </p>
            </header>

            <div className="grid-3">
              <div className="card surface">
                <h3 className="h3">Core</h3>
                <div className="tag-wrap">
                  {skills.primary.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card surface">
                <h3 className="h3">Secondary</h3>
                <div className="tag-wrap">
                  {skills.secondary.map((t) => (
                    <span key={t} className="tag tag-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card surface">
                <h3 className="h3">Tools</h3>
                <div className="tag-wrap">
                  {skills.tools.map((t) => (
                    <span key={t} className="tag tag-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" ref={sectionRefs.projects} className="section">
          <div className="container">
            <header className="section-header">
              <h2 className="h2">Projects</h2>
              <p className="muted">
                Selected work. Replace these with your real portfolio items.
              </p>
            </header>

            <div className="project-grid">
              {projects.map((p) => (
                <article key={p.title} className="card surface project-card">
                  <div className="project-top">
                    <h3 className="h3">{p.title}</h3>
                    <p className="muted">{p.description}</p>
                  </div>

                  <div className="tag-wrap">
                    {p.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    {p.links.map((l) => (
                      <a
                        key={l.label}
                        className="btn btn-ghost"
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section
          id="experience"
          ref={sectionRefs.experience}
          className="section"
        >
          <div className="container">
            <header className="section-header">
              <h2 className="h2">Experience & Education</h2>
              <p className="muted">
                A simple timeline-style summary of work and learning.
              </p>
            </header>

            <div className="timeline">
              {experience.map((item) => (
                <div key={item.heading} className="timeline-item">
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className="card surface timeline-card">
                    <div className="timeline-head">
                      <h3 className="h3">{item.heading}</h3>
                      <span className="pill">{item.period}</span>
                    </div>
                    <ul className="list">
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" ref={sectionRefs.contact} className="section">
          <div className="container">
            <header className="section-header">
              <h2 className="h2">Contact</h2>
              <p className="muted">
                Send a message using the form (mailto) or reach out via social
                links.
              </p>
            </header>

            <div className="grid-2 contact-grid">
              <div className="card surface">
                <h3 className="h3">Quick contact</h3>

                <div className="contact-row">
                  <span className="contact-label">Email</span>
                  <a className="contact-value" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </div>

                <div className="divider" role="separator" />

                <h4 className="h4">Social</h4>
                <ul className="social-list">
                  {profile.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        className="social-link"
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="social-name">{s.label}</span>
                        <span className="social-handle muted">{s.display}</span>
                        <span className="social-arrow" aria-hidden="true">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card surface">
                <h3 className="h3">Message me</h3>

                <form className="form" onSubmit={onSubmitContact}>
                  <label className="field">
                    <span className="field-label">Name</span>
                    <input
                      className="input"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, name: e.target.value }))
                      }
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Email</span>
                    <input
                      className="input"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, email: e.target.value }))
                      }
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Message</span>
                    <textarea
                      className="textarea"
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, message: e.target.value }))
                      }
                      name="message"
                      placeholder="What would you like to talk about?"
                      rows={5}
                      required
                    />
                  </label>

                  <div className="form-actions">
                    <button className="btn btn-primary" type="submit">
                      Send
                    </button>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={() =>
                        setFormState({ name: "", email: "", message: "" })
                      }
                    >
                      Clear
                    </button>
                  </div>

                  {formStatus.type !== "idle" ? (
                    <p
                      className={`form-status ${
                        formStatus.type === "error"
                          ? "is-error"
                          : "is-success"
                      }`}
                      role="status"
                    >
                      {formStatus.message}
                    </p>
                  ) : null}
                </form>
              </div>
            </div>

            <footer className="footer">
              <div className="footer-inner">
                <span className="muted">
                  © {new Date().getFullYear()} {profile.name}. Built with React.
                </span>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => scrollToSection("home")}
                >
                  Back to top ↑
                </button>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
