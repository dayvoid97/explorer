// src/app/legal/[policy]/page.tsx
'use client'
import { notFound } from 'next/navigation'
import LegalPolicies from '@/app/components/PolicyComponent'

// Your legal policies data - replace with your actual content
const legalPolicies = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `Terms of Service

Last Updated: ${new Date().toLocaleDateString()}

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

Last Updated: ${new Date().toLocaleDateString()}

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

Last Updated: ${new Date().toLocaleDateString()}

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

Last Updated: ${new Date().toLocaleDateString()}

1. Intellectual Property Rights
We respect the intellectual property rights of others and expect our users to do the same.

2. Copyright Policy
All content on this platform is our property or that of our licensors and is protected by copyright laws.

3. DMCA Notice and Takedown Procedure
If you believe your copyrighted work has been infringed, please provide the required information.

4. Counter-Notification Process
If you believe your content was removed in error, you may submit a counter-notification.

5. Trademark Policy
Our company name, logo, and product names are trademarks.

6. Repeat Infringer Policy
We will terminate accounts of users who repeatedly infringe intellectual property rights.

7. Fair Use and Educational Use
We recognize fair use and educational exceptions.

8. Reporting Trademark Violations
To report trademark violations, contact us with the required information.

9. International Copyright
We comply with international copyright treaties.

10. Content Licensing
Some content may be available under specific licenses.

11. Updates to Policy
We may update this policy to reflect changes in law or our practices.

12. Contact Information
For intellectual property matters, contact us at ip@financialgurkha.com.

13. Legal Action
We reserve the right to take legal action against infringers.

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
