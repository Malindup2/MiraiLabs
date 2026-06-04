"use client";

import { useEffect, useRef, useState } from "react";

export default function Careers() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const jobs = [
    {
      title: "Senior Frontend Engineer (React/WebGL)",
      location: "Colombo / Hybrid",
      type: "Full-Time",
      description: "We are looking for a frontend specialist to craft high-fidelity interface layers, custom animation curves, and WebGL modules for our platform clients.",
      requirements: [
        "4+ years of professional React and Next.js production experience.",
        "Demonstrated mastery of raw CSS, Tailwind, and custom transitions.",
        "Strong familiarity with Three.js, shaders, or canvas-based pixel pipelines.",
        "A rigorous eye for micro-interactions and visual perfection."
      ]
    },
    {
      title: "Distributed Systems & Ledger Engineer",
      location: "Colombo / Remote Possible",
      type: "Full-Time",
      description: "Join our core database team to architect stateful transaction pipelines, ledger layers, and key-value replication protocols operating at high concurrency.",
      requirements: [
        "Deep fluency in Rust, Go, or C++ with async memory management.",
        "Familiarity with raft/consensus implementations and ledger structures.",
        "Experience optimizing database queries and custom indexing logic.",
        "Strong understanding of Linux network sockets and memory profiling."
      ]
    },
    {
      title: "DevOps & Platform Security Architect",
      location: "Tallinn / Dubai / Hybrid",
      type: "Full-Time",
      description: "Scale and defend multi-region Kubernetes deployments. Architect zero-trust networks, automated failovers, and secret management hierarchies.",
      requirements: [
        "Experience writing complex infrastructure as code (Terraform/Pulumi).",
        "Expertise in AWS, Cloudflare Enterprise routing, and security policies.",
        "Proficiency managing multi-tenant Kubernetes and service meshes (Istio).",
        "Knowledge of ISO 27001 compliance standards and database recovery routes."
      ]
    }
  ];

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
    const hoverElements = document.querySelectorAll('a, button, .job-row');
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
  }, [expandedJob]);

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
          <div className="section-label">Careers</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-white leading-[1.1] tracking-tight max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Build digital systems that <em>last.</em>
          </h1>
          <p className="text-[#777] text-lg max-w-2xl mt-4 leading-relaxed">
            We are looking for engineers and product creators who value technical rigor, visual beauty, and long-term codebase health.
          </p>
        </section>

        {/* OPEN ROLES */}
        <section className="py-10 px-6 md:px-12 lg:px-20 max-w-[1440px] mx-auto">
          <div className="section-label mb-8">Open Positions</div>
          <div className="border-t border-[rgba(255,255,255,0.05)] w-full">
            {jobs.map((job, idx) => (
              <div 
                key={idx} 
                className="job-row border-b border-[rgba(255,255,255,0.05)] py-8 transition-all duration-300 hover:bg-[rgba(255,255,255,0.01)]"
              >
                <div 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-none"
                  onClick={() => setExpandedJob(expandedJob === idx ? null : idx)}
                >
                  <div className="flex flex-col">
                    <h3 className="font-serif text-xl md:text-2xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {job.title}
                    </h3>
                    <div className="flex gap-4 text-xs text-[#555] uppercase tracking-wider mt-1.5">
                      <span>{job.location}</span>
                      <span>&bull;</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <button className="bg-transparent border-none text-[#777] text-xl font-light cursor-none">
                    {expandedJob === idx ? "—" : "+"}
                  </button>
                </div>

                {expandedJob === idx && (
                  <div className="mt-6 text-sm text-[#777] leading-relaxed max-w-2xl animate-fadeIn">
                    <p className="mb-4">{job.description}</p>
                    <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-2">Key Qualifications</h4>
                    <ul className="list-disc pl-5 flex flex-col gap-2 mb-6">
                      {job.requirements.map((req, rIdx) => (
                        <li key={rIdx}>{req}</li>
                      ))}
                    </ul>
                    <a href="/contact" className="btn-primary py-2.5 px-6 text-xs inline-block cursor-none">
                      Apply For Role &rarr;
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-20 px-6 md:py-[100px] md:px-12 lg:px-20 max-w-[1440px] mx-auto border-t border-[rgba(189,189,189,0.15)] flex flex-col gap-12">
          <div className="section-label">Engineering Environment</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-[20px]">
              <h4 className="font-serif text-lg text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>High-End Workstations</h4>
              <p className="text-xs text-[#777] leading-relaxed">
                We equip our team with high-performance hardware, mechanical keyboards, noise-canceling headsets, and clean physical workspaces.
              </p>
            </div>
            <div className="p-6 bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-[20px]">
              <h4 className="font-serif text-lg text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>R&D Allocation</h4>
              <p className="text-xs text-[#777] leading-relaxed">
                Spend up to 10% of your engineering week studying emerging system configurations, Web3 ledger protocols, or custom graphics frameworks.
              </p>
            </div>
            <div className="p-6 bg-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.03)] rounded-[20px]">
              <h4 className="font-serif text-lg text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Global Mobility</h4>
              <p className="text-xs text-[#777] leading-relaxed">
                Work dynamically from our development labs in Colombo, or connect with our clients and nodes in Estonia, UAE, and Tokyo.
              </p>
            </div>
          </div>
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
