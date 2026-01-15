import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw connections
      particles.forEach((particle1, i) => {
        particles.slice(i + 1).forEach(particle2 => {
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  
  return <span ref={ref}>{count}{suffix}</span>;
};

// Typing Effect Component
const TypingEffect = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);
  
  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
        >
          PS
        </motion.div>
        
        <div className="hidden md:flex gap-8">
          {['Skills', 'Competitive', 'Volunteer', 'Projects', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2, color: '#00f5ff' }}
              className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <motion.section 
      style={{ opacity }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8"
        >
          <span className="text-cyan-400 text-2xl">🚀</span>
          <span className="text-cyan-400 text-sm font-semibold tracking-wider">
            ASPIRING SOFTWARE ENGINEER & PROBLEM SOLVER
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Parthib Saha
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
        >
          Recent CS graduate and competitive programmer with 3000+ problems solved across multiple platforms. 
          Eager to apply my problem-solving skills and passion for building scalable systems in a software engineering role.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4 mb-16"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-semibold text-sm shadow-lg"
          >
            View Projects
          </motion.a>
          
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, borderColor: '#00f5ff', backgroundColor: 'rgba(0, 245, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-slate-700 text-slate-300 rounded-full font-semibold text-sm transition-all"
          >
            Get in Touch
          </motion.a>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: 3000, suffix: '+', label: 'Problems Solved' },
            { value: 1428, suffix: '', label: 'Codeforces Rating' },
            { value: 1914, suffix: '', label: 'LeetCode Rating' },
            { value: 3.53, suffix: '', label: 'CGPA' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center group cursor-pointer"
            >
              <div className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Floating gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
    </motion.section>
  );
};

// Skill Card Component
const SkillCard = ({ icon, title, tags, delay }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: delay + i * 0.05 }}
              className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-400 font-semibold"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>
    </motion.div>
  );
};

