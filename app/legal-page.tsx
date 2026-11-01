import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./legal.module.css";

type LegalPageProps = { title: string; intro: string; children: ReactNode };

export default function LegalPage({ title, intro, children }: LegalPageProps) {
  return <main className={styles.page}>
    <div className={styles.wrap}>
      <header className={styles.top}>
        <Link className={styles.brand} href="/login"><span className={styles.mark} aria-hidden="true">RP</span><span>ReachPulse</span></Link>
        <Link className={styles.home} href="/login">Sign in <span aria-hidden="true">→</span></Link>
      </header>
      <article className={styles.card}>
        <span className={styles.eyebrow}>ReachPulse · Legal</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Effective date: November 1, 2026</p>
        <p className={styles.intro}>{intro}</p>
        {children}
      </article>
      <nav className={styles.foot} aria-label="Legal pages">
        <Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/data-deletion">Data deletion</Link>
      </nav>
    </div>
  </main>;
}

