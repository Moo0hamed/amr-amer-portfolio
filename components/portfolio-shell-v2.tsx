"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, TransitionEvent as ReactTransitionEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BehanceIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MenuIcon,
  MoonIcon,
  SendIcon,
  SparkIcon,
  SunIcon,
  WhatsappIcon
} from "./icons";
import {
  copy,
  designer,
  driveFolderUrl,
  projectFilters,
  projects,
  services,
  socialLinks,
  studioPrinciples,
  type Locale,
  type SocialLink
} from "../data/site";
import type { SiteContent } from "../lib/site-content";

type Theme = "light" | "dark";
type FormStatus = "idle" | "sending" | "success" | "needs-setup" | "error";

function SocialIcon({ kind }: { kind: SocialLink["kind"] }) {
  const props = { width: 18, height: 18 };
  if (kind === "behance") return <BehanceIcon {...props} />;
  if (kind === "linkedin") return <LinkedinIcon {...props} />;
  if (kind === "instagram") return <InstagramIcon {...props} />;
  if (kind === "facebook") return <FacebookIcon {...props} />;
  if (kind === "whatsapp") return <WhatsappIcon {...props} />;
  return <MailIcon {...props} />;
}

function Lines({ children }: { children: string }) {
  const lines = children.split("\n");
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 ? <br /> : null}</span>)}</>;
}

function AmrIdentityCard({ locale, hero = false, designer }: { locale: Locale; hero?: boolean; designer: SiteContent["designer"] }) {
  const direction = locale === "ar" ? "rtl" : "ltr";
  return <div className={`neo-id-card${hero ? " neo-hero-id-card" : ""}`} dir={direction}>
    <div className="id-card-top"><span>AMR AMER <i /></span><span>INTERIOR DESIGN / 01</span></div>
    <div className="id-card-stage">
      <div className="id-card-sun" />
      <div className="id-card-glow" />
      <div className="id-card-side-note id-card-note-left"><small>DESIGN / CAIRO</small><strong>Spaces<br />with soul.</strong><span>LIGHT · FORM · LIFE</span></div>
      <img className="id-card-portrait" src="/images/amr-amer-poster.png" alt={locale === "ar" ? "عمرو عامر، مصمم داخلي" : "Amr Amer, interior designer"} />
      <div className="id-card-side-note id-card-note-right"><small>THE ART OF</small><strong>FEELING<br />AT HOME</strong><span>{designer.locationEn.toUpperCase()}</span></div>
      <span className="id-card-stage-index">AA / 2026</span>
    </div>
    <div className="id-card-footer">
      <div><strong>{designer.nameEn}</strong><span>{locale === "ar" ? designer.role : designer.roleEn}</span></div>
      <p>{locale === "ar" ? designer.education : designer.educationEn}</p>
      <span className="id-card-edition">EST. 2026 <i>✳</i></span>
    </div>
  </div>;
}

