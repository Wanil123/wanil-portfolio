// src/App.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Sun,
  Moon,
  Download,
  Code2,
  Briefcase,
  GraduationCap,
  MapPin,
  Globe
} from 'lucide-react'

export default function App() {
  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')

  useEffect(() => {
    const savedTheme = localStorage.getItem('wanil-theme')
    const savedLang = localStorage.getItem('wanil-lang')
    if (savedTheme) setDark(savedTheme === 'dark')
    if (savedLang === 'fr' || savedLang === 'en') setLang(savedLang as 'fr' | 'en')
  }, [])

  useEffect(() => {
    localStorage.setItem('wanil-theme', dark ? 'dark' : 'light')
    localStorage.setItem('wanil-lang', lang)
    document.documentElement.classList.toggle('dark', dark)
  }, [dark, lang])

  const t = useMemo(() => (lang === 'fr' ? strings.fr : strings.en), [lang])

  // ---- CV download (robuste dev/prod) ----
  // chemin relatif vers le PDF dans public/cv (gère le "base" Vite en prod)
  const cvRelPath = `${import.meta.env.BASE_URL}cv/Wanil_Parfait_CV_UX_UI.pdf`

  const downloadCV = async () => {
    try {
      // on récupère le fichier (pas de cache pour voir les mises à jour)
      const res = await fetch(cvRelPath, { cache: 'no-store' })
      if (!res.ok) throw new Error('HTTP ' + res.status)

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      // href absolu juste pour le clic
      a.href = url
      a.download = 'Wanil_Parfait_CV_UX_UI.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // fallback: ouvrir le PDF via une URL absolue
      const absoluteUrl = new URL(cvRelPath, window.location.origin).toString()
      window.location.href = absoluteUrl
    }
  }
  // ----------------------------------------

  const projects: Project[] = [
    {
      title: t.projects.festival.title,
      role: t.projects.festival.role,
      description: t.projects.festival.desc,
      tech: ['Laravel', 'Tailwind', 'MySQL', 'JavaScript', 'Adobe XD'],
      features: [
        t.features.booking,
        t.features.roles,
        t.features.dashboard,
        t.features.analytics,
        t.features.map,
      ],
      links: [{ href: 'https://projet-web2-e4.cpsw-fcsei.com/', label: t.common.liveDemo }],
    },
    {
      title: t.projects.g6.title,
      role: t.projects.g6.role,
      description: t.projects.g6.desc,
      tech: ['Laravel', 'HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Adobe XD'],
      features: [t.features.responsive, t.features.map, t.features.form, t.features.menu],
      links: [{ href: 'https://1771399.cpsw-fcsei.com/fc1771399_pub_g6/index', label: t.common.liveDemo }],
    },
  ]

  const skills: SkillGroup[] = [
    {
      label: t.skills.front,
      items: ['HTML5', 'CSS3', 'Tailwind', 'Bootstrap', 'JavaScript (ES6+)', 'Vue.js', 'React', 'Figma', 'Adobe XD', 'WordPress'],
    },
    { label: t.skills.back, items: ['PHP', 'Laravel', 'MySQL', 'REST APIs'] },
    { label: t.skills.tools, items: ['Git', 'GitHub', 'Jira', 'VS Code', 'Netlify', t.skills.ci, 'Agile/Scrum'] },
  ]

  const nav = [
    { id: 'projects', label: t.nav.projects },
    { id: 'skills', label: t.nav.skills },
    { id: 'experience', label: t.nav.experience },
    { id: 'education', label: t.nav.education },
    { id: 'contact', label: t.nav.contact },
  ]

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
        {/* Decorative background */}
        <div className="pointer-events-none fixed inset-0 -z-10 blur-3xl opacity-40">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-violet-400/30 dark:bg-violet-600/25" />
          <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-blue-400/20 dark:bg-cyan-600/20" />
        </div>

        {/* Navbar */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/60">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="#home" className="flex items-center gap-2 font-semibold">
              <Code2 className="h-5 w-5" /> <span>Wanil Parfait</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button className="text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
                <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> {lang === 'fr' ? 'EN' : 'FR'}</span>
              </button>
              <button className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="home" className="mx-auto max-w-6xl px-4 pt-16 pb-8 md:pt-24">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="md:col-span-3">
              <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">{t.hero.badge}</p>
              <h1 className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight">Wanil Parfait</h1>
              <p className="mt-4 text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl">{t.hero.lead}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#projects">{t.cta.viewProjects}</a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="mailto:maiwanpar@gmail.com"><Mail className="mr-2 h-4 w-4" /> {t.cta.contact}</a>
                </Button>
                {/* Téléchargement du CV */}
                <Button onClick={downloadCV} variant="outline">
                  <Download className="mr-2 h-4 w-4" /> {t.cta.resume}
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Montréal, QC</div>
                <a className="flex items-center gap-2 hover:text-violet-600 dark:hover:text-violet-400" href="tel:+15793685230"><Phone className="h-4 w-4" /> +1 579-368-5230</a>
                <a className="flex items-center gap-2 hover:text-violet-600 dark:hover:text-violet-400" href="https://www.linkedin.com/in/wanil-parfait-b26889108/" target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-2">
              <Card className="bg-white/70 dark:bg-slate-900/60 backdrop-blur border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                <CardHeader>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.hero.title}</div>
                  <div className="text-xl font-semibold">Front-End · UX/UI</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['Vue.js', 'React', 'Laravel', 'Tailwind', 'Figma', 'WordPress'].map((s) => (
                      <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t.hero.pitch}</p>
                </CardContent>
                {/* Footer supprimé */}
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle icon={<Briefcase className="h-5 w-5" />} title={t.sections.projects} subtitle={t.sections.projectsSub} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {projects.map((p, idx) => (<ProjectCard key={idx} project={p} />))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle icon={<Code2 className="h-5 w-5" />} title={t.sections.skills} subtitle={t.sections.skillsSub} />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {skills.map((group) => (
              <Card key={group.label} className="bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60">
                <CardHeader className="pb-2">
                  <div className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">{group.label}</div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {group.items.map((it) => (<Badge key={it} variant="secondary" className="rounded-full">{it}</Badge>))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle icon={<Briefcase className="h-5 w-5" />} title={t.sections.experience} subtitle={t.sections.experienceSub} />
          <Card className="mt-8 bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="font-semibold">Lien MULTIMÉDIA – Qui fait Quoi (Montréal)</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Oct 2024 – Déc 2024 · {t.common.intern}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>{t.exp.item1}</li>
                <li>{t.exp.item2}</li>
                <li>{t.exp.item3}</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Education */}
        <section id="education" className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle icon={<GraduationCap className="h-5 w-5" />} title={t.sections.education} subtitle={t.sections.educationSub} />
          <Card className="mt-8 bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60">
            <CardHeader>
              <div className="font-semibold">Cégep de Saint-Jérôme</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{t.edu.program} · 2023–2024</div>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-300">
              {t.edu.details}
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-14">
          <SectionTitle icon={<Mail className="h-5 w-5" />} title={t.sections.contact} subtitle={t.sections.contactSub} />
          <Card className="mt-8 bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60">
            <CardContent className="grid gap-4 md:grid-cols-3 items-center">
              <div className="space-y-2">
                <div className="font-semibold">Wanil Parfait</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Montréal, QC</div>
                <div className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" /> <a className="hover:underline" href="mailto:maiwanpar@gmail.com">maiwanpar@gmail.com</a>
                </div>
                <div className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4" /> <a className="hover:underline" href="tel:+15793685230">+1 579-368-5230</a>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-center">
                <Button asChild variant="outline"><a href="https://github.com/" target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" /> GitHub</a></Button>
                <Button asChild variant="outline"><a href="https://www.linkedin.com/in/wanil-parfait-b26889108/" target="_blank" rel="noreferrer"><Linkedin className="mr-2 h-4 w-4" /> LinkedIn</a></Button>
                <Button asChild><a href="#projects">{t.common.workTogether}</a></Button>
                {/* Bouton CV aussi ici */}
                <Button onClick={downloadCV} variant="outline">
                  <Download className="mr-2 h-4 w-4" /> {t.cta.resume}
                </Button>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 md:text-right">
                <div id="resume" className="font-medium mb-1">{t.sections.resume}</div>
                <p>{t.resume.note}</p>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-slate-500 dark:text-slate-500 justify-between">
              <span>© {new Date().getFullYear()} Wanil Parfait</span>
              <span>{t.footer.made}</span>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  )
}

function SectionTitle({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p> : null}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card className="group h-full bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{project.role}</div>
              <h3 className="text-lg font-semibold leading-snug mt-1">{project.title}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500/60 to-cyan-500/60 group-hover:from-violet-500 group-hover:to-cyan-500 transition-all" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tech.map((t) => (<Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>))}
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {project.features.map((f, i) => (<li key={i}>{f}</li>))}
          </ul>
        </CardContent>
        <CardFooter className="flex items-center gap-3">
          {project.links.map((l) => (
            <Button asChild key={l.href} variant="outline">
              <a href={l.href} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> {l.label}</a>
            </Button>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Types
interface ProjectLink { href: string; label: string }
interface Project {
  title: string
  role: string
  description: string
  tech: string[]
  features: string[]
  links: ProjectLink[]
}
interface SkillGroup { label: string; items: string[] }

// Copy (FR/EN)
const strings = {
  fr: {
    common: { liveDemo: 'Voir le site', intern: 'Stage', workTogether: 'Travaillons ensemble' },
    nav: { projects: 'Projets', skills: 'Compétences', experience: 'Expérience', education: 'Études', contact: 'Contact' },
    hero: {
      badge: 'Développeur Web',
      title: 'Profil',
      lead: "Développeur front-end & UX/UI basé à Montréal. J'adore créer des interfaces propres, rapides et accessibles, avec Vue/React côté front et Laravel côté back.",
      pitch: 'Approche composant, responsive first, souci de la performance et de l’accessibilité (WCAG).',
    },
    cta: { viewProjects: 'Voir mes projets', contact: 'Me contacter', resume: 'CV / Résumé' },
    sections: {
      projects: 'Projets sélectionnés',
      projectsSub: 'Une sélection courte, orientée résultat.',
      skills: 'Compétences',
      skillsSub: 'Techniques principales et outils de travail.',
      experience: 'Expérience',
      experienceSub: 'Dernière expérience en environnement Agile.',
      education: 'Études',
      educationSub: 'Formation collégiale en développement web.',
      contact: 'Contact',
      contactSub: 'Discutons de votre projet ou de votre besoin d’intégration front-end.',
      resume: 'CV / Résumé',
    },
    features: {
      booking: 'Système de réservations (forfaits, annulation avant évènement)',
      roles: 'Gestion des rôles (admin / clients)',
      dashboard: 'Dashboard d’administration',
      analytics: 'Intégration Google Analytics',
      map: 'Carte interactive',
      responsive: 'Design responsive',
      form: 'Formulaire de contact',
      menu: 'Menu intégré',
    },
    projects: {
      festival: { title: '5:7 Festival de Films — Plateforme Full-Stack', role: 'Full-Stack', desc: 'Plateforme de réservations avec rôles et analytics; interface responsive soignée.' },
      g6: { title: 'Resto Pub G6 — Site vitrine responsive', role: 'Front-End / Intégration', desc: 'Site vitrine moderne avec carte interactive, formulaire et menu intégré.' },
    },
    skills: { front: 'Front-end', back: 'Back-end', tools: 'Outils & Méthodo', ci: 'CI (basique)' },
    exp: {
      item1: 'Intégration de maquettes responsives (Laravel + Bootstrap) avec composants réutilisables.',
      item2: 'Travail en Agile (Jira) : sprints, revues, suivi des tâches et collaboration d’équipe.',
      item3: 'Amélioration de l’UX mobile (lisibilité, performance, interactions tactiles).',
    },
    edu: { program: 'AEC — Conception & Programmation de Sites Web', details: 'Cours complets en HTML/CSS/JS, PHP/Laravel, UX/UI, intégration et méthodo Agile.' },
    resume: { note: 'Clique sur “CV / Résumé” pour télécharger la version PDF.' },
    footer: { made: 'Conçu avec React, Tailwind et composants custom inspirés de shadcn/ui.' },
  },
  en: {
    common: { liveDemo: 'Live demo', intern: 'Internship', workTogether: 'Work together' },
    nav: { projects: 'Projects', skills: 'Skills', experience: 'Experience', education: 'Education', contact: 'Contact' },
    hero: {
      badge: 'Web Developer',
      title: 'Profile',
      lead: 'Front-end & UX/UI developer based in Montreal. I build clean, fast and accessible interfaces using Vue/React on the front and Laravel on the back.',
      pitch: 'Component-driven, responsive-first, with attention to performance and accessibility (WCAG).',
    },
    cta: { viewProjects: 'View projects', contact: 'Contact me', resume: 'Resume / CV' },
    sections: {
      projects: 'Selected Projects',
      projectsSub: 'A short, impact-focused selection.',
      skills: 'Skills',
      skillsSub: 'Core tech and daily tooling.',
      experience: 'Experience',
      experienceSub: 'Recent Agile environment.',
      education: 'Education',
      educationSub: 'College-level program in web development.',
      contact: 'Contact',
      contactSub: 'Let’s discuss your project or front-end integration needs.',
      resume: 'Resume / CV',
    },
    features: {
      booking: 'Booking system (packages, pre-event cancellations)',
      roles: 'Role-based access (admins / clients)',
      dashboard: 'Admin dashboard',
      analytics: 'Google Analytics integration',
      map: 'Interactive map',
      responsive: 'Responsive design',
      form: 'Contact form',
      menu: 'Integrated menu',
    },
    projects: {
      festival: { title: '5:7 Film Festival — Full-stack Platform', role: 'Full-Stack', desc: 'Reservation platform with roles and analytics; polished responsive UI.' },
      g6: { title: 'Resto Pub G6 — Responsive showcase website', role: 'Front-End / Integration', desc: 'Modern showcase site with interactive map, contact form, and integrated menu.' },
    },
    skills: { front: 'Front-end', back: 'Back-end', tools: 'Tooling & Methods', ci: 'basic CI' },
    exp: {
      item1: 'Integrated responsive mockups (Laravel + Bootstrap) with reusable components.',
      item2: 'Worked in Agile (Jira): sprints, reviews, task tracking and team collaboration.',
      item3: 'Improved mobile UX (readability, performance, touch interactions).',
    },
    edu: { program: 'AEC — Web Design & Programming', details: 'Coursework across HTML/CSS/JS, PHP/Laravel, UX/UI, integration and Agile methods.' },
    resume: { note: 'Click “Resume / CV” to download the PDF version.' },
    footer: { made: 'Built with React, Tailwind and custom components inspired by shadcn/ui.' },
  },
} as const
