import { motion } from 'framer-motion';
import { FiArrowLeft, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiShield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              CS Jargon Platform ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our platform.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>We may collect personal information that you provide to us, including:</p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information (bio, avatar, preferences)</li>
              <li>Educational information (courses enrolled, progress, grades)</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you use the Platform, we automatically collect certain information:</p>
            <ul>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages viewed, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log files and analytics data</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and manage your account</li>
              <li>Send you updates, newsletters, and promotional materials</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li>
                <strong>With Instructors:</strong> Course instructors can see your name, email,
                and course progress
              </li>
              <li>
                <strong>With Service Providers:</strong> Third-party vendors who perform services
                on our behalf
              </li>
              <li>
                <strong>For Legal Purposes:</strong> When required by law or to protect our
                rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                sale of assets
              </li>
              <li>
                <strong>With Your Consent:</strong> When you explicitly agree to share your
                information
              </li>
            </ul>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Platform
              and hold certain information. You can instruct your browser to refuse all cookies
              or to indicate when a cookie is being sent.
            </p>

            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect
              your personal information. However, no method of transmission over the internet or
              electronic storage is 100% secure.
            </p>

            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our Platform is not intended for children under 13 years of age. We do not
              knowingly collect personal information from children under 13. If you believe we
              have collected information from a child under 13, please contact us immediately.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on computers located outside
              of your state, province, country, or other governmental jurisdiction where data
              protection laws may differ from those in your jurisdiction.
            </p>

            <h2>10. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy, unless a longer retention period is
              required or permitted by law.
            </p>

            <h2>11. Third-Party Links</h2>
            <p>
              Our Platform may contain links to third-party websites. We are not responsible for
              the privacy practices or content of these third-party sites.
            </p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Last
              updated" date.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>Email: privacy@csjargon.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Education Street, Learning City, LC 12345</li>
            </ul>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                We are committed to protecting your privacy and being transparent about our data
                practices. If you have any concerns or questions about how we handle your
                information, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;