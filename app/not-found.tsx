import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-page">
      <span className="eyebrow">AMR / 404</span>
      <h1>هذه الصفحة لم تُرسم بعد.</h1>
      <p>الرابط الذي تبحث عنه غير موجود أو تم نقله إلى مساحة أخرى.</p>
      <Link className="button button-dark" href="/">
        العودة إلى الاستوديو <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
