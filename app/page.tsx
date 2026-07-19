"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const services = [
  {
    number: "01",
    title: "Design & build",
    copy: "Landscape planning, garden construction, hardscape, planting and the details that make outdoor space usable.",
    image: "/images/concept-public-realm.png",
  },
  {
    number: "02",
    title: "Renew & rehabilitate",
    copy: "A considered reset for tired landscapes—from removal and replanting to renewed paths, irrigation and seasonal structure.",
    image: "/images/concept-hero.png",
  },
  {
    number: "03",
    title: "Maintain & sustain",
    copy: "Planned care for gardens and irrigation systems, keeping landscapes healthy, efficient and ready for everyday use.",
    image: "/images/concept-care.png",
  },
];

const landscapes = [
  {
    number: "01",
    eyebrow: "GOVERNMENT LANDSCAPES",
    title: "Public realm, kept in rhythm.",
    text: "Landscape delivery and maintenance shaped around public use, programme requirements and long-term performance.",
    image: "/images/concept-public-realm.png",
  },
  {
    number: "02",
    eyebrow: "PRIVATE ENVIRONMENTS",
    title: "A quieter kind of arrival.",
    text: "Garden construction and care for residential, commercial and institutional environments across the Kingdom.",
    image: "/images/concept-hero.png",
  },
  {
    number: "03",
    eyebrow: "GARDEN REHABILITATION",
    title: "Existing ground, renewed.",
    text: "Replanting, irrigation renewal and spatial improvements that give established gardens a more resilient next chapter.",
    image: "/images/concept-care.png",
  },
  {
    number: "04",
    eyebrow: "OPERATIONS & CARE",
    title: "Good landscapes keep changing.",
    text: "Periodic maintenance for planting, pathways and irrigation systems—planned around seasons, use and site conditions.",
    image: "/images/landscape-service.jpg",
  },
];

