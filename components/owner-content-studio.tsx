"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { SiteContent } from "../lib/site-content";
import { copy, designer, driveFolderUrl, projectFilters, projects, services, socialLinks, studioPrinciples } from "../data/site";
import { ArrowLeft, ArrowUpRight, CheckIcon, CloseIcon, ExternalLinkIcon, LockIcon, PlusIcon } from "./icons";

type Section = "overview" | "identity" | "services" | "projects";
type LocalizedCopyKey = "heroTitle" | "heroDescription" | "philosophyTitle" | "philosophyBody" | "servicesTitle" | "contactTitle";
const sections: Array<{ id: Section; title: string }> = [
  { id: "overview", title: "نظرة عامة" },
  { id: "identity", title: "الهوية والنصوص" },
  { id: "services", title: "الخدمات" },
  { id: "projects", title: "المشاريع" }
];
const initialContent: SiteContent = { copy, designer, driveFolderUrl, projectFilters, projects, services, socialLinks, studioPrinciples };

export default function OwnerContentStudio({ authenticated }: { authenticated: boolean }) {
  const [message, setMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/studio/content", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { content?: SiteContent; canSave?: boolean; error?: string };
        if (!response.ok || !result.content) throw new Error(result.error || "تعذر تحميل المحتوى.");
        setContent(result.content);
        setCanSave(Boolean(result.canSave));
      })
      .catch((error: unknown) => setSaveMessage(error instanceof Error ? error.message : "تعذر تحميل المحتوى."))
      .finally(() => setLoading(false));
  }, [authenticated]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setLoginError("");
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.get("email"), password: values.get("password") })
      });
      const result = await response.json() as { ok?: boolean; code?: string };
      if (result.ok) window.location.reload();
      else setLoginError(result.code === "AUTH_NOT_CONFIGURED" ? "أضف بيانات المالك إلى متغيرات البيئة أولًا." : "بيانات الدخول غير صحيحة.");
    } catch {
      setLoginError("تعذر إتمام تسجيل الدخول الآن.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/studio/logout", { method: "POST" });
    window.location.reload();
  }

  async function save() {
    setSaveState("saving");
    setSaveMessage("");
    try {
      const response = await fetch("/api/studio/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const result = await response.json() as { ok?: boolean; savedTo?: string; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "تعذر حفظ التعديلات.");
      setSaveState("saved");
      setSaveMessage(result.savedTo === "github" ? "حُفظت التغييرات في GitHub وسيعرضها الموقع مباشرة." : "حُفظت التغييرات على هذا الموقع.");
      window.setTimeout(() => setSaveState("idle"), 4000);
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "تعذر حفظ التعديلات.");
    }
  }

  function updateDesigner(field: keyof SiteContent["designer"], value: string) {
    setContent((current) => ({ ...current, designer: { ...current.designer, [field]: value } }));
  }

  function updateCopy(locale: "ar" | "en", field: LocalizedCopyKey, value: string) {
    setContent((current) => ({ ...current, copy: { ...current.copy, [locale]: { ...current.copy[locale], [field]: value } } }));
  }

  if (!authenticated) {
    return <main className="studio-shell studio-auth-shell">
      <div className="studio-auth-top"><Link className="studio-brand" href="/">AMR<span>.</span> / STUDIO</Link><Link className="studio-back-link" href="/"><ArrowLeft width={15} height={15} /> الموقع العام</Link></div>
      <div className="studio-auth-grid">
        <div className="studio-auth-intro"><span className="section-kicker">Private workspace / 01</span><h1>مساحتك لإدارة<br />كل التفاصيل.</h1><p>لوحة خاصة بك لتعديل محتوى الموقع ونشر التغييرات. لا يوجد تسجيل عام.</p><div className="auth-note"><LockIcon width={16} height={16} /><span>تسجيل الدخول مطلوب للوصول إلى أدوات التعديل.</span></div></div>
        <form className="studio-login-card" onSubmit={login}><div className="login-card-top"><span>OWNER ACCESS</span><span>AMR / 001</span></div><h2>دخول المالك</h2><p>أدخل البريد وكلمة المرور اللذين أعددتهما للموقع.</p><label className="field-label"><span>البريد الإلكتروني</span><input name="email" type="email" autoComplete="username" required placeholder="owner@example.com" dir="ltr" /></label><label className="field-label"><span>كلمة المرور</span><input name="password" type="password" autoComplete="current-password" required placeholder="••••••••••••" dir="ltr" /></label>{loginError ? <div className="studio-alert error"><CloseIcon width={16} height={16} /><span>{loginError}</span></div> : null}<button className="button button-dark studio-login-button" type="submit" disabled={busy}>{busy ? "جارٍ التحقق..." : "الدخول إلى الاستوديو"}<ArrowUpRight width={17} height={17} /></button><span className="login-footnote">بيانات الدخول محفوظة على الخادم فقط.</span></form>
      </div>
    </main>;
  }

  return <main className="studio-shell studio-dashboard">
    <header className="studio-header"><Link className="studio-brand" href="/">AMR<span>.</span> / STUDIO</Link><div className="studio-header-meta"><span className="studio-live-dot" /> خاص بالمالك <Link href="/"><ExternalLinkIcon width={14} height={14} /></Link><button type="button" onClick={logout}>خروج</button></div></header>
    <div className="studio-layout">
      <aside className="studio-sidebar"><div className="sidebar-intro"><span className="section-kicker">Owner studio</span><h1>مرحبًا<br />عمرو.</h1><p>عدّل ما يظهر في الموقع واحفظه مباشرة.</p></div><nav className="studio-nav" aria-label="أقسام لوحة المالك">{sections.map((item, index) => <button key={item.id} className={section === item.id ? "is-active" : ""} type="button" onClick={() => setSection(item.id)}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</button>)}</nav><div className="sidebar-foot"><span>AMR / STUDIO</span><span>دخول محمي</span></div></aside>
      <section className="studio-content">
        {saveMessage ? <div className={`studio-toast ${saveState === "error" ? "studio-toast-error" : ""}`}><CheckIcon width={16} height={16} /> {saveMessage}</div> : null}
        {section === "overview" ? <><PanelHeader title="موقعك بين يديك." description="عدّل بياناتك وخدماتك وأعمالك من هنا. كل تغيير محفوظ يظهر للزوار مباشرة." /><div className="studio-stat-grid"><div className="studio-stat"><span>المشاريع المنشورة</span><strong>{String(content.projects.length).padStart(2, "0")}</strong><small>تظهر في معرض الأعمال</small></div><div className="studio-stat"><span>الخدمات</span><strong>{String(content.services.length).padStart(2, "0")}</strong><small>يمكنك إضافتها أو حذفها</small></div><div className="studio-stat"><span>الحفظ</span><strong>{canSave ? "جاهز" : "—"}</strong><small>{canSave ? "تعديلاتك قابلة للحفظ" : "إعداد الحفظ مطلوب"}</small></div></div><div className="studio-card readiness-card"><div className="card-topline"><span>لوحة المالك</span><span className="status-pill success">خاصة</span></div><h3>عدّل المحتوى ثم اضغط حفظ التغييرات.</h3><p>تظهر تعديلاتك على الموقع بعد الحفظ، ويمكنك الرجوع إليها في أي وقت من هذه اللوحة.</p><button className="button button-dark" type="button" onClick={() => setSection("identity")}>تعديل الموقع <ArrowUpRight width={15} height={15} /></button></div></> : null}
        {section === "identity" ? <><PanelHeader title="الهوية والنصوص." description="حدّث بيانات المالك والنصوص الظاهرة في الصفحة الرئيسية والنبذة والتواصل." />{loading ? <p>جارٍ تحميل المحتوى...</p> : <div className="studio-card content-card"><div className="card-topline"><span>بيانات المالك</span><span>AR / EN</span></div><div className="draft-grid">{([ ["name", "الاسم بالعربية"], ["nameEn", "الاسم بالإنجليزية"], ["role", "المسمى بالعربية"], ["roleEn", "المسمى بالإنجليزية"], ["education", "المؤهل بالعربية"], ["educationEn", "المؤهل بالإنجليزية"], ["location", "الموقع بالعربية"], ["locationEn", "الموقع بالإنجليزية"], ["email", "البريد الإلكتروني"], ["phoneDisplay", "الهاتف الظاهر"], ["whatsapp", "رقم واتساب مع مفتاح الدولة"] ] as Array<[keyof SiteContent["designer"], string]>).map(([field, label]) => <label className="field-label" key={field}><span>{label}</span><input value={content.designer[field]} onChange={(event) => updateDesigner(field, event.target.value)} /></label>)}</div><div className="studio-divider" /><div className="card-topline"><span>نصوص الصفحة</span><span>AR / EN</span></div>{([ ["heroTitle", "عنوان الواجهة"], ["heroDescription", "وصف الواجهة"], ["philosophyTitle", "عنوان النبذة"], ["philosophyBody", "نص النبذة"], ["servicesTitle", "عنوان الخدمات"], ["contactTitle", "عنوان التواصل"] ] as Array<[LocalizedCopyKey, string]>).map(([field, label]) => <div className="draft-grid" key={field}><label className="field-label"><span>{label} — العربية</span><textarea rows={2} value={content.copy.ar[field]} onChange={(event) => updateCopy("ar", field, event.target.value)} /></label><label className="field-label"><span>{label} — English</span><textarea rows={2} value={content.copy.en[field]} onChange={(event) => updateCopy("en", field, event.target.value)} /></label></div>)}<label className="field-label"><span>رابط مجلد الأعمال</span><input dir="ltr" value={content.driveFolderUrl} onChange={(event) => setContent((current) => ({ ...current, driveFolderUrl: event.target.value }))} /></label><SaveButton disabled={!canSave} state={saveState} onClick={save} /></div>}</> : null}
        {section === "services" ? <><PanelHeader title="الخدمات." description="أضف خدمة أو عدّل اسمها ووصفها بالعربية والإنجليزية. الحذف يزيلها من الموقع." />{loading ? <p>جارٍ تحميل المحتوى...</p> : <div className="studio-card projects-card"><div className="card-topline"><span>الخدمات الظاهرة</span><button className="button button-outline" type="button" onClick={() => setContent((current) => ({ ...current, services: [...current.services, { number: String(current.services.length + 1).padStart(2, "0"), title: "خدمة جديدة", titleEn: "New service", description: "اكتب وصف الخدمة", descriptionEn: "Add a service description" }] }))}><PlusIcon width={15} height={15} /> إضافة خدمة</button></div><div className="studio-edit-list">{content.services.map((service, index) => <article className="studio-card studio-edit-card" key={`${service.number}-${index}`}><div className="card-topline"><span>خدمة {String(index + 1).padStart(2, "0")}</span><button className="icon-button-danger" type="button" aria-label="حذف الخدمة" onClick={() => setContent((current) => ({ ...current, services: current.services.filter((_, itemIndex) => itemIndex !== index) }))}><CloseIcon width={17} height={17} /></button></div><div className="draft-grid"><label className="field-label"><span>الاسم بالعربية</span><input value={service.title} onChange={(event) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) }))} /></label><label className="field-label"><span>الاسم بالإنجليزية</span><input value={service.titleEn} onChange={(event) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, titleEn: event.target.value } : item) }))} /></label><label className="field-label"><span>الوصف بالعربية</span><textarea rows={3} value={service.description} onChange={(event) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) }))} /></label><label className="field-label"><span>الوصف بالإنجليزية</span><textarea rows={3} value={service.descriptionEn} onChange={(event) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, descriptionEn: event.target.value } : item) }))} /></label></div></article>)}</div><SaveButton disabled={!canSave} state={saveState} onClick={save} /></div>}</> : null}
        {section === "projects" ? <><PanelHeader title="المشاريع." description="أضف رابط ملف Google Drive أو عدّل اسم مشروع. الحذف يزيله من معرض الأعمال." />{loading ? <p>جارٍ تحميل المحتوى...</p> : <div className="studio-card projects-card"><div className="card-topline"><span>{content.projects.length} مشروعًا منشورًا</span><span>Google Drive</span></div><div className="draft-grid project-add-form"><label className="field-label"><span>اسم المشروع</span><input value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="مثال: تصميم غرفة معيشة" /></label><label className="field-label"><span>رابط ملف Drive</span><input dir="ltr" value={newProjectUrl} onChange={(event) => setNewProjectUrl(event.target.value)} placeholder="https://drive.google.com/file/d/..." /></label><button className="button button-dark" type="button" onClick={() => { const match = newProjectUrl.match(/\/d\/([\w-]+)/) || newProjectUrl.match(/[?&]id=([\w-]+)/); if (!match || !newProjectName.trim()) { setSaveState("error"); setSaveMessage("أدخل اسم المشروع ورابط ملف Google Drive صحيحًا."); return; } const id = match[1]; setContent((current) => ({ ...current, projects: [...current.projects, { id, fileName: newProjectName.trim(), category: "archive", imageUrl: `/api/drive?id=${id}&size=800`, sourceUrl: `https://drive.google.com/file/d/${id}/view?usp=sharing` }] })); setNewProjectName(""); setNewProjectUrl(""); setSaveState("idle"); setSaveMessage("أضيف المشروع إلى القائمة. احفظ التغييرات لنشره."); }}><PlusIcon width={16} height={16} /> إضافة مشروع</button></div><div className="studio-edit-list">{content.projects.map((project, index) => <article className="studio-edit-row" key={`${project.id}-${index}`}><div><strong>{project.fileName}</strong><small>{project.id}</small></div><label className="field-label"><span>اسم المشروع</span><input value={project.fileName} onChange={(event) => setContent((current) => ({ ...current, projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, fileName: event.target.value } : item) }))} /></label><a href={project.sourceUrl} target="_blank" rel="noreferrer" aria-label="فتح الملف"><ExternalLinkIcon width={15} height={15} /></a><button className="icon-button-danger" type="button" aria-label="حذف المشروع" onClick={() => setContent((current) => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))}><CloseIcon width={17} height={17} /></button></article>)}</div><SaveButton disabled={!canSave} state={saveState} onClick={save} /></div>}</> : null}
        {!canSave && authenticated ? <div className="studio-info-banner"><LockIcon width={17} height={17} /><span>للحفظ على الموقع المنشور، أضف متغيرات <code>GITHUB_CONTENT_*</code> في إعدادات الاستضافة. يمكنك التحرير الآن لكن يلزم ربط التخزين قبل الحفظ.</span></div> : null}
      </section>
    </div>
  </main>;
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return <div className="studio-panel-header"><div><span className="section-kicker">OWNER / EDITOR</span><h2>{title}</h2></div><p>{description}</p></div>;
}

function SaveButton({ disabled, state, onClick }: { disabled: boolean; state: string; onClick: () => void }) {
  return <div className="studio-save-row"><span>{state === "saving" ? "جارٍ حفظ التعديلات..." : "راجع المحتوى قبل الحفظ؛ سيظهر للزوار بعد الحفظ."}</span><button className="button button-dark" type="button" disabled={disabled || state === "saving"} onClick={onClick}>{state === "saving" ? "جارٍ الحفظ" : "حفظ التغييرات"}<CheckIcon width={16} height={16} /></button></div>;
}
