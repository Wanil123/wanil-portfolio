// src/App.tsx - Portfolio Haut de Gamme — Redesigned 2025
import React, { useEffect, useMemo, useState, useRef, useCallback, Component, type ErrorInfo, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useInView } from 'framer-motion'
import {
  Mail,
  Phone,
  ExternalLink,
  Github,
  Sun,
  Moon,
  Download,
  Code2,
  Briefcase,
  GraduationCap,
  MapPin,
  Globe,
  Menu,
  X,
  ArrowUp,
  Sparkles,
  Zap,
  Palette,
  Database,
  Terminal,
  ChevronRight,
  ChevronDown,
  Eye,
  Music,
  ShoppingBag,
  ShoppingCart,
  Film,
  CloudSun,
  Server,
  Rocket,
  Settings,
  Layout,
  Lock,
  Search,
  FileCode
} from 'lucide-react'

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Portfolio error:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors">
              Recharger la page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}


// ============================================
// MAGNETIC BUTTON WRAPPER
// ============================================
function MagneticButton({ children, className = '' }: { children: ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// TEXT REVEAL ANIMATION (letter by letter)
// ============================================
function TextReveal({ text, className = '', delay = 0 }: { text: string, className?: string, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ============================================
// STAGGER FADE IN (for groups of elements)
// ============================================
function StaggerChildren({ children, className = '' }: { children: ReactNode, className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SKILL PROGRESS BAR
// ============================================
function SkillBar({ name, level, color, delay = 0 }: { name: string, level: number, color: string, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.5 }}
          className="text-slate-500"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.215, 0.61, 0.355, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

// ============================================
// PRELOADER COMPONENT (Fast)
// ============================================
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 200)
          return 100
        }
        return prev + 20
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center animate-pulse-glow">
          <Code2 className="w-12 h-12 text-white" />
        </div>
        <motion.div
          className="absolute -inset-4 rounded-3xl border-2 border-emerald-500/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Wanil Parfait</h2>
        <p className="text-slate-400 text-sm">Loading...</p>
      </motion.div>

      <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.p
        className="mt-4 text-slate-500 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Math.min(Math.round(progress), 100)}%
      </motion.p>
    </motion.div>
  )
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 text-white shadow-lg hover:shadow-emerald-500/25 transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ============================================
// TYPING ANIMATION COMPONENT
// ============================================
function TypeWriter({ words, className = '' }: { words: string[], className?: string }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.substring(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.substring(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[1em] ml-1 bg-emerald-500 align-middle"
      />
    </span>
  )
}

// ============================================
// GRAIN OVERLAY
// ============================================
function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// ============================================
// MESH GRADIENT BACKGROUND
// ============================================
function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Mesh gradient blobs */}
      <div className="mesh-blob-1 absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[120px]" />
      <div className="mesh-blob-2 absolute top-1/4 -right-32 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
      <div className="mesh-blob-3 absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[110px]" />
      <div className="mesh-blob-4 absolute -bottom-40 right-1/4 w-[550px] h-[550px] bg-emerald-600/8 rounded-full blur-[130px]" />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 dot-grid opacity-50" />
    </div>
  )
}

// ============================================
// MARQUEE COMPONENT
// ============================================
function Marquee() {
  const techItems = 'React  --  Vue.js  --  Laravel  --  JavaScript  --  WordPress  --  TypeScript  --  Tailwind  --  Python  --  Odoo  --  Figma  --  PostgreSQL  --  PHP  --  '

  return (
    <div className="relative overflow-hidden py-2">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="stroke-text text-4xl md:text-6xl lg:text-7xl font-mono font-bold text-slate-300/70 tracking-wider select-none">
          {techItems}{techItems}
        </span>
      </div>
    </div>
  )
}

// ============================================
// MOBILE MENU
// ============================================
type TranslationStrings = typeof strings.fr | typeof strings.en | typeof strings.ja

function MobileMenu({ isOpen, onClose, nav, t }: { isOpen: boolean, onClose: () => void, nav: { id: string, label: string }[], t: TranslationStrings }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-950/95 backdrop-blur-2xl z-50 md:hidden border-l border-slate-800"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold gradient-text">Menu</span>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {nav.map((n, idx) => (
                  <motion.a
                    key={n.id}
                    href={`#${n.id}`}
                    onClick={onClose}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <span className="font-medium">{n.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-amber-500/10 border border-emerald-500/20"
              >
                <p className="text-sm text-slate-400 mb-3">{t.hero.pitch}</p>
                <a
                  href="mailto:maiwanpar@gmail.com"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                >
                  <Mail className="h-4 w-4" /> {t.cta.contact}
                </a>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================
// FULL-WIDTH PROJECT CARD
// ============================================
function ProjectCardFull({ project, index }: { project: Project, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [imageLoaded, setImageLoaded] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative"
    >
      <div className="relative flex flex-col lg:flex-row items-stretch gap-0 rounded-2xl overflow-hidden bg-slate-900/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 hover:border-emerald-500/30 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-emerald-500/10">
        {/* Left side: number + info */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="stroke-text text-5xl md:text-7xl font-black text-slate-600/60 leading-none select-none">
              {num}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-semibold">
              {project.role}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 group-hover:text-emerald-400 transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm md:text-base mb-6 max-w-lg leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right side: image */}
        <div className="relative lg:w-[45%] h-64 lg:h-auto overflow-hidden">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent lg:from-slate-900/60 lg:via-transparent" />
          <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// BENTO SKILL CARD
// ============================================
function BentoCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`relative group rounded-2xl overflow-hidden ${className}`}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-amber-500/20 animated-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-[1px] rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl" />
      <div className="relative p-6 md:p-8 h-full">
        {children}
      </div>
    </div>
  )
}

// ============================================
// TIMELINE EXPERIENCE CARD
// ============================================
function TimelineCard({ title, location, date, items, badge, badgeColor, index }: {
  title: string
  location: string
  date: string
  items: readonly string[]
  badge: string
  badgeColor: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
      className="relative pl-8 md:pl-12 pb-12 last:pb-0"
    >
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
        className="absolute left-0 top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 z-10 shadow-lg shadow-emerald-500/30"
      />

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm p-6 hover:border-emerald-500/20 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-slate-500 text-sm">{location}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
              {badge}
            </span>
            <span className="text-slate-500">{date}</span>
          </div>
        </div>
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3 + i * 0.08 }}
              className="flex items-start gap-2 text-sm text-slate-400"
            >
              <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const getInitialLang = (): 'fr' | 'en' | 'ja' => {
    try {
      const savedLang = localStorage.getItem('wanil-lang')
      if (savedLang === 'fr' || savedLang === 'en' || savedLang === 'ja') {
        return savedLang
      }
    } catch { /* localStorage unavailable */ }
    const browserLang = navigator.language || 'en'
    const langCode = browserLang.toLowerCase().split('-')[0]
    if (langCode === 'fr') return 'fr'
    if (langCode === 'ja') return 'ja'
    return 'en'
  }

  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState<'fr' | 'en' | 'ja'>(getInitialLang)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Track active section for nav indicator
  useEffect(() => {
    const sections = ['home', 'projects', 'skills', 'experience', 'education', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [loading])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('wanil-theme')
      if (savedTheme) setDark(savedTheme === 'dark')
    } catch { /* localStorage unavailable */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('wanil-theme', dark ? 'dark' : 'light')
      localStorage.setItem('wanil-lang', lang)
    } catch { /* localStorage unavailable */ }
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.lang = lang === 'ja' ? 'ja' : lang === 'fr' ? 'fr' : 'en'
  }, [dark, lang])

  const t = useMemo(() => {
    if (lang === 'fr') return strings.fr
    if (lang === 'ja') return strings.ja
    return strings.en
  }, [lang])

  const cvFileMap = { fr: 'CV_Wanil_Parfait_FR.pdf', en: 'CV_Wanil_Parfait_EN.pdf', ja: 'CV_Wanil_Parfait_JP.pdf' }
  const cvFileName = cvFileMap[lang]
  const cvRelPath = `${import.meta.env.BASE_URL}cv/${cvFileName}`

  const downloadCV = useCallback(async () => {
    try {
      const res = await fetch(cvRelPath, { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = cvFileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      const absoluteUrl = new URL(cvRelPath, window.location.origin).toString()
      window.location.href = absoluteUrl
    }
  }, [cvRelPath, cvFileName])

  const projects: Project[] = [
    {
      title: t.projects.lamipict.title,
      role: t.projects.lamipict.role,
      description: t.projects.lamipict.desc,
      tech: ['Laravel', 'React', 'Vue.js', 'MySQL', 'Stripe', 'Tailwind CSS'],
      features: [t.features.stripe, t.features.adminDashboard, t.features.orderManagement, t.features.imageCustomization],
      links: [{ href: 'https://www.lamipict.com', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    },
    {
      title: t.projects.festival.title,
      role: t.projects.festival.role,
      description: t.projects.festival.desc,
      tech: ['Laravel', 'Tailwind', 'MySQL', 'JavaScript', 'Adobe XD'],
      features: [t.features.booking, t.features.roles, t.features.dashboard, t.features.analytics],
      links: [{ href: 'https://film-festival1.netlify.app', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    },
    {
      title: t.projects.musike.title,
      role: t.projects.musike.role,
      description: t.projects.musike.desc,
      tech: ['React', 'CSS3', 'API Integration', 'JavaScript'],
      features: [t.features.musicPlayer, t.features.playlist, t.features.responsive, t.features.animations],
      links: [{ href: 'https://musike-app.netlify.app/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    },
    {
      title: t.projects.netramark.title,
      role: t.projects.netramark.role,
      description: t.projects.netramark.desc,
      tech: ['FastAPI', 'SQLAlchemy 2.0', 'Pydantic v2', 'Alembic', 'pytest', 'JWT', 'Docker'],
      features: [t.features.jwtAuth, t.features.abnormalityDetection, t.features.paginationFilters, t.features.asyncApi],
      links: [
        { href: 'https://clinical-trials-data-api.onrender.com/', label: t.common.liveDemo },
        { href: 'https://github.com/Wanil123/Clinical_Trials_Data_API', label: t.common.sourceCode },
      ],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    },
    {
      title: t.projects.weather.title,
      role: t.projects.weather.role,
      description: t.projects.weather.desc,
      tech: ['React', 'API REST', 'CSS3', 'JavaScript'],
      features: [t.features.weatherApi, t.features.geolocation, t.features.responsive, t.features.realtime],
      links: [{ href: 'https://your-weather-ap.netlify.app/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80',
    },
    {
      title: t.projects.luxe.title,
      role: t.projects.luxe.role,
      description: t.projects.luxe.desc,
      tech: ['React', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
      features: [t.features.ecommerce, t.features.animations, t.features.responsive, t.features.darkMode],
      links: [{ href: 'https://luxe-mode.netlify.app/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
    },
  ]

  const nav = [
    { id: 'projects', label: t.nav.projects },
    { id: 'skills', label: t.nav.skills },
    { id: 'experience', label: t.nav.experience },
    { id: 'education', label: t.nav.education },
    { id: 'contact', label: t.nav.contact },
  ]

  const typingWords = lang === 'fr'
    ? ['Developpeur Full-Stack', 'Passionne React', 'Expert Laravel', 'Fan de Vue.js', 'Designer UX/UI']
    : lang === 'ja'
    ? ['Full-Stack Developer', 'React Engineer', 'Laravel Expert', 'Vue.js Developer', 'UX/UI Designer']
    : ['Full-Stack Developer', 'React Enthusiast', 'Laravel Expert', 'Vue.js Fan', 'UX/UI Designer']

  return (
    <ErrorBoundary>
      {/* Preloader */}
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={dark ? 'dark' : ''}
        >
          <ScrollProgress />
          <BackToTop />
          <MeshBackground />
          <GrainOverlay />

          <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
            {/* ====== NAVBAR ====== */}
            <motion.header
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-950/60 border-b border-slate-800/40"
            >
              <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <motion.a
                  href="#home"
                  className="flex items-center gap-3 font-bold text-lg group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden sm:inline gradient-text font-black tracking-tight">WP</span>
                </motion.a>

                {/* Center nav */}
                <nav className="hidden md:flex items-center gap-1">
                  {nav.map((n) => (
                    <motion.a
                      key={n.id}
                      href={`#${n.id}`}
                      className="relative px-4 py-2 rounded-full text-sm font-medium hover:text-emerald-400 transition-colors"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {n.label}
                      {activeSection === n.id && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.a>
                  ))}
                </nav>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                  {/* Language Dropdown */}
                  <div className="relative" ref={langMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs px-3 py-2 rounded-full border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-colors flex items-center gap-2"
                      onClick={() => setLangMenuOpen(!langMenuOpen)}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">{lang.toUpperCase()}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {langMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full right-0 mt-2 py-2 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl min-w-[140px] z-50"
                        >
                          {[
                            { code: 'fr' as const, label: 'Francais', flag: 'FR' },
                            { code: 'en' as const, label: 'English', flag: 'EN' },
                            { code: 'ja' as const, label: 'Japanese', flag: 'JA' },
                          ].map((language) => (
                            <button
                              key={language.code}
                              onClick={() => {
                                setLang(language.code)
                                setLangMenuOpen(false)
                              }}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-slate-800 transition-colors ${
                                lang === language.code ? 'text-emerald-400 font-medium bg-emerald-500/10' : ''
                              }`}
                            >
                              <span className="text-xs font-mono font-bold w-6">{language.flag}</span>
                              <span>{language.label}</span>
                              {lang === language.code && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto w-2 h-2 rounded-full bg-emerald-500"
                                />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex p-2.5 rounded-full border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-colors"
                    onClick={() => setDark(!dark)}
                    aria-label="Toggle dark mode"
                  >
                    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-full border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-colors md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open menu"
                  >
                    <Menu className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.header>

            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} nav={nav} t={t} />

            {/* ====== HERO SECTION ====== */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20">
              <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                  {/* Left Column — Text content */}
                  <div className="order-1 lg:order-1">
                    {/* Greeting line */}
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-emerald-400 font-mono text-sm md:text-base mb-4 flex items-center gap-2"
                    >
                      <span className="inline-block w-8 h-[2px] bg-emerald-500" />
                      {t.hero.badge}
                    </motion.p>

                    {/* Name & Role */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
                    >
                      <span className="text-white">Wanil </span>
                      <span className="gradient-text">Parfait</span>
                    </motion.h1>

                    {/* TypeWriter */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg md:text-xl text-slate-400 mb-6 h-8 font-mono"
                    >
                      <TypeWriter words={typingWords} />
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
                    >
                      {t.hero.lead}
                    </motion.p>

                    {/* CTA Row */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="flex flex-wrap gap-4 mb-8"
                    >
                      <MagneticButton>
                        <motion.a
                          href="#projects"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/25"
                        >
                          <Briefcase className="h-4 w-4" /> {t.cta.viewProjects}
                        </motion.a>
                      </MagneticButton>

                      <MagneticButton>
                        <motion.a
                          href="https://mail.google.com/mail/?view=cm&to=maiwanpar@gmail.com&su=Opportunit%C3%A9%20de%20collaboration"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white transition-all"
                        >
                          <Mail className="h-4 w-4" /> {t.cta.contact}
                        </motion.a>
                      </MagneticButton>

                      <MagneticButton>
                        <motion.button
                          onClick={downloadCV}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 transition-all"
                        >
                          <Download className="h-4 w-4" /> {t.cta.resume}
                        </motion.button>
                      </MagneticButton>
                    </motion.div>

                    {/* Status line */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="flex flex-wrap items-center gap-5 text-sm text-slate-500"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Montreal, QC
                      </div>
                      <a
                        className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                        href="https://github.com/wanil123"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Github className="h-4 w-4" /> GitHub
                      </a>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{t.common.available}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column — Interactive Terminal Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                    className="order-2 lg:order-2"
                  >
                    <div className="relative group">
                      {/* Glow behind the card */}
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Terminal card */}
                      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Terminal header */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/60 border-b border-slate-700/50">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          </div>
                          <span className="ml-2 text-xs text-slate-500 font-mono">wanil@portfolio ~ </span>
                        </div>

                        {/* Terminal body */}
                        <div className="p-5 md:p-6 font-mono text-xs md:text-sm space-y-3">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <span className="text-emerald-400">const</span>{' '}
                            <span className="text-amber-300">developer</span>{' '}
                            <span className="text-slate-400">=</span>{' '}
                            <span className="text-slate-300">{'{'}</span>
                          </motion.div>

                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="pl-4 space-y-1.5">
                            <div>
                              <span className="text-teal-300">name</span>
                              <span className="text-slate-400">:</span>{' '}
                              <span className="text-amber-200">"Wanil Parfait"</span>
                              <span className="text-slate-500">,</span>
                            </div>
                            <div>
                              <span className="text-teal-300">location</span>
                              <span className="text-slate-400">:</span>{' '}
                              <span className="text-amber-200">"Montreal, QC"</span>
                              <span className="text-slate-500">,</span>
                            </div>
                            <div>
                              <span className="text-teal-300">role</span>
                              <span className="text-slate-400">:</span>{' '}
                              <span className="text-amber-200">"Full-Stack Developer"</span>
                              <span className="text-slate-500">,</span>
                            </div>
                            <div>
                              <span className="text-teal-300">stack</span>
                              <span className="text-slate-400">:</span>{' '}
                              <span className="text-slate-300">[</span>
                              <span className="text-amber-200">"React"</span>
                              <span className="text-slate-500">, </span>
                              <span className="text-amber-200">"Vue.js"</span>
                              <span className="text-slate-500">, </span>
                              <span className="text-amber-200">"Laravel"</span>
                              <span className="text-slate-500">, </span>
                              <span className="text-amber-200">"JavaScript"</span>
                              <span className="text-slate-300">]</span>
                              <span className="text-slate-500">,</span>
                            </div>
                            <div>
                              <span className="text-teal-300">available</span>
                              <span className="text-slate-400">:</span>{' '}
                              <span className="text-emerald-400">true</span>
                              <span className="text-slate-500">,</span>
                            </div>
                          </motion.div>

                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                            <span className="text-slate-300">{'}'}</span>
                            <span className="text-slate-500">;</span>
                          </motion.div>

                          {/* Blinking cursor line */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className="pt-2 flex items-center gap-1"
                          >
                            <span className="text-emerald-400">{'>'}</span>
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                              className="inline-block w-2 h-4 bg-emerald-500"
                            />
                          </motion.div>
                        </div>

                        {/* Stats bar at bottom */}
                        <div className="px-5 md:px-6 py-3 bg-slate-800/40 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3 h-3" /> 5+ {lang === 'fr' ? 'projets' : 'projects'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3 h-3" /> 2+ {lang === 'fr' ? 'ans exp.' : 'yrs exp.'}
                            </span>
                          </div>
                          <span className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {lang === 'fr' ? 'En ligne' : 'Online'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>

            </section>

            {/* Marquee */}
            <div className="pointer-events-none select-none -mt-4 mb-8">
              <Marquee />
            </div>

            {/* ====== PROJECTS SECTION ====== */}
            <section id="projects" className="mx-auto max-w-7xl px-4 md:px-8 py-24">
              <StaggerChildren className="mb-16">
                <StaggerItem>
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-semibold">{t.nav.projects}</span>
                </StaggerItem>
                <StaggerItem>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4">{t.sections.projects}</h2>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-slate-400 max-w-xl text-lg">{t.sections.projectsSub}</p>
                </StaggerItem>
              </StaggerChildren>

              <div className="space-y-8">
                {projects.map((p, idx) => (
                  <ProjectCardFull key={idx} project={p} index={idx} />
                ))}
              </div>
            </section>

            {/* ====== SKILLS SECTION - BENTO GRID ====== */}
            <section id="skills" className="mx-auto max-w-7xl px-4 md:px-8 py-24">
              <StaggerChildren className="mb-16">
                <StaggerItem>
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-semibold">{t.nav.skills}</span>
                </StaggerItem>
                <StaggerItem>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4">{t.sections.skills}</h2>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-slate-400 max-w-xl text-lg">{t.sections.skillsSub}</p>
                </StaggerItem>
              </StaggerChildren>

              <StaggerChildren className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-auto">
                {/* Frontend - spans 2 cols */}
                <StaggerItem className="md:col-span-2">
                  <BentoCard className="h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10">
                        <Layout className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{t.skills.front}</h3>
                        <p className="text-xs text-slate-500">{t.skills.frontDesc}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <SkillBar name="React" level={92} color="bg-gradient-to-r from-emerald-500 to-teal-500" delay={0.1} />
                      <SkillBar name="Vue.js 3" level={88} color="bg-gradient-to-r from-emerald-500 to-green-500" delay={0.2} />
                      <SkillBar name="TypeScript" level={85} color="bg-gradient-to-r from-blue-500 to-sky-500" delay={0.3} />
                      <SkillBar name="Tailwind CSS" level={95} color="bg-gradient-to-r from-sky-500 to-blue-500" delay={0.4} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {['HTML5', 'CSS3', 'ES6+', 'Bootstrap', 'Framer Motion'].map((s) => (
                        <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">{s}</span>
                      ))}
                    </div>
                  </BentoCard>
                </StaggerItem>

                {/* Backend - spans 2 rows */}
                <StaggerItem className="md:row-span-2">
                  <BentoCard className="h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-amber-500/10">
                        <Server className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{t.skills.back}</h3>
                        <p className="text-xs text-slate-500">{t.skills.backDesc}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <SkillBar name="Laravel" level={90} color="bg-gradient-to-r from-red-500 to-orange-500" delay={0.1} />
                      <SkillBar name="PHP" level={88} color="bg-gradient-to-r from-indigo-500 to-blue-500" delay={0.2} />
                      <SkillBar name="Python" level={82} color="bg-gradient-to-r from-yellow-500 to-green-500" delay={0.3} />
                      <SkillBar name="MySQL / PostgreSQL" level={85} color="bg-gradient-to-r from-blue-500 to-indigo-500" delay={0.4} />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {['REST APIs', 'Auth & Roles', 'Eloquent', 'Redis'].map((s) => (
                        <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">{s}</span>
                      ))}
                    </div>
                  </BentoCard>
                </StaggerItem>

                {/* CMS */}
                <StaggerItem>
                  <BentoCard className="h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-green-500/10">
                        <Rocket className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="text-lg font-bold">{t.skills.cms}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{t.skills.cmsDesc}</p>
                    <div className="flex flex-wrap gap-2">
                      {['WordPress', 'Headless CMS', 'i18n', 'SEO', 'Git', 'Netlify', 'Vercel'].map((s) => (
                        <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">{s}</span>
                      ))}
                    </div>
                  </BentoCard>
                </StaggerItem>

                {/* Odoo */}
                <StaggerItem>
                  <BentoCard className="h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-orange-500/10">
                        <Settings className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-bold">{t.skills.odoo}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{t.skills.odooDesc}</p>
                    <div className="flex flex-wrap gap-2">
                      {['Odoo 17', 'Custom Modules', 'QWeb / OWL', 'PDF Reports', 'API Odoo'].map((s) => (
                        <span key={s} className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">{s}</span>
                      ))}
                    </div>
                  </BentoCard>
                </StaggerItem>
              </StaggerChildren>
            </section>

            {/* ====== EXPERIENCE SECTION - VERTICAL TIMELINE ====== */}
            <section id="experience" className="mx-auto max-w-7xl px-4 md:px-8 py-24">
              <StaggerChildren className="mb-16">
                <StaggerItem>
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-semibold">{t.nav.experience}</span>
                </StaggerItem>
                <StaggerItem>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4">{t.sections.experience}</h2>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-slate-400 max-w-xl text-lg">{t.sections.experienceSub}</p>
                </StaggerItem>
              </StaggerChildren>

              <div className="relative max-w-3xl">
                {/* Vertical timeline line */}
                <div className="absolute left-[7px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500 via-teal-500/50 to-transparent" />

                <TimelineCard
                  title={t.exp.freelance.title}
                  location="Montreal, QC"
                  date={t.exp.freelance.date}
                  items={t.exp.freelance.items}
                  badge={t.common.current}
                  badgeColor="bg-emerald-500/10 text-emerald-400"
                  index={0}
                />

                <TimelineCard
                  title={t.exp.gsd.title}
                  location="Laval, QC"
                  date={t.exp.gsd.date}
                  items={t.exp.gsd.items}
                  badge={t.exp.gsd.role ?? 'Back-End'}
                  badgeColor="bg-amber-500/10 text-amber-400"
                  index={1}
                />

                <TimelineCard
                  title={t.exp.lien.title}
                  location="Montreal, QC"
                  date={t.exp.lien.date}
                  items={t.exp.lien.items}
                  badge={t.common.intern}
                  badgeColor="bg-teal-500/10 text-teal-400"
                  index={2}
                />
              </div>
            </section>

            {/* ====== EDUCATION SECTION ====== */}
            <section id="education" className="mx-auto max-w-7xl px-4 md:px-8 py-24">
              <StaggerChildren className="mb-16">
                <StaggerItem>
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-semibold">{t.nav.education}</span>
                </StaggerItem>
                <StaggerItem>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-3 mb-4">{t.sections.education}</h2>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-slate-400 max-w-xl text-lg">{t.sections.educationSub}</p>
                </StaggerItem>
              </StaggerChildren>

              <StaggerChildren>
                <StaggerItem>
                  <div className="relative rounded-2xl overflow-hidden max-w-3xl">
                    {/* Glassmorphism card */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-amber-500/5" />
                    <div className="absolute inset-[1px] rounded-2xl bg-slate-900/80 backdrop-blur-2xl" />

                    <div className="relative p-8 md:p-10">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                        <div className="flex gap-4 items-start">
                          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 items-center justify-center text-white shadow-lg flex-shrink-0">
                            <GraduationCap className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Cegep de Saint-Jerome</h3>
                            <p className="text-emerald-400 font-semibold text-sm">{t.edu.program}</p>
                            <p className="text-sm text-slate-500 mt-1">{t.edu.type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-medium text-xs">
                            {t.edu.hours}
                          </span>
                          <span className="text-sm text-slate-500">2023 - 2024</span>
                        </div>
                      </div>

                      <p className="text-slate-400 leading-relaxed mb-8 text-sm">
                        {t.edu.description}
                      </p>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">{t.edu.skillsTitle}</h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {t.edu.skills.map((skill, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                              <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Courses */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">{t.edu.coursesTitle}</h4>
                        <div className="flex flex-wrap gap-2">
                          {t.edu.courses.map((course, i) => (
                            <span key={i} className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stage */}
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                        <div className="flex items-center gap-3 mb-2">
                          <Briefcase className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-sm">{t.edu.stageTitle}</span>
                        </div>
                        <p className="text-sm text-slate-400">{t.edu.stageDesc}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerChildren>
            </section>

            {/* ====== CONTACT SECTION - BIG CTA ====== */}
            <section id="contact" className="relative mx-auto max-w-7xl px-4 md:px-8 py-24">
              {/* Gradient background glow */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-amber-500/20 rounded-full blur-[100px]" />
              </div>

              <div className="text-center max-w-3xl mx-auto">
                <StaggerChildren className="mb-12">
                  <StaggerItem>
                    <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-semibold">{t.nav.contact}</span>
                  </StaggerItem>
                  <StaggerItem>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mt-3 mb-6">
                      {t.contact.cta}
                    </h2>
                  </StaggerItem>
                  <StaggerItem>
                    <p className="text-slate-400 text-lg mb-10">{t.contact.ctaDesc}</p>
                  </StaggerItem>
                  <StaggerItem>
                    <MagneticButton className="inline-block">
                      <motion.a
                        href="https://mail.google.com/mail/?view=cm&to=maiwanpar@gmail.com&su=Opportunit%C3%A9%20de%20collaboration"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 md:gap-3 px-6 py-4 md:px-10 md:py-5 text-base md:text-lg font-bold rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
                      >
                        <Sparkles className="w-6 h-6" />
                        {t.common.workTogether}
                      </motion.a>
                    </MagneticButton>
                  </StaggerItem>
                </StaggerChildren>

                {/* Contact info */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-slate-500"
                >
                  <a href="mailto:maiwanpar@gmail.com" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <Mail className="w-4 h-4" /> maiwanpar@gmail.com
                  </a>
                  <a href="tel:+15793685230" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <Phone className="w-4 h-4" /> +1 579-368-5230
                  </a>
                  <a href="https://github.com/wanil123" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <motion.button
                    onClick={downloadCV}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  >
                    <Download className="w-4 h-4" /> {t.cta.resume}
                  </motion.button>
                </motion.div>
              </div>
            </section>

            {/* ====== FOOTER ====== */}
            <footer className="border-t border-slate-800/60 py-8">
              <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                <span>&copy; {new Date().getFullYear()} Wanil Parfait. {t.footer.rights}</span>
                <span className="flex items-center gap-2">
                  {t.footer.made}
                  <span className="gradient-text font-semibold">React + Tailwind</span>
                </span>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </ErrorBoundary>
  )
}

// ============================================
// TYPES
// ============================================
interface ProjectLink { href: string; label: string }
interface Project {
  title: string
  role: string
  description: string
  tech: string[]
  features: string[]
  links: ProjectLink[]
  image?: string
}

// ============================================
// TRANSLATIONS (FR/EN)
// ============================================
const strings = {
  fr: {
    common: {
      liveDemo: 'Voir le site',
      sourceCode: 'Code source',
      intern: 'Stage',
      current: 'En cours',
      workTogether: 'Travaillons ensemble',
      available: 'Disponible pour opportunités'
    },
    nav: { projects: 'Projets', skills: 'Compétences', experience: 'Expérience', education: 'Études', contact: 'Contact' },
    hero: {
      badge: 'Ouvert aux opportunités',
      title: 'Profil',
      lead: "Développeur Full-Stack passionné basé à Montréal. Je conçois des applications web complètes avec React, Vue.js, JavaScript côté front et Laravel, PHP, WordPress côté back. Du design à la base de données !",
      pitch: "Approche composant, responsive-first, avec un souci constant de la performance et de l'accessibilité (WCAG).",
    },
    cta: { viewProjects: 'Voir mes projets', contact: 'Me contacter', resume: 'CV' },
    sections: {
      projects: 'Projets sélectionnés',
      projectsSub: 'Une sélection de mes réalisations récentes, du e-commerce au streaming musical.',
      skills: 'Compétences',
      skillsSub: 'Technologies et outils que je maîtrise au quotidien.',
      experience: 'Expérience',
      experienceSub: 'Mon parcours professionnel en développement web.',
      education: 'Formation',
      educationSub: 'Mon parcours académique en développement web.',
      contact: 'Contact',
      contactSub: "Discutons de votre projet ou d'une opportunité de collaboration.",
      resume: 'CV / Résumé',
    },
    features: {
      booking: 'Système de réservations avec forfaits',
      roles: 'Gestion des rôles admin/clients',
      dashboard: "Dashboard d'administration",
      analytics: 'Intégration Google Analytics',
      map: 'Carte interactive',
      responsive: 'Design responsive',
      form: 'Formulaire de contact',
      menu: 'Menu intégré',
      ecommerce: 'Interface e-commerce moderne',
      animations: 'Animations fluides et modernes',
      darkMode: 'Mode sombre/clair',
      musicPlayer: 'Lecteur audio interactif',
      playlist: 'Gestion de playlists',
      weatherApi: 'Intégration API météo en temps réel',
      geolocation: 'Géolocalisation automatique',
      realtime: 'Données en temps réel',
      stripe: 'Paiements Stripe intégrés',
      adminDashboard: 'Tableau de bord administrateur',
      orderManagement: 'Gestion des commandes',
      imageCustomization: 'Personnalisation d\'images',
      jwtAuth: 'Authentification JWT',
      abnormalityDetection: 'Détection automatique d\'anomalies',
      paginationFilters: 'Pagination & filtres avancés',
      asyncApi: 'API async complète',
    },
    projects: {
      lamipict: {
        title: 'LamiPict — Plateforme E-commerce Web-to-Print',
        role: 'Full-Stack Developer',
        desc: 'Plateforme e-commerce complète avec personnalisation d\'images, paiements Stripe et tableau de bord administrateur. En production avec clients réels.'
      },
      luxe: {
        title: 'Luxe Mode — Boutique E-commerce',
        role: 'Full-Stack Developer',
        desc: 'Boutique de mode haut de gamme avec interface élégante, animations fluides et expérience utilisateur premium.'
      },
      musike: {
        title: 'Musike — Application Streaming',
        role: 'Full-Stack Developer',
        desc: "Application de streaming musical avec lecteur interactif, gestion de playlists et interface moderne."
      },
      festival: {
        title: '5:7 Festival de Films',
        role: 'Full-Stack Developer',
        desc: 'Plateforme de réservations pour festival de films avec gestion des rôles et analytics intégrés.'
      },
      weather: {
        title: 'Weather App — Application Météo',
        role: 'Full-Stack Developer',
        desc: 'Application météo en temps réel avec géolocalisation, prévisions détaillées et interface intuitive.'
      },
      netramark: {
        title: 'Clinical Trials Data API',
        role: 'Back-End Developer',
        desc: 'API REST pour la gestion de données d\'essais cliniques — patients, biomarqueurs et analyses de laboratoire avec détection automatique des anomalies.'
      },
    },
    skills: {
      front: 'Front-end & UX/UI',
      frontDesc: 'Interfaces modernes & accessibles',
      back: 'Back-end & API',
      backDesc: 'Applications métier robustes',
      cms: 'CMS & Déploiement',
      cmsDesc: 'Livraison rapide & SEO',
      odoo: 'Odoo & ERP',
      odooDesc: 'Intégrations avancées',
    },
    exp: {
      freelance: {
        title: 'Développeur Web Freelance — Projets Indépendants',
        date: 'Nov 2025 — Présent',
        items: [
          'Sites web et applications pour PME québécoises (React, Vue.js, Laravel)',
          'Bots de trading automatisés avec Python et PostgreSQL',
          'Projets e-commerce Full-Stack avec Stripe et i18n FR/EN',
        ],
      },
      gsd: {
        title: 'Développeur Back-End (Odoo / Python) — G.S.D Group Inc.',
        role: 'Back-End',
        date: 'Nov 2024 — Oct 2025',
        items: [
          'Développement de modules Odoo 17 : CRM, facturation, portail client',
          'Optimisation PostgreSQL (+40% performance) et création d\'APIs REST',
          'Méthodologie Agile/Scrum avec Git et Jira',
        ],
      },
      lien: {
        title: 'Développeur Front-End — Le Lien Multimédia / Qui Fait Quoi',
        date: 'Jan 2024 — Août 2024',
        items: [
          'Interfaces web Vue.js + Laravel pour le portail média qfq.com',
          'Intégration d\'APIs REST et optimisation des performances front-end',
        ],
      },
    },
    edu: {
      program: 'Conception & Programmation de Sites Web',
      type: 'Attestation d\'études collégiales (AEC)',
      hours: '1 425 heures',
      description: 'Formation intensive permettant d\'acquérir toutes les compétences nécessaires à la conception et au développement de sites Web, de l\'analyse de devis à la mise en production.',
      skillsTitle: 'Compétences acquises',
      skills: [
        'Conception d\'interfaces interactives (front-end)',
        'Programmation côté serveur (back-end)',
        'Gestion de bases de données MySQL/PostgreSQL',
        'Expérience utilisateur (UX) et design d\'interface (UI)',
        'Cadriciels (frameworks) et CMS modernes',
        'Planification de projet en méthodologie Agile',
      ],
      coursesTitle: 'Cours clés',
      courses: [
        'Algorithmique & Programmation',
        'Programmation Web dynamique',
        'Design UX/UI appliqué',
        'Cadriciel Web (Laravel)',
        'Programmation d\'interface (JavaScript)',
        'Gestion de projet Agile',
        'CMS & WordPress',
        'Programmation avancée',
      ],
      stageTitle: 'Stage en entreprise — 8 semaines',
      stageDesc: 'Stage pratique au sein d\'une entreprise permettant d\'appliquer les compétences acquises en conditions réelles de production.',
    },
    contact: {
      cta: 'Prêt à collaborer ?',
      ctaDesc: "N'hésitez pas à me contacter pour discuter de votre projet ou d'une opportunité.",
    },
    resume: { note: 'Cliquez sur "CV" pour télécharger la version PDF.' },
    footer: {
      made: 'Conçu avec',
      rights: 'Tous droits réservés.'
    },
  },
  en: {
    common: {
      liveDemo: 'Live demo',
      sourceCode: 'Source code',
      intern: 'Internship',
      current: 'Current',
      workTogether: 'Work together',
      available: 'Available for opportunities'
    },
    nav: { projects: 'Projects', skills: 'Skills', experience: 'Experience', education: 'Education', contact: 'Contact' },
    hero: {
      badge: 'Open to opportunities',
      title: 'Profile',
      lead: 'Passionate Full-Stack developer based in Montreal. I build complete web applications with React, Vue.js, JavaScript on the front and Laravel, PHP, WordPress on the back. From design to database!',
      pitch: 'Component-driven, responsive-first, with constant attention to performance and accessibility (WCAG).',
    },
    cta: { viewProjects: 'View projects', contact: 'Contact me', resume: 'Resume' },
    sections: {
      projects: 'Selected Projects',
      projectsSub: 'A selection of my recent work, from e-commerce to music streaming.',
      skills: 'Skills',
      skillsSub: 'Technologies and tools I work with daily.',
      experience: 'Experience',
      experienceSub: 'My professional journey in web development.',
      education: 'Education',
      educationSub: 'My academic background in web development.',
      contact: 'Contact',
      contactSub: "Let's discuss your project or collaboration opportunity.",
      resume: 'Resume / CV',
    },
    features: {
      booking: 'Booking system with packages',
      roles: 'Admin/client role management',
      dashboard: 'Administration dashboard',
      analytics: 'Google Analytics integration',
      map: 'Interactive map',
      responsive: 'Responsive design',
      form: 'Contact form',
      menu: 'Integrated menu',
      ecommerce: 'Modern e-commerce interface',
      animations: 'Smooth modern animations',
      darkMode: 'Dark/light mode',
      musicPlayer: 'Interactive audio player',
      playlist: 'Playlist management',
      weatherApi: 'Real-time weather API integration',
      geolocation: 'Automatic geolocation',
      realtime: 'Real-time data',
      stripe: 'Stripe payments integration',
      adminDashboard: 'Admin dashboard',
      orderManagement: 'Order management',
      imageCustomization: 'Image customization',
      jwtAuth: 'JWT authentication',
      abnormalityDetection: 'Automated abnormality detection',
      paginationFilters: 'Pagination & advanced filters',
      asyncApi: 'Full async API',
    },
    projects: {
      lamipict: {
        title: 'LamiPict — Web-to-Print E-commerce Platform',
        role: 'Full-Stack Developer',
        desc: 'Complete e-commerce platform with image customization, Stripe payments and admin dashboard. In production with real customers.'
      },
      luxe: {
        title: 'Luxe Mode — E-commerce Store',
        role: 'Full-Stack Developer',
        desc: 'High-end fashion boutique with elegant interface, smooth animations and premium user experience.'
      },
      musike: {
        title: 'Musike — Streaming App',
        role: 'Full-Stack Developer',
        desc: 'Music streaming application with interactive player, playlist management and modern interface.'
      },
      festival: {
        title: '5:7 Film Festival',
        role: 'Full-Stack Developer',
        desc: 'Reservation platform for film festival with role management and integrated analytics.'
      },
      weather: {
        title: 'Weather App — Weather Application',
        role: 'Full-Stack Developer',
        desc: 'Real-time weather application with geolocation, detailed forecasts and intuitive interface.'
      },
      netramark: {
        title: 'Clinical Trials Data API',
        role: 'Back-End Developer',
        desc: 'REST API for clinical trial data management — patients, biomarkers and lab analyses with automated abnormality detection.'
      },
    },
    skills: {
      front: 'Front-end & UX/UI',
      frontDesc: 'Modern & accessible interfaces',
      back: 'Back-end & API',
      backDesc: 'Robust business applications',
      cms: 'CMS & Deployment',
      cmsDesc: 'Fast delivery & SEO',
      odoo: 'Odoo & ERP',
      odooDesc: 'Advanced integrations',
    },
    exp: {
      freelance: {
        title: 'Freelance Web Developer — Independent Projects',
        date: 'Nov 2025 — Present',
        items: [
          'Websites and applications for Quebec SMBs (React, Vue.js, Laravel)',
          'Automated trading bots with Python and PostgreSQL',
          'Full-Stack e-commerce projects with Stripe and i18n FR/EN',
        ],
      },
      gsd: {
        title: 'Back-End Developer (Odoo / Python) — G.S.D Group Inc.',
        role: 'Back-End',
        date: 'Nov 2024 — Oct 2025',
        items: [
          'Developed Odoo 17 modules: CRM, invoicing, client portal',
          'PostgreSQL optimization (+40% performance) and REST API creation',
          'Agile/Scrum methodology with Git and Jira',
        ],
      },
      lien: {
        title: 'Front-End Developer — Le Lien Multimédia / Qui Fait Quoi',
        date: 'Jan 2024 — Aug 2024',
        items: [
          'Vue.js + Laravel web interfaces for media portal qfq.com',
          'REST APIs integration and front-end performance optimization',
        ],
      },
    },
    edu: {
      program: 'Web Design & Programming',
      type: 'College Studies Attestation (AEC)',
      hours: '1,425 hours',
      description: 'Intensive program providing all necessary skills for website design and development, from project analysis to production deployment.',
      skillsTitle: 'Skills Acquired',
      skills: [
        'Interactive interface design (front-end)',
        'Server-side programming (back-end)',
        'MySQL/PostgreSQL database management',
        'User experience (UX) and interface design (UI)',
        'Modern frameworks and CMS',
        'Agile project planning methodology',
      ],
      coursesTitle: 'Key Courses',
      courses: [
        'Algorithms & Programming',
        'Dynamic Web Programming',
        'Applied UX/UI Design',
        'Web Framework (Laravel)',
        'Interface Programming (JavaScript)',
        'Agile Project Management',
        'CMS & WordPress',
        'Advanced Programming',
      ],
      stageTitle: 'Work Internship — 8 weeks',
      stageDesc: 'Hands-on internship within a company to apply acquired skills in real production conditions.',
    },
    contact: {
      cta: 'Ready to collaborate?',
      ctaDesc: "Feel free to reach out to discuss your project or opportunity.",
    },
    resume: { note: 'Click "Resume" to download the PDF version.' },
    footer: {
      made: 'Built with',
      rights: 'All rights reserved.'
    },
  },
  ja: {
    common: {
      liveDemo: 'サイトを見る',
      sourceCode: 'ソースコード',
      intern: 'インターンシップ',
      current: '現在',
      workTogether: '一緒に働きましょう',
      available: '新しい機会を探しています'
    },
    nav: { projects: 'プロジェクト', skills: 'スキル', experience: '経歴', education: '学歴', contact: 'お問い合わせ' },
    hero: {
      badge: '新しい機会を募集中',
      title: 'プロフィール',
      lead: 'モントリオール在住のフルスタック開発者。React、Vue.js、JavaScriptでフロントエンド、Laravel、PHP、WordPressでバックエンドを構築。デザインからデータベースまで一貫して対応します。',
      pitch: 'コンポーネント駆動開発、レスポンシブファースト、パフォーマンスとアクセシビリティ（WCAG）を常に意識した開発。',
    },
    cta: { viewProjects: 'プロジェクトを見る', contact: 'お問い合わせ', resume: '履歴書' },
    sections: {
      projects: '主要プロジェクト',
      projectsSub: 'ECサイトから音楽ストリーミングまで、最近の制作実績をご紹介します。',
      skills: 'スキル',
      skillsSub: '日常的に使用している技術とツール。',
      experience: '職歴',
      experienceSub: 'ウェブ開発における私のキャリア。',
      education: '学歴',
      educationSub: 'ウェブ開発における私の学術的経歴。',
      contact: 'お問い合わせ',
      contactSub: 'プロジェクトやコラボレーションについてお気軽にご相談ください。',
      resume: '履歴書 / CV',
    },
    features: {
      booking: 'パッケージ付き予約システム',
      roles: '管理者/顧客の権限管理',
      dashboard: '管理ダッシュボード',
      analytics: 'Google Analytics連携',
      map: 'インタラクティブマップ',
      responsive: 'レスポンシブデザイン',
      form: 'お問い合わせフォーム',
      menu: '統合メニュー',
      ecommerce: 'モダンなECインターフェース',
      animations: 'スムーズなアニメーション',
      darkMode: 'ダーク/ライトモード',
      musicPlayer: 'インタラクティブ音楽プレイヤー',
      playlist: 'プレイリスト管理',
      weatherApi: 'リアルタイム天気API連携',
      geolocation: '自動位置情報取得',
      realtime: 'リアルタイムデータ',
      stripe: 'Stripe決済連携',
      adminDashboard: '管理ダッシュボード',
      orderManagement: '注文管理',
      imageCustomization: '画像カスタマイズ',
      jwtAuth: 'JWT認証',
      abnormalityDetection: '異常自動検出',
      paginationFilters: 'ページネーション＆高度なフィルター',
      asyncApi: '完全非同期API',
    },
    projects: {
      lamipict: {
        title: 'LamiPict — Web-to-Print ECプラットフォーム',
        role: 'フルスタック開発者',
        desc: '画像カスタマイズ、Stripe決済、管理ダッシュボードを備えた完全なECプラットフォーム。実際の顧客と本番運用中。'
      },
      luxe: {
        title: 'Luxe Mode — ECサイト',
        role: 'フルスタック開発者',
        desc: '洗練されたインターフェース、スムーズなアニメーション、プレミアムなユーザー体験を備えた高級ファッションブティック。'
      },
      musike: {
        title: 'Musike — 音楽ストリーミングアプリ',
        role: 'フルスタック開発者',
        desc: 'インタラクティブプレイヤー、プレイリスト管理、モダンなインターフェースを備えた音楽ストリーミングアプリケーション。'
      },
      festival: {
        title: '5:7 映画祭',
        role: 'フルスタック開発者',
        desc: '権限管理とアナリティクスを統合した映画祭の予約プラットフォーム。'
      },
      weather: {
        title: 'Weather App — 天気アプリ',
        role: 'フルスタック開発者',
        desc: '位置情報取得、詳細な予報、直感的なインターフェースを備えたリアルタイム天気アプリケーション。'
      },
      netramark: {
        title: 'Clinical Trials Data API',
        role: 'バックエンド開発者',
        desc: '臨床試験データ管理用REST API — 患者、バイオマーカー、異常自動検出機能付き検査分析。'
      },
    },
    skills: {
      front: 'フロントエンド & UX/UI',
      frontDesc: 'モダンでアクセシブルなインターフェース',
      back: 'バックエンド & API',
      backDesc: '堅牢なビジネスアプリケーション',
      cms: 'CMS & デプロイ',
      cmsDesc: '迅速な納品 & SEO',
      odoo: 'Odoo & ERP',
      odooDesc: '高度なインテグレーション',
    },
    exp: {
      freelance: {
        title: 'フリーランスWeb開発者 — 独立プロジェクト',
        date: '2025年11月 — 現在',
        items: [
          'ケベック州の中小企業向けウェブサイトとアプリケーション（React、Vue.js、Laravel）',
          'PythonとPostgreSQLによる自動取引ボット開発',
          'StripeとFR/EN多言語対応のフルスタックECプロジェクト',
        ],
      },
      gsd: {
        title: 'バックエンド開発者（Odoo / Python）— G.S.D Group Inc.',
        role: 'バックエンド',
        date: '2024年11月 — 2025年10月',
        items: [
          'Odoo 17モジュール開発：CRM、請求書、顧客ポータル',
          'PostgreSQL最適化（パフォーマンス40%向上）とREST API構築',
          'GitとJiraを使用したアジャイル/スクラム開発',
        ],
      },
      lien: {
        title: 'フロントエンド開発者 — Le Lien Multimédia / Qui Fait Quoi',
        date: '2024年1月 — 2024年8月',
        items: [
          'メディアポータルqfq.com向けVue.js + Laravelウェブインターフェース開発',
          'REST API統合とフロントエンドパフォーマンス最適化',
        ],
      },
    },
    edu: {
      program: 'ウェブサイト設計・プログラミング',
      type: '大学準学位（AEC）',
      hours: '1,425時間',
      description: 'プロジェクト分析から本番環境へのデプロイまで、ウェブサイトの設計・開発に必要なすべてのスキルを習得する集中プログラム。',
      skillsTitle: '習得スキル',
      skills: [
        'インタラクティブなインターフェース設計（フロントエンド）',
        'サーバーサイドプログラミング（バックエンド）',
        'MySQL/PostgreSQLデータベース管理',
        'ユーザー体験（UX）とインターフェースデザイン（UI）',
        'モダンなフレームワークとCMS',
        'アジャイルプロジェクト計画手法',
      ],
      coursesTitle: '主要科目',
      courses: [
        'アルゴリズムとプログラミング',
        '動的Webプログラミング',
        'UX/UIデザイン実践',
        'Webフレームワーク（Laravel）',
        'インターフェースプログラミング（JavaScript）',
        'アジャイルプロジェクト管理',
        'CMS & WordPress',
        '上級プログラミング',
      ],
      stageTitle: '企業インターンシップ — 8週間',
      stageDesc: '実際の本番環境で習得したスキルを適用する、企業での実践的なインターンシップ。',
    },
    contact: {
      cta: 'ご一緒しませんか？',
      ctaDesc: 'プロジェクトや協業の機会についてお気軽にご連絡ください。',
    },
    resume: { note: '「履歴書」をクリックしてPDF版をダウンロードできます。' },
    footer: {
      made: '使用技術：',
      rights: '全著作権所有。'
    },
  },
} as const