const clients = [
  "Ministry of Commerce",
  "Saudi Arabian Royal Guard",
  "General Authority for Military Industries",
  "Saudi Contractors Authority",
  "Emaar Square Jeddah",
  "Riyadh Gallery",
  "Riyadh Schools",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const reelRef = useRef<HTMLDivElement>(null);
  const reelStageRef = useRef<HTMLDivElement>(null);
  const reelDrag = useRef({ active: false, startX: 0, startScroll: 0 });

  useEffect(() => {
    const reel = reelRef.current;
    const stage = reelStageRef.current;
    if (!reel || !stage) return;

    const mobile = window.matchMedia("(max-width: 640px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (mobile.matches) return;

      const travel = Math.max(0, reel.scrollWidth - reel.clientWidth);
      const stageTravel = Math.max(1, stage.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - stage.offsetTop) / stageTravel));
      reel.scrollLeft = progress * travel;
      stage.style.setProperty("--reel-progress", `${progress * 100}%`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const measure = () => {
      if (mobile.matches) {
        stage.style.height = "auto";
        stage.style.removeProperty("--reel-progress");
        return;
      }
      const travel = Math.max(0, reel.scrollWidth - reel.clientWidth);
      stage.style.height = `${window.innerHeight + travel * 0.72}px`;
      requestUpdate();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(reel);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", measure);
    mobile.addEventListener("change", measure);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", measure);
      mobile.removeEventListener("change", measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const moveReel = (direction: number) => {
    const reel = reelRef.current;
    const stage = reelStageRef.current;
    if (!reel) return;

    const amount = Math.min(window.innerWidth * 0.72, 920);
    if (stage && window.innerWidth > 640) {
      const maxReel = Math.max(1, reel.scrollWidth - reel.clientWidth);
      const nextLeft = Math.min(maxReel, Math.max(0, reel.scrollLeft + direction * amount));
      const pageTravel = Math.max(1, stage.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: stage.offsetTop + (nextLeft / maxReel) * pageTravel,
        behavior: "smooth",
      });
      return;
    }

    reel.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const closeMenu = () => setMenuOpen(false);

  const startReelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    reelDrag.current = {
      active: true,
      startX: event.clientX,
      startScroll: event.currentTarget.scrollLeft,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const dragReel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!reelDrag.current.active) return;
    const nextLeft = reelDrag.current.startScroll - (event.clientX - reelDrag.current.startX) * 1.15;
    const stage = reelStageRef.current;
    if (stage && window.innerWidth > 640) {
      const maxReel = Math.max(1, event.currentTarget.scrollWidth - event.currentTarget.clientWidth);
      const pageTravel = Math.max(1, stage.offsetHeight - window.innerHeight);
      const clampedLeft = Math.min(maxReel, Math.max(0, nextLeft));
      window.scrollTo({ top: stage.offsetTop + (clampedLeft / maxReel) * pageTravel });
      return;
    }
    event.currentTarget.scrollLeft = nextLeft;
  };

  const stopReelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!reelDrag.current.active) return;
    reelDrag.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.classList.remove("is-dragging");
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-header">
        <a className="brand" href="#hero" aria-label="Nascom Landscaping home">
          <img src="/images/nascom-logo.png" alt="Nascom Landscaping" />
        </a>

        <nav className={menuOpen ? "primary-nav is-open" : "primary-nav"} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>Company</a>
          <a href="#services" onClick={closeMenu}>Capabilities</a>
          <a href="#landscapes" onClick={closeMenu}>Landscapes</a>
          <a href="#care" onClick={closeMenu}>Care</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <a className="header-cta" href="mailto:info@landscape.sa?subject=Landscape%20project%20enquiry">
          Start a project <span aria-hidden="true">↗</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="main">
        <section className="hero" id="hero">
          <div className="hero-media" aria-hidden="true">
            <img src="/images/concept-hero.png" alt="" />
          </div>
          <div className="hero-shade" />

          <div className="hero-content">
            <p className="kicker light">RIYADH · LANDSCAPE DESIGN & CARE</p>
            <h1>
              Make room<br />
              for <em>living.</em>
            </h1>
            <p className="hero-copy">
              Outdoor environments designed, built, renewed and cared for across Saudi Arabia—one living system from soil to shade.
            </p>
            <div className="hero-actions">
              <a className="button button-lime" href="#landscapes">Explore the landscape</a>
              <a className="text-link light-link" href="#services">See how we work <span>↓</span></a>
            </div>
          </div>

          <div className="hero-index" aria-label="Nascom at a glance">
            <span>EST. 2007</span>
            <span>RIYADH · JEDDAH · DAMMAM</span>
            <span>DESIGN · BUILD · CARE</span>
          </div>
        </section>

        <section className="intro section-shell" id="about">
          <div className="section-number">01</div>
          <div className="intro-heading">
            <p className="kicker">ROOTED IN RIYADH</p>
            <h2>A landscape is never finished. It is looked after.</h2>
          </div>
          <div className="intro-copy">
            <p className="lead">
              Since 2007, Nascom has delivered landscape design, construction, rehabilitation and maintenance for public and private environments.
            </p>
            <p>
              The work connects what is visible—planting, paths, shade and seasonal colour—with the systems beneath it: irrigation, planning, maintenance and responsive site care.
            </p>
            <a className="text-link" href="#care">Follow the living system <span>↘</span></a>
          </div>

          <div className="intro-visual">
            <figure className="intro-main-image">
              <img src="/images/concept-public-realm.png" alt="Conceptual Saudi public-realm landscape" />
              <figcaption>LANDSCAPE DIRECTION · RIYADH</figcaption>
            </figure>
            <div className="year-card">
              <strong>2007</strong>
              <span>Established<br />in Riyadh</span>
            </div>
            <figure className="intro-detail-image">
              <img src="/images/concept-care.png" alt="Landscape care team tending a planted environment" />
              <figcaption>CARE / SEASON / DETAIL</figcaption>
            </figure>
          </div>
        </section>

        <section className="services" id="services">
          <div className="services-copy section-shell">
            <div>
              <p className="kicker light">ONE LANDSCAPE · THREE CONTINUITIES</p>
              <h2>From first line<br />to lasting shade.</h2>
            </div>
            <p>
              Fewer handovers. Clearer responsibility. Nascom’s published landscape offer moves from construction to renewal and ongoing care.
            </p>
          </div>

          <div className="service-stage section-shell">
            <div className="service-image">
              <img src={services[activeService].image} alt="Landscape capability visualization" />
              <span>CAPABILITY / 0{activeService + 1}</span>
            </div>

            <div className="service-list">
              {services.map((service, index) => (
                <button
                  type="button"
                  key={service.title}
                  className={activeService === index ? "service-row is-active" : "service-row"}
                  onMouseEnter={() => setActiveService(index)}
                  onFocus={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                >
                  <span className="service-number">{service.number}</span>
                  <span className="service-text">
                    <strong>{service.title}</strong>
                    <small>{service.copy}</small>
                  </span>
                  <span className="service-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </div>

          <div className="capability-band" aria-label="Landscape capabilities">
            <div>
              <span>HARDSCAPE</span><i>✦</i><span>SOFTSCAPE</span><i>✦</i><span>IRRIGATION</span><i>✦</i><span>REHABILITATION</span><i>✦</i><span>MAINTENANCE</span><i>✦</i><span>SEASONAL PLANTING</span>
            </div>
          </div>
        </section>

        <section className="landscape-reel" id="landscapes">
          <div className="reel-heading section-shell">
            <div>
              <p className="kicker">LANDSCAPE CONTINUITIES</p>
              <h2>Ground that works<br />through every season.</h2>
            </div>
            <div className="reel-controls">
              <p>DRAG, SWIPE, OR USE THE ARROWS</p>
              <button type="button" onClick={() => moveReel(-1)} aria-label="Previous landscape">←</button>
              <button type="button" onClick={() => moveReel(1)} aria-label="Next landscape">→</button>
            </div>
          </div>

          <div className="reel-scroll-stage" ref={reelStageRef}>
            <div className="reel-sticky">
              <div
                className="reel"
                ref={reelRef}
                aria-label="Landscape service gallery"
                onPointerDown={startReelDrag}
                onPointerMove={dragReel}
                onPointerUp={stopReelDrag}
                onPointerCancel={stopReelDrag}
              >
            {landscapes.map((item) => (
              <article className="reel-card" key={item.number}>
                <div className="reel-image">
                  <img src={item.image} alt="" draggable={false} />
                  <span>{item.number}</span>
                </div>
                <div className="reel-caption">
                  <p>{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <span>{item.text}</span>
                </div>
              </article>
            ))}
            <article className="reel-card reel-card-cta">
              <p>THE NEXT LANDSCAPE</p>
              <h3>What should grow here?</h3>
              <a href="#contact">Share the site brief <span>↗</span></a>
            </article>
              </div>
              <div className="reel-progress" aria-hidden="true"><span /></div>
            </div>
          </div>
        </section>

        <section className="care section-shell" id="care">
          <div className="care-media">
            <img src="/images/concept-care.png" alt="Landscape professionals tending an irrigation line and planting" />
            <div className="care-stamp">
              <span>365</span>
              <small>DAYS OF<br />ATTENTION</small>
            </div>
          </div>
          <div className="care-content">
            <p className="kicker">THE CARE AFTER COMPLETION</p>
            <h2>Healthy ground is an operating system.</h2>
            <p className="lead">
              A garden changes every day. Planned maintenance keeps that change deliberate—protecting planting, water, pathways and the experience of the space.
            </p>
            <ol className="care-steps">
              <li><span>01</span><div><strong>Read the site</strong><small>Condition · climate · use</small></div></li>
              <li><span>02</span><div><strong>Plan the cycle</strong><small>Irrigation · pruning · nutrition</small></div></li>
              <li><span>03</span><div><strong>Care continuously</strong><small>Monitor · adapt · renew</small></div></li>
            </ol>
          </div>
        </section>

        <section className="published-work">
          <div className="section-shell work-grid">
            <div>
              <p className="kicker light">PUBLISHED PROJECT EXPERIENCE</p>
              <h2>Trusted across public and private environments.</h2>
            </div>
            <div className="client-list">
              {clients.map((client, index) => (
                <div key={client}><span>{String(index + 1).padStart(2, "0")}</span><strong>{client}</strong></div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-top section-shell">
            <p className="kicker light">LET THE SITE BREATHE</p>
            <h2>Start with the ground.<br /><em>Build what comes next.</em></h2>
            <p>Share the location, programme, scale and long-term care requirements with Nascom’s team.</p>
            <div className="contact-actions">
              <a className="button button-lime" href="mailto:info@landscape.sa?subject=Landscape%20project%20enquiry">Send a project brief ↗</a>
              <a className="text-link light-link" href="tel:920001459">Call 920001459 ↗</a>
            </div>
          </div>

          <div className="contact-grid section-shell">
            <div><span>GENERAL</span><a href="mailto:info@landscape.sa">info@landscape.sa</a></div>
            <div><span>RIYADH</span><a href="tel:920001459">920001459</a></div>
            <div><span>JEDDAH</span><a href="mailto:jbm@landscape.sa">jbm@landscape.sa</a></div>
            <div><span>DAMMAM</span><a href="mailto:dbm@landscape.sa">dbm@landscape.sa</a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/images/nascom-logo.png" alt="Nascom Landscaping" />
          <p>Design · Build · Rehabilitate · Maintain</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#about">Company</a>
          <a href="#services">Capabilities</a>
          <a href="#landscapes">Landscapes</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="footer-meta">
          <p>© 2026 NASCOM LANDSCAPING</p>
          <small>Independent website concept. Selected imagery is illustrative.</small>
        </div>
      </footer>
    </>
  );
}
