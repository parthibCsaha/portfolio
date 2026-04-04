import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import './App.css';

const navItems = [
  { label: 'Skills', id: 'skills' },
  { label: 'Competitive', id: 'competitive' },
  { label: 'Extracurricular', id: 'extracurricular' },
  { label: 'Projects', id: 'projects' },
  { label: 'Education', id: 'education' },
  { label: 'Contact', id: 'contact' },
];

const heroStats = [
  { value: 3000, suffix: '+', label: 'Problems Solved' },
  { value: 1431, suffix: '', label: 'Codeforces Rating' },
  { value: 1914, suffix: '', label: 'LeetCode Rating' },
  { value: 3.53, suffix: '', label: 'CGPA / 4.00' },
];

const signalItems = [
  '3000+ Problems Solved',
  'Specialist @ Codeforces',
  'Knight @ LeetCode',
  '4★ @ CodeChef',
  'AI + Backend Engineering',
  'RAG and LLM Workflows',
  'Full-Stack Product Delivery',
  'Open to SWE Opportunities',
];

const codeStreamSnippets = [
  'const result = await rag.search(query);',
  'if (cache.has(key)) return cache.get(key);',
  'docker compose up --build',
  'git push origin main',
  'SELECT * FROM candidates WHERE score > 90;',
  'for (const node of graph) dfs(node);',
  'class Service { async execute() {} }',
  'return stream.withCitations(answer);',
  'vector<int> dp(n + 1, 0);',
  'public async Task<IActionResult> Post()',
  'npm run lint && npm run build',
  'while (left <= right) { mid = (left + right) / 2; }',
];