// Skills Section
const SkillsSection = () => {
  const skills = [
    {
      icon: '💻',
      title: 'Programming Languages',
      tags: ['Java', 'C/C++', 'Python', 'JavaScript', 'SQL']
    },
    {
      icon: '🎯',
      title: 'Frameworks & Libraries',
      tags: ['Spring Boot', 'React', 'WebSocket', 'REST APIs']
    },
    {
      icon: '🗄️',
      title: 'Database Management',
      tags: ['PostgreSQL', 'MySQL', 'SQL Optimization']
    },
    {
      icon: '🛠️',
      title: 'Development Tools',
      tags: ['VS Code', 'IntelliJ IDEA', 'Docker', 'Postman', 'Git']
    },
    {
      icon: '🧠',
      title: 'Core Competencies',
      tags: ['Data Structures', 'Algorithms', 'Problem Solving', 'System Design']
    },
    {
      icon: '⚙️',
      title: 'Software Engineering',
      tags: ['OOP', 'Microservices', 'CI/CD', 'Multithreading']
    }
  ];
  
  return (
    <section id="skills" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-cyan-400 text-sm font-bold tracking-widest mb-4 uppercase">
            Technical Arsenal
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white">
            Skills & Expertise
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <SkillCard key={skill.title} {...skill} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Competitive Programming Section
const CompetitiveSection = () => {
  const platforms = [
    { name: 'Codeforces', count: '1600+' },
    { name: 'LeetCode', count: '1000+' },
    { name: 'AtCoder', count: '300+' },
    { name: 'CodeChef', count: '200+' },
    { name: 'Beecrowd', count: '100+' },
    { name: 'HackerRank', count: '50+' }
  ];
  
  const achievements = [
    {
      platform: 'Codeforces',
      title: 'Specialist (Max Rating: 1428)',
      desc: 'Ranked 27th (Div 3) and 70th (Div 2) in Bangladesh',
      link: 'https://codeforces.com/profile/Parthib_Saha'
    },
    {
      platform: 'CodeChef',
      title: '4★ Coder (Max Rating: 1800)',
      desc: 'Ranked 35th (Div 2) in Bangladesh',
      link: 'https://www.codechef.com/users/parthib53'
    },
    {
      platform: 'LeetCode',
      title: 'Knight (Max Rating: 1914)',
      desc: 'Top performer with consistent problem-solving excellence',
      link: 'https://leetcode.com/u/parthibsahaprattus/'
    },
    {
      platform: 'ICPC',
      title: 'Honorable Mention',
      desc: 'Team DIU_StriverS - Asia Dhaka Regional Preliminary',
      link: 'https://icpc.global/ICPCID/2GBDKQE5HN4G'
    }
  ];
  
  return (
    <section id="competitive" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-cyan-400 text-sm font-bold tracking-widest mb-4 uppercase">
            Problem Solving Excellence
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white">
            Competitive Programming
          </h2>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-10 overflow-hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"
            />
            
            <h3 className="text-3xl font-bold text-white mb-8 relative z-10">
              Problem Solving Stats
            </h3>
            
            <div className="space-y-4 relative z-10">
              {platforms.map((platform, i) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex justify-between items-center py-4 border-b border-slate-700/50 last:border-0 cursor-pointer group"
                >
                  <span className="text-slate-300 font-semibold group-hover:text-cyan-400 transition-colors">
                    {platform.name}
                  </span>
                  <span className="text-3xl font-black text-cyan-400">
                    {platform.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Achievements */}
          <div className="space-y-6">
            {achievements.map((achievement, i) => (
              <motion.a
                key={achievement.platform}
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10, scale: 1.02 }}
                className="block group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="text-purple-400 text-xs font-bold tracking-widest mb-3 uppercase">
                    {achievement.platform}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {achievement.title}
                  </h4>
                  
                  <p className="text-slate-400 text-sm mb-4">
                    {achievement.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold group-hover:gap-4 transition-all">
                    <span>View Profile</span>
                    <span>→</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Volunteer Section
const VolunteerSection = () => {
  const experiences = [
    {
      icon: '📝',
      period: '2022 - 2024',
      title: 'Problem Setter & Judge',
      org: 'Takeoff Programming Contest, DIU',
      desc: 'Authored and rigorously tested competitive programming problems for university-level contests. Ensured problem quality, test case coverage, and fair difficulty distribution to challenge participants effectively.',
      tags: ['Problem Design', 'Test Case Creation', 'Contest Management']
    },
    {
      icon: '👨‍🏫',
      period: '2022 - 2024',
      title: 'Trainer & Course Prefect',
      org: 'Data Structures & Algorithms Course',
      desc: 'Mentored students in mastering data structures and algorithms through hands-on problem-solving sessions. Guided peers in competitive programming strategies and helped build strong foundational coding skills.',
      tags: ['Teaching', 'Mentorship', 'DSA Training']
    }
  ];
  
  return (
    <section id="volunteer" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-cyan-400 text-sm font-bold tracking-widest mb-4 uppercase">
            Giving Back to Community
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white">
            Volunteer Experience
          </h2>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {exp.icon}
                </div>
                
                <div className="inline-block px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full text-xs text-pink-400 font-bold mb-4">
                  {exp.period}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {exp.title}
                </h3>
                
                <p className="text-cyan-400 font-semibold mb-4">
                  {exp.org}
                </p>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {exp.desc}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag, j) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 + j * 0.05 }}
                      className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs text-pink-400 font-semibold"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden"
    >
      <div className="grid lg:grid-cols-2">
        {/* Project Visual */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative h-80 lg:h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent blur-3xl"
          />
          <div className="text-8xl z-10">{project.icon}</div>
        </motion.div>
        
        {/* Project Content */}
        <div className="p-10 flex flex-col justify-center">
          <div className="text-cyan-400 text-xs font-bold tracking-widest mb-4 uppercase">
            {project.label}
          </div>
          
          <h3 className="text-4xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-slate-400 leading-relaxed mb-6">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2 + i * 0.05 }}
                className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs text-purple-400 font-semibold"
              >
                {tech}
              </motion.span>
            ))}
          </div>
          
          <motion.a
            href={project.link}
            whileHover={{ x: 10 }}
            className="inline-flex items-center gap-2 text-cyan-400 font-bold text-sm group-hover:gap-4 transition-all"
          >
            <span>View Project</span>
            <span>→</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

// Projects Section
const ProjectsSection = () => {
  const projects = [
    {
      icon: '🤖',
      label: 'AI-Powered Application',
      title: 'HireSense',
      description: 'Built a comprehensive job portal with AI-powered resume analysis, automated job matching, and intelligent candidate ranking. Features role-based authentication, real-time notifications, and a scalable REST API architecture.',
      tech: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'LLMs (Groq)', 'JWT'],
      link: 'https://github.com/parthibCsaha/AI-Powered-Job-Portal'
    },
    {
      icon: '📈',
      label: 'Real-Time Trading System',
      title: 'Wall Street',
      description: 'Designed and developed a high-performance order book matching engine simulating a stock exchange. Implemented advanced concurrency with ReentrantLock and real-time WebSocket notifications using STOMP protocol.',
      tech: ['Java', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'React', 'STOMP'],
      link: 'https://github.com/parthibCsaha/Real-Time-Stock-Matching-Engine'
    }
  ];
  
  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-cyan-400 text-sm font-bold tracking-widest mb-4 uppercase">
            Featured Work
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white">
            Projects
          </h2>
        </motion.div>
        
        <div className="space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Education Section
const EducationSection = () => {
  return (
    <section id="education" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-cyan-400 text-sm font-bold tracking-widest mb-4 uppercase">
            Academic Background
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white">
            Education
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-12 overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
          />
          
          <div className="grid lg:grid-cols-[2fr,1fr] gap-12 items-center relative z-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                B.Sc. in Computer Science and Engineering
              </h3>
              <p className="text-xl text-slate-300 font-semibold mb-2">
                Daffodil International University
              </p>
              <p className="text-slate-500">
                August 2021 - September 2025
              </p>
            </div>
            
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-7xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent"
              >
                3.53
              </motion.div>
              <div className="text-slate-500 text-sm uppercase tracking-widest font-bold mt-2">
                CGPA / 4.00
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const contacts = [
    { icon: '📧', label: 'Email', link: 'mailto:parthibsahaprattus@gmail.com' },
    { icon: '💼', label: 'LinkedIn', link: 'https://www.linkedin.com/in/parthib-saha-32b547260/' },
    { icon: '🐙', label: 'GitHub', link: 'https://github.com/parthibCsaha' },
    { icon: '📱', label: 'Phone', link: 'tel:+8801704853732' }
  ];
  
  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black text-white mb-6"
        >
          Let's Build Something{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Amazing
          </span>{' '}
          Together
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 mb-12"
        >
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {contacts.map((contact, i) => (
            <motion.a
              key={contact.label}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ 
                y: -5, 
                scale: 1.05,
                boxShadow: '0 20px 50px rgba(0, 245, 255, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full text-slate-300 font-semibold hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <span className="text-2xl">{contact.icon}</span>
              <span>{contact.label}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-slate-500 text-sm">
          &copy; 2026 Parthib Saha. Crafted with passion and code.
        </p>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans antialiased">
      <ParticleBackground />
      
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <CompetitiveSection />
      <VolunteerSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00f5ff, #7c3aed);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00d9ff, #6d28d9);
        }
      `}</style>
    </div>
  );
};

export default App;