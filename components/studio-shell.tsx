"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckIcon,
  CloseIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  GridIcon,
  LockIcon,
  PlusIcon,
  SparkIcon
} from "./icons";

type StudioSection = "overview" | "projects" | "sources" | "content" | "settings";
type AuthMessage = "" | "not-configured" | "invalid" | "error";

type Draft = {
  id: string;
  title: string;
  category: string;
  description: string;
  savedAt: string;
};

const sections: Array<{ id: StudioSection; label: string; number: string }> = [
  { id: "overview", label: "نظرة عامة", number: "01" },
  { id: "projects", label: "المشاريع", number: "02" },
  { id: "sources", label: "مصادر الملفات", number: "03" },
  { id: "content", label: "المحتوى والهوية", number: "04" },
  { id: "settings", label: "الإعدادات", number: "05" }
];

export default function StudioShell({ authenticated }: { authenticated: boolean }) {
  const [authMessage, setAuthMessage] = useState<AuthMessage>("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [section, setSection] = useState<StudioSection>("overview");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draft, setDraft] = useState({ title: "", category: "Residential interiors", description: "" });

  useEffect(() => {
    if (!authenticated) return;
    try {
      const saved = window.localStorage.getItem("amr-studio-drafts");
      if (saved) setDrafts(JSON.parse(saved) as Draft[]);
    } catch {
      // Local draft storage is optional; the real production store belongs in the database.
    }
  }, [authenticated]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setAuthMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      });
      const result = (await response.json()) as { ok?: boolean; code?: string };
      if (result.ok) {
        window.location.reload();
      } else if (result.code === "AUTH_NOT_CONFIGURED") {
        setAuthMessage("not-configured");
      } else if (result.code === "INVALID_CREDENTIALS") {
        setAuthMessage("invalid");
      } else {
        setAuthMessage("error");
      }
    } catch {
      setAuthMessage("error");
    } finally {
      setLoginBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    window.location.reload();
  }

  function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const nextDraft: Draft = {
      id: crypto.randomUUID(),
      title: draft.title.trim(),
      category: draft.category,
      description: draft.description.trim(),
      savedAt: new Date().toISOString()
    };
    const next = [nextDraft, ...drafts];
    setDrafts(next);
    window.localStorage.setItem("amr-studio-drafts", JSON.stringify(next));
    setDraft({ title: "", category: "Residential interiors", description: "" });
    setDraftOpen(false);
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 3200);
  }

  if (!authenticated) {
    return (
      <main className="studio-shell studio-auth-shell">
        <div className="studio-auth-top"><Link className="studio-brand" href="/">AMR<span>.</span> / STUDIO</Link><Link className="studio-back-link" href="/"><ArrowLeft width={15} height={15} /> الموقع العام</Link></div>
        <div className="studio-auth-grid">
          <div className="studio-auth-intro">
            <span className="section-kicker">Private workspace / 01</span>
            <h1>مساحتك لإدارة<br />كل التفاصيل.</h1>
            <p>استوديو خاص لإدارة المشاريع، المصادر، المحتوى والظهور العام. لا يوجد تسجيل عام أو بيانات تجريبية.</p>
            <div className="auth-note"><LockIcon width={16} height={16} /><span>هذه المنطقة محمية ولا تظهر ضمن تجربة الزائر.</span></div>
          </div>
          <form className="studio-login-card" onSubmit={login}>
            <div className="login-card-top"><span>OWNER ACCESS</span><span>AMR / 001</span></div>
            <h2>تسجيل دخول المالك</h2>
            <p>استخدم بيانات المالك الموجودة في متغيرات البيئة المحلية.</p>
            <label className="field-label"><span>البريد الإلكتروني</span><input name="email" type="email" autoComplete="username" required placeholder="owner@example.com" dir="ltr" /></label>
            <label className="field-label"><span>كلمة المرور</span><input name="password" type="password" autoComplete="current-password" required placeholder="••••••••••••" dir="ltr" /></label>
            {authMessage === "not-configured" ? <div className="studio-alert warning"><SparkIcon width={16} height={16} /><span>لم يتم إعداد OWNER_EMAIL وOWNER_PASSWORD وOWNER_SESSION_SECRET بعد.</span></div> : null}
            {authMessage === "invalid" ? <div className="studio-alert error"><CloseIcon width={16} height={16} /><span>بيانات الدخول غير صحيحة.</span></div> : null}
            {authMessage === "error" ? <div className="studio-alert error"><CloseIcon width={16} height={16} /><span>تعذر إتمام تسجيل الدخول الآن.</span></div> : null}
            <button className="button button-dark studio-login-button" type="submit" disabled={loginBusy}>{loginBusy ? "جارٍ التحقق..." : "الدخول إلى الاستوديو"}<ArrowUpRight width={17} height={17} /></button>
            <span className="login-footnote">لا تخزن بيانات الدخول في الواجهة أو المستودع.</span>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="studio-shell studio-dashboard">
      <header className="studio-header">
        <Link className="studio-brand" href="/">AMR<span>.</span> / STUDIO</Link>
        <div className="studio-header-meta"><span className="studio-live-dot" /> Private / Owner only <Link href="/"><ExternalLinkIcon width={14} height={14} /></Link><button type="button" onClick={logout}>خروج</button></div>
      </header>
      <div className="studio-layout">
        <aside className="studio-sidebar">
          <div className="sidebar-intro"><span className="section-kicker">Owner studio</span><h1>مرحبًا<br />عمرو.</h1><p>تحكم هادئ في كل ما يظهر للعالم.</p></div>
          <nav className="studio-nav" aria-label="Owner studio navigation">{sections.map((item) => <button key={item.id} className={section === item.id ? "is-active" : ""} type="button" onClick={() => setSection(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
          <div className="sidebar-foot"><span>AMR / 2025—26</span><span>Protected workspace</span></div>
        </aside>
        <section className="studio-content">
          {draftSaved ? <div className="studio-toast"><CheckIcon width={16} height={16} /> تم حفظ المسودة محليًا. لا تظهر للزائر قبل النشر.</div> : null}
          {section === "overview" ? <Overview drafts={drafts} onNavigate={setSection} /> : null}
          {section === "projects" ? <Projects drafts={drafts} draftOpen={draftOpen} setDraftOpen={setDraftOpen} draft={draft} setDraft={setDraft} onSave={saveDraft} /> : null}
          {section === "sources" ? <Sources /> : null}
          {section === "content" ? <ContentPanel /> : null}
          {section === "settings" ? <SettingsPanel /> : null}
        </section>
      </div>
    </main>
  );
}

function PanelHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="studio-panel-header"><div><span className="section-kicker">{eyebrow}</span><h2>{title}</h2></div><p>{description}</p></div>;
}

function Overview({ drafts, onNavigate }: { drafts: Draft[]; onNavigate: (section: StudioSection) => void }) {
  return <>
    <PanelHeader eyebrow="Overview / 01" title="الصورة الكاملة." description="من هنا ترى حالة الموقع والمحتوى والمصادر في لمحة واحدة، دون ادعاء أن شيئًا يعمل قبل اختباره." />
    <div className="studio-stat-grid"><div className="studio-stat"><span>Published projects</span><strong>00</strong><small>لا توجد أعمال منشورة</small></div><div className="studio-stat"><span>Local drafts</span><strong>{String(drafts.length).padStart(2, "0")}</strong><small>مسودات هذا المتصفح</small></div><div className="studio-stat"><span>Connected sources</span><strong>00</strong><small>تحتاج إعداد الاعتماد</small></div></div>
    <div className="overview-grid"><div className="studio-card readiness-card"><div className="card-topline"><span>Launch readiness</span><span className="status-pill neutral">In progress</span></div><h3>الواجهة العامة جاهزة<br />لاستقبال عملك الحقيقي.</h3><div className="readiness-track"><i style={{ width: "42%" }} /></div><div className="readiness-meta"><span>واجهة وتجربة الاستخدام</span><strong>42%</strong></div><button className="text-button" type="button" onClick={() => onNavigate("projects")}>ابدأ بإضافة مشروع <ArrowUpRight width={15} height={15} /></button></div><div className="studio-card checklist-card"><div className="card-topline"><span>Next actions</span><span>03</span></div><ul><li><span className="check-circle done"><CheckIcon width={12} height={12} /></span><span>تجهيز الهوية الأساسية</span></li><li><span className="check-circle" /><span>إضافة أول مشروع حقيقي</span></li><li><span className="check-circle" /><span>ربط مصدر ملفات</span></li><li><span className="check-circle" /><span>إعداد خدمة البريد</span></li></ul></div></div>
  </>;
}

function Projects({ drafts, draftOpen, setDraftOpen, draft, setDraft, onSave }: { drafts: Draft[]; draftOpen: boolean; setDraftOpen: (open: boolean) => void; draft: { title: string; category: string; description: string }; setDraft: (draft: { title: string; category: string; description: string }) => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return <>
    <div className="studio-panel-header studio-panel-header-action"><PanelHeader eyebrow="Projects / 02" title="الأعمال." description="أضف أعمالك الحقيقية هنا. المسودات المحلية لا تظهر على الموقع العام قبل ربط قاعدة البيانات والنشر." /><button className="button button-dark" type="button" onClick={() => setDraftOpen(!draftOpen)}><PlusIcon width={16} height={16} /> مشروع جديد</button></div>
    {draftOpen ? <form className="draft-form studio-card" onSubmit={onSave}><div className="card-topline"><span>New local draft</span><button type="button" onClick={() => setDraftOpen(false)} aria-label="إغلاق"><CloseIcon width={17} height={17} /></button></div><div className="draft-grid"><label className="field-label"><span>اسم المشروع</span><input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="اسم حقيقي للمشروع" /></label><label className="field-label"><span>التصنيف</span><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>Residential interiors</option><option>Kitchens</option><option>Dressing rooms</option><option>3D visualisation</option></select></label><label className="field-label field-full"><span>وصف مختصر</span><textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="وصف صادر من معلومات المشروع الحقيقية..." /></label></div><div className="draft-actions"><span>سيتم حفظها كمسودة محلية فقط.</span><button className="button button-dark" type="submit">حفظ المسودة <CheckIcon width={16} height={16} /></button></div></form> : null}
    <div className="studio-card projects-card"><div className="card-topline"><span>Published & drafts</span><span>{String(drafts.length).padStart(2, "0")} drafts</span></div>{drafts.length === 0 ? <div className="studio-empty"><div className="empty-diamond"><GridIcon width={23} height={23} /></div><h3>لا توجد مسودات بعد.</h3><p>ابدأ بإضافة مشروع حقيقي. لن نضع صورًا أو أسماء عملاء تجريبية مكان عملك.</p><button className="text-button" type="button" onClick={() => setDraftOpen(true)}>إنشاء أول مسودة <ArrowUpRight width={15} height={15} /></button></div> : <div className="draft-list">{drafts.map((item) => <div className="draft-row" key={item.id}><span className="draft-dot" /><div><strong>{item.title}</strong><small>{item.category} / draft</small></div><time>{new Date(item.savedAt).toLocaleDateString("en-GB")}</time><span className="status-pill neutral">Local only</span></div>)}</div>}</div>
  </>;
}

function Sources() {
  const sources = [{ name: "Google Drive", description: "المجلدات والملفات عبر OAuth وDrive API v3.", status: "يحتاج اعتماد", tone: "warning", icon: <DatabaseIcon width={20} height={20} /> }, { name: "Dropbox", description: "Webhook + list_folder/continue للمزامنة.", status: "يحتاج تطبيقًا وHTTPS", tone: "warning", icon: <DatabaseIcon width={20} height={20} /> }, { name: "Direct media", description: "روابط مباشرة لملفات يملكها العميل أو الاستوديو.", status: "جاهز للواجهة", tone: "neutral", icon: <ExternalLinkIcon width={20} height={20} /> }, { name: "Behance", description: "الوصول يتوقف على موافقة المنصة ومطور التطبيق.", status: "غير مضمون", tone: "error", icon: <ExternalLinkIcon width={20} height={20} /> }];
  return <><PanelHeader eyebrow="Sources / 03" title="مصادر الملفات." description="أضف المصدر مرة واحدة، ثم اجعل الموقع يقرأ حالته بوضوح. لا يوجد تكامل مفعّل قبل إدخال بيانات الاعتماد واختباره." /><div className="sources-list">{sources.map((source) => <div className="source-row" key={source.name}><div className="source-icon">{source.icon}</div><div className="source-copy"><h3>{source.name}</h3><p>{source.description}</p></div><span className={`status-pill ${source.tone}`}>{source.status}</span><button type="button" className="source-action">إعداد <ArrowUpRight width={15} height={15} /></button></div>)}</div><div className="studio-info-banner"><SparkIcon width={18} height={18} /><span><strong>قاعدة الصدق:</strong> أي مصدر يحتاج إعدادًا يدويًا أو HTTPS عامًا سيظل معلّمًا بذلك هنا وفي توثيق المشروع.</span></div></>;
}

function ContentPanel() {
  return <><PanelHeader eyebrow="Content / 04" title="المحتوى والهوية." description="النصوص العامة الحالية مبنية على المعلومات المتاحة فقط. أضف التفاصيل من هنا بعد تجهيز مخزن المحتوى الإنتاجي." /><div className="content-editor-grid"><div className="studio-card content-card"><div className="card-topline"><span>Public identity</span><span>AR / EN</span></div><label className="field-label"><span>الاسم الظاهر</span><input defaultValue="عمرو عامر / Amr Amer" /></label><label className="field-label"><span>المسمى الوظيفي</span><input defaultValue="مصمم داخلي / Interior Designer" /></label><label className="field-label"><span>الموقع</span><input defaultValue="القاهرة، مصر / Cairo, Egypt" /></label><button className="button button-outline" type="button">حفظ بعد ربط قاعدة البيانات <LockIcon width={15} height={15} /></button></div><div className="studio-card preview-card"><div className="card-topline"><span>Live preview</span><span className="status-pill neutral">Public</span></div><div className="preview-mini"><span>AMR</span><strong>مساحات هادئة،<br />مصممة لتُعاش.</strong><small>Interior designer / Cairo</small><i /></div></div></div></>;
}

function SettingsPanel() {
  return <><PanelHeader eyebrow="Settings / 05" title="الإعدادات." description="حالة البيئة الحالية بوضوح. كل قيمة حساسة تُقرأ من الخادم ولا تُعرض في الواجهة العامة." /><div className="settings-list"><div className="setting-row"><div><strong>Owner authentication</strong><span>OWNER_EMAIL / OWNER_PASSWORD / SESSION_SECRET</span></div><span className="status-pill warning">تحقق من البيئة</span></div><div className="setting-row"><div><strong>Contact delivery</strong><span>CONTACT_WEBHOOK_URL</span></div><span className="status-pill warning">غير مهيأ</span></div><div className="setting-row"><div><strong>Database</strong><span>PostgreSQL / Supabase</span></div><span className="status-pill warning">غير متصل</span></div><div className="setting-row"><div><strong>Public site</strong><span>واجهة عامة متاحة محليًا</span></div><span className="status-pill success">Ready</span></div></div><div className="studio-info-banner"><LockIcon width={18} height={18} /><span>لا توجد مفاتيح API أو كلمات مرور داخل الكود. استخدم <code>.env.local</code> محليًا، ولا ترفعها إلى المستودع.</span></div></>;
}
