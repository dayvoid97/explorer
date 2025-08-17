// src/app/legal/[policy]/page.tsx
import { notFound } from 'next/navigation'
import LegalPolicies from '@/app/components/PolicyComponent'

// Your legal policies data - replace with your actual content
const legalPolicies = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `Terms of Service

Strum - Vibe Together Terms of Service
Last updated: February, 2025

1. Introduction
Welcome to the Strum- Vibe Together (the "Site"). By accessing or using our Site and our App Strum- Vibe Together, you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Site and Strum- Vibe Together App.

2. Use of the Site
You must be at least 18 years old to use this Site. By using the Site & Strum- Vibe Together App, you represent and warrant that you are at least 18 years old. You agree to use the Site & Strum- Vibe Together App in compliance with all applicable laws and regulations.

3. Privacy
We are committed to protecting your privacy. Our Privacy Policy, which can be foundhere, explains how we collect, use, and protect your personal data. By using the Site & Strum- Vibe Together App, you agree to the terms of our Privacy Policy.

4. Intellectual Property
All content on this Site, including text, graphics, logos, and images, is the property of Kanchan Sharma - All Rights Reserved or its content suppliers and is protected by intellectual property laws. You may not use any content from the Site without our prior written consent.

5. Disclaimer of Warranties
The Site and Strum- Vibe Together App is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Site or the information, content, or materials included on the Site. You expressly agree that your use of the Site and Sturm- Vibe Together App is at your sole risk.

6. Limitation of Liability
To the fullest extent permitted by law, the Site and Strum- Vibe Together App shall not be liable for any damages of any kind arising from the use of the Site and Strum- Vibe Together App or from any information, content, or materials included on the Site and the Strum- Vibe Together App.

7. Changes to the Terms
We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Site or the Strum- Vibe Together App . Your continued use of the Site and the Strum- Vibe Together App following the posting of changes constitutes your acceptance of such changes.

8. Governing Law
These Terms shall be governed by and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions.

9. Contact Information
If you have any questions about these Terms, please directly contact us via our email: strum.tips@gmail.com. You can also contact us via X , Telegram Group or the Warpcast Channel.



// REPLACE THIS SECTION WITH YOUR ACTUAL TERMS OF SERVICE CONTENT`,
  },

  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `Privacy Policy
    Strum - Vibe Together Privacy Policy
Last updated: February, 2025

1. Introduction
Welcome to Financial Gurkha Only Ws in the Chat ("we", "our", "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy, or our practices with regards to your personal information, please contact us at strum.tips@gmail.com.

2. Information We Collect
We collect personal information that you provide to us voluntarily when you register on the Site, express an interest in obtaining information about us or our products and services, when you participate in activities on the Site, or otherwise contact us.

Personal Information: Name, email address, phone number, etc.
Payment Data: Data necessary to process your payment if you make purchases, such as your payment instrument number (e.g., a credit card number), and the security code associated with your payment instrument.
Cookies and Tracking Technologies: We may use cookies and similar tracking technologies to access or store information.
3. How We Use Your Information
We use personal information collected via our Site for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.

To facilitate account creation and logon process.
To send you marketing and promotional communications.
To send administrative information to you.
Fulfill and manage your orders.
Request Feedback.
To protect our services.
To enforce our terms, conditions and policies.
To respond to legal requests and prevent harm.
4. Will Your Information Be Shared With Anyone?
We only share and disclose your information in the following situations:

Compliance with Laws.
Vital Interests and Legal Rights.
Vendors, Consultants and Other Third-Party Service Providers.
Business Transfers.
With your Consent.
5. Do We Use Cookies and Other Tracking Technologies?
We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.

6. How Long Do We Keep Your Information?
We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.

7. How Do We Keep Your Information Safe?
We aim to protect your personal information through a system of organizational and technical security measures.

8. What Are Your Privacy Rights?
In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.

9. Controls for Do-Not-Track Features
Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.

10. Do California Residents Have Specific Privacy Rights?
Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.

11. Updates to This Policy
We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.

12. Contact Us
If you have any questions about these Terms, please directly contact us via our email: strum.tips@gmail.com. You can also contact us via X , Telegram Group or the Warpcast Channel.


// REPLACE THIS SECTION WITH YOUR ACTUAL PRIVACY POLICY CONTENT`,
  },
  {
    id: 'eula',
    title: 'End User License Agreement',
    content: `End User License Agreement (EULA)

Financial Gurkha and Strum Collective End User License Agreement
Last updated: February, 2025

1. Your Relationship With Us
Welcome to Financial Gurkha a part of Strum Collective (the “Platform”), which is provided by Strum - Vibe Together in the United States (collectively such entities will be referred to as “Strum - Vibe Together”, “we” or “us”).

You are reading the terms of service (the “Terms”), which govern the relationship and serve as an agreement between you and us and set forth the terms and conditions by which you may access and use the Platform and our related websites, services, applications, products and content (collectively, the “Services”). Access to certain Services or features of the Services (such as, by way of example and not limitation, the ability to submit or share User Content) may be subject to age restrictions and not available to all users. Our Services are provided for private, non-commercial use. For purposes of these Terms, “you” and “your” means you as the user of the Services.

The Terms form a legally binding agreement between you and us. Please take the time to read them carefully. If you are under age 18, you may only use the Services with the consent of your parent or legal guardian. Please be sure your parent or legal guardian has reviewed and discussed these Terms with you.

2. Accepting the Terms
By accessing or using our Services, you confirm that you can form a binding contract with Strum - Vibe Together, that you accept these Terms and agree to comply with them. Your access and use of our Services is also subject to our Privacy Policy and Community Guidelines, which are incorporated herein by reference. If you are accessing or using the Services on behalf of a business or entity, you represent and warrant that you have the authority to bind the entity to these Terms.

You accept these Terms by accessing or using the Services. You should print or save a copy for your records.

3. Changes to the Terms
We may amend these Terms from time to time (e.g., when we update our Services or in response to regulatory changes). We will use commercially reasonable efforts to notify users of material changes. Your continued use of the Services after such changes constitutes your acceptance of the new Terms.

4. Your Account with Us
To access some of our Services, you must create an account and provide accurate, up-to-date information. You are responsible for keeping your account details confidential. We reserve the right to disable your account at any time if you fail to comply with these Terms.

If you wish to delete your account, you may do so via the Strum- Vibe Together App using the "Delete Account" feature in Account Settings or you can send us an email at strum.tips@gmail.com with subject "Account Deletion" . Once deleted, you cannot reactivate or retrieve any information from your account.

Please allow us up to 48 hours to respond to account deletion request.

5. Your Access to and Use of Our Services
Your use of the Services is subject to these Terms and applicable laws. You may not, for example, modify, reverse engineer, or distribute any part of the Services, use the Services for unauthorized commercial purposes, or interfere with their operation.

Do not access the Services if you are not legally capable.
Do not copy, modify, or create derivative works of the Services.
Do not use automated scripts to collect information.
Do not impersonate any person or entity.
Do not upload or transmit malicious content.
6. Intellectual Property Rights
We respect intellectual property rights. By using our Services, you agree to abide by our Copyright Policy.

7. Content
Strum - Vibe Together Content
All content, software, images, text, graphics, logos, and other materials (the “Strum - Vibe Together Content”) on the Services are either owned or licensed by us. Except for User Content (as defined below), no rights are transferred to you.

You acknowledge that we may generate revenue from your use of the Services, and unless expressly permitted, you will not share in such revenue.

Subject to these Terms, we grant you a non-exclusive, limited, non-transferable license to access and use the Services for your personal, non-commercial use. NO RIGHTS ARE LICENSED WITH RESPECT TO SOUND RECORDINGS AND THE MUSICAL WORKS EMBODIED THEREIN.

User-Generated Content
Users may upload or transmit content (e.g., text, photos, videos, audio) (“User Content”). You retain ownership of your User Content but grant us an irrevocable, non-exclusive, royalty-free license to use, modify, reproduce, distribute, and display it.

We reserve the right to remove or disable access to any User Content that violates these Terms.

8. Indemnity
You agree to indemnify and hold harmless Strum - Vibe Together, its affiliates, and their officers, directors, and employees from any claims arising from your breach of these Terms.

9. EXCLUSION OF WARRANTIES
The Services are provided “as is” without warranties of any kind. We do not guarantee that the Services will meet your requirements or be uninterrupted, secure, or error-free.

NO IMPLIED WARRANTIES (such as satisfactory quality or fitness for purpose) apply except as expressly stated.

10. LIMITATION OF LIABILITY
NOTHING IN THESE TERMS SHALL EXCLUDE OR LIMIT OUR LIABILITY FOR LOSSES THAT CANNOT BE LEGALLY EXCLUDED. Subject to applicable law, our total liability is limited to the amount you paid to us in the last 12 months. We are not liable for indirect, consequential, or incidental losses.

We shall not be responsible for any loss resulting from reliance on our Services, changes to the Services, or issues with your account or data.

11. Other Terms
Open Source: The Platform includes open source software subject to their own licenses.

Entire Agreement: These Terms constitute the entire agreement between you and Strum - Vibe Together and supersede all prior agreements.

Links: You may link to our homepage provided it is done fairly and legally.

No Waiver: Our failure to enforce any provision of these Terms does not constitute a waiver.

Security: While we take reasonable measures, we do not guarantee that our Services are secure.

Severability: If any provision is found invalid, the remaining Terms will continue in effect.

12. Dispute Resolution
A. Informal Resolution Process
In the event of a dispute, you and we agree to attempt to resolve the matter amicably. The dispute must be initiated by notifying the other party, who will have 60 days to respond. If unresolved, either party may initiate legal action.

B. Exclusive Venue
These Terms and any disputes arising from them will be governed by the laws of the State of California and resolved exclusively in the U.S. District Court for the Central District of California or the Superior Court of California, County of Los Angeles.

C. Limitation Period
Any legal proceeding must be initiated within one (1) year of the event giving rise to the dispute.

13. App Stores
The Platform may be downloaded from various app stores (Apple, Windows Phone, Amazon Appstore, Google Play). In case of conflicts, the app store’s terms shall apply.

14. Contact Us
You can reach us at: https://strum.tips/#feedback or email us at: strum.tips@gmail.com

// REPLACE THIS SECTION WITH YOUR ACTUAL EULA CONTENT`,
  },
  {
    id: 'copyright',
    title: 'Copyright and Trademark Policy',
    content: `Copyright and Trademark Policy


Copyright and Trademark Policy
Last Updated: August, 2025

1. Introduction
At Financial Gurkha Only Ws in the Chat (“Strum Collective”), we respect the intellectual property rights of others and expect our users to do the same. This Copyright and Trademark Policy governs the use of content on our Services and outlines the rules regarding copyrighted materials, trademarks, and the use of our logos and branding assets.

2. Ownership of Content
All content on our Services—including text, graphics, images, logos, audio, video, and software (collectively, the “Content”)—is either owned by Strum or licensed to us. Such Content is protected by copyright, trademark, and other intellectual property laws. Except as expressly provided in these Terms, no right, title, or interest in or to any Content is transferred to you.

3. User-Generated Content
When you submit or upload any content (“User Content”) to our Services, you represent and warrant that you either own the content or have all necessary rights and permissions from the original rights holders. By submitting User Content, you grant Strum an unconditional, irrevocable, non-exclusive, royalty-free, worldwide license to use, modify, reproduce, display, and distribute your User Content for the purposes of operating and promoting the Services.

Important: You are solely responsible for ensuring that your User Content does not infringe the copyrights, trademarks, or other intellectual property rights of any third party. Unauthorized use may subject you to legal liability, including potential claims by the original rights holder.

4. Copyright Infringement
If you believe that any material on our Services infringes your copyright or trademark rights, please notify us immediately. Your notice should include:

A description of the copyrighted or trademarked work that you claim has been infringed.
A description of the material you believe is infringing and its location on our Services.
Your contact information, including your name, address, telephone number, and email address.
A statement that you have a good faith belief that the disputed use is not authorized by the copyright or trademark owner, its agent, or the law.
A statement, under penalty of perjury, that the information in your notice is accurate and that you are either the copyright or trademark owner or authorized to act on the owner’s behalf.
Strum reserves the right to remove or disable access to any content that we determine, in our sole discretion, may infringe on the intellectual property rights of others. We assume no liability for any actions taken in response to such notices.

5. Logos and Branding
The logos, trademarks, service marks, and other brand features (collectively, the “Logos”) displayed on our Services are the exclusive property of Strum- Vibe Together or our licensors. They are protected by copyright, trademark, and other intellectual property laws.

Permitted Use: You may use our Logos solely to identify and promote the Services for non-commercial purposes, such as product awareness or marketing initiatives.

Restrictions: You may not alter, modify, or create derivative works of our Logos. You may not claim ownership or imply any endorsement or partnership with Strum by using our Logos. Unauthorized use of our Logos may result in legal action.


If you need to Logos for any extended purpose, you must first ask for permission. Reach us at strum.tips@gmail with email subject "Logos Extended Use Permission". We shall review your request and only after our permission reply you will be allowed to use for extended use. We do no necessarily guarantee a reply for any and all permission requests.

6. No Warranty; No Liability
All Content—including our Logos and all other intellectual property provided on or through our Services—is provided "as is" without any warranty of any kind, either express or implied. Strum does not guarantee the accuracy, completeness, or usefulness of any material, and your use of such materials is at your own risk.

Strum is not liable for any direct, indirect, incidental, or consequential damages arising from any infringement of intellectual property rights by User Content or the use of materials posted by third parties on our Services.

7. Indemnification
You agree to indemnify, defend, and hold harmless Strum, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, or expenses (including reasonable attorneys’ fees) arising out of or related to any breach of this Copyright and Trademark Policy or your use of our Services.

8. Modifications to This Policy
Strum reserves the right to modify or update this Copyright and Trademark Policy at any time. Any changes will be effective immediately upon posting the revised policy on our Services. Your continued use of our Services after such modifications will constitute your acceptance of the revised terms.

9. Contact Information
If you have any questions or concerns about this Copyright and Trademark Policy, or if you wish to report an infringement, please contact us with email subject "Strum Copyright Policy" at:

Email: [strum.tips@gmail.com]
// REPLACE THIS SECTION WITH YOUR ACTUAL COPYRIGHT POLICY CONTENT`,
  },
]

interface LegalPageProps {
  params: Promise<{
    policy: string
  }>
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { policy } = await params

  // Check if the policy exists
  const validPolicies = ['terms', 'privacy', 'eula', 'copyright']
  if (!validPolicies.includes(policy)) {
    notFound()
  }

  return <LegalPolicies policies={legalPolicies} activePolicy={policy} />
}

// Generate static params for the legal pages
export async function generateStaticParams() {
  return [{ policy: 'terms' }, { policy: 'privacy' }, { policy: 'eula' }, { policy: 'copyright' }]
}