const skillGroups = [
  {
    icon: '🧠',
    title: 'Analytical Skills',
    tags: ['Problem Solving', 'Algorithms', 'Data Structures'],
  },
  {
    icon: '💻',
    title: 'Programming',
    tags: ['Java', 'C', 'C++', 'C#', 'Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    icon: '🧩',
    title: 'Frameworks',
    tags: ['Spring Boot', 'ASP.NET Core', 'React'],
  },
  {
    icon: '🤖',
    title: 'AI Skills & Tools',
    tags: [
      'Machine Learning',
      'NLP',
      'Prompt Engineering',
      'RAG',
      'Vector Embeddings',
      'Semantic Search',
      'LLM Integration',
      'GitHub Copilot',
      'OpenAI Codex',
      'Antigravity',
    ],
    featured: true,
  },
  {
    icon: '🗄️',
    title: 'Database Management',
    tags: ['PostgreSQL', 'MySQL', 'Database Indexing'],
  },
  {
    icon: '🛠️',
    title: 'Development Tools',
    tags: ['VS Code', 'IntelliJ IDEA', 'Google Colab', 'Postman', 'Docker', 'Redis'],
  },
  {
    icon: '🔁',
    title: 'Version Control',
    tags: ['Git', 'GitHub'],
  },
  {
    icon: '⚙️',
    title: 'Concepts',
    tags: ['SDLC', 'OOP', 'Multithreading', 'Concurrency', 'Microservices', 'Rate Limiting'],
  },
];

const platforms = [
  { name: 'Codeforces', solved: '1600+', tone: 'teal' },
  { name: 'LeetCode', solved: '1000+', tone: 'amber' },
  { name: 'AtCoder', solved: '300+', tone: 'teal' },
  { name: 'CodeChef', solved: '200+', tone: 'amber' },
  { name: 'Beecrowd', solved: '100+', tone: 'teal' },
  { name: 'HackerRank', solved: '50+', tone: 'amber' },
];

const achievements = [
  {
    platform: 'Codeforces',
    title: 'Specialist (Max Rating: 1431)',
    desc: 'Ranked 27th (Div 3) and 70th (Div 2) in Bangladesh.',
    link: 'https://codeforces.com/profile/Parthib_Saha',
  },
  {
    platform: 'CodeChef',
    title: '4★ Coder (Max Rating: 1800)',
    desc: 'Ranked 35th (Div 2) in Bangladesh.',
    link: 'https://www.codechef.com/users/parthib53',
  },
  {
    platform: 'LeetCode',
    title: 'Knight (Max Rating: 1914)',
    desc: 'Consistent high-performance across weekly contests.',
    link: 'https://leetcode.com/u/parthibsahaprattus/',
  },
  {
    platform: 'ICPC',
    title: 'Honorable Mention',
    desc: 'Team DIU_StriverS, Asia Dhaka Regional Preliminary.',
    link: 'https://icpc.global/ICPCID/2GBDKQE5HN4G',
  },
];

const extracurricularExperiences = [
  {
    icon: '📝',
    period: '2022 - 2024',
    title: 'Problem Setter & Judge',
    org: 'Takeoff Programming Contest, DIU',
    desc: 'Authored and stress-tested contest problems, balancing clarity, difficulty, and fairness for university-level competitions.',
    tags: ['Problem Design', 'Test Cases', 'Contest Quality'],
  },
  {
    icon: '👨‍🏫',
    period: '2022 - 2024',
    title: 'Trainer & Course Prefect',
    org: 'Data Structures & Algorithms Course',
    desc: 'Mentored students through structured DSA sessions and practical problem-solving drills to build long-term coding confidence.',
    tags: ['Teaching', 'Mentorship', 'Competitive Training'],
  },
];

const projects = [
  {
    icon: '🤖',
    label: 'AI-Powered Application',
    title: 'HireSense',
    description:
      'Built a role-based job portal for candidates, employers, and admins with AI resume analysis, automated job matching, candidate ranking, and secure JWT-based REST APIs backed by unit tests.',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'Groq (LLMs)', 'JWT', 'Docker', 'Redis'],
    highlights: ['AI-driven hiring recommendations', 'Role-based workflows for admins and employers'],
    link: 'https://github.com/parthibCsaha/AI-Powered-Job-Portal',
  },
  {
    icon: '📈',
    label: 'Real-Time Trading System',
    title: 'Wall Street',
    description:
      'A high-throughput order book and matching engine simulation with concurrent trade processing and live event broadcasting through WebSockets.',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'React', 'STOMP'],
    highlights: ['Concurrent matching engine architecture', 'Real-time trade updates via WebSocket'],
    link: 'https://github.com/parthibCsaha/Real-Time-Stock-Matching-Engine',
  },
  {
    icon: '🧠',
    label: 'LLM + Knowledge Retrieval',
    title: 'RAG Studio',
    description:
      'Built an AI-powered document search and Q&A system with document upload, semantic search, chunking, embeddings, vector retrieval, and real-time streaming responses with session-based chat and citations.',
    tech: ['C#', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Groq (LLM)', 'Hugging Face'],
    highlights: ['Document-to-answer retrieval pipeline', 'Session-based chat with citation context'],
    link: 'https://github.com/parthibCsaha/RAG-Studio',
  },
  {
    icon: '🏥',
    label: 'Healthcare Management Platform',
    title: 'MediCore (Hospital Management System)',
    description:
      'Built scalable REST APIs for patients, doctors, appointments, and hospital operations using clean architecture, with JWT role-based access and secure API design.',
    tech: ['C#', 'ASP.NET Core', 'EF Core', 'PostgreSQL', 'Swagger', 'Docker', 'JWT'],
    highlights: ['Clean architecture for maintainability', 'Secure role-aware clinical workflow APIs'],
    link: 'https://github.com/parthibCsaha/Hospital-Management-System',
  },
];

