"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import StackIcon from "tech-stack-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const decomposeLabelRef = useRef<HTMLDivElement>(null);
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

  // HUD Projects Carousel State
  const projects = [
    {
      tag: "System Engine // Core Node",
      name: "ML-01: RUST LOGISTICS",
      desc: "High-performance systems, real-time message brokers, and safe memory architectures for global operations.",
      tech: ["Rust", "Actix", "Kafka", "gRPC"]
    },
    {
      tag: "WebGL Layer // Interactive HUD",
      name: "ML-02: PIPELINE MONITOR",
      desc: "Interactive 3D dashboards, real-time network telemetry graphs, and client-side rendering modules.",
      tech: ["Next.js", "Three.js", "GLSL", "D3.js"]
    },
    {
      tag: "AI Inference // Neural Agent",
      name: "ML-03: COGNITIVE AGENT",
      desc: "Fine-tuned language models, structured output parsers, and custom reinforcement learning loops.",
      tech: ["Python", "PyTorch", "FastAPI", "Ollama"]
    }
  ];

  const [currentProjectIdx, setCurrentProjectIdx] = useState(0);
  const nextProject = () => {
    setCurrentProjectIdx((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };
  const prevProject = () => {
    setCurrentProjectIdx((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  // HUD Capabilities Rolling Text State
  const capabilities = [
    "Web Platforms",
    "Mobile Applications",
    "Cloud Infrastructure",
    "DevOps Systems",
    "AI Integration",
    "Product Strategy"
  ];
  const [currentCapIdx, setCurrentCapIdx] = useState(0);

  // HUD Telemetry rolling statements (Meaningful engineering copy)
  const telemetryStatements = [
    "ZERO DOWNTIME SYSTEMS",
    "SECURE CLOUD PIPELINES",
    "RUST MICROSERVICES CORE",
    "EDGE MESH RUNTIMES"
  ];
  const [currentTelIdx, setCurrentTelIdx] = useState(0);

  useEffect(() => {
    const capTimer = setInterval(() => {
      setCurrentCapIdx((prev) => (prev + 1) % capabilities.length);
    }, 2500);
    return () => clearInterval(capTimer);
  }, []);

  useEffect(() => {
    const telTimer = setInterval(() => {
      setCurrentTelIdx((prev) => (prev + 1) % telemetryStatements.length);
    }, 2800);
    return () => clearInterval(telTimer);
  }, []);

  // System Telemetry Dashboard State
  const [activeMetric, setActiveMetric] = useState<"deployments" | "uptime" | "engineers">("deployments");
  const [statsVisible, setStatsVisible] = useState(false);
  const [countDeployments, setCountDeployments] = useState(0);
  const [countUptime, setCountUptime] = useState(90.0);
  const [countEngineers, setCountEngineers] = useState(0);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setStatsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    const currentRef = statsSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    if (!statsVisible) return;

    // Animate Deployments: 0 to 14
    let depStart = 0;
    const depTarget = 14;
    const depDuration = 1200;
    const depStepTime = Math.abs(Math.floor(depDuration / depTarget));
    const depTimer = setInterval(() => {
      depStart += 1;
      setCountDeployments(depStart);
      if (depStart >= depTarget) clearInterval(depTimer);
    }, depStepTime);

    // Animate Uptime: 90.00 to 99.99
    let uptimeStart = 90.0;
    const uptimeTarget = 99.99;
    const uptimeSteps = 100;
    const uptimeIncrement = (uptimeTarget - uptimeStart) / uptimeSteps;
    let currentStep = 0;
    const uptimeTimer = setInterval(() => {
      currentStep += 1;
      uptimeStart += uptimeIncrement;
      setCountUptime(parseFloat(uptimeStart.toFixed(2)));
      if (currentStep >= uptimeSteps) {
        setCountUptime(99.99);
        clearInterval(uptimeTimer);
      }
    }, 12);

    // Animate Engineers: 0 to 15
    let engStart = 0;
    const engTarget = 15;
    const engStepTime = Math.abs(Math.floor(depDuration / engTarget));
    const engTimer = setInterval(() => {
      engStart += 1;
      setCountEngineers(engStart);
      if (engStart >= engTarget) clearInterval(engTimer);
    }, engStepTime);

    return () => {
      clearInterval(depTimer);
      clearInterval(uptimeTimer);
      clearInterval(engTimer);
    };
  }, [statsVisible]);

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
    const icoGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const edges = new THREE.EdgesGeometry(icoGeo);

    // wireframe lines — the "form"
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    const wireframe = new THREE.LineSegments(edges, wireMat);
    scene.add(wireframe);

    // inner solid (subtle)
    const solidMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.02, side: THREE.FrontSide });
    const solid = new THREE.Mesh(icoGeo, solidMat);
    scene.add(solid);

    // ─── PARTICLES: face centers that explode on scroll ────────────────
    const ICO_DETAIL = 1;
    const baseFaceGeo = new THREE.IcosahedronGeometry(1.3, ICO_DETAIL);
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
      const r = 1.3;
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

    const heroContent = heroContentRef.current;
    const decomposeLabel = decomposeLabelRef.current;

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
      wireMat.opacity = wireOpacity * 0.08;
      solidMat.opacity = wireOpacity * 0.02;

      // particle opacity
      const pOpacity = clampVal(explode * 2, 0, 1) * (1 - reform * 0.7);
      particleMat.opacity = pOpacity;
      cloudMat.opacity = pOpacity * 0.6;

      // Select HUD columns and apply smooth slide-out and fade transitions
      const leftColTop = document.querySelector('.hud-left-top') as HTMLElement;
      const leftColBot = document.querySelector('.hud-left-bottom') as HTMLElement;
      const rightColTop = document.querySelector('.hud-right-top') as HTMLElement;
      const rightColBot = document.querySelector('.hud-right-bottom') as HTMLElement;
      const centerRing = document.querySelector('.hud-center-ring') as HTMLElement;
      const bgImg = document.querySelector('.hero-sticky img') as HTMLElement;
      const heroGrid = document.querySelector('.hero-grid') as HTMLElement;

      // corner panels animate out on first half, and back in on second half of scroll
      const hudActive = progress <= 0.5 ? progress * 2 : (1 - progress) * 2;
      const easedHudActive = easeOutVal(hudActive);
      const slideOutPercent = easedHudActive * 140; // slide by up to 140% of their space
      const hudOpacity = 1 - clampVal(easedHudActive * 1.2, 0, 1);

      if (leftColTop) {
        leftColTop.style.transform = `translateX(-${slideOutPercent}%)`;
        leftColTop.style.opacity = hudOpacity.toString();
      }
      if (leftColBot) {
        leftColBot.style.transform = `translateX(-${slideOutPercent}%)`;
        leftColBot.style.opacity = hudOpacity.toString();
      }
      if (rightColTop) {
        rightColTop.style.transform = `translateX(${slideOutPercent}%)`;
        rightColTop.style.opacity = hudOpacity.toString();
      }
      if (rightColBot) {
        rightColBot.style.transform = `translateX(${slideOutPercent}%)`;
        rightColBot.style.opacity = hudOpacity.toString();
      }

      // Parallax zoom background image (symmetric on scroll)
      if (bgImg) {
        bgImg.style.transform = `scale(${1 + easedHudActive * 0.12})`;
        bgImg.style.opacity = (0.35 * (1 - easedHudActive * 0.45)).toString(); // fade out slowly
      }

      // Expanding HUD Center Ring (symmetric on scroll)
      if (centerRing) {
        centerRing.style.transform = `translate(-50%, -50%) scale(${1 + easedHudActive * 0.8})`;
        centerRing.style.opacity = ((1 - easedHudActive) * 0.35).toString();
      }

      // Grid lines glow (subtle opacity modulation on scroll, static grid density)
      if (heroGrid) {
        const gridGlow = 0.025 + Math.sin(progress * Math.PI) * 0.05;
        heroGrid.style.opacity = gridGlow.toString();
      }

      // decompose label (with focus scale down effect)
      if (decomposeLabel) {
        const labelShow = clampVal((progress - 0.15) * 6, 0, 1) * (1 - clampVal((progress - 0.7) * 6, 0, 1));
        decomposeLabel.style.opacity = labelShow.toString();
        
        // Reticle focus scale animation
        const focusScale = 1.3 - labelShow * 0.3; // scale goes from 1.3 down to 1.0 (lock-on feel)
        decomposeLabel.style.transform = `translate(-50%, -50%) scale(${focusScale})`;
      }
    };

    // ─── ANIMATION LOOP ──────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let threeAnimFrameId: number;

    const animate = () => {
      threeAnimFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // smooth lerp toward scroll target - faster catch up for snappier response
      lerpedProgress += (scrollProgress - lerpedProgress) * 0.12;

      updateParticles(lerpedProgress);

      // gentle rotation — slows during decompose
      const rotSpeed = 1 - lerpedProgress * 0.6;
      wireframe.rotation.y = elapsed * 0.18 * rotSpeed;
      wireframe.rotation.x = elapsed * 0.08 * rotSpeed;
      solid.rotation.y = wireframe.rotation.y;
      solid.rotation.x = wireframe.rotation.x;

      // accelerate particle swirl as the mesh decomposes to simulate release of kinetic energy
      const swirlSpeedY = 0.04 + lerpedProgress * 0.25; // spins 6x faster when decomposed!
      const swirlSpeedX = lerpedProgress * 0.1;
      particles.rotation.y = elapsed * swirlSpeedY;
      particles.rotation.z = elapsed * swirlSpeedX;
      cloud.rotation.y = -elapsed * (0.03 + lerpedProgress * 0.12);

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
          <img
            src="/hero.png"
            alt="Hero Visual Background"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-35 pointer-events-none"
          />
          <canvas id="three-canvas" ref={canvasRef}></canvas>
          <div className="hero-grid"></div>

          {/* decompose state label - Sci-Fi Reticle target tracking system */}
          <div className="decompose-label" id="decomposeLabel" ref={decomposeLabelRef} style={{ top: "42%", left: "48%" }}>
            <div className="hud-reticle" style={{ minWidth: "300px" }}>
              <div className="reticle-corner tl"></div>
              <div className="reticle-corner tr"></div>
              <div className="reticle-corner bl"></div>
              <div className="reticle-corner br"></div>
              
              <div className="flex flex-col gap-2 font-mono text-left select-none">
                <span className="text-[9px] text-[#00ffff] tracking-[0.25em] uppercase blink font-semibold">Mirai Labs Node // Live Core</span>
                <div className="h-10 flex items-center overflow-hidden relative mt-1">
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={currentTelIdx}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="text-lg font-bold text-white tracking-wider uppercase leading-none"
                    >
                      {telemetryStatements[currentTelIdx]}
                    </motion.h2>
                  </AnimatePresence>
                </div>
                <div className="flex justify-between items-center text-[8px] text-gray-500 border-t border-white/5 pt-2 mt-1">
                  <span>LOC: COLOMBO // ESTONIA</span>
                  <span>STANDARDS: SOC2 CERT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rotating HUD Circular Rings */}
          <div className="hud-center-ring">
            <div className="hud-ring-outer"></div>
            <div className="hud-ring-inner"></div>
            <div className="hud-ring-dots"></div>
          </div>

          {/* HUD Grid Layout */}
          <div className="hud-grid" id="heroContent" ref={heroContentRef}>
            {/* Top-Left: Brand & Sub-headings */}
            <div className="hud-col hud-left-top">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest text-[#777] font-mono">Colombo Node // Sri Lanka</span>
                </div>
                <h1 className="font-serif text-5xl font-light tracking-tight leading-[1.05] chrome-gradient-text" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  MIRAI LABS <br />
                  <span className="italic font-light text-4xl block mt-1 opacity-90">SYSTEMS //</span>
                </h1>
              </motion.div>
            </div>

            {/* Bottom-Left: Interactive Project Preview Card (Video Removed) */}
            <div className="hud-col hud-left-bottom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="hud-card project-preview-card"
              >
                <div className="project-details">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentProjectIdx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="project-tag">{projects[currentProjectIdx].tag}</span>
                      <h3 className="project-name mt-1">{projects[currentProjectIdx].name}</h3>
                      <p className="project-desc mt-2">{projects[currentProjectIdx].desc}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="project-nav">
                  <button onClick={prevProject} className="project-nav-btn">←</button>
                  <a href="/contact" className="project-view-btn">View Specs</a>
                  <button onClick={nextProject} className="project-nav-btn">→</button>
                </div>
              </motion.div>
            </div>

            {/* Top-Right: Dynamic Services Rolling Display */}
            <div className="hud-col hud-right-top">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="hud-card"
                style={{ minHeight: "160px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-3">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#777] font-mono font-semibold">Capabilities Node</h4>
                  <span className="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse" style={{ boxShadow: "0 0 6px #00ffff" }}></span>
                </div>
                
                <div className="h-16 flex items-center overflow-hidden relative my-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCapIdx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="text-2xl font-light tracking-wide text-white uppercase font-mono"
                      style={{ textShadow: "0 0 10px rgba(255,255,255,0.2)" }}
                    >
                      {capabilities[currentCapIdx]}
                     </motion.div>
                  </AnimatePresence>
                </div>

                <div className="border-t border-[rgba(255,255,255,0.04)] pt-2 flex justify-between items-center text-[9px] font-mono text-gray-600">
                  <span>&gt; EXECUTE_SCHEDULER</span>
                  <span>ACTIVE STATE</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom-Right: Interactive Badges & Action Buttons */}
            <div className="hud-col hud-right-bottom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="flex flex-col gap-6 items-end w-full"
              >
                {/* WE BUILD bold statement */}
                <div className="text-right w-full mb-2">
                  <span className="font-bold text-white tracking-widest text-4xl font-mono uppercase block" style={{ textShadow: "0 0 15px rgba(255,255,255,0.18)" }}>
                    WE BUILD
                  </span>
                </div>

                {/* Primary/Secondary Actions */}
                <div className="flex gap-4">
                  <a href="/contact" className="btn-ghost" style={{ padding: "10px 24px" }}>Start Project</a>
                  <a href="#below-hero" className="btn-primary" style={{ padding: "10px 24px" }} onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('.below-hero')?.scrollIntoView({ behavior: 'smooth' });
                  }}>Explore Systems</a>
                </div>
              </motion.div>
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

        {/* STATS SECTION - PREMIUM SYSTEM TELEMETRY DASHBOARD */}
        <section ref={statsSectionRef} className="py-20 px-5 md:py-[120px] md:px-10 max-w-[1440px] mx-auto border-t border-[rgba(189,189,189,0.15)] flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <div className="section-label">Scale & Reliability</div>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our numbers speak for <em>themselves.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Interactive Stats Selectors (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
              {/* Stat 1: Deployments */}
              <div
                onClick={() => setActiveMetric("deployments")}
                onMouseEnter={() => setActiveMetric("deployments")}
                className={`cursor-pointer relative overflow-hidden rounded-[24px] p-6 md:p-8 flex flex-col justify-between min-h-[140px] border transition-all duration-500 group ${
                  activeMetric === "deployments"
                    ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.25)] shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                    : "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
                style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
              >
                {/* Active Indicator Glow Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-white transition-transform duration-500 origin-bottom ${
                  activeMetric === "deployments" ? "scale-y-100" : "scale-y-0"
                }`}></div>
                
                <div className="flex justify-between items-start w-full">
                  <span className="text-4xl md:text-5xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                    {countDeployments}+
                  </span>
                  <span className={`transition-colors duration-300 ${activeMetric === "deployments" ? "text-white" : "text-gray-500"}`}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-6">
                  <div className="text-xs uppercase tracking-widest text-[#999] font-medium">Production Deployments</div>
                  <div className="text-[11px] text-[#555] group-hover:text-[#777] transition-colors duration-300">Enterprise platforms launched globally</div>
                </div>
              </div>

              {/* Stat 2: Uptime */}
              <div
                onClick={() => setActiveMetric("uptime")}
                onMouseEnter={() => setActiveMetric("uptime")}
                className={`cursor-pointer relative overflow-hidden rounded-[24px] p-6 md:p-8 flex flex-col justify-between min-h-[140px] border transition-all duration-500 group ${
                  activeMetric === "uptime"
                    ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.25)] shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                    : "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
                style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
              >
                {/* Active Indicator Glow Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-white transition-transform duration-500 origin-bottom ${
                  activeMetric === "uptime" ? "scale-y-100" : "scale-y-0"
                }`}></div>

                <div className="flex justify-between items-start w-full">
                  <span className="text-4xl md:text-5xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                    {countUptime}%
                  </span>
                  <span className={`transition-colors duration-300 ${activeMetric === "uptime" ? "text-white" : "text-gray-500"}`}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-6">
                  <div className="text-xs uppercase tracking-widest text-[#999] font-medium">Production Uptime</div>
                  <div className="text-[11px] text-[#555] group-hover:text-[#777] transition-colors duration-300">Continuous reliability & SLA guarantee</div>
                </div>
              </div>

              {/* Stat 3: Engineers */}
              <div
                onClick={() => setActiveMetric("engineers")}
                onMouseEnter={() => setActiveMetric("engineers")}
                className={`cursor-pointer relative overflow-hidden rounded-[24px] p-6 md:p-8 flex flex-col justify-between min-h-[140px] border transition-all duration-500 group ${
                  activeMetric === "engineers"
                    ? "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.25)] shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                    : "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]"
                }`}
                style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
              >
                {/* Active Indicator Glow Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-white transition-transform duration-500 origin-bottom ${
                  activeMetric === "engineers" ? "scale-y-100" : "scale-y-0"
                }`}></div>

                <div className="flex justify-between items-start w-full">
                  <span className="text-4xl md:text-5xl font-light text-white tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                    {countEngineers}+
                  </span>
                  <span className={`transition-colors duration-300 ${activeMetric === "engineers" ? "text-white" : "text-gray-500"}`}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-6">
                  <div className="text-xs uppercase tracking-widest text-[#999] font-medium">Core Engineers</div>
                  <div className="text-[11px] text-[#555] group-hover:text-[#777] transition-colors duration-300">Dedicated system architects & UI developers</div>
                </div>
              </div>
            </div>

            {/* Right Column: Console Screen Display (7 cols) */}
            <div className="lg:col-span-7 bg-[rgba(5,5,5,0.4)] border border-[rgba(255,255,255,0.06)] rounded-[32px] p-6 md:p-8 flex flex-col justify-between min-h-[440px] relative overflow-hidden shadow-2xl" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
              
              {/* Dashboard Header */}
              <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.2)]"></span>
                  <span className="text-[10px] tracking-widest font-mono text-[#777] uppercase">Dashboard // Corporate Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-wider font-mono text-[#555] uppercase">Verified Audit 2026</span>
                </div>
              </div>

              {/* 1. DEPLOYMENTS VISUALIZER */}
              {activeMetric === "deployments" && (
                <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Sector Distribution Progress Bars */}
                    <div className="flex flex-col gap-4 font-mono">
                      <div className="text-[10px] uppercase tracking-wider text-[#666]">Sector Distribution</div>
                      {[
                        { title: "Enterprise Fintech Platforms", count: 4, percent: 100 },
                        { title: "Global Logistics & Operations", count: 4, percent: 100 },
                        { title: "Real-time SaaS Systems", count: 3, percent: 75 },
                        { title: "AI Infrastructure Pipelines", count: 3, percent: 75 }
                      ].map((sector, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] text-white/80">
                            <span className="truncate pr-2">{sector.title}</span>
                            <span className="text-white font-medium">{sector.count}</span>
                          </div>
                          <div className="h-1 w-full bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-1000 ease-out" 
                              style={{ width: `${sector.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deployment Insights Box */}
                    <div className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] rounded-xl p-5 font-mono min-h-[180px] flex flex-col justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="text-[10px] uppercase tracking-wider text-[#666]">Scale & Footprint</div>
                        <h3 className="font-serif text-3xl font-light text-white leading-tight mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          1.4M+ <em>Users</em>
                        </h3>
                        <p className="text-[11px] text-[#777] leading-relaxed mt-1">
                          Total monthly active users scaling smoothly across production applications deployed by our core team.
                        </p>
                      </div>

                      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3 mt-3 flex justify-between items-center text-[10px] text-[#555]">
                        <span>Primary Cloud Hubs</span>
                        <span className="text-white">AWS / GCP / Cloudflare</span>
                      </div>
                    </div>
                  </div>

                  {/* Deploy Stats Details Footer */}
                  <div className="grid grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6 mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Geographic nodes</span>
                      <span className="text-lg text-white font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4 Continents</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Client Retainer</span>
                      <span className="text-lg text-white font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>94% Annual</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Deploy Cadence</span>
                      <span className="text-lg text-[#27c93f] font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>CI/CD Continuous</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. UPTIME VISUALIZER */}
              {activeMetric === "uptime" && (
                <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1">
                    {/* SVG SLA Compliance Circular Gauge */}
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background Circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="rgba(255, 255, 255, 0.03)"
                            strokeWidth="6"
                            fill="transparent"
                          />
                          {/* Progress Circle with glow */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="#ffffff"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={263.8}
                            strokeDashoffset={2.6} // Representing 99%
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center font-mono">
                          <span className="text-[10px] text-[#666] uppercase tracking-widest">SLA</span>
                          <span className="text-xl text-white font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>99.99%</span>
                        </div>
                      </div>
                    </div>

                    {/* Reliability highlights */}
                    <div className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] rounded-xl p-5 font-mono min-h-[180px] flex flex-col justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="text-[10px] uppercase tracking-wider text-[#666]">Reliability Highlights</div>
                        <ul className="text-[11px] text-[#777] flex flex-col gap-2.5 mt-2 list-none p-0">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Multi-region automated failovers</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Zero-downtime ledger migration protocols</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Continuous DDoS protection & isolation</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3 mt-3 flex justify-between items-center text-[10px] text-[#555]">
                        <span>Disaster Recovery</span>
                        <span className="text-white">MTTR &lt; 15 Minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* SLA Stats Details Footer */}
                  <div className="grid grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6 mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Compliance</span>
                      <span className="text-lg text-white font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ISO 27001</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Infrastructure</span>
                      <span className="text-lg text-white font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>SOC2 Framework</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Data Redundancy</span>
                      <span className="text-lg text-[#27c93f] font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Triple-Node Sync</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CORE ENGINEERS VISUALIZER */}
              {activeMetric === "engineers" && (
                <div className="flex-1 flex flex-col justify-between animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-1">
                    {/* Skills Breakdown Meters */}
                    <div className="flex flex-col gap-4 font-mono">
                      <div className="text-[10px] uppercase tracking-wider text-[#666]">Engineering Core Capabilities</div>
                      {[
                        { title: "Systems & Architecture", val: 95 },
                        { title: "Creative UI / WebGL / NextJS", val: 92 },
                        { title: "Consensus & Ledger Nodes", val: 86 },
                        { title: "AI Infra & Custom LLMs", val: 82 }
                      ].map((skill, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-white/80">{skill.title}</span>
                            <span className="text-white font-semibold">{skill.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-1000 ease-out" 
                              style={{ width: `${skill.val}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stats details & metadata */}
                    <div className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] rounded-xl p-5 font-mono min-h-[180px] flex flex-col justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="text-[10px] uppercase tracking-wider text-[#666]">Seniority Concentration</div>
                        <h3 className="font-serif text-3xl font-light text-white leading-tight mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          100% <em>Senior</em>
                        </h3>
                        <p className="text-[11px] text-[#777] leading-relaxed mt-1">
                          No juniors, no placement interns. Every engineer at Mirai Labs is a senior or principal specialist operating with seasoned experience.
                        </p>
                      </div>

                      <div className="border-t border-[rgba(255,255,255,0.04)] pt-3 mt-3 flex justify-between items-center text-[10px]">
                        <span className="text-[#555]">Global Contributors</span>
                        <span className="text-white">Colombo / Tallinn / Tokyo</span>
                      </div>
                    </div>
                  </div>

                  {/* Team commits summary */}
                  <div className="grid grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6 mt-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Expertise Average</span>
                      <span className="text-lg text-white font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>8.5 Years</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">GitHub Commits</span>
                      <span className="text-lg text-white font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>480k+</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[#555] font-mono">Test Coverage</span>
                      <span className="text-lg text-[#27c93f] font-serif mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>&gt;94.8%</span>
                    </div>
                  </div>
                </div>
              )}
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
