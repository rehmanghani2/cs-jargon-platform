import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiDownload,
  FiShare2,
  FiPrinter,
  FiAward,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { useApi } from '@hooks/useApi';
import  certificateApi  from '@api/certificateApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Loader from '@components/common/Loader';
import { formatDate } from '@utils/formatters';
import toast from 'react-hot-toast';

const CertificateViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const { loading, execute } = useApi(certificateApi.getCertificateById);

  useEffect(() => {
    loadCertificate();
  }, [id]);

  const loadCertificate = async () => {
    try {
      const data = await execute(id);
      setCertificate(data);
    } catch (error) {
      toast.error('Failed to load certificate');
      navigate('/certificates');
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await certificateApi.downloadCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificateNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded!');
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `I earned a certificate in ${certificate.course.title}!`;

    switch (platform) {
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Certificate Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The certificate you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/certificates')}>
            Back to Certificates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button
          onClick={() => navigate('/certificates')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Certificates</span>
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="small" onClick={handlePrint} leftIcon={<FiPrinter />}>
            Print
          </Button>
          <Button variant="outline" size="small" onClick={handleDownload} leftIcon={<FiDownload />}>
            Download PDF
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowShareModal(!showShareModal)}
            leftIcon={<FiShare2 />}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Share Options */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 print:hidden"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Share on social media:
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => handleShare('linkedin')}
              leftIcon={<FaLinkedin />}
            >
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => handleShare('twitter')}
              leftIcon={<FaTwitter />}
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => handleShare('facebook')}
              leftIcon={<FaFacebook />}
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => handleShare('copy')}
              leftIcon={<FiShare2 />}
            >
              Copy Link
            </Button>
          </div>
        </motion.div>
      )}

      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-4 border-blue-600 dark:border-blue-500 overflow-hidden"
      >
        {/* Certificate Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <FiAward className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Certificate of Completion</h1>
          <p className="text-blue-100">CS Jargon Platform</p>
        </div>

        {/* Certificate Body */}
        <div className="p-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            This is to certify that
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {certificate.student.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            has successfully completed the course
          </p>
          <h3 className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-8">
            {certificate.course.title}
          </h3>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Issue Date</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatDate(certificate.issuedDate)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Final Score</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {certificate.score}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grade</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {certificate.grade}
              </p>
            </div>
          </div>

          {/* Certificate Number */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">Certificate Number</p>
            <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
              {certificate.certificateNumber}
            </p>
          </div>

          {/* Verification */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <FiCheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Verified Certificate</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Verify this certificate at: {window.location.origin}/verify/{certificate.certificateNumber}
            </p>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="px-12 py-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">Issued by</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                CS Jargon Platform
              </p>
            </div>
            {certificate.instructor && (
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Instructor</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {certificate.instructor.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Additional Info */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 print:hidden">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          About This Certificate
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This certificate verifies that {certificate.student.name} has successfully completed
          the course "{certificate.course.title}" with a score of {certificate.score}%.
          The certificate can be verified online using the certificate number shown above.
        </p>
      </div>
    </div>
  );
};

export default CertificateViewPage;