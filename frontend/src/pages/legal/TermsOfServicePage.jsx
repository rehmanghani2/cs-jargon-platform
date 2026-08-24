import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CS Jargon Platform ("the Platform"), you accept and agree
              to be bound by the terms and provision of this agreement. If you do not agree to
              these Terms of Service, please do not use the Platform.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials (information or
              software) on CS Jargon Platform for personal, non-commercial transitory viewing
              only. This is the grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>
                Attempt to decompile or reverse engineer any software contained on the Platform
              </li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person</li>
            </ul>

            <h2>3. User Accounts</h2>
            <p>
              To access certain features of the Platform, you may be required to create an
              account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>
                Maintain the security of your password and accept all risks of unauthorized
                access
              </li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2>4. User Content</h2>
            <p>
              Users may post, upload, or otherwise contribute content to the Platform ("User
              Content"). You retain all rights to your User Content, but you grant us a
              worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute
              your User Content in connection with the Platform.
            </p>

            <h2>5. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for any illegal purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Upload viruses or malicious code</li>
              <li>Spam, phish, or engage in similar activities</li>
              <li>Interfere with the proper functioning of the Platform</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              The Platform and its original content (excluding User Content), features, and
              functionality are owned by CS Jargon Platform and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h2>7. Course Enrollment and Access</h2>
            <p>
              When you enroll in a course, you are granted access to the course materials for
              the duration specified in the course description. Course access may be revoked if
              you violate these Terms of Service.
            </p>

            <h2>8. Certificates</h2>
            <p>
              Certificates of completion are issued based on successful course completion.
              Certificates are for educational purposes only and do not constitute professional
              accreditation or certification.
            </p>

            <h2>9. Disclaimer</h2>
            <p>
              The materials on CS Jargon Platform are provided on an 'as is' basis. We make no
              warranties, expressed or implied, and hereby disclaim and negate all other
              warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property.
            </p>

            <h2>10. Limitations</h2>
            <p>
              In no event shall CS Jargon Platform or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or profit, or due to
              business interruption) arising out of the use or inability to use the materials
              on the Platform.
            </p>

            <h2>11. Privacy</h2>
            <p>
              Your use of the Platform is also governed by our Privacy Policy. Please review
              our Privacy Policy to understand our practices.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify
              users of any material changes. Your continued use of the Platform after such
              modifications constitutes your acceptance of the updated terms.
            </p>

            <h2>13. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Platform
              immediately, without prior notice or liability, under our sole discretion, for
              any reason whatsoever, including without limitation if you breach the Terms of
              Service.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with applicable laws,
              without regard to its conflict of law provisions.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul>
              <li>Email: legal@csjargon.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Education Street, Learning City, LC 12345</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;