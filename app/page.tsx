"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import StackIcon from "tech-stack-icons";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const decomposeLabelRef = useRef<HTMLDivElement>(null);
  const reassembleFlashRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "The engineering rigor Mirai Labs brought to our core cloud infrastructure allowed us to scale from thousands to millions of active users without a single minute of downtime.",
      author: "Sarah Jenkins",
      role: "CTO",
      company: "Velo Financial"
    },
    {
      quote: "Mirai Labs doesn’t just write code. They architected our AI data ingestion pipeline with absolute precision. Their team operates at a level we haven't seen elsewhere.",
      author: "Marcus Thorne",
      role: "Head of Engineering",
      company: "Aether Core"
    },
    {
      quote: "Their custom software systems transformed our operations. The codebase is clean, the documentation is impeccable, and their support is unmatched.",
      author: "Elena Rostova",
      role: "Director of Product",
      company: "Zenith Logix"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  useEffect(() => {
    // ─── CURSOR ───────────────────────────────────────────────────────────
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
    const hoverElements = document.querySelectorAll('a, button, .service-item, [class*="col-span"], .group.relative');
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

    // ─── SCROLL STATE & NAV ───────────────────────────────────────────────
    const navbar = navbarRef.current;
    const heroContainer = heroContainerRef.current;
    const progressBar = progressBarRef.current;

    let scrollProgress = 0; // 0→1 across the hero scroll zone

    const onScroll = () => {
      if (heroContainer) {
        const rect = heroContainer.getBoundingClientRect();
        const total = heroContainer.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        scrollProgress = Math.max(0, Math.min(1, scrolled / total));
      }

      // nav
      if (navbar) {
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // progress bar
      if (progressBar) {
        const totalPage = document.body.scrollHeight - window.innerHeight;
        progressBar.style.width = (window.scrollY / totalPage * 100) + '%';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger once on mount
    onScroll();

    // ─── THREE.JS SETUP ───────────────────────────────────────────────────
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.set(0, 0, 6);

    // ─── GEOMETRY: Icosahedron + wireframe ─────────────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const edges = new THREE.EdgesGeometry(icoGeo);

    // wireframe lines — the "form"
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
    const wireframe = new THREE.LineSegments(edges, wireMat);
    scene.add(wireframe);

    // inner solid (subtle)
    const solidMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.6, side: THREE.FrontSide });
    const solid = new THREE.Mesh(icoGeo, solidMat);
    scene.add(solid);

    // ─── PARTICLES: face centers that explode on scroll ────────────────
    const ICO_DETAIL = 1;
    const baseFaceGeo = new THREE.IcosahedronGeometry(1.8, ICO_DETAIL);
    const posAttr = baseFaceGeo.getAttribute('position') as THREE.BufferAttribute;

    // collect unique face centers
    const faceCenters: THREE.Vector3[] = [];
    for (let i = 0; i < posAttr.count; i += 3) {
      const ax = posAttr.getX(i), ay = posAttr.getY(i), az = posAttr.getZ(i);
      const bx = posAttr.getX(i+1), by = posAttr.getY(i+1), bz = posAttr.getZ(i+1);
      const cx = posAttr.getX(i+2), cy = posAttr.getY(i+2), cz = posAttr.getZ(i+2);
      faceCenters.push(new THREE.Vector3((ax+bx+cx)/3, (ay+by+cy)/3, (az+bz+cz)/3));
    }

    // explode particles — small triangle-like marks at face centers
    const PARTICLE_COUNT = faceCenters.length;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pTargets: THREE.Vector3[] = []; // exploded targets
    const pOrigins: THREE.Vector3[] = []; // original positions

    faceCenters.forEach((fc, i) => {
      pPositions[i*3]   = fc.x;
      pPositions[i*3+1] = fc.y;
      pPositions[i*3+2] = fc.z;
      pOrigins.push(fc.clone());
      // explode outward + slight random drift
      const dir = fc.clone().normalize();
      const spread = 4.5 + Math.random() * 3;
      const drift = new THREE.Vector3((Math.random()-.5)*.8, (Math.random()-.5)*.8, (Math.random()-.5)*.8);
      pTargets.push(dir.multiplyScalar(spread).add(drift));
    });

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // additional small dot cloud around the structure
    const CLOUD_COUNT = 280;
    const cloudGeo = new THREE.BufferGeometry();
    const cloudPos = new Float32Array(CLOUD_COUNT * 3);
    const cloudTargets: THREE.Vector3[] = [];
    const cloudOrigins: THREE.Vector3[] = [];
    for (let i = 0; i < CLOUD_COUNT; i++) {
      // start ON the sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8;
      cloudPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      cloudPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      cloudPos[i*3+2] = r * Math.cos(phi);
      cloudOrigins.push(new THREE.Vector3(cloudPos[i*3], cloudPos[i*3+1], cloudPos[i*3+2]));
      const far = 6 + Math.random() * 5;
      const tTheta = Math.random() * Math.PI * 2;
      const tPhi = Math.acos(2 * Math.random() - 1);
      cloudTargets.push(new THREE.Vector3(far * Math.sin(tPhi) * Math.cos(tTheta), far * Math.sin(tPhi) * Math.sin(tTheta), far * Math.cos(tPhi)));
    }
    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
    const cloudMat = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.03, transparent: true, opacity: 0 });
    const cloud = new THREE.Points(cloudGeo, cloudMat);
    scene.add(cloud);

    // ─── RESIZE ───────────────────────────────────────────────────────────
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    // Helper math functions
    const lerpVal = (a: number, b: number, t: number) => a + (b - a) * t;
    const clampVal = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const easeOutVal = (t: number) => 1 - Math.pow(1-t, 3);

    let lerpedProgress = 0;
    let lastFlash = -1;

    const heroContent = heroContentRef.current;
    const decomposeLabel = decomposeLabelRef.current;
    const reassembleFlash = reassembleFlashRef.current;

    const updateParticles = (progress: number) => {
      const explode = easeOutVal(clampVal(progress * 2, 0, 1)); // first half = explode
      const reform  = progress > 0.5 ? easeOutVal(clampVal((progress - 0.5) * 2, 0, 1)) : 0; // second half = reform

      // face particles
      const pPos = particleGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ox = pOrigins[i].x, oy = pOrigins[i].y, oz = pOrigins[i].z;
        const tx = pTargets[i].x, ty = pTargets[i].y, tz = pTargets[i].z;
        if (reform > 0) {
          // reform: lerp from target back to origin
          pPos.setXYZ(i, lerpVal(tx, ox, reform), lerpVal(ty, oy, reform), lerpVal(tz, oz, reform));
        } else {
          pPos.setXYZ(i, lerpVal(ox, tx, explode), lerpVal(oy, ty, explode), lerpVal(oz, tz, explode));
        }
      }
      pPos.needsUpdate = true;

      // cloud
      const cPos = cloudGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < CLOUD_COUNT; i++) {
        const ox = cloudOrigins[i].x, oy = cloudOrigins[i].y, oz = cloudOrigins[i].z;
        const tx = cloudTargets[i].x, ty = cloudTargets[i].y, tz = cloudTargets[i].z;
        if (reform > 0) {
          cPos.setXYZ(i, lerpVal(tx, ox, reform), lerpVal(ty, oy, reform), lerpVal(tz, oz, reform));
        } else {
          cPos.setXYZ(i, lerpVal(ox, tx, explode), lerpVal(oy, ty, explode), lerpVal(oz, tz, explode));
        }
      }
      cPos.needsUpdate = true;

      // wireframe + solid opacity fade
      const wireOpacity = 1 - clampVal(explode * 2.5, 0, 1);
      wireMat.opacity = wireOpacity * 0.55;
      solidMat.opacity = wireOpacity * 0.6;

      // particle opacity
      const pOpacity = clampVal(explode * 2, 0, 1) * (1 - reform * 0.7);
      particleMat.opacity = pOpacity;
      cloudMat.opacity = pOpacity * 0.6;

      // hero text fade out
      if (heroContent) {
        const textFade = 1 - clampVal(progress * 5, 0, 1);
        heroContent.style.opacity = textFade.toString();
        heroContent.style.transform = `translateY(${(1 - textFade) * 20}px)`;
      }

      // decompose label
      if (decomposeLabel) {
        const labelShow = clampVal((progress - 0.15) * 6, 0, 1) * (1 - clampVal((progress - 0.7) * 6, 0, 1));
        decomposeLabel.style.opacity = labelShow.toString();
      }

      // reform flash
      if (reassembleFlash && reform > 0.05 && reform < 0.3 && Math.floor(progress * 100) !== lastFlash) {
        lastFlash = Math.floor(progress * 100);
        reassembleFlash.style.opacity = '0.4';
        setTimeout(() => {
          if (reassembleFlash) reassembleFlash.style.opacity = '0';
        }, 200);
      }
    };

    // ─── ANIMATION LOOP ──────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let threeAnimFrameId: number;

    const animate = () => {
      threeAnimFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // smooth lerp toward scroll target
      lerpedProgress += (scrollProgress - lerpedProgress) * 0.06;

      updateParticles(lerpedProgress);

      // gentle rotation — slows during decompose
      const rotSpeed = 1 - lerpedProgress * 0.6;
      wireframe.rotation.y = elapsed * 0.18 * rotSpeed;
      wireframe.rotation.x = elapsed * 0.08 * rotSpeed;
      solid.rotation.y = wireframe.rotation.y;
      solid.rotation.x = wireframe.rotation.x;
      particles.rotation.y = elapsed * 0.04;
      cloud.rotation.y = -elapsed * 0.03;

      // subtle camera drift
      camera.position.x = Math.sin(elapsed * 0.3) * 0.15;
      camera.position.y = Math.cos(elapsed * 0.2) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // ─── SCROLL REVEAL ───────────────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

    reveals.forEach(el => revealObs.observe(el));

    // ─── CLEANUP ─────────────────────────────────────────────────────────
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(ringAnimFrameId);
      cancelAnimationFrame(threeAnimFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      revealObs.disconnect();

      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });

      // Dispose Three.js objects
      icoGeo.dispose();
      edges.dispose();
      wireMat.dispose();
      solidMat.dispose();
      baseFaceGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>
      <div className="progress-bar" id="progressBar" ref={progressBarRef}></div>

      {/* NAV */}
      <nav id="navbar" ref={navbarRef}>
        <a href="/" className="nav-logo">Mirai <span>Labs</span></a>
        <ul className="nav-links">
          <li><a href="/about">About</a></li>
          <li><a href="/news">News</a></li>
          <li><a href="/careers">Careers</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
        <a href="/contact" className="nav-cta">Start a Project</a>
      </nav>

      {/* HERO — scroll container */}
      <div className="hero-scroll-container" id="heroScrollContainer" ref={heroContainerRef}>
        <div className="hero-sticky" id="heroSticky">
          <video
            src="/robot_asset.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-35 pointer-events-none"
          ></video>
          <canvas id="three-canvas" ref={canvasRef}></canvas>
          <div className="hero-grid"></div>
          <div className="reassemble-flash" id="reassembleFlash" ref={reassembleFlashRef}></div>

          {/* decompose state label */}
          <div className="decompose-label" id="decomposeLabel" ref={decomposeLabelRef}>
            <h2>Systems in motion.</h2>
          </div>

          {/* hero text (visible at top, fades at scroll) */}
          <div className="hero-content" id="heroContent" ref={heroContentRef}>
            <div className="hero-left">
              <div className="hero-eyebrow">Colombo, Sri Lanka — Est. 2024</div>
              <h1 className="hero-title">
                Engineering<br />
                <em>digital</em><br />
                products.
              </h1>
            </div>
            <div className="hero-right">
              <p className="hero-sub">We build systems that last — web platforms, mobile applications, AI infrastructure, and enterprise software for ambitious businesses.</p>
              <div className="hero-actions">
                <a href="#" className="btn-primary">Start a Project</a>
                <a href="#" className="btn-ghost">View Our Work</a>
              </div>
            </div>
          </div>

          <div className="scroll-hint">
            <div className="scroll-line"></div>
            <span>Scroll</span>
          </div>
        </div>
      </div>

      {/* BELOW HERO */}
      <div className="below-hero">
        <section className="statement">
          <div className="reveal">
            <h2>We don&apos;t chase<br />trends. We build<br /><em>systems that last.</em></h2>
          </div>
          <div className="reveal">
            <p>Every engagement starts with deep understanding — of your users, your market, your ambitions. Then we engineer with precision and care for the long term.</p>
          </div>
        </section>

        <section className="services reveal">
          <div className="section-label">Our Capabilities</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#555] font-semibold group-hover:text-[#777] transition-colors duration-300">01</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-white leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Custom Software Development
                </h3>
                <p className="text-xs text-[#777] leading-relaxed">
                  Robust backend architectures, custom APIs, and stateful databases engineered with Rust, Go, and C++ for mission-critical operations.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white mt-8 transition-colors duration-300">
                <span>Explore Tech Specs</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
                    </svg>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#555] font-semibold group-hover:text-[#777] transition-colors duration-300">02</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-white leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Web Platforms
                </h3>
                <p className="text-xs text-[#777] leading-relaxed">
                  High-performance Next.js systems, real-time dashboards, and WebGL modules matching speed with flawless visual excellence.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white mt-8 transition-colors duration-300">
                <span>Explore Platforms</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                    </svg>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#555] font-semibold group-hover:text-[#777] transition-colors duration-300">03</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-white leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Mobile Development
                </h3>
                <p className="text-xs text-[#777] leading-relaxed">
                  Native and cross-platform mobile apps for iOS and Android built for offline-first reliability and fluid UX.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white mt-8 transition-colors duration-300">
                <span>Explore Native Specs</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21m0 0-.766-4.65m.766 4.65h7.125m-12.75 0h.008v.008H3.375V21Zm1.2-4.975L12 3.75l7.425 12.275a2.25 2.25 0 0 1-1.925 3.413H6.5a2.25 2.25 0 0 1-1.925-3.413Z" />
                    </svg>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#555] font-semibold group-hover:text-[#777] transition-colors duration-300">04</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-white leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Artificial Intelligence
                </h3>
                <p className="text-xs text-[#777] leading-relaxed">
                  Intelligent data pipelines, custom LLM fine-tuning, and reinforcement agents designed to automate complex corporate workflows.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white mt-8 transition-colors duration-300">
                <span>Explore Models</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group relative p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21m-1.414-7.071-.707.707m-11.314 11.314-.707.707m12.728 0-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L12 12m0 0L6.343 6.343M12 12l5.657 5.657M12 12l-5.657 5.657M12 12l5.657-5.657" />
                    </svg>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#555] font-semibold group-hover:text-[#777] transition-colors duration-300">05</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-white leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Infrastructure & DevOps
                </h3>
                <p className="text-xs text-[#777] leading-relaxed">
                  Kubernetes orchestration, zero-downtime pipelines, zero-trust configurations, and secure cloud pipelines.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white mt-8 transition-colors duration-300">
                <span>Explore Architectures</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="group relative p-8 md:p-10 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[300px]" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center w-full">
                  <span className="text-white text-opacity-80 group-hover:text-opacity-100 transition-all duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                    </svg>
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[#555] font-semibold group-hover:text-[#777] transition-colors duration-300">06</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-white leading-tight mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Product Strategy
                </h3>
                <p className="text-xs text-[#777] leading-relaxed">
                  Collaborative workshops, interactive wireframes, detailed platform scope blueprints, and bespoke corporate identity libraries.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#555] group-hover:text-white mt-8 transition-colors duration-300">
                <span>Explore Strategies</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>
          </div>
        </section>

        {/* TECH STACK MARQUEE */}
        <section className="tech-stack reveal">
          <div className="section-label">Our Tech Stack</div>
          <div className="marquee-container">
            <div className="marquee-row marquee-left">
              <div className="marquee-track">
                {[...Array(2)].map((_, trackIdx) => (
                  <div key={`track-${trackIdx}`} className="flex gap-[64px] flex-nowrap shrink-0">
                    <div className="marquee-item"><StackIcon name="angular" /></div>
                    <div className="marquee-item"><StackIcon name="react" /></div>
                    <div className="marquee-item"><StackIcon name="aws" /></div>
                    <div className="marquee-item"><StackIcon name="docker" /></div>
                    <div className="marquee-item"><StackIcon name="kubernetes" /></div>
                    <div className="marquee-item"><StackIcon name="redis" /></div>
                    <div className="marquee-item"><StackIcon name="graphql" /></div>
                    <div className="marquee-item"><StackIcon name="go" /></div>
                    <div className="marquee-item"><StackIcon name="django" /></div>
                    <div className="marquee-item"><StackIcon name="nextjs" /></div>
                    <div className="marquee-item"><StackIcon name="typescript" /></div>
                    <div className="marquee-item"><StackIcon name="nodejs" /></div>
                    <div className="marquee-item"><StackIcon name="python" /></div>
                    <div className="marquee-item"><StackIcon name="mongodb" /></div>
                    <div className="marquee-item"><StackIcon name="postgresql" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WE WORK WITH (GLOBAL FOOTPRINT) */}
        <section className="py-20 px-5 md:py-[120px] md:px-10 max-w-[1440px] mx-auto border-t border-[rgba(189,189,189,0.15)] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="section-label">Global Footprint</div>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              We work with partners across the globe.
            </h2>
            <p className="text-sm text-[#777] leading-relaxed max-w-md">
              From our main engineering center in Colombo, Sri Lanka, we design and support production systems operating globally. Hover over a location to see our reach.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-6">
              <button 
                className={`px-4 py-2.5 rounded-full border text-xs uppercase tracking-wider transition-all duration-300 cursor-none ${activeCountry === 'sri-lanka' ? 'bg-white text-black border-white font-medium' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] text-[#777] hover:text-white hover:border-white'}`}
                onMouseEnter={() => setActiveCountry('sri-lanka')}
                onMouseLeave={() => setActiveCountry(null)}
              >
                Sri Lanka
              </button>
              <button 
                className={`px-4 py-2.5 rounded-full border text-xs uppercase tracking-wider transition-all duration-300 cursor-none ${activeCountry === 'uae' ? 'bg-white text-black border-white font-medium' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] text-[#777] hover:text-white hover:border-white'}`}
                onMouseEnter={() => setActiveCountry('uae')}
                onMouseLeave={() => setActiveCountry(null)}
              >
                United Arab Emirates
              </button>
              <button 
                className={`px-4 py-2.5 rounded-full border text-xs uppercase tracking-wider transition-all duration-300 cursor-none ${activeCountry === 'estonia' ? 'bg-white text-black border-white font-medium' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] text-[#777] hover:text-white hover:border-white'}`}
                onMouseEnter={() => setActiveCountry('estonia')}
                onMouseLeave={() => setActiveCountry(null)}
              >
                Estonia
              </button>
              <button 
                className={`px-4 py-2.5 rounded-full border text-xs uppercase tracking-wider transition-all duration-300 cursor-none ${activeCountry === 'japan' ? 'bg-white text-black border-white font-medium' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] text-[#777] hover:text-white hover:border-white'}`}
                onMouseEnter={() => setActiveCountry('japan')}
                onMouseLeave={() => setActiveCountry(null)}
              >
                Japan
              </button>
            </div>

            {/* Dynamic detail label */}
            <div className="h-12 mt-6 flex items-center">
              {activeCountry === 'sri-lanka' && <p className="text-xs uppercase tracking-widest text-[#999] animate-fadeIn">Colombo — Core R&D & Engineering Hub</p>}
              {activeCountry === 'uae' && <p className="text-xs uppercase tracking-widest text-[#999] animate-fadeIn">Dubai — Digital Infrastructure & FinTech Hub</p>}
              {activeCountry === 'estonia' && <p className="text-xs uppercase tracking-widest text-[#999] animate-fadeIn">Tallinn — Ledger Systems & Digital Identity Lab</p>}
              {activeCountry === 'japan' && <p className="text-xs uppercase tracking-widest text-[#999] animate-fadeIn">Tokyo — Industrial Automation & Integrations Space</p>}
              {!activeCountry && <p className="text-xs uppercase tracking-widest text-transparent select-none">&nbsp;</p>}
            </div>
          </div>
          <div className="relative w-full h-[400px] bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* World Map Background Image */}
            <img src="/map.png" alt="World Map" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />

            {/* Glowing lines connecting Sri Lanka to UAE, Estonia, Japan */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Sri Lanka (650, 310) to Estonia (480, 160) */}
              <path 
                d="M650 310 Q 565 235 480 160" 
                fill="none" 
                stroke={activeCountry === 'estonia' ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'} 
                strokeWidth={activeCountry === 'estonia' ? '2.5' : '1'} 
                className="transition-all duration-300"
              />
              {/* Sri Lanka (650, 310) to UAE (550, 240) */}
              <path 
                d="M650 310 Q 600 275 550 240" 
                fill="none" 
                stroke={activeCountry === 'uae' ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'} 
                strokeWidth={activeCountry === 'uae' ? '2.5' : '1'} 
                className="transition-all duration-300"
              />
              {/* Sri Lanka (650, 310) to Japan (820, 190) */}
              <path 
                d="M650 310 Q 735 250 820 190" 
                fill="none" 
                stroke={activeCountry === 'japan' ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'} 
                strokeWidth={activeCountry === 'japan' ? '2.5' : '1'} 
                className="transition-all duration-300"
              />
            </svg>

            {/* Markers with Flags & Blinking dots */}
            {/* 1. Estonia */}
            <div 
              className={`absolute transition-all duration-500 flex flex-col items-center gap-2 ${activeCountry === 'estonia' ? 'scale-110 z-10' : 'opacity-70 scale-100 z-0'}`}
              style={{ left: '48%', top: '32%' }}
            >
              <div className="relative group flex flex-col items-center">
                <img 
                  src="/flag-for-flag-estonia-svgrepo-com.svg" 
                  alt="Estonia Flag" 
                  className={`w-9 h-6 object-cover rounded shadow-lg border transition-all duration-300 ${activeCountry === 'estonia' ? 'border-white' : 'border-[rgba(255,255,255,0.15)]'}`}
                />
                <span className="absolute -top-6 text-[10px] tracking-wider uppercase font-medium bg-black px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.1)] text-white whitespace-nowrap">Estonia</span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 animate-ping absolute -bottom-1"></span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 absolute -bottom-1"></span>
              </div>
            </div>

            {/* 2. UAE */}
            <div 
              className={`absolute transition-all duration-500 flex flex-col items-center gap-2 ${activeCountry === 'uae' ? 'scale-110 z-10' : 'opacity-70 scale-100 z-0'}`}
              style={{ left: '55%', top: '48%' }}
            >
              <div className="relative group flex flex-col items-center">
                <img 
                  src="/united-arab-emirates-svgrepo-com.svg" 
                  alt="UAE Flag" 
                  className={`w-9 h-6 object-cover rounded shadow-lg border transition-all duration-300 ${activeCountry === 'uae' ? 'border-white' : 'border-[rgba(255,255,255,0.15)]'}`}
                />
                <span className="absolute -top-6 text-[10px] tracking-wider uppercase font-medium bg-black px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.1)] text-white whitespace-nowrap">UAE</span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 animate-ping absolute -bottom-1"></span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 absolute -bottom-1"></span>
              </div>
            </div>

            {/* 3. Sri Lanka */}
            <div 
              className={`absolute transition-all duration-500 flex flex-col items-center gap-2 ${activeCountry === 'sri-lanka' ? 'scale-110 z-10' : 'scale-100 z-0'}`}
              style={{ left: '65%', top: '62%' }}
            >
              <div className="relative group flex flex-col items-center">
                <img 
                  src="/flag-for-flag-sri-lanka-svgrepo-com.svg" 
                  alt="Sri Lanka Flag" 
                  className={`w-9 h-6 object-cover rounded shadow-lg border transition-all duration-300 ${activeCountry === 'sri-lanka' ? 'border-white' : 'border-[rgba(255,255,255,0.3)]'}`}
                />
                <span className="absolute -top-6 text-[10px] tracking-wider uppercase font-medium bg-black px-1.5 py-0.5 rounded border border-white text-white whitespace-nowrap">Sri Lanka (HQ)</span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 animate-ping absolute -bottom-1"></span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 absolute -bottom-1"></span>
              </div>
            </div>

            {/* 4. Japan */}
            <div 
              className={`absolute transition-all duration-500 flex flex-col items-center gap-2 ${activeCountry === 'japan' ? 'scale-110 z-10' : 'opacity-70 scale-100 z-0'}`}
              style={{ left: '82%', top: '38%' }}
            >
              <div className="relative group flex flex-col items-center">
                <img 
                  src="/japan-svgrepo-com.svg" 
                  alt="Japan Flag" 
                  className={`w-9 h-6 object-cover rounded shadow-lg border transition-all duration-300 ${activeCountry === 'japan' ? 'border-white' : 'border-[rgba(255,255,255,0.15)]'}`}
                />
                <span className="absolute -top-6 text-[10px] tracking-wider uppercase font-medium bg-black px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.1)] text-white whitespace-nowrap">Japan</span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 animate-ping absolute -bottom-1"></span>
                <span className="w-2.5 h-2.5 bg-white rounded-full mt-1.5 absolute -bottom-1"></span>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACES COLLAGE */}
        <section className="py-20 px-5 md:py-[120px] md:px-10 max-w-[1440px] mx-auto border-t border-[rgba(189,189,189,0.15)] flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-4">
              <div className="section-label">Our Workspaces</div>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Where precision is <em>engineered.</em>
              </h2>
            </div>
            <p className="text-sm text-[#777] max-w-sm leading-relaxed">
              Our engineering labs and innovation hubs are designed to inspire focus, rigorous prototyping, and cross-border collaboration.
            </p>
          </div>

          {/* Asymmetric Collage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[220px] md:auto-rows-[320px]">
            {/* 1. Colombo Hub */}
            <div className="md:col-span-8 md:row-span-1 relative rounded-[32px] overflow-hidden group border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-500">
              <img src="/colombo.jpg" alt="Colombo HQ" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1.5 z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#555] group-hover:text-white transition-colors duration-300">Engineering Headquarters</span>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Colombo R&D</h3>
              </div>
            </div>

            {/* 2. Tallinn Node */}
            <div className="md:col-span-4 md:row-span-1 relative rounded-[32px] overflow-hidden group border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-500">
              <img src="/tallin.jpg" alt="Tallinn Office" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1.5 z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#555] group-hover:text-white transition-colors duration-300">Distributed Identity Node</span>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tallinn Lab</h3>
              </div>
            </div>

            {/* 3. Japan Lab */}
            <div className="md:col-span-6 md:row-span-1 relative rounded-[32px] overflow-hidden group border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-500">
              <img src="/japan.jpg" alt="Japan Office" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1.5 z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#555] group-hover:text-white transition-colors duration-300">Automation & Integration</span>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Tokyo Space</h3>
              </div>
            </div>

            {/* 4. Innovation Hub */}
            <div className="md:col-span-6 md:row-span-1 relative rounded-[32px] overflow-hidden group border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-500">
              <img src="/innovation-hub.jpg" alt="Innovation Hub" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1.5 z-10">
                <span className="text-[10px] uppercase tracking-widest text-[#555] group-hover:text-white transition-colors duration-300">Design & Prototyping</span>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Innovation Hub</h3>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS CAROUSEL */}
        <section className="py-20 px-5 md:py-[120px] md:px-10 max-w-[1440px] mx-auto border-t border-[rgba(189,189,189,0.15)] flex flex-col">
          <div className="section-label">Client Feedback</div>
          <div className="max-w-[800px] mx-auto w-full flex flex-col gap-9 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-6 md:p-[50px_60px] relative shadow-2xl" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
            <div className="flex flex-col gap-6">
              <p className="italic font-light leading-[1.45] text-[#cccccc] text-center text-[20px] md:text-[26px]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                &ldquo;{testimonials[activeIndex].quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2 text-[11px] tracking-[0.08em] uppercase text-[#555]">
                <span className="text-white font-medium">{testimonials[activeIndex].author}</span>
                <span className="text-[rgba(255,255,255,0.15)]">/</span>
                <span className="text-[#777]">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-6">
              <button
                onClick={() => setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="bg-transparent border border-[rgba(255,255,255,0.15)] text-[#bdbdbd] w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-none text-[14px] transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                aria-label="Previous testimonial"
              >
                ←
              </button>
              <div className="flex gap-2.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full border-none p-0 cursor-none transition-all duration-300 ease-in-out ${idx === activeIndex ? 'bg-white scale-125' : 'bg-[rgba(255,255,255,0.25)]'}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="bg-transparent border border-[rgba(255,255,255,0.15)] text-[#bdbdbd] w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-none text-[14px] transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 px-5 md:py-[120px] md:px-10 max-w-[1440px] mx-auto border-t border-[rgba(189,189,189,0.15)] flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="relative overflow-hidden bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-8 md:p-10 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] group" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex justify-between items-start w-full">
                <span className="text-5xl md:text-6xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>14+</span>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                  <svg className="w-8 h-8 text-white opacity-85 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </span>
              </div>
              <div className="text-sm uppercase tracking-wider text-[#777] mt-8">Production Deployments</div>
            </div>

            {/* Card 2 */}
            <div className="relative overflow-hidden bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-8 md:p-10 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] group" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex justify-between items-start w-full">
                <span className="text-5xl md:text-6xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>99.99%</span>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                  <svg className="w-8 h-8 text-white opacity-85 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <polyline points="16 11 18 13 22 9"></polyline>
                  </svg>
                </span>
              </div>
              <div className="text-sm uppercase tracking-wider text-[#777] mt-8">Production Uptime</div>
            </div>

            {/* Card 3 */}
            <div className="relative overflow-hidden bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.05)] rounded-[24px] p-8 md:p-10 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] group" style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <div className="flex justify-between items-start w-full">
                <span className="text-5xl md:text-6xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>15+</span>
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                  <svg className="w-8 h-8 text-white opacity-85 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
              </div>
              <div className="text-sm uppercase tracking-wider text-[#777] mt-8">Core Engineers</div>
            </div>
          </div>
        </section>

        {/* PREMIUM FOOTER */}
        <footer className="w-full border-t border-[rgba(255,255,255,0.05)] bg-[#030303] mt-20 pt-20 pb-10">
          <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col gap-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 animate-fadeUp">
              {/* Column 1: Info & Socials */}
              <div className="flex flex-col gap-6">
                <a href="#" className="nav-logo text-white font-medium text-xl tracking-tight flex items-baseline gap-1" style={{ textDecoration: 'none' }}>
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
                  <li><a href="/about" className="text-sm text-[#777] hover:text-white transition-colors duration-300 no-underline">Web Platforms</a></li>
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
