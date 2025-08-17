// src/app/legal/[policy]/page.tsx
import { notFound } from 'next/navigation'
import LegalPolicies from '@/app/components/PolicyComponent'

// Your legal policies data - replace with your actual content
const legalPolicies = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `Terms of Service

Last Updated: December 2024

1. Acceptance of Terms
By accessing and using FinancialGurkha ("Service"), you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily download one copy of the materials on our platform for personal, non-commercial transitory viewing only.

3. User Accounts
You are responsible for safeguarding the password and for all activities under your account.

4. Content Policy
Users are responsible for the content they post. We reserve the right to remove content that violates our guidelines.

5. Privacy
Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.

6. Termination
We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability.

7. Disclaimer
The materials on our platform are provided on an 'as is' basis. We make no warranties, expressed or implied.

8. Limitations
In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use the materials.

9. Governing Law
These terms and conditions are governed by and construed in accordance with applicable laws.

10. Contact Information
If you have any questions about these Terms, please contact us at legal@financialgurkha.com.

// REPLACE THIS SECTION WITH YOUR ACTUAL TERMS OF SERVICE CONTENT`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `Privacy Policy

Last Updated: December 2024

1. Information We Collect
We collect information you provide directly to us, such as account information, profile information, and content you create.

2. Information Collected Automatically
When you use our Service, we automatically collect device information, usage information, and location information.

3. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services.

4. Information Sharing and Disclosure
We may share your information with your consent, to comply with laws, or to protect rights and safety.

5. Data Security
We implement appropriate security measures to protect your personal information.

6. Data Retention
We retain your information for as long as your account is active or as needed to provide services.

7. Your Rights
You have the right to access, update, or delete your personal information.

8. Cookies and Tracking Technologies
We use cookies and similar technologies to collect information about your browsing activities.

9. Third-Party Services
Our Service may contain links to third-party websites or services that are not owned or controlled by us.

10. Changes to Privacy Policy
We may update this Privacy Policy from time to time.

11. Contact Us
If you have questions about this Privacy Policy, please contact us at privacy@financialgurkha.com.

// REPLACE THIS SECTION WITH YOUR ACTUAL PRIVACY POLICY CONTENT`,
  },
  {
    id: 'eula',
    title: 'End User License Agreement',
    content: `End User License Agreement (EULA)

Last Updated: December 2024

1. Grant of License
Subject to the terms of this Agreement, we grant you a limited, non-exclusive, non-transferable license to use our software and services.

2. License Restrictions
You agree NOT to copy, modify, reverse engineer, or redistribute the software.

3. Ownership
The software and all intellectual property rights therein remain our exclusive property.

4. User Data and Content
You retain ownership of content you create using our software.

5. Updates and Modifications
We may provide updates, patches, or new versions.

6. Support and Maintenance
Support is provided at our discretion.

7. Warranty Disclaimer
THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.

8. Limitation of Liability
IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.

9. Termination
This license is effective until terminated.

10. Export Restrictions
You acknowledge that the software may be subject to export restrictions.

11. Governing Law
This Agreement is governed by applicable laws.

12. Entire Agreement
This Agreement constitutes the entire agreement between you and us.

13. Contact Information
For questions regarding this EULA, contact us at legal@financialgurkha.com.

// REPLACE THIS SECTION WITH YOUR ACTUAL EULA CONTENT`,
  },
  {
    id: 'copyright',
    title: 'Copyright and Trademark Policy',
    content: `Copyright and Trademark Policy


Copyright and Trademark Policy
Last Updated: August, 2025

1. Introduction
At Financial Gurkha (“Strum Collective”), we respect the intellectual property rights of others and expect our users to do the same. This Copyright and Trademark Policy governs the use of content on our Services and outlines the rules regarding copyrighted materials, trademarks, and the use of our logos and branding assets.

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
  params: {
    policy: string
  }
}

export default function LegalPage({ params }: LegalPageProps) {
  const { policy } = params

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