const contacts = [
  { icon: '📧', label: 'Email', text: 'parthibsahaprattus@gmail.com', link: 'mailto:parthibsahaprattus@gmail.com' },
  { icon: '💼', label: 'LinkedIn', text: 'linkedin.com/in/parthib-saha-32b547260', link: 'https://www.linkedin.com/in/parthib-saha-32b547260/' },
  { icon: '🐙', label: 'GitHub', text: 'github.com/parthibCsaha', link: 'https://github.com/parthibCsaha' },
  { icon: '📱', label: 'Phone', text: '+8801704853732', link: 'tel:+8801704853732' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const setSpotlightPosition = (event) => {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  card.style.setProperty('--spot-x', `${x}px`);
  card.style.setProperty('--spot-y', `${y}px`);
};

const clearSpotlight = (event) => {
  const card = event.currentTarget;
  card.style.removeProperty('--spot-x');
  card.style.removeProperty('--spot-y');
};

const subscribeToMediaQueryChange = (mediaQuery, listener) => {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }

  if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }

  return () => {};
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.15,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

const CursorAura = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.2 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.2 });
  const smoothXSoft = useSpring(x, { stiffness: 70, damping: 24, mass: 0.4 });
  const smoothYSoft = useSpring(y, { stiffness: 70, damping: 24, mass: 0.4 });
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;

    if (typeof window.matchMedia !== 'function') return undefined;

    const mediaQuery = window.matchMedia('(pointer:fine)');
    const syncPointerType = () => setEnabled(mediaQuery.matches);
    const unsubscribeMediaQuery = subscribeToMediaQueryChange(mediaQuery, syncPointerType);
    syncPointerType();

    const onMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('pointermove', onMove);

    return () => {
      window.removeEventListener('pointermove', onMove);
      unsubscribeMediaQuery();
    };
  }, [reduceMotion, x, y]);

  if (!enabled || reduceMotion) return null;

  return (
    <>
      <motion.div className="cursor-aura" style={{ x: smoothX, y: smoothY }} />
      <motion.div className="cursor-aura-secondary" style={{ x: smoothXSoft, y: smoothYSoft }} />
    </>
  );
};