export default function PortfolioShellV2() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [workSlide, setWorkSlide] = useState(1);
  const [carouselTransitionEnabled, setCarouselTransitionEnabled] = useState(true);
  const carouselStartX = useRef<number | null>(null);
  const carouselInteractionAt = useRef(0);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [siteContent, setSiteContent] = useState<SiteContent>({ copy, designer, driveFolderUrl, projectFilters, projects, services, socialLinks, studioPrinciples });
  const { copy: liveCopy, designer: liveDesigner, driveFolderUrl: liveDriveFolderUrl, projectFilters: liveProjectFilters, projects: liveProjects, services: liveServices, socialLinks: liveSocialLinks } = siteContent;
  const t = liveCopy[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("amr-theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/site-content", { cache: "no-store" })
      .then(async (response) => response.ok ? await response.json() as SiteContent : null)
      .then((content) => { if (active && content) setSiteContent(content); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("amr-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  const emptyText = useMemo(() => {
    if (activeFilter === "all") return t.emptyDescription;
    const label = liveProjectFilters.find((filter) => filter.id === activeFilter);
    return locale === "ar"
      ? `لا توجد أعمال منشورة ضمن تصنيف «${label?.label ?? "هذا"}» بعد.`
      : `No published work under “${label?.labelEn ?? "this"}” yet.`;
  }, [activeFilter, locale, t.emptyDescription]);

  const visibleProjects = useMemo(
    () => activeFilter === "all" ? liveProjects : liveProjects.filter((project) => project.category === activeFilter),
    [activeFilter, liveProjects]
  );
  const projectGroups = useMemo(() => {
    const groups: (typeof visibleProjects)[] = [];
    for (let index = 0; index < visibleProjects.length; index += 4) groups.push(visibleProjects.slice(index, index + 4));
    return groups;
  }, [visibleProjects]);

  useEffect(() => {
    setWorkSlide(projectGroups.length > 1 ? 1 : 0);
  }, [activeFilter]);

  useEffect(() => {
    setWorkSlide(projectGroups.length > 1 ? 1 : 0);
  }, [projectGroups.length]);

  const activeWorkSlide = projectGroups.length > 1
    ? (workSlide - 1 + projectGroups.length) % projectGroups.length
    : 0;
  const loopedProjectGroups = projectGroups.length > 1
    ? [projectGroups[projectGroups.length - 1], ...projectGroups, projectGroups[0]]
    : projectGroups;

  useEffect(() => {
    if (projectGroups.length < 2) return;

    const carousel = document.querySelector<HTMLElement>(".neo-project-carousel");
    if (!carousel) return;

    const markInteraction = () => {
      carouselInteractionAt.current = Date.now();
    };
    const autoAdvance = window.setInterval(() => {
      if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (carousel.matches(":hover") || carousel.contains(document.activeElement)) return;
      if (carouselStartX.current !== null || Date.now() - carouselInteractionAt.current < 4500) return;

      const bounds = carousel.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

      setWorkSlide((slide) => slide + 1);
    }, 2400);

    carousel.addEventListener("pointerdown", markInteraction);
    carousel.addEventListener("wheel", markInteraction, { passive: true });
    carousel.addEventListener("touchstart", markInteraction, { passive: true });

    return () => {
      window.clearInterval(autoAdvance);
      carousel.removeEventListener("pointerdown", markInteraction);
      carousel.removeEventListener("wheel", markInteraction);
      carousel.removeEventListener("touchstart", markInteraction);
    };
  }, [projectGroups.length]);

  function moveWorkSlide(step: number) {
    if (projectGroups.length < 2) return;
    setWorkSlide((slide) => Math.max(0, Math.min(projectGroups.length + 1, slide + step)));
  }

  function handleCarouselTransitionEnd(event: ReactTransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (workSlide === 0 || workSlide === projectGroups.length + 1) {
      setCarouselTransitionEnabled(false);
      setWorkSlide(workSlide === 0 ? projectGroups.length : 1);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setCarouselTransitionEnabled(true)));
    }
  }

  function handleCarouselPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (projectGroups.length < 2) return;
    carouselStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleCarouselPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const startX = carouselStartX.current;
    carouselStartX.current = null;
    if (startX === null) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 45) moveWorkSlide(distance > 0 ? -1 : 1);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fieldError(field: keyof typeof form) {
    if (!touched[field]) return "";
    if (!form[field].trim()) return t.required;
    if (field === "email" && !/^\S+@\S+\.\S+$/.test(form.email)) return locale === "ar" ? "أدخل بريدًا صحيحًا" : "Enter a valid email";
    return "";
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const invalidName = !form.name.trim();
    const invalidEmail = !/^\S+@\S+\.\S+$/.test(form.email);
    const invalidMessage = !form.message.trim();
    if (invalidName || invalidEmail || invalidMessage) return;

    setFormStatus("sending");
    setFormError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = (await response.json()) as { ok?: boolean; code?: string; error?: string };
      if (response.ok && result.ok) {
        setFormStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTouched({});
      } else if (result.code === "EMAIL_NOT_CONFIGURED") {
        setFormStatus("needs-setup");
      } else {
        setFormStatus("error");
        setFormError(result.error || t.formError);
      }
    } catch {
      setFormStatus("error");
      setFormError(t.formError);
    }
  }

  return (
    <main className={`neo-site ${theme === "dark" ? "neo-dark" : ""} ${menuOpen ? "neo-menu-open" : ""}`}>
      <div className="neo-grain" aria-hidden="true" />
      <header className="neo-header">
        <button className="neo-logo" type="button" onClick={() => scrollTo("top")} aria-label="Amr Amer — home">
          <span className="neo-logo-word">AMR<span>.</span></span>
          <span className="neo-logo-meta">INTERIORS / 001</span>
        </button>
        <nav className="neo-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          <button type="button" onClick={() => scrollTo("work")}><span>01</span>{t.navWork}</button>
          <button type="button" onClick={() => scrollTo("about")}><span>02</span>{t.navAbout}</button>
          <button type="button" onClick={() => scrollTo("contact")}><span>03</span>{t.navContact}</button>
        </nav>
        <div className="neo-actions">
          <button className="neo-theme" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? t.themeDark : t.themeLight} title={theme === "light" ? t.themeDark : t.themeLight}>{theme === "light" ? <MoonIcon width={16} height={16} /> : <SunIcon width={16} height={16} />}<span>{theme === "light" ? (locale === "ar" ? "ليلي" : "DARK") : (locale === "ar" ? "نهاري" : "LIGHT")}</span></button>
          <button className="neo-language" type="button" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label="Switch language"><b className={locale === "ar" ? "is-active" : ""}>ع</b><i>/</i><b className={locale === "en" ? "is-active" : ""}>EN</b></button>
          <button className="neo-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen}>{menuOpen ? <CloseIcon width={21} height={21} /> : <MenuIcon width={21} height={21} />}</button>
        </div>
      </header>

      <section className="neo-hero neo-pad" id="top">
        <div className="neo-hero-topline"><span className="neo-chip neo-chip-blue">{locale === "ar" ? "استوديو عمرو عامر" : "AMR AMER STUDIO"}</span><span>{locale === "ar" ? "تصميم داخلي / القاهرة" : "Interior design / Cairo"}</span><span>01 — 05</span></div>
        <div className="neo-hero-grid">
          <div className="neo-hero-copy">
            <span className="neo-kicker">{t.heroKicker}</span>
            <h1><Lines>{locale === "ar" ? "مساحات لها\nشخصية." : "Interiors with\na point of view."}</Lines></h1>
            <p>{t.heroDescription}</p>
            <div className="neo-hero-actions"><button className="neo-button neo-button-black" type="button" onClick={() => scrollTo("work")}>{t.explore}<ArrowUpRight width={17} height={17} /></button><button className="neo-underlink" type="button" onClick={() => scrollTo("contact")}>{t.contact}<span /></button></div>
          </div>
          <AmrIdentityCard locale={locale} hero designer={liveDesigner} />
        </div>
        <div className="neo-hero-bottom"><span>{locale === "ar" ? "مرّر للأسفل" : "Scroll down"}<ArrowDown width={14} height={14} /></span><span className="neo-hero-marquee">{locale === "ar" ? "سكني · مطابخ · غرف ملابس · تصوّر ثلاثي الأبعاد" : "RESIDENTIAL · KITCHENS · DRESSING ROOMS · 3D VISUALISATION"}</span><span>© {new Date().getFullYear()}</span></div>
      </section>

      <section className="neo-manifesto neo-pad">
        <div className="neo-section-number">00 / 05</div>
        <div className="neo-manifesto-copy"><span className="neo-kicker">{locale === "ar" ? "الموقف" : "The position"}</span><h2>{locale === "ar" ? "أصمم المكان\nكأنه هوية." : "I design a space\nlike an identity."}</h2><p>{locale === "ar" ? "لا أبحث عن شكل يمرّ سريعًا. أبحث عن قرار واضح، خامة صادقة، وتفصيلة تجعل المكان لك وحدك." : "Not a look that passes quickly. A clear decision, an honest material and one detail that makes the space unmistakably yours."}</p></div>
        <div className="neo-manifesto-mark"><span>AA</span><i /></div>
      </section>

      <section className="neo-work neo-pad" id="work">
        <div className="neo-section-heading"><div><span className="neo-section-number">01 / 05</span><h2><Lines>{locale === "ar" ? "أعمال حقيقية.\nإحساس واضح." : "Real work.\nClear feeling."}</Lines></h2></div><p>{t.selectedWorkDescription}</p></div>
        <div className="neo-work-toolbar"><div className="neo-filters" role="tablist" aria-label={locale === "ar" ? "تصفية الأعمال" : "Work filters"}>{liveProjectFilters.map((filter) => <button type="button" role="tab" aria-selected={activeFilter === filter.id} className={activeFilter === filter.id ? "is-active" : ""} key={filter.id} onClick={() => setActiveFilter(filter.id)}>{locale === "ar" ? filter.label : filter.labelEn}</button>)}</div><div className="neo-work-meta"><span className="neo-count">{String(visibleProjects.length).padStart(2, "0")} / {locale === "ar" ? "مشروع منشور" : "PUBLISHED PROJECTS"}</span><a className="neo-archive-link" href={liveDriveFolderUrl} target="_blank" rel="noreferrer">{t.openArchive}<ExternalLinkIcon width={14} height={14} /></a></div></div>
        {visibleProjects.length ? <div className="neo-project-carousel" aria-roledescription="carousel" aria-label={locale === "ar" ? "كاروسيل أعمال عمرو عامر" : "Amr Amer project carousel"}>
          {projectGroups.length > 1 ? <div className="neo-carousel-controls">
            <button type="button" className="neo-carousel-button" onClick={() => moveWorkSlide(-1)} aria-label={locale === "ar" ? "المجموعة السابقة" : "Previous project group"}><span aria-hidden="true">←</span>{locale === "ar" ? "السابق" : "PREV"}</button>
            <div className="neo-carousel-status">
              <span className="neo-carousel-count" aria-live="polite">{String(activeWorkSlide + 1).padStart(2, "0")} / {String(projectGroups.length).padStart(2, "0")}</span>
              <span className="neo-carousel-progress" role="progressbar" aria-label={locale === "ar" ? "تقدم استعراض الأعمال" : "Project carousel progress"} aria-valuemin={1} aria-valuemax={projectGroups.length} aria-valuenow={activeWorkSlide + 1}><i style={{ width: `${((activeWorkSlide + 1) / projectGroups.length) * 100}%` }} /></span>
            </div>
            <button type="button" className="neo-carousel-button" onClick={() => moveWorkSlide(1)} aria-label={locale === "ar" ? "المجموعة التالية" : "Next project group"}>{locale === "ar" ? "التالي" : "NEXT"}<span aria-hidden="true">→</span></button>
          </div> : null}
          <div className="neo-project-viewport" onPointerDown={handleCarouselPointerDown} onPointerUp={handleCarouselPointerUp} onPointerCancel={() => { carouselStartX.current = null; }}>
            <div className="neo-project-track" onTransitionEnd={handleCarouselTransitionEnd} style={{ transform: `translateX(-${workSlide * 100}%)`, transition: carouselTransitionEnabled ? undefined : "none" }}>
              {loopedProjectGroups.map((group, trackIndex) => {
                const groupIndex = projectGroups.length > 1
                  ? (trackIndex - 1 + projectGroups.length) % projectGroups.length
                  : trackIndex;
                return <div className="neo-project-slide" dir={direction} key={`project-group-${trackIndex}`} role="group" aria-roledescription="slide" aria-label={`${locale === "ar" ? "المجموعة" : "Group"} ${groupIndex + 1} ${locale === "ar" ? "من" : "of"} ${projectGroups.length}`}>
                {group.map((project, cardIndex) => {
                  const projectIndex = groupIndex * 4 + cardIndex;
                  const projectTitle = locale === "ar"
                    ? `تصميم داخلي ${String(projectIndex + 1).padStart(2, "0")}`
                    : `Interior Design ${String(projectIndex + 1).padStart(2, "0")}`;
                  return <article className={`neo-project-card neo-project-card-${(projectIndex % 4) + 1}`} key={project.id}>
                    <div className="neo-project-card-top"><span>AMR AMER / INTERIORS</span><span>{String(projectIndex + 1).padStart(2, "0")}</span></div>
                    <a className="neo-project-media" href={project.sourceUrl} target="_blank" rel="noreferrer" aria-label={`${t.openProject}: ${projectTitle} (${project.fileName})`}><img src={project.imageUrl} alt={`${locale === "ar" ? "تصميم داخلي من أعمال عمرو عامر" : "Interior design by Amr Amer"} ${String(projectIndex + 1).padStart(2, "0")}`} loading={projectIndex < 4 ? "eager" : "lazy"} /><span className="neo-project-open">{t.openProject}<ArrowUpRight width={15} height={15} /></span></a>
                    <div className="neo-project-details"><strong className="neo-project-title" dir="auto">{projectTitle}</strong><div className="neo-project-author"><span>AA</span><div><b>AMR AMER</b><small>{t.archiveLabel}</small></div></div><div className="neo-project-stats"><span><small>{locale === "ar" ? "النوع" : "FORMAT"}</small><b>{project.fileName.toLowerCase().endsWith(".jpg") ? "JPG" : "PNG"}</b></span><span><small>{locale === "ar" ? "المرجع" : "FILE"}</small><b>{String(projectIndex + 1).padStart(2, "0")}</b></span></div></div>
                  </article>;
                })}
                </div>;
              })}
            </div>
          </div>
        </div> : <div className="neo-empty-work">
          <div className="neo-archive-poster"><div className="archive-grid" /><span className="archive-stamp">REAL<br />WORK<br />ONLY</span><div className="archive-ring" /><div className="archive-card"><span>AMR AMER / ARCHIVE</span><strong>YOUR<br />SPACE<br /><em>YOUR<br />STORY</em></strong><small>WAITING FOR THE FIRST REAL PROJECT</small></div><div className="archive-footer"><span>STUDIO NOTE / 001</span><span>NO PLACEHOLDERS</span></div></div>
          <div className="neo-empty-copy"><span className="neo-chip neo-chip-coral">00 / 00</span><h3>{t.emptyTitle}</h3><p>{emptyText}</p><div className="neo-private-note"><span />{locale === "ar" ? "سيظهر العمل هنا من روابطك الحقيقية فقط." : "Only your real work links will appear here."}</div></div>
        </div>}
      </section>

      <section className="neo-about neo-pad" id="about">
        <div className="neo-section-number">02 / 05</div>
        <div className="neo-about-main"><span className="neo-kicker">{t.philosophyKicker}</span><h2><Lines>{t.philosophyTitle}</Lines></h2><p>{t.philosophyBody}</p><div className="neo-signature"><span>AA</span><div><strong>{liveDesigner.name}</strong><small>{locale === "ar" ? liveDesigner.role : liveDesigner.roleEn}</small></div></div></div>
        <AmrIdentityCard locale={locale} designer={liveDesigner} />
      </section>

      <section className="neo-services neo-pad">
        <div className="neo-section-heading"><div><span className="neo-section-number">03 / 05</span><h2><Lines>{t.servicesTitle}</Lines></h2></div><div className="neo-star">✳</div></div>
        <div className="neo-service-grid">{liveServices.map((service, index) => <article className={`neo-service-card neo-service-${(index % 3) + 1}`} key={service.number}><div className="service-card-top"><span>{service.number}</span><ArrowUpRight width={17} height={17} /></div><div className="service-symbol" aria-hidden="true">{index === 0 ? "◒" : index === 1 ? "▱" : "✦"}</div><h3>{locale === "ar" ? service.title : service.titleEn}</h3><p>{locale === "ar" ? service.description : service.descriptionEn}</p><span className="service-card-caption">{locale === "ar" ? "عرض الخدمة" : "VIEW SERVICE"}</span></article>)}</div>
      </section>

      <section className="neo-process neo-pad">
        <div className="neo-section-number">04 / 05</div>
        <div className="neo-process-heading"><span className="neo-kicker">{t.processKicker}</span><h2><Lines>{t.processTitle}</Lines></h2><p>{t.processBody}</p></div>
        <div className="neo-process-list"><article><span>01</span><div><h3>{t.step01}</h3><p>{t.step01Body}</p></div><b>↗</b></article><article><span>02</span><div><h3>{t.step02}</h3><p>{t.step02Body}</p></div><b>↗</b></article><article><span>03</span><div><h3>{t.step03}</h3><p>{t.step03Body}</p></div><b>↗</b></article></div>
      </section>

      <section className="neo-contact neo-pad" id="contact">
        <div className="neo-contact-title"><span className="neo-section-number">05 / 05</span><span className="neo-kicker">{t.contactKicker}</span><h2><Lines>{t.contactTitle}</Lines></h2><p>{t.contactBody}</p><div className="neo-direct-links"><a href={`mailto:${liveDesigner.email}`}><MailIcon width={16} height={16} /><span>{liveDesigner.email}</span><ArrowUpRight width={15} height={15} /></a><a href={`https://wa.me/${liveDesigner.whatsapp}`} target="_blank" rel="noreferrer"><WhatsappIcon width={16} height={16} /><span>{liveDesigner.phoneDisplay}</span><ExternalLinkIcon width={15} height={15} /></a></div></div>
        <form className="neo-contact-form" onSubmit={submitContact} noValidate><div className="neo-form-title"><span>{t.sendMessage}</span><SendIcon width={17} height={17} /></div><label><span>{t.formName}</span><input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} onBlur={() => setTouched((current) => ({ ...current, name: true }))} placeholder={t.formNamePlaceholder} aria-invalid={Boolean(fieldError("name"))} />{fieldError("name") ? <small>{fieldError("name")}</small> : null}</label><label><span>{t.formEmail}</span><input dir="ltr" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} onBlur={() => setTouched((current) => ({ ...current, email: true }))} placeholder={t.formEmailPlaceholder} aria-invalid={Boolean(fieldError("email"))} />{fieldError("email") ? <small>{fieldError("email")}</small> : null}</label><label><span>{t.formMessage}</span><textarea rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} onBlur={() => setTouched((current) => ({ ...current, message: true }))} placeholder={t.formMessagePlaceholder} aria-invalid={Boolean(fieldError("message"))} />{fieldError("message") ? <small>{fieldError("message")}</small> : null}</label>{formStatus === "success" ? <div className="neo-form-notice success"><CheckIcon width={16} height={16} />{t.formSuccess}</div> : null}{formStatus === "needs-setup" ? <div className="neo-form-notice warning"><SparkIcon width={16} height={16} />{t.formNeedsSetup}</div> : null}{formStatus === "error" ? <div className="neo-form-notice error"><CloseIcon width={16} height={16} />{formError || t.formError}</div> : null}<button className="neo-button neo-button-black" type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? t.formSending : t.formSubmit}<ArrowUpRight width={17} height={17} /></button></form>
      </section>

      <footer className="neo-footer neo-pad"><div className="neo-footer-top"><a href="#top" className="neo-footer-logo">AMR<span>.</span></a><span>{t.footerNote}</span><button type="button" onClick={() => scrollTo("top")}>{t.backTop}<ArrowUpRight width={14} height={14} /></button></div><div className="neo-footer-bottom"><span>© {new Date().getFullYear()} {liveDesigner.nameEn}. {t.footerRights}.</span><div>{liveSocialLinks.slice(0, 4).map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}><SocialIcon kind={social.kind} /></a>)}</div><span>AA / 001</span></div></footer>
    </main>
  );
}
