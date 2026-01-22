// src/App.tsx - Portfolio Haut de Gamme
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
        return prev + 20 // Faster loading
      })
    }, 50) // Faster interval

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
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center animate-pulse-glow">
          <Code2 className="w-12 h-12 text-white" />
        </div>
        <motion.div
          className="absolute -inset-4 rounded-3xl border-2 border-violet-500/50"
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
        <p className="text-slate-400 text-sm">Chargement du portfolio...</p>
      </motion.div>

      <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
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
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 origin-left z-50"
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
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg hover:shadow-violet-500/25 transition-shadow"
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
// ANIMATED BACKGROUND (Optimized - CSS only)
// ============================================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Static gradient blobs - no JS animation */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
    </div>
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
        className="inline-block w-[3px] h-[1em] ml-1 bg-violet-500 align-middle"
      />
    </span>
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-50 md:hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold gradient-text">Menu</span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <span className="font-medium">{n.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{t.hero.pitch}</p>
                <Button asChild className="w-full">
                  <a href="mailto:maiwanpar@gmail.com">
                    <Mail className="mr-2 h-4 w-4" /> {t.cta.contact}
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================
// PROJECT CARD WITH 3D HOVER
// ============================================
function ProjectCard3D({ project, index }: { project: Project, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [imageLoaded, setImageLoaded] = useState(false)

  const projectIcons: Record<string, React.ElementType> = {
    'LamiPict': ShoppingCart,
    'Luxe Mode': ShoppingBag,
    'Musike': Music,
    '5:7': Film,
    'Weather': CloudSun,
  }

  const IconComponent = Object.entries(projectIcons).find(([key]) => project.title.includes(key))?.[1] || Briefcase

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full group"
    >
      <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-2">
        {/* Project Image/Preview */}
        <div className="relative h-48 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 overflow-hidden">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          {/* Icon badge */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <IconComponent className="w-6 h-6 text-white" />
          </div>

          {/* Hover overlay with button */}
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              {project.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-violet-100 transition-colors transform hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-violet-500 font-semibold">{project.role}</div>
              <h3 className="text-lg font-bold leading-snug mt-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {project.title}
              </h3>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full text-xs">
                {t}
              </Badge>
            ))}
          </div>

          <ul className="space-y-1.5">
            {project.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Sparkles className="w-3 h-3 text-violet-500 mt-1 flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-3 w-full">
            {project.links.map((l) => (
              <Button asChild key={l.href} variant="outline" className="flex-1">
                <a href={l.href} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> {l.label}
                </a>
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// ============================================
// SECTION REVEAL ANIMATION
// ============================================
function RevealSection({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SECTION TITLE WITH ANIMATION
// ============================================
function SectionTitle({ title, subtitle, icon }: { title: string, subtitle?: string, icon?: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex items-start gap-4 mb-12"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/25"
      >
        {icon}
      </motion.div>
      <div>
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState<'fr' | 'en' | 'ja'>('fr')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Close language menu when clicking outside
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
    const savedTheme = localStorage.getItem('wanil-theme')
    const savedLang = localStorage.getItem('wanil-lang')

    if (savedTheme) setDark(savedTheme === 'dark')

    // Si une langue est sauvegardée, l'utiliser
    if (savedLang === 'fr' || savedLang === 'en' || savedLang === 'ja') {
      setLang(savedLang as 'fr' | 'en' | 'ja')
    } else {
      // Sinon, détecter la langue du navigateur
      const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
      const langCode = browserLang.toLowerCase().split('-')[0]

      if (langCode === 'fr') {
        setLang('fr')
      } else if (langCode === 'ja') {
        setLang('ja')
      } else {
        setLang('en')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wanil-theme', dark ? 'dark' : 'light')
    localStorage.setItem('wanil-lang', lang)
    document.documentElement.classList.toggle('dark', dark)
  }, [dark, lang])

  const t = useMemo(() => {
    if (lang === 'fr') return strings.fr
    if (lang === 'ja') return strings.ja
    return strings.en
  }, [lang])

  // CV download
  const cvRelPath = `${import.meta.env.BASE_URL}cv/Wanil_Parfait_CV_UX_UI.pdf`

  const downloadCV = useCallback(async () => {
    try {
      const res = await fetch(cvRelPath, { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Wanil_Parfait_CV_UX_UI.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      const absoluteUrl = new URL(cvRelPath, window.location.origin).toString()
      window.location.href = absoluteUrl
    }
  }, [cvRelPath])

  const projects: Project[] = [
    {
      title: t.projects.lamipict.title,
      role: t.projects.lamipict.role,
      description: t.projects.lamipict.desc,
      tech: ['Laravel', 'React', 'Vue.js', 'MySQL', 'Stripe', 'Tailwind CSS'],
      features: [t.features.stripe, t.features.adminDashboard, t.features.orderManagement, t.features.imageCustomization],
      links: [{ href: 'https://www.lamipict.com', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
    },
    {
      title: t.projects.luxe.title,
      role: t.projects.luxe.role,
      description: t.projects.luxe.desc,
      tech: ['React', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
      features: [t.features.ecommerce, t.features.animations, t.features.responsive, t.features.darkMode],
      links: [{ href: 'https://luxe-mode.netlify.app/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    },
    {
      title: t.projects.musike.title,
      role: t.projects.musike.role,
      description: t.projects.musike.desc,
      tech: ['React', 'CSS3', 'API Integration', 'JavaScript'],
      features: [t.features.musicPlayer, t.features.playlist, t.features.responsive, t.features.animations],
      links: [{ href: 'https://musike-app.netlify.app/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
    },
    {
      title: t.projects.festival.title,
      role: t.projects.festival.role,
      description: t.projects.festival.desc,
      tech: ['Laravel', 'Tailwind', 'MySQL', 'JavaScript', 'Adobe XD'],
      features: [t.features.booking, t.features.roles, t.features.dashboard, t.features.analytics],
      links: [{ href: 'https://projet-web2-e4.cpsw-fcsei.com/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    },
    {
      title: t.projects.weather.title,
      role: t.projects.weather.role,
      description: t.projects.weather.desc,
      tech: ['React', 'API REST', 'CSS3', 'JavaScript'],
      features: [t.features.weatherApi, t.features.geolocation, t.features.responsive, t.features.realtime],
      links: [{ href: 'https://your-weather-ap.netlify.app/', label: t.common.liveDemo }],
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80',
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
    ? ['Développeur Full-Stack', 'Passionné React', 'Expert Laravel', 'Fan de Vue.js', 'Designer UX/UI']
    : lang === 'ja'
    ? ['フルスタック開発者', 'React エンジニア', 'Laravel エキスパート', 'Vue.js 開発者', 'UX/UI デザイナー']
    : ['Full-Stack Developer', 'React Enthusiast', 'Laravel Expert', 'Vue.js Fan', 'UX/UI Designer']

  return (
    <>
      {/* Preloader */}
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className={dark ? 'dark' : ''}>
          <ScrollProgress />
          <BackToTop />
          <AnimatedBackground />

          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
            {/* Navbar */}
            <motion.header
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/60"
            >
              <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                <motion.a
                  href="#home"
                  className="flex items-center gap-3 font-bold text-lg group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden sm:inline gradient-text">Wanil Parfait</span>
                </motion.a>

                <nav className="hidden md:flex items-center gap-1">
                  {nav.map((n) => (
                    <motion.a
                      key={n.id}
                      href={`#${n.id}`}
                      className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {n.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="flex items-center gap-2">
                  {/* Language Dropdown */}
                  <div className="relative" ref={langMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
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
                          className="absolute top-full right-0 mt-2 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl min-w-[140px] z-50"
                        >
                          {[
                            { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
                            { code: 'en' as const, label: 'English', flag: '🇬🇧' },
                            { code: 'ja' as const, label: '日本語', flag: '🇯🇵' },
                          ].map((language) => (
                            <button
                              key={language.code}
                              onClick={() => {
                                setLang(language.code)
                                setLangMenuOpen(false)
                              }}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                                lang === language.code ? 'text-violet-600 dark:text-violet-400 font-medium bg-violet-50 dark:bg-violet-500/10' : ''
                              }`}
                            >
                              <span className="text-base">{language.flag}</span>
                              <span>{language.label}</span>
                              {lang === language.code && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto w-2 h-2 rounded-full bg-violet-500"
                                />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 15 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setDark((d) => !d)}
                    aria-label="Toggle theme"
                  >
                    <AnimatePresence mode="wait">
                      {dark ? (
                        <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                          <Sun className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                          <Moon className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Mobile menu button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.header>

            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} nav={nav} t={t} />

            {/* Hero Section */}
            <section id="home" className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-32 md:pb-24">
              <div className="grid lg:grid-cols-5 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="lg:col-span-3"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-6"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t.hero.badge}
                  </motion.div>

                  <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
                    <span className="block">Wanil</span>
                    <span className="gradient-text">Parfait</span>
                  </h1>

                  <div className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-6 h-8">
                    <TypeWriter words={typingWords} />
                  </div>

                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mb-8 leading-relaxed">
                    {t.hero.lead}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild className="text-base px-6 py-3 h-auto shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow">
                        <a href="#projects">
                          <Briefcase className="mr-2 h-5 w-5" /> {t.cta.viewProjects}
                        </a>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild variant="secondary" className="text-base px-6 py-3 h-auto">
                        <a href="mailto:maiwanpar@gmail.com">
                          <Mail className="mr-2 h-5 w-5" /> {t.cta.contact}
                        </a>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={downloadCV} variant="outline" className="text-base px-6 py-3 h-auto">
                        <Download className="mr-2 h-5 w-5" /> {t.cta.resume}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ color: '#8b5cf6' }}
                    >
                      <MapPin className="h-4 w-4" /> Montréal, QC
                    </motion.div>
                    <motion.a
                      className="flex items-center gap-2 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      href="https://github.com/wanil123"
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </motion.a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <div className="relative">
                    {/* Floating decorations */}
                    <motion.div
                      animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30"
                    />
                    <motion.div
                      animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                      transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                      className="absolute -bottom-6 -left-6 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30"
                    />

                    <Card className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-violet-500/10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5" />

                      <CardHeader className="relative">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            WP
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.hero.title}</div>
                            <div className="text-xl font-bold">Full-Stack · UX/UI</div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="relative space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {['Vue.js', 'React', 'Laravel', 'Tailwind', 'Figma', 'TypeScript'].map((s, i) => (
                            <motion.div
                              key={s}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                            >
                              <Badge variant="secondary" className="rounded-full">
                                {s}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {t.hero.pitch}
                        </p>

                        <div className="pt-4 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-slate-500">{t.common.available}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="mx-auto max-w-6xl px-4 py-20">
              <RevealSection>
                <SectionTitle
                  icon={<Briefcase className="h-6 w-6" />}
                  title={t.sections.projects}
                  subtitle={t.sections.projectsSub}
                />
              </RevealSection>

              <div className="grid gap-8 sm:grid-cols-2">
                {projects.map((p, idx) => (
                  <ProjectCard3D key={idx} project={p} index={idx} />
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="mx-auto max-w-6xl px-4 py-20">
              <RevealSection>
                <SectionTitle
                  icon={<Code2 className="h-6 w-6" />}
                  title={t.sections.skills}
                  subtitle={t.sections.skillsSub}
                />
              </RevealSection>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Front-end & UX/UI */}
                <RevealSection>
                  <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-violet-500/10">
                          <Layout className="w-5 h-5 text-violet-500" />
                        </div>
                        <h3 className="text-lg font-bold">{t.skills.front}</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Vue.js 3', 'Tailwind CSS', 'Bootstrap', 'TypeScript', 'Framer Motion'].map((s) => (
                          <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </RevealSection>

                {/* Back-end & API */}
                <RevealSection>
                  <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-500/10">
                          <Server className="w-5 h-5 text-cyan-500" />
                        </div>
                        <h3 className="text-lg font-bold">{t.skills.back}</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {['PHP', 'Laravel', 'Python', 'REST APIs', 'MySQL', 'PostgreSQL', 'Auth & Rôles'].map((s) => (
                          <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </RevealSection>

                {/* CMS & Déploiement */}
                <RevealSection>
                  <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-500/10">
                          <Rocket className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold">{t.skills.cms}</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {['WordPress', 'Headless CMS', 'i18n (FR/EN)', 'SEO', 'Git / GitHub', 'Netlify', 'Vercel'].map((s) => (
                          <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </RevealSection>

                {/* Odoo & ERP */}
                <RevealSection>
                  <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10">
                          <Settings className="w-5 h-5 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold">{t.skills.odoo}</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {['Odoo 17', 'Modules custom', 'Portails clients', 'QWeb / OWL', 'PDF Reports', 'API Odoo'].map((s) => (
                          <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </RevealSection>
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="mx-auto max-w-6xl px-4 py-20">
              <RevealSection>
                <SectionTitle
                  icon={<Briefcase className="h-6 w-6" />}
                  title={t.sections.experience}
                  subtitle={t.sections.experienceSub}
                />
              </RevealSection>

              <div className="space-y-6">
                {/* Freelance - Current */}
                <RevealSection>
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">{t.exp.freelance.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400">Montréal, QC</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                            {t.common.current}
                          </span>
                          <span className="text-slate-500">{t.exp.freelance.date}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {t.exp.freelance.items.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                          >
                            <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </RevealSection>

                {/* G.S.D Group - Odoo */}
                <RevealSection>
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">{t.exp.gsd.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400">Laval, QC</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium">
                            {t.exp.gsd.role}
                          </span>
                          <span className="text-slate-500">{t.exp.gsd.date}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {t.exp.gsd.items.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                          >
                            <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </RevealSection>

                {/* Le Lien Multimédia - Internship */}
                <RevealSection>
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-violet-600 to-cyan-500" />
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold">{t.exp.lien.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400">Montréal, QC</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium">
                            {t.common.intern}
                          </span>
                          <span className="text-slate-500">{t.exp.lien.date}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {t.exp.lien.items.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                          >
                            <ChevronRight className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </RevealSection>
              </div>
            </section>

            {/* Education Section */}
            <section id="education" className="mx-auto max-w-6xl px-4 py-20">
              <RevealSection>
                <SectionTitle
                  icon={<GraduationCap className="h-6 w-6" />}
                  title={t.sections.education}
                  subtitle={t.sections.educationSub}
                />
              </RevealSection>

              <RevealSection>
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-cyan-500 to-violet-600" />
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 items-center justify-center text-white shadow-lg">
                          <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Cégep de Saint-Jérôme</h3>
                          <p className="text-violet-600 dark:text-violet-400 font-semibold">{t.edu.program}</p>
                          <p className="text-sm text-slate-500 mt-1">{t.edu.type}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium text-sm">
                          {t.edu.hours}
                        </span>
                        <span className="text-sm text-slate-500">2023 – 2024</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t.edu.description}
                    </p>

                    {/* Skills Acquired */}
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t.edu.skillsTitle}</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {t.edu.skills.map((skill, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                          >
                            <ChevronRight className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                            <span>{skill}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Key Courses */}
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t.edu.coursesTitle}</h4>
                      <div className="flex flex-wrap gap-2">
                        {t.edu.courses.map((course, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            viewport={{ once: true }}
                          >
                            <Badge variant="secondary" className="rounded-full text-xs">{course}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Stage */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-violet-500" />
                        <span className="font-semibold">{t.edu.stageTitle}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t.edu.stageDesc}</p>
                    </div>
                  </CardContent>
                </Card>
              </RevealSection>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mx-auto max-w-6xl px-4 py-20">
              <RevealSection>
                <SectionTitle
                  icon={<Mail className="h-6 w-6" />}
                  title={t.sections.contact}
                  subtitle={t.sections.contactSub}
                />
              </RevealSection>

              <RevealSection>
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {/* Contact Info */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">Wanil Parfait</h3>
                        <div className="space-y-4">
                          <motion.a
                            href="mailto:maiwanpar@gmail.com"
                            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
                            whileHover={{ x: 5 }}
                          >
                            <div className="p-2 rounded-xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                              <Mail className="w-5 h-5 text-violet-500" />
                            </div>
                            maiwanpar@gmail.com
                          </motion.a>

                          <motion.a
                            href="tel:+15793685230"
                            className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
                            whileHover={{ x: 5 }}
                          >
                            <div className="p-2 rounded-xl bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                              <Phone className="w-5 h-5 text-violet-500" />
                            </div>
                            +1 579-368-5230
                          </motion.a>

                          <motion.div
                            className="flex items-center gap-3 text-slate-600 dark:text-slate-400"
                            whileHover={{ x: 5 }}
                          >
                            <div className="p-2 rounded-xl bg-violet-500/10">
                              <MapPin className="w-5 h-5 text-violet-500" />
                            </div>
                            Montréal, QC
                          </motion.div>
                        </div>
                      </div>

                      {/* GitHub & CV */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Liens</h3>
                        <div className="flex flex-wrap gap-3">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button asChild variant="outline" className="gap-2">
                              <a href="https://github.com/wanil123" target="_blank" rel="noreferrer">
                                <Github className="w-5 h-5" /> GitHub
                              </a>
                            </Button>
                          </motion.div>

                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button onClick={downloadCV} variant="outline" className="gap-2">
                              <Download className="w-5 h-5" /> {t.cta.resume}
                            </Button>
                          </motion.div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="md:col-span-2 lg:col-span-1">
                        <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 flex flex-col justify-center">
                          <h3 className="text-lg font-bold mb-3">{t.contact.cta}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            {t.contact.ctaDesc}
                          </p>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button asChild className="w-full shadow-lg shadow-violet-500/25">
                              <a href="mailto:maiwanpar@gmail.com">
                                <Sparkles className="mr-2 h-5 w-5" /> {t.common.workTogether}
                              </a>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-slate-200/60 dark:border-slate-700/60 px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <span>© {new Date().getFullYear()} Wanil Parfait. {t.footer.rights}</span>
                    <span className="flex items-center gap-2">
                      {t.footer.made}
                      <span className="gradient-text font-semibold">React + Tailwind</span>
                    </span>
                  </CardFooter>
                </Card>
              </RevealSection>
            </section>
          </div>
        </div>
      )}
    </>
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
      intern: 'Stage',
      current: 'En cours',
      workTogether: 'Travaillons ensemble',
      available: 'Disponible pour opportunités'
    },
    nav: { projects: 'Projets', skills: 'Compétences', experience: 'Expérience', education: 'Études', contact: 'Contact' },
    hero: {
      badge: 'Ouvert aux opportunités',
      title: 'Profil',
      lead: "Développeur Full-Stack passionné basé à Montréal. Je conçois des applications web complètes avec React, Vue.js côté front et Laravel, PHP côté back. Du design à la base de données !",
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
      intern: 'Internship',
      current: 'Current',
      workTogether: 'Work together',
      available: 'Available for opportunities'
    },
    nav: { projects: 'Projects', skills: 'Skills', experience: 'Experience', education: 'Education', contact: 'Contact' },
    hero: {
      badge: 'Open to opportunities',
      title: 'Profile',
      lead: 'Passionate Full-Stack developer based in Montreal. I build complete web applications with React, Vue.js on the front and Laravel, PHP on the back. From design to database!',
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
      intern: 'インターンシップ',
      current: '現在',
      workTogether: '一緒に働きましょう',
      available: '新しい機会を探しています'
    },
    nav: { projects: 'プロジェクト', skills: 'スキル', experience: '経歴', education: '学歴', contact: 'お問い合わせ' },
    hero: {
      badge: '新しい機会を募集中',
      title: 'プロフィール',
      lead: 'モントリオール在住のフルスタック開発者。React、Vue.jsでフロントエンド、Laravel、PHPでバックエンドを構築。デザインからデータベースまで一貫して対応します。',
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
