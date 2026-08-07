// src/app/legal/[policy]/page.tsx
import { notFound } from 'next/navigation'
import LegalPolicies from '@/app/components/PolicyComponent'

/**
 * Legal policies for Financial Gurkha.
 *
 * These were previously boilerplate carried over from an unrelated product
 * ("Strum — Vibe Together"), including its contact address. An AI visibility
 * audit found assistants citing that inconsistency as evidence the site was an
 * immature personal project. Legal pages are read by models and by anyone
 * evaluating whether a publication is real, so they are rewritten here to
 * describe this publication accurately.
 *
 * Not a substitute for review by a qualified lawyer.
 */

const CONTACT = 'contact@kanchanksharma.com'
const LAST_UPDATED = 'August 7, 2026'

const legalPolicies = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `Terms of Service

Financial Gurkha — Terms of Service
Last updated: ${LAST_UPDATED}

1. Introduction
Financial Gurkha (financialgurkha.com) is an independent markets research publication operated from New York City by Kanchan Sharma (the "Publisher", "we", "us"). By accessing or using this website (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, please do not use the Site.

2. Nature of the Content — Please Read This Section
All content on the Site is published for educational and informational purposes only.

Nothing on this Site is investment advice, financial advice, legal advice, tax advice, or a recommendation, offer or solicitation to buy or sell any security or other financial instrument.

Financial Gurkha is not a registered investment adviser, broker-dealer, or financial planner, and is not registered with or licensed by the U.S. Securities and Exchange Commission, FINRA, or any state securities regulator. We do not provide personalised investment advice, do not manage client assets, and do not have discretion over any account.

Valuations, price targets, fair-value estimates and forecasts published on the Site are opinions derived from publicly available information and stated assumptions. They are not statements of fact, are subject to significant uncertainty, and may prove wrong. Different assumptions produce different results. You should independently verify any figure before relying on it.

Investing involves risk, including the risk of losing your entire investment. Past performance does not indicate future results. You are solely responsible for your own investment decisions and should consult a licensed financial adviser who knows your circumstances.

3. Eligibility
You must be at least 18 years old to use this Site. By using the Site you represent that you are at least 18 and that your use complies with all laws applicable to you.

4. Commissioned Research and Consultations
Where the Publisher provides commissioned research, valuations or consultations, these services are educational and analytical in nature. Scope, deliverables and fees are agreed in writing before work begins. Commissioned work is likewise not personalised investment advice, and the client retains full responsibility for any decision taken on the basis of it. Deliverables are provided for the client's own use and may not be resold or redistributed without written permission.

5. Intellectual Property
All original content on the Site — articles, valuations, analysis, models, photography and design — is the property of the Publisher and is protected by copyright. Financial data and quotations reproduced from SEC filings, company disclosures and other primary sources remain the property of their respective owners and are used for reporting and commentary.

You may quote brief excerpts with clear attribution and a link to the original article. You may not republish articles in full, or use the content to train commercial machine-learning models, without written permission.

6. Third-Party Links and Advertising
The Site links to third-party sources, including SEC filings and company investor-relations pages, and displays advertising served by third parties including Google AdSense. We do not control and are not responsible for third-party content, products or privacy practices.

7. Accuracy and Corrections
We source figures from primary filings and show our arithmetic where we derive a number. Errors are nonetheless possible. Where a material error is identified, we correct the article and note the correction. To report an error, write to ${CONTACT}.

8. Disclaimer of Warranties
The Site is provided "as is" and "as available", without warranties of any kind, express or implied, including accuracy, completeness, merchantability or fitness for a particular purpose.

9. Limitation of Liability
To the fullest extent permitted by law, the Publisher shall not be liable for any direct, indirect, incidental, consequential or punitive damages — including trading or investment losses — arising from your use of the Site or reliance on its content.

10. Changes to These Terms
We may update these Terms from time to time. Changes take effect when posted, and the "last updated" date above will change. Continued use of the Site constitutes acceptance.

11. Governing Law
These Terms are governed by the laws of the State of New York, without regard to conflict-of-law principles.

12. Contact
Questions about these Terms: ${CONTACT}`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `Privacy Policy

Financial Gurkha — Privacy Policy
Last updated: ${LAST_UPDATED}

1. Scope
This policy explains what information financialgurkha.com collects and how it is used.

2. What We Collect
We do not require an account to read the Site, and we do not ask for personal information in order to publish to you.

Analytics. We use Google Analytics 4 and PostHog to understand how articles are read — pages viewed, approximate reading depth and time, device type, and approximate location derived from IP address. This data is used in aggregate to improve the writing and the site. Visits from automated clients and from non-production environments are excluded. PostHog session recordings are enabled with all form inputs masked.

Advertising. We display advertising through Google AdSense. Google and its partners may use cookies and device identifiers to serve and measure ads, including personalised advertising where permitted. You can review and control this at google.com/settings/ads and adssettings.google.com.

Correspondence. If you email us — for example to request a consultation or commission research — we retain that correspondence in order to reply and to carry out the work.

3. What We Do Not Do
We do not sell your personal information. We do not build advertising profiles ourselves. We do not require registration to read.

4. Cookies
Cookies are used by our analytics and advertising providers as described above. Most browsers let you refuse or delete cookies; the Site remains readable if you do.

5. Your Rights
Depending on where you live, you may have rights to access, correct, delete or restrict processing of your personal data, and to opt out of sale or sharing of personal information. Residents of the EEA/UK (GDPR) and California (CCPA/CPRA) have such rights. To exercise them, write to ${CONTACT}.

6. Children
The Site is not directed to children under 13 and we do not knowingly collect their information.

7. Data Retention
Analytics data is retained according to the providers' settings — currently up to 14 months in Google Analytics. Email correspondence is retained as long as needed for the purpose it was sent.

8. International Transfers
Our analytics and hosting providers may process data in the United States and other countries.

9. Changes
Material changes to this policy will be posted here with an updated date.

10. Contact
Privacy questions: ${CONTACT}`,
  },
  {
    id: 'editorial',
    title: 'Editorial Standards & Methodology',
    content: `Editorial Standards and Methodology

Financial Gurkha
Last updated: ${LAST_UPDATED}

Who publishes this
Financial Gurkha is an independent markets research publication founded in 2022 and operated from New York City by Kanchan Sharma, who holds a bachelor's degree in financial economics from St. John's University. There is no outside ownership, no sponsor, and no institutional affiliation. Where other contributors write, they are named on the article.

Where our numbers come from
Every financial figure we publish is taken from a primary source: SEC filings (10-K, 10-Q, 8-K), company earnings releases, investor presentations, earnings-call transcripts, or official statistical releases from bodies such as the Federal Reserve, the Bureau of Economic Analysis and the SEC. We name the source and, where practical, link to it.

We do not republish figures from other financial media without going back to the underlying filing.

Where we derive a figure
Some of the most useful numbers are not printed in a filing — incremental margin, free cash flow margin, segment share, implied growth rates. Where we calculate rather than quote, we say so and show the arithmetic so the reader can check it. Estimates are labelled as estimates.

How valuations are built
Discounted cash flow valuations are opinions supported by arithmetic, not statements of fact. Every model rests on assumptions — growth, margins, reinvestment and discount rate — and reasonable people choose different ones. We state our assumptions explicitly. A valuation's usefulness lies in whether the reasoning is transparent enough for you to disagree with it.

We do not publish price targets as though they were predictions, and we do not claim a forecasting track record we have not documented.

Conflicts of interest
Where the author holds, intends to hold, or has any other interest in a security discussed, that is disclosed in the article itself, prominently and before the analysis. We would rather tell you about a bias than pretend to an objectivity nobody has.

We accept no payment from any company in exchange for coverage, and no company reviews an article before publication. Advertising on the Site is served programmatically by Google AdSense and has no relationship to editorial content. Commissioned research for clients is separate from published articles, and clients do not influence what we publish.

Corrections
Where we get something wrong, we correct the article and note what changed. To report an error, write to ${CONTACT}. Errors of fact are corrected as quickly as we can verify them.

Use of AI tools
We use AI tools in research and drafting — for reading long filings, checking arithmetic and structuring drafts. Every figure published is verified against the primary source by a human, and the editorial judgement, the argument and the conclusions are the author's. We think it is more honest to tell you this than to leave it unsaid.

What this publication is not
We are not a registered investment adviser and do not provide personalised investment advice. We do not manage money. We are not a real-time data service, and we do not cover every company or every quarter. We write in depth about a small number of situations rather than briefly about many.

Contact
${CONTACT}`,
  },
  {
    id: 'copyright',
    title: 'Copyright and Trademark Policy',
    content: `Copyright and Trademark Policy

Financial Gurkha
Last updated: ${LAST_UPDATED}

1. Our Content
Original articles, valuations, financial models, analysis, photography and site design published on financialgurkha.com are the copyright of Kanchan Sharma unless otherwise stated.

2. Permitted Use
You may quote brief excerpts for commentary, criticism, news reporting or research, provided you attribute the work to Financial Gurkha and link to the original article.

You may not republish whole articles, mirror the Site, or use its content to train commercial machine-learning models without prior written permission.

3. Third-Party Material
Financial data, filing excerpts and tables reproduced from SEC filings, company disclosures and government statistical releases remain the property of their respective owners and are reproduced for reporting and commentary. Company names, logos and ticker symbols are trademarks of their respective owners, used for identification only. Their use does not imply any affiliation with or endorsement by those companies.

4. Reporting Infringement
If you believe material on this Site infringes your copyright, send a notice to ${CONTACT} including: identification of the copyrighted work; identification of the material you say is infringing and where it appears; your contact details; a statement that you have a good-faith belief the use is not authorised; and a statement, under penalty of perjury, that the information is accurate and that you are authorised to act for the copyright owner.

We remove or disable material that is properly shown to be infringing.

5. Counter-Notice
If your material was removed and you believe that was in error, you may send a counter-notice to the same address.

6. Contact
${CONTACT}`,
  },
]

type LegalPageProps = {
  params: Promise<{
    policy: string
  }>
}

const VALID_POLICIES = ['terms', 'privacy', 'editorial', 'copyright']

export async function generateMetadata({ params }: LegalPageProps) {
  const { policy } = await params
  const found = legalPolicies.find((p) => p.id === policy)
  if (!found) return { title: 'Not found' }

  return {
    title: found.title,
    description:
      policy === 'editorial'
        ? 'How Financial Gurkha sources figures, builds valuations, discloses conflicts of interest and handles corrections. Independent markets research, New York City.'
        : `${found.title} for Financial Gurkha, an independent markets research publication based in New York City.`,
    alternates: { canonical: `https://financialgurkha.com/legal/${policy}` },
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { policy } = await params

  if (!VALID_POLICIES.includes(policy)) {
    notFound()
  }

  return <LegalPolicies policies={legalPolicies} activePolicy={policy} />
}

// Generate static params for the legal pages
export async function generateStaticParams() {
  return VALID_POLICIES.map((policy) => ({ policy }))
}
