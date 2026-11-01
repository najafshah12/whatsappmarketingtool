import type { Metadata } from "next";
import LegalPage from "../legal-page";
import styles from "../legal.module.css";

export const metadata: Metadata = { title: "Data Deletion · ReachPulse", description: "How to request deletion of ReachPulse account and workspace data." };

export default function DataDeletionPage() {
  return <LegalPage title="Data Deletion Instructions" intro="You can request deletion of your ReachPulse account information or data held in an agency or client workspace.">
    <section className={styles.section}><h2>Request deletion by email</h2><p>Email <a className={styles.email} href="mailto:belic.info.pk@gmail.com?subject=ReachPulse%20data%20deletion%20request">belic.info.pk@gmail.com</a> with the subject “ReachPulse data deletion request.” Include:</p><ul><li>The email address used for the ReachPulse account.</li><li>The agency and client workspace name(s) involved.</li><li>Whether you want account deletion, workspace deletion, or specific contact records removed.</li><li>A reply address where we can confirm the request.</li></ul><p>Do not send a password, verification code, Meta app secret, or WhatsApp access token. We may ask for reasonable proof that you control the account or are authorized by the workspace owner.</p></section>
    <section className={styles.section}><h2>What happens next</h2><p>After verifying the request, we will remove or de-identify the relevant ReachPulse account or workspace records where feasible, including associated contacts, groups, campaign records, inbox data, and stored WhatsApp connection credentials. We may retain limited information where required for legal, security, or record-keeping purposes and during routine backup cycles; if so, we will explain the applicable limitation.</p></section>
    <section className={styles.section}><h2>Disconnect WhatsApp from Meta</h2><p>Deleting a ReachPulse connection removes its stored credential from ReachPulse, but may not remove business assets or permissions from Meta. To revoke those separately, remove ReachPulse or its app permissions in the relevant Meta Business settings. Meta may retain information under its own policies.</p></section>
    <section className={styles.section}><h2>Agency-managed data</h2><p>If a contact or client workspace belongs to an agency, contact that agency’s administrator first. The administrator can request removal for the workspace they control. ReachPulse may need the agency owner’s authorization before deleting shared workspace records.</p></section>
  </LegalPage>;
}