const AuroraBackground = () => {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <motion.div
        className="aurora-wave aurora-wave-teal"
        animate={{ x: [0, 70, -20, 0], y: [0, -35, 20, 0], scale: [1, 1.08, 0.98, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-wave aurora-wave-amber"
        animate={{ x: [0, -85, 35, 0], y: [0, 25, -45, 0], scale: [1, 0.96, 1.06, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-wave aurora-wave-indigo"
        animate={{ x: [0, 45, -55, 0], y: [0, 38, -28, 0], scale: [1, 1.05, 1, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

const CodeStreamBackground = () => {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const isCoarsePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer:coarse)').matches;
    const isCompactViewport = Math.min(window.innerWidth, window.innerHeight) < 760;
    const lowPowerMode = reduceMotion || isCoarsePointer || isCompactViewport || (navigator.hardwareConcurrency || 8) <= 4;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;
    let lastTime = 0;

    const fontSize = lowPowerMode ? 13 : 14;
    const lineHeight = lowPowerMode ? 28 : 24;
    let rows = [];

    const pickSnippet = () => codeStreamSnippets[Math.floor(Math.random() * codeStreamSnippets.length)];
    const composeLine = () => `${pickSnippet()}   ${pickSnippet()}`;

    const createRow = (y, initial = false) => {
      const text = composeLine();
      const textWidth = ctx.measureText(text).width;
      const startX = initial ? Math.random() * (width + textWidth) - textWidth : width + Math.random() * 240;

      return {
        y,
        text,
        textWidth,
        x: startX,
        speed: (lowPowerMode ? 18 : 22) + Math.random() * (lowPowerMode ? 24 : 34),
        alpha: (lowPowerMode ? 0.06 : 0.08) + Math.random() * (lowPowerMode ? 0.08 : 0.11),
        tint: Math.random() > 0.8 ? 'amber' : 'teal',
        cursorOffset: Math.random(),
        cursorBlink: 1.5 + Math.random() * 1.4,
      };
    };

    const setupRows = () => {
      const totalRows = Math.floor(height / lineHeight) + (lowPowerMode ? 2 : 4);
      rows = Array.from({ length: totalRows }, (_, index) => createRow((index + 1) * lineHeight - 6, true));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = 'top';
      setupRows();
      ctx.clearRect(0, 0, width, height);
    };

    const animate = (time) => {
      const dt = Math.min(0.05, (time - (lastTime || time)) / 1000);
      lastTime = time;

      ctx.fillStyle = 'rgba(5, 13, 22, 0.3)';
      ctx.fillRect(0, 0, width, height);

      rows.forEach((row, index) => {
        row.x -= row.speed * dt;

        if (row.x + row.textWidth < -120) {
          rows[index] = createRow(row.y, false);
          return;
        }

        const color = row.tint === 'amber'
          ? `rgba(255, 191, 87, ${row.alpha})`
          : `rgba(95, 231, 204, ${row.alpha})`;

        ctx.fillStyle = color;
        ctx.fillText(row.text, row.x, row.y);
        ctx.fillText(row.text, row.x + row.textWidth + 120, row.y);

        const cursorProgress = (time * 0.00011 * row.speed + row.cursorOffset) % 1;
        const cursorX = row.x + cursorProgress * row.textWidth;
        const blink = (Math.sin(time * 0.001 * row.cursorBlink * Math.PI * 2) + 1) * 0.5;

        if (blink > 0.42 && cursorX > -10 && cursorX < width + 10) {
          ctx.fillStyle = row.tint === 'amber' ? 'rgba(255, 191, 87, 0.2)' : 'rgba(95, 231, 204, 0.17)';
          ctx.fillRect(cursorX, row.y + 1, 7, fontSize + 2);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="code-stream-bg" aria-hidden="true" />;
};

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const isCoarsePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer:coarse)').matches;
    const isCompactViewport = Math.min(window.innerWidth, window.innerHeight) < 760;
    const lowPowerMode = reduceMotion || isCoarsePointer || isCompactViewport || (navigator.hardwareConcurrency || 8) <= 4;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;

    const pointer = { x: width * 0.5, y: height * 0.5, active: false };

    const createParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.18 + 0.09,
      phase: Math.random() * Math.PI * 2,
      tint: Math.random() > 0.5 ? 'teal' : 'amber',
    });

    const getParticleCount = () => {
      const density = lowPowerMode ? 42000 : 21000;
      const minCount = lowPowerMode ? 28 : 52;
      const maxCount = lowPowerMode ? 84 : 140;
      return Math.min(maxCount, Math.max(minCount, Math.floor((width * height) / density)));
    };

    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: getParticleCount() }, createParticle);
    };

    const fieldAngle = (x, y, time) => {
      const waveA = Math.sin(x * 0.0019 + time * 0.7) * 1.8;
      const waveB = Math.cos(y * 0.0014 - time * 0.45) * 1.5;
      const swirl = Math.sin((x + y) * 0.00085 + time * 0.28) * 2.2;
      return waveA + waveB + swirl;
    };

    const animate = (timeMs) => {
      const time = timeMs * 0.001;

      ctx.fillStyle = 'rgba(5, 13, 22, 0.14)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        const angle = fieldAngle(particle.x, particle.y, time);
        const strength = lowPowerMode ? 0.011 : 0.019;

        particle.vx += Math.cos(angle) * strength;
        particle.vy += Math.sin(angle) * strength;

        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = lowPowerMode ? 170 : 220;
          if (dist > 0 && dist < radius) {
            const pull = ((radius - dist) / radius) * (lowPowerMode ? 0.02 : 0.05);
            particle.vx += (dx / dist) * pull;
            particle.vy += (dy / dist) * pull;
          }
        }

        particle.vx *= 0.945;
        particle.vy *= 0.945;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x > width + 2) particle.x = -2;
        if (particle.x < -2) particle.x = width + 2;
        if (particle.y > height + 2) particle.y = -2;
        if (particle.y < -2) particle.y = height + 2;

        const twinkle = 0.55 + Math.sin(time * 2.1 + particle.phase) * 0.45;
        const alpha = particle.alpha * twinkle;
        const color = particle.tint === 'teal' ? `rgba(95, 231, 204, ${alpha})` : `rgba(255, 191, 87, ${alpha * 0.9})`;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!lowPowerMode) {
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distanceSquared = dx * dx + dy * dy;
            const limit = 105;
            if (distanceSquared < limit * limit) {
              const alpha = 0.07 * (1 - distanceSquared / (limit * limit));
              ctx.strokeStyle = `rgba(148, 216, 255, ${alpha})`;
              ctx.lineWidth = 0.45;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      const point = 'touches' in event && event.touches.length > 0 ? event.touches[0] : event;
      pointer.x = point.clientX;
      pointer.y = point.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('resize', resize);

    if ('PointerEvent' in window) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerleave', onPointerLeave);
    } else {
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseleave', onPointerLeave);
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);

      if ('PointerEvent' in window) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
      } else {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseleave', onPointerLeave);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerLeave);
      }
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="particle-bg" />;
};

const AnimatedCounter = ({ end, duration = 1.8, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return undefined;

    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const next = progress * end;
      setCount(Number.isInteger(end) ? Math.floor(next) : Number(next.toFixed(2)));

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    return undefined;
  }, [duration, end, inView]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const SignalStrip = ({ className = '' }) => {
  const reduceMotion = useReducedMotion();
  const repeated = [...signalItems, ...signalItems];

  return (
    <section className={`signal-strip-wrap ${className}`.trim()} aria-label="Portfolio highlights ticker">
      <div className="shell">
        <div className="signal-strip">
          <motion.div
            className="signal-track"
            animate={reduceMotion ? { x: 0 } : { x: '-50%' }}
            transition={reduceMotion ? { duration: 0 } : { duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            {repeated.map((item, index) => (
              <span key={`${item}-${index}`} className="signal-chip">
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <motion.div
    variants={fadeUp}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="section-heading"
  >
    <div className="section-eyebrow">{eyebrow}</div>
    <h2>{title}</h2>
    {subtitle ? <p>{subtitle}</p> : null}
  </motion.div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`main-nav ${scrolled ? 'is-scrolled' : ''}`}
    >
      <div className="shell nav-shell">
        <a href="#home" className="brand-mark" aria-label="Go to top">
          PS
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </div>

        <a href="#contact" className="nav-cta">
          Hire Me
        </a>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  const roles = ['Software Engineer', 'Competitive Programmer', 'Problem Solver'];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section id="home" className="hero-wrap">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />

      <div className="shell hero-grid">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="hero-copy"
        >
          <motion.div variants={fadeUp} className="status-pill">
            Open To Full-Time Software Engineering Roles
          </motion.div>

          <motion.h1 variants={fadeUp}>
            Building reliable systems with <span className="text-gradient">speed, scale, and style.</span>
          </motion.h1>

          <motion.p variants={fadeUp}>
            I am Parthib Saha, a recent CSE graduate who has solved 3000+ algorithmic problems and loves turning
            hard engineering challenges into simple, elegant products.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-role-switcher">
            <span>Now focused on:</span>
            <strong>{roles[roleIndex]}</strong>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-actions">
            <a href="#projects" className="btn-primary">
              Explore Projects
            </a>
            <a href="#contact" className="btn-secondary">
              Let&apos;s Connect
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hero-panel"
        >
          <div className="hero-panel-title">Career Snapshot</div>

          <div className="hero-stats-grid">
            {heroStats.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.1, duration: 0.45 }}
                className="stat-card"
              >
                <div className="stat-number">
                  <AnimatedCounter end={item.value} suffix={item.suffix} />
                </div>
                <div className="stat-label">{item.label}</div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>

      <SignalStrip className="hero-signal-strip" />
    </section>
  );
};

const SkillsSection = () => (
  <section id="skills" className="section-block">
    <div className="shell">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
        <SectionHeader
          eyebrow="Core Expertise"
        />

        <div className="cards-grid three-col">
          {skillGroups.map((skill) => (
            <motion.article
              key={skill.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className={`glass-card interactive-surface ${skill.featured ? 'ai-skill-card' : ''}`}
              onMouseMove={setSpotlightPosition}
              onMouseLeave={clearSpotlight}
            >
              <div className="card-icon">{skill.icon}</div>
              <h3>{skill.title}</h3>
              <div className="chip-wrap">
                {skill.tags.map((tag) => (
                  <span key={tag} className={`chip ${skill.featured ? 'ai-chip' : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const CompetitiveSection = () => (
  <section id="competitive" className="section-block alt-surface">
    <div className="shell">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
        <SectionHeader
          eyebrow="Competitive Programming"
          subtitle="A lifelong passion reflected in 3000+ solved problems, top-tier global rankings, and a commitment to continuous growth in algorithmic mastery."
        />

        <div className="split-grid">
          <motion.div variants={fadeUp} className="glass-card tall-card interactive-surface" onMouseMove={setSpotlightPosition} onMouseLeave={clearSpotlight}>
            <h3>Problems Solved</h3>
            <div className="platform-list">
              {platforms.map((platform) => (
                <div key={platform.name} className="platform-row">
                  <span>{platform.name}</span>
                  <strong className={platform.tone === 'amber' ? 'tone-amber' : 'tone-teal'}>{platform.solved}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="stack-col">
            {achievements.map((achievement) => (
              <motion.a
                key={achievement.platform}
                variants={fadeUp}
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card achievement-link"
                onMouseMove={setSpotlightPosition}
                onMouseLeave={clearSpotlight}
              >
                <div className="section-eyebrow mini">{achievement.platform}</div>
                <h4>{achievement.title}</h4>
                <p>{achievement.desc}</p>
                <span className="inline-link">Open Profile</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const ExtracurricularSection = () => (
  <section id="extracurricular" className="section-block">
    <div className="shell">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
        <SectionHeader
          eyebrow="Extracurricular Activities"
          subtitle="I enjoy creating learning momentum in teams and communities around algorithms and software craft."
        />

        <div className="cards-grid two-col">
          {extracurricularExperiences.map((item) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              className="glass-card timeline-card interactive-surface"
              onMouseMove={setSpotlightPosition}
              onMouseLeave={clearSpotlight}
            >
              <div className="timeline-top">
                <span className="card-icon">{item.icon}</span>
                <span className="period-pill">{item.period}</span>
              </div>
              <h3>{item.title}</h3>
              <h4>{item.org}</h4>
              <p>{item.desc}</p>
              <div className="chip-wrap">
                {item.tags.map((tag) => (
                  <span key={tag} className="chip soft">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const ProjectsSection = () => (
  <section id="projects" className="section-block alt-surface">
    <div className="shell">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
        <SectionHeader
          eyebrow="Featured Projects"
          subtitle="A mix of intelligent automation and real-time systems designed for reliability and scale."
        />

        <div className="project-stack">
          {projects.map((project) => (
            <motion.article
              key={project.title}
              variants={fadeUp}
              className="project-card interactive-surface"
              onMouseMove={setSpotlightPosition}
              onMouseLeave={clearSpotlight}
            >
              <div className="project-visual">
                <span>{project.icon}</span>
              </div>
              <div className="project-content">
                <div className="section-eyebrow mini">{project.label}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-highlights">
                  {project.highlights.map((highlight) => (
                    <div key={highlight} className="project-highlight">
                      {highlight}
                    </div>
                  ))}
                </div>
                <div className="chip-wrap">
                  {project.tech.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-link">
                  View Repository
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const EducationSection = () => (
  <section id="education" className="section-block">
    <div className="shell">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
        <SectionHeader
          eyebrow="Education"
        />

        <motion.article variants={fadeUp} className="glass-card education-card interactive-surface" onMouseMove={setSpotlightPosition} onMouseLeave={clearSpotlight}>
          <div>
            <h3>B.Sc. in Computer Science and Engineering</h3>
            <h4>Daffodil International University</h4>
            <p>August 2021 - December 2025</p>
          </div>

          <div className="cgpa-badge">
            <strong>3.53</strong>
            <span>CGPA / 4.00</span>
          </div>
        </motion.article>
      </motion.div>
    </div>
  </section>
);

const ContactSection = () => (
  <section id="contact" className="section-block contact-block">
    <div className="shell">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={staggerParent}>
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let&apos;s build something high-impact together"
          subtitle="Open to full-time opportunities, collaborations, and technically ambitious product teams."
        />

        <div className="cards-grid two-col">
          {contacts.map((contact) => (
            <motion.a
              key={contact.label}
              variants={fadeUp}
              href={contact.link}
              target={contact.link.startsWith('http') ? '_blank' : undefined}
              rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="glass-card contact-card interactive-surface"
              onMouseMove={setSpotlightPosition}
              onMouseLeave={clearSpotlight}
            >
              <div className="card-icon">{contact.icon}</div>
              <h3>{contact.label}</h3>
              <p>{contact.text}</p>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="site-footer">
    <div className="shell">
      <p>&copy; 2026 Parthib Saha. Designed and engineered with intention.</p>
    </div>
  </footer>
);

const App = () => (
  <div className="app-root">
    <ScrollProgress />
    <AuroraBackground />
    <CodeStreamBackground />
    <ParticleBackground />
    <CursorAura />
    <div className="noise-overlay" />

    <Navbar />
    <HeroSection />
    <SkillsSection />
    <CompetitiveSection />
    <ExtracurricularSection />
    <ProjectsSection />
    <EducationSection />
    <ContactSection />
    <Footer />
  </div>
);

export default App;
