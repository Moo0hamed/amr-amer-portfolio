"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page">
      <span className="eyebrow">AMR / 500</span>
      <h1>حدث خطأ غير متوقع.</h1>
      <p>يمكنك المحاولة مرة أخرى، أو العودة إلى الصفحة الرئيسية.</p>
      <button className="button button-dark" type="button" onClick={() => reset()}>المحاولة مرة أخرى <span aria-hidden="true">↗</span></button>
    </main>
  );
}
