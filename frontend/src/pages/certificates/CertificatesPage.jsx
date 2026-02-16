import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import EmptyState from '@components/common/EmptyState';
import { FiAward, FiDownload, FiShare2, FiExternalLink } from 'react-icons/fi';
import { formatDate } from '@utils/formatters';

function CertificatesPage() {
  // Mock data
  const certificates = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      course: 'Data Structures & Algorithms',
      type: 'course_completion',
      issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      score: 95,
      grade: 'A',
      certificateNumber: 'CS-DSA-2024-001',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      course: 'Web Development Fundamentals',
      type: 'course_completion',
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      score: 88,
      grade: 'B+',
      certificateNumber: 'CS-WEB-2024-002',
    },
    {
      id: 3,
      title: 'Perfect Attendance Award',
      course: 'All Courses',
      type: 'achievement',
      issueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      certificateNumber: 'CS-ATT-2024-003',
    },
  ];

  const handleDownload = (certificate) => {
    // Download logic
    console.log('Downloading certificate:', certificate.id);
  };

  const handleShare = (certificate) => {
    // Share logic
    console.log('Sharing certificate:', certificate.id);
  };

  const CertificateCard = ({ certificate }) => (
    <Card hover>
      <div className="space-y-4">
        {/* Certificate Preview */}
        <div className="aspect-[1.414/1] bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          <div className="relative text-center text-white p-8">
            <FiAward className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold mb-2">
              Certificate of Completion
            </h3>
            <p className="text-lg opacity-90">{certificate.title}</p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {certificate.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {certificate.course}
              </p>
            </div>
            <Badge
              variant={
                certificate.type === 'course_completion'
                  ? 'success'
                  : 'info'
              }
            >
              {certificate.type === 'course_completion' ? 'Course' : 'Achievement'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Issue Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(certificate.issueDate)}
              </p>
            </div>
            {certificate.score && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Score</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {certificate.score}% ({certificate.grade})
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Certificate ID: {certificate.certificateNumber}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link to={`/certificates/${certificate.id}`}>
            <Button variant="outline" size="small" fullWidth>
              <FiExternalLink className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="small"
            onClick={() => handleDownload(certificate)}
            fullWidth
          >
            <FiDownload className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => handleShare(certificate)}
            fullWidth
          >
            <FiShare2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            My Certificates
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your earned certificates
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiAward className="w-6 h-6 text-success-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {certificates.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Certificates
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiAward className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {certificates.filter(c => c.type === 'course_completion').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Course Completions
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiAward className="w-6 h-6 text-warning-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {certificates.filter(c => c.type === 'achievement').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Achievements
            </p>
          </div>
        </Card>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <EmptyState
          icon={FiAward}
          title="No certificates yet"
          description="Complete courses to earn certificates and showcase your achievements."
          actionLabel="Browse Courses"
          onAction={() => {}}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiAward className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Share Your Achievements
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Showcase your certificates on LinkedIn, add them to your resume, or share them with potential employers. All certificates are verifiable with unique certificate IDs.
            </p>
            <Button variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CertificatesPage;