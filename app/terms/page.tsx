import type { Metadata } from "next";
import LegalPage from "../legal-page";
import styles from "../legal.module.css";

export const metadata: Metadata = { title: "Terms of Service · ReachPulse", description: "Terms for using the ReachPulse agency messaging workspace." };

export default function TermsPage() {
  return <LegalPage title="Terms of Service" intro="These terms cover use of the ReachPulse workspace for managing WhatsApp Business accounts, contacts, templates, and campaigns. By accessing the service, you agree to follow these terms.">
    <section className={styles.section}><h2>Accounts and workspaces</h2><p>Keep your sign-in details secure and use the service only for an agency or business you are authorized to represent. Workspace owners are responsible for inviting the right people and assigning roles that match their work. You are responsible for activity performed using your account.</p></section>
    <section className={styles.section}><h2>Contact data and messaging permission</h2><p>You must have the necessary rights and documented permission before importing or messaging a contact. You must honor opt-outs promptly, use approved message templates when required, and comply with applicable privacy, marketing, consumer-protection, and WhatsApp/Meta rules. Do not use ReachPulse to send unsolicited bulk messages, evade enforcement, or upload data you are not authorized to use.</p><p>If you manage workspaces for clients, you are responsible for ensuring that each client has authorized your use of its data and WhatsApp account.</p></section>
    <section className={styles.section}><h2>WhatsApp and third-party services</h2><p>Connecting a number requires authorization through Meta’s official WhatsApp Embedded Signup and remains subject to Meta’s review, permissions, account eligibility, and policies. ReachPulse cannot guarantee account approval, message delivery, template approval, or uninterrupted availability of Meta or other providers. Provider fees and limits may apply independently.</p></section>
    <section className={styles.section}><h2>Your content and account security</h2><p>You keep responsibility for the contact data, message content, and templates you submit. You authorize ReachPulse to process that content only as needed to operate the features you request. Do not share passwords, app secrets, access tokens, or other credentials with teammates through campaign content or support messages.</p></section>
    <section className={styles.section}><h2>Misuse and access changes</h2><p>We may limit or suspend access where reasonably necessary to protect users, investigate suspected abuse, respond to a security issue, or comply with law or a provider requirement. You may stop using the service and request account or workspace data deletion using the <a className={styles.email} href="/data-deletion">data deletion instructions</a>.</p></section>
    <section className={styles.section}><h2>Updates and questions</h2><p>We may update these terms as the service changes. The effective date above identifies the latest version. Continued use after an update means you accept the revised terms. Questions about these terms can be sent to <a className={styles.email} href="mailto:belic.info.pk@gmail.com">belic.info.pk@gmail.com</a>.</p></section>
  </LegalPage>;
}

