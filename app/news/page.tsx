"use client";

import { useEffect, useRef, useState } from "react";

export default function News() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Engineering", "Systems", "AI & Automation", "Insights"];
  const [activeCategory, setActiveCategory] = useState("All");

  const articles = [
    {
      title: "Architecting a Real-Time Transaction Ledger for High-Frequency Systems",
      category: "Engineering",
      date: "May 28, 2026",
      readTime: "8 min read",
      summary: "How we leveraged memory-mapped databases and parallel thread structures to design a high-frequency ledger processing 50k transactions per second with sub-millisecond latencies.",
    },
    {
      title: "Demystifying Zero-Knowledge Proofs in Enterprise Supply Chains",
      category: "Systems",
      date: "May 12, 2026",
      readTime: "12 min read",
      summary: "An in-depth look at implementing ZK-SNARKs to guarantee private transactions inside multi-tenant industrial logistics databases without losing performance.",
    },
    {
      title: "Optimizing WebGL Render Loops for Complex 3D Particle Environments",
      category: "Engineering",
      date: "Apr 20, 2026",
      readTime: "6 min read",
      summary: "A practical guide to GPU instancing, vertex shader math, and manual garbage cleanup routines inside interactive Three.js scenes to guarantee 60fps rendering.",
    },
    {
      title: "Mirai Labs Partners with UAE Venture Firm to Pioneer ledger platforms",
      category: "Insights",
      date: "Mar 15, 2026",
      readTime: "3 min read",
      summary: "Announcing our new engineering collaboration in Dubai to build secure multi-signature custodian frameworks for enterprise digital assets.",
    },
    {
      title: "Automating Cloud Scaling Policies with Lightweight Reinforcement Learning",
      category: "AI & Automation",
      date: "Feb 28, 2026",
      readTime: "10 min read",
      summary: "Replacing complex heuristics with custom agentic models to predict cloud resource requirements, cutting AWS runtime fees by up to 30%.",
    }
  ];

  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;
    let ringAnimFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      ringAnimFrameId = requestAnimationFrame(animRing);
    };
    animRing();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .category-btn, .article-card');
    const onMouseEnter = () => {
      if (cursor && ring) {
        cursor.style.width = '14px';
        cursor.style.height = '14px';
        ring.style.width = '44px';
        ring.style.height = '44px';
      }
    };
    const onMouseLeave = () => {
      if (cursor && ring) {
        cursor.style.width = '6px';
        cursor.style.height = '6px';
        ring.style.width = '28px';
        ring.style.height = '28px';
      }
    };

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(ringAnimFrameId);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, [filteredArticles]);

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>

      {/* NAV */}
      <nav id="navbar" className="scrolled">
        <a href="/" className="nav-logo">Mirai <span>Labs</span></a>
        <ul className="nav-links">
          <li><a href="/about">About</a></li>
          <li><a href="/news">News</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="/contact" className="nav-cta">Start a Project</a>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="below-hero min-h-screen pt-40">
        {/* HERO SECTION */}
        <section className="py-20 px-6 md:py-[100px] md:px-12 lg:px-20 max-w-[1440px] mx-auto flex flex-col gap-6">
          <div className="section-label">Editorial & Lab Notes</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-[1.1] tracking-tight max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Deep insights on modern <em>engineering.</em>
          </h1>
          <p className="text-[#777] text-lg max-w-2xl mt-4 leading-relaxed">
            Written by engineers and designers. Discover architectural case studies, platform announcements, and our work on ledger protocols.
          </p>
        </section>

        {/* FILTERS */}
        <section className="px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto mb-10">
          <div className="flex flex-wrap gap-3 border-b border-[rgba(255,255,255,0.05)] pb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-btn px-5 py-2.5 rounded-full border text-xs uppercase tracking-wider transition-all duration-300 bg-transparent ${cat === activeCategory ? 'border-white text-white font-medium bg-[rgba(255,255,255,0.03)]' : 'border-[rgba(255,255,255,0.1)] text-[#777]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((art, idx) => (
              <div 
                key={idx}
                className="article-card p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.02)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center text-xs tracking-wider uppercase">
                    <span className="text-white bg-[rgba(255,255,255,0.05)] px-3 py-1 rounded border border-[rgba(255,255,255,0.05)]">{art.category}</span>
                    <span className="text-[#555]">{art.date}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {art.title}
                  </h3>
                  <p className="text-sm text-[#777] leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="flex justify-between items-center border-t border-[rgba(255,255,255,0.05)] pt-6 mt-8">
                  <span className="text-xs text-[#555]">{art.readTime}</span>
                  <a href="#" className="text-sm font-medium text-white hover:text-[#bdbdbd] transition-colors duration-300 no-underline flex items-center gap-1">
                    Read Article <span className="text-[10px]">&rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="py-20 text-center text-[#555] text-sm">No articles found in this category.</div>
          )}
        </section>

        {/* PREMIUM FOOTER */}
        <footer className="w-full border-t border-[rgba(255,255,255,0.05)] bg-[#030303] mt-20 pt-20 pb-10">
          <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col gap-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 animate-fadeUp">
              {/* Column 1: Info & Socials */}
              <div className="flex flex-col gap-6">
                <a href="/" className="nav-logo text-white font-medium text-xl tracking-tight flex items-baseline gap-1" style={{ textDecoration: 'none' }}>
                  Mirai <span className="font-serif italic text-gray-400 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Labs</span>
                </a>
                <p className="text-sm text-[#777] leading-relaxed">
                  Engineering digital products with absolute precision, modern aesthetics, and long-term sustainability.
                </p>
                <div className="flex gap-3 mt-2">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-[rgba(255,255,255,0.01)] cursor-none transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-white" aria-label="LinkedIn Profile">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-[rgba(255,255,255,0.01)] cursor-none transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-white" aria-label="Twitter X Profile">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-[rgba(255,255,255,0.01)] cursor-none transition-all duration-300 hover:bg-white hover:text-black hover:border-white text-white" aria-label="GitHub Repository">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.579 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2: Navigation */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#555]">Navigation</h4>
                <ul className="flex flex-col gap-3 list-none p-0 m-0">
                  <li><a href="/" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">Work</a></li>
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">Services</a></li>
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">About</a></li>
                  <li><a href="/contact" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">Contact</a></li>
                </ul>
              </div>

              {/* Column 3: Capabilities */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#555]">Services</h4>
                <ul className="flex flex-col gap-3 list-none p-0 m-0">
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">Software Development</a></li>
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">Web Platforms</a></li>
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">Mobile Development</a></li>
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 cursor-none no-underline">AI & DevOps</a></li>
                </ul>
              </div>

              {/* Column 4: Newsletter */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#555]">Start a Project</h4>
                <p className="text-sm text-[#777]">
                  Ready to build something lasting? Subscribe to get engineering updates.
                </p>
                <div className="flex relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors duration-300 cursor-none"
                  />
                  <button className="absolute right-2 top-1.5 bottom-1.5 w-9 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm cursor-none transition-transform duration-300 hover:scale-105">
                    &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs text-[#555]">
                &copy; {new Date().getFullYear()} Mirai Labs. Built with precision and care.
              </span>
              <div className="flex gap-6">
                <a href="#" className="text-xs text-[#555] hover:text-white transition-colors duration-300 cursor-none no-underline">Privacy Policy</a>
                <a href="#" className="text-xs text-[#555] hover:text-white transition-colors duration-300 cursor-none no-underline">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
