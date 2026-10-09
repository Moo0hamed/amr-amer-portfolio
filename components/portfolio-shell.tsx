"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
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
  projectFilters,
  projects,
  services,
  socialLinks,
  studioPrinciples,
  type Locale,
  type SocialLink
} from "../data/site";

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

function MultilineText({ children }: { children: string }) {
  return (
    <>
      {children.split("\n").map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < children.split("\n").length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

export default function PortfolioShell() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const t = copy[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("amr-theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
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
    const label = projectFilters.find((filter) => filter.id === activeFilter);
    return locale === "ar"
      ? `لا توجد أعمال منشورة ضمن تصنيف «${label?.label ?? "هذا"}» بعد.`
      : `No published work under “${label?.labelEn ?? "this"}” yet.`;
  }, [activeFilter, locale, t.emptyDescription]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (formStatus !== "idle") setFormStatus("idle");
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
    <main className={`site-shell ${menuOpen ? "menu-is-open" : ""}`}>
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />

      <header className="site-header">
        <button className="brand" type="button" onClick={() => scrollTo("top")} aria-label="Amr Amer — home">
          <span className="brand-mark">AMR</span>
          <span className="brand-divider" />
          <span className="brand-caption">{locale === "ar" ? "تصميم داخلي" : "INTERIOR DESIGN"}</span>
        </button>

        <nav className={`main-nav ${menuOpen ? "is-visible" : ""}`} aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          <button type="button" onClick={() => scrollTo("work")}>
            <span>01</span>{t.navWork}
          </button>
          <button type="button" onClick={() => scrollTo("about")}>
            <span>02</span>{t.navAbout}
          </button>
          <button type="button" onClick={() => scrollTo("contact")}>
            <span>03</span>{t.navContact}
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? t.themeDark : t.themeLight}
            title={theme === "light" ? t.themeDark : t.themeLight}
          >
            {theme === "light" ? <MoonIcon width={17} height={17} /> : <SunIcon width={17} height={17} />}
          </button>
          <button className="language-toggle" type="button" onClick={() => setLocale(locale === "ar" ? "en" : "ar")} aria-label="Switch language">
            <span className={locale === "ar" ? "is-active" : ""}>ع</span>
            <i>/</i>
            <span className={locale === "en" ? "is-active" : ""}>EN</span>
          </button>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen}>
            {menuOpen ? <CloseIcon width={21} height={21} /> : <MenuIcon width={21} height={21} />}
          </button>
        </div>
      </header>

      <section className="hero-section section-pad" id="top">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow-dot" />
            <span className="eyebrow">{t.heroKicker}</span>
          </div>
          <h1 className="hero-title"><MultilineText>{t.heroTitle}</MultilineText></h1>
          <p className="hero-description">{t.heroDescription}</p>
          <div className="hero-actions">
            <button className="button button-dark" type="button" onClick={() => scrollTo("work")}>
              {t.explore} <ArrowUpRight width={17} height={17} />
            </button>
            <button className="text-link" type="button" onClick={() => scrollTo("contact")}>
              {t.contact} <span className="text-link-line" />
            </button>
          </div>
        </div>

        <div className="hero-visual-wrap" aria-label={locale === "ar" ? "تكوين بصري تجريدي" : "Abstract spatial composition"}>
          <div className="hero-visual">
            <div className="visual-grid" aria-hidden="true" />
            <div className="hero-arch" aria-hidden="true"><span /></div>
            <div className="hero-plane hero-plane-main" aria-hidden="true" />
            <div className="hero-plane hero-plane-side" aria-hidden="true" />
            <div className="hero-shadow" aria-hidden="true" />
            <div className="hero-light" aria-hidden="true" />
            <div className="visual-label visual-label-top">STUDIO / 01</div>
            <div className="visual-label visual-label-bottom">LIGHT — MATERIAL — FORM</div>
            <span className="visual-cross visual-cross-one" aria-hidden="true" />
            <span className="visual-cross visual-cross-two" aria-hidden="true" />
          </div>
          <div className="hero-side-note"><span>CAIRO / EG</span><span>30° 02′ N</span></div>
        </div>

        <button className="scroll-cue" type="button" onClick={() => scrollTo("work")}>
          <span>{t.scroll}</span><ArrowDown width={16} height={16} />
        </button>
      </section>

      <div className="principles-strip section-pad" aria-label={locale === "ar" ? "مبادئ الاستوديو" : "Studio principles"}>
        <span className="strip-label">{locale === "ar" ? "مبادئ الاستوديو" : "Studio principles"}</span>
        <div className="principles-list">
          {studioPrinciples.map((principle) => (
            <div className="principle" key={principle.value}>
              <span className="principle-number">{principle.value}</span>
              <span>{locale === "ar" ? principle.label : principle.labelEn}</span>
            </div>
          ))}
        </div>
        <span className="strip-index">AM / 2025—26</span>
      </div>

      <section className="work-section section-pad" id="work">
        <div className="section-heading split-heading">
          <div>
            <span className="section-kicker">{t.selectedWork}</span>
            <h2><MultilineText>{t.selectedWorkTitle}</MultilineText></h2>
          </div>
          <p>{t.selectedWorkDescription}</p>
        </div>

        <div className="work-toolbar">
          <div className="filter-list" role="tablist" aria-label={locale === "ar" ? "تصفية الأعمال" : "Work filters"}>
            {projectFilters.map((filter) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.id}
                className={activeFilter === filter.id ? "is-active" : ""}
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                {locale === "ar" ? filter.label : filter.labelEn}
              </button>
            ))}
          </div>
          <span className="work-count">{String(projects.length).padStart(2, "0")} {locale === "ar" ? "مشروع منشور" : "published projects"}</span>
        </div>

        {projects.length === 0 ? (
          <div className="empty-gallery">
            <div className="gallery-visual" aria-hidden="true">
              <div className="gallery-visual-header"><span>AMR AMER / ARCHIVE</span><span>— 01</span></div>
              <div className="gallery-frame gallery-frame-one"><span>LIGHT</span></div>
              <div className="gallery-frame gallery-frame-two"><span>SPACE</span></div>
              <div className="gallery-frame gallery-frame-three"><span>FORM</span></div>
              <div className="gallery-orbit" />
              <div className="gallery-visual-footer"><span>REAL WORK ONLY</span><span>STUDIO NOTE / 001</span></div>
            </div>
            <div className="empty-gallery-copy">
              <span className="empty-index">00 / 00</span>
              <h3>{t.emptyTitle}</h3>
              <p>{emptyText}</p>
              <span className="private-intake"><span className="eyebrow-dot" /> {locale === "ar" ? "يُضاف العمل الحقيقي من مساحة المالك الخاصة." : "Real work is added through the private owner space."}</span>
            </div>
          </div>
        ) : null}
      </section>

      <section className="about-section section-pad" id="about">
        <div className="about-aside">
          <span className="section-kicker">{t.philosophyKicker}</span>
          <span className="vertical-note">AMR / PHILOSOPHY / 01</span>
        </div>
        <div className="about-main">
          <h2><MultilineText>{t.philosophyTitle}</MultilineText></h2>
          <p className="about-lead">{t.philosophyBody}</p>
          <div className="about-signature">
            <div className="signature-mark">AA</div>
            <div><strong>{designer.name}</strong><span>{locale === "ar" ? designer.role : designer.roleEn}</span></div>
          </div>
        </div>
        <div className="about-detail-card">
          <span className="card-index">A / 01</span>
          <span className="card-rule" />
          <strong>{locale === "ar" ? designer.education : designer.educationEn}</strong>
          <span>{locale === "ar" ? designer.location : designer.locationEn}</span>
          <div className="card-compass" aria-hidden="true"><span>N</span><i /><span>S</span></div>
        </div>
      </section>

      <section className="services-section section-pad">
        <div className="section-heading split-heading services-heading">
          <div>
            <span className="section-kicker">{t.servicesKicker}</span>
            <h2><MultilineText>{t.servicesTitle}</MultilineText></h2>
          </div>
          <span className="heading-mark" aria-hidden="true">✳</span>
        </div>
        <div className="services-list">
          {services.map((service) => (
            <article className="service-row" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h3>{locale === "ar" ? service.title : service.titleEn}</h3>
              <p>{locale === "ar" ? service.description : service.descriptionEn}</p>
              <span className="service-arrow"><ArrowUpRight width={17} height={17} /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section section-pad">
        <div className="process-intro">
          <span className="section-kicker">{t.processKicker}</span>
          <h2><MultilineText>{t.processTitle}</MultilineText></h2>
          <p>{t.processBody}</p>
        </div>
        <div className="process-steps">
          <article className="process-step"><span>{t.step01}</span><p>{t.step01Body}</p><div className="step-line"><i /></div></article>
          <article className="process-step"><span>{t.step02}</span><p>{t.step02Body}</p><div className="step-line"><i /></div></article>
          <article className="process-step"><span>{t.step03}</span><p>{t.step03Body}</p><div className="step-line"><i /></div></article>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="contact-intro">
          <div className="eyebrow-row"><span className="eyebrow-dot" /><span className="eyebrow">{t.contactKicker}</span></div>
          <h2><MultilineText>{t.contactTitle}</MultilineText></h2>
          <p>{t.contactBody}</p>
          <div className="direct-contact-list">
            <a href={`mailto:${designer.email}`}><span className="direct-contact-icon"><MailIcon width={16} height={16} /></span><span><small>{t.emailLabel}</small>{designer.email}</span><ArrowUpRight width={16} height={16} /></a>
            <a href={`https://wa.me/${designer.whatsapp}`} target="_blank" rel="noreferrer"><span className="direct-contact-icon"><WhatsappIcon width={16} height={16} /></span><span><small>{t.whatsappLabel}</small>{designer.phoneDisplay}</span><ExternalLinkIcon width={16} height={16} /></a>
          </div>
        </div>

        <form className="contact-form" onSubmit={submitContact} noValidate>
          <div className="form-topline"><span>{t.sendMessage}</span><SendIcon width={17} height={17} /></div>
          <label className="field-label"><span>{t.formName}</span><input type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} onBlur={() => setTouched((current) => ({ ...current, name: true }))} placeholder={t.formNamePlaceholder} aria-invalid={Boolean(fieldError("name"))} />{fieldError("name") ? <small className="field-error">{fieldError("name")}</small> : null}</label>
          <label className="field-label"><span>{t.formEmail}</span><input type="email" dir="ltr" value={form.email} onChange={(event) => updateField("email", event.target.value)} onBlur={() => setTouched((current) => ({ ...current, email: true }))} placeholder={t.formEmailPlaceholder} aria-invalid={Boolean(fieldError("email"))} />{fieldError("email") ? <small className="field-error">{fieldError("email")}</small> : null}</label>
          <label className="field-label"><span>{t.formMessage}</span><textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} onBlur={() => setTouched((current) => ({ ...current, message: true }))} placeholder={t.formMessagePlaceholder} rows={4} aria-invalid={Boolean(fieldError("message"))} />{fieldError("message") ? <small className="field-error">{fieldError("message")}</small> : null}</label>
          {formStatus === "success" ? <div className="form-notice success"><CheckIcon width={16} height={16} />{t.formSuccess}</div> : null}
          {formStatus === "needs-setup" ? <div className="form-notice warning"><SparkIcon width={16} height={16} />{t.formNeedsSetup}</div> : null}
          {formStatus === "error" ? <div className="form-notice error"><CloseIcon width={16} height={16} />{formError || t.formError}</div> : null}
          <button className="button button-dark form-submit" type="submit" disabled={formStatus === "sending"}>
            {formStatus === "sending" ? t.formSending : t.formSubmit}
            <ArrowUpRight width={17} height={17} />
          </button>
        </form>
      </section>

      <footer className="site-footer section-pad">
        <div className="footer-top"><Link className="footer-brand" href="/">AMR<span>.</span></Link><span>{t.footerNote}</span><button className="back-top" type="button" onClick={() => scrollTo("top")}>{t.backTop}<ArrowUpRight width={15} height={15} /></button></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {designer.nameEn}. {t.footerRights}.</span><div className="footer-socials">{socialLinks.slice(0, 4).map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}><SocialIcon kind={social.kind} /></a>)}</div><span className="footer-code">AA / STUDIO 001</span></div>
      </footer>
    </main>
  );
}
