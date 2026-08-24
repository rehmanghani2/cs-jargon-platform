import { motion } from 'framer-motion';
import { FiFile, FiDownload, FiClock, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { formatDate, formatTimeAgo } from '@utils/formatters';

const SubmissionView = ({
  submission,
  assignment,
  onDownloadFile,
  onAddComment,
  showGrading = false,
}) => {
  const {
    student,
    submittedAt,
    files = [],
    content,
    grade,
    feedback,
    status,
    lateSubmission,
    comments = [],
  } = submission;

  const statusConfig = {
    submitted: {
      variant: 'info',
      icon: FiCheckCircle,
      label: 'Submitted',
      color: 'text-blue-600 dark:text-blue-400',
    },
    graded: {
      variant: 'success',
      icon: FiCheckCircle,
      label: 'Graded',
      color: 'text-green-600 dark:text-green-400',
    },
    late: {
      variant: 'warning',
      icon: FiAlertCircle,
      label: 'Late Submission',
      color: 'text-orange-600 dark:text-orange-400',
    },
  };

  const currentStatus = lateSubmission ? 'late' : status;
  const config = statusConfig[currentStatus] || statusConfig.submitted;
  const StatusIcon = config.icon;

  const getGradeColor = (grade, maxPoints) => {
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Submission Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar src={student.avatar} name={student.name} size="large" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StatusIcon className={`w-4 h-4 ${config.color}`} />
                <Badge variant={config.variant}>{config.label}</Badge>
                {lateSubmission && (
                  <Badge variant="warning">Late</Badge>
                )}
              </div>
            </div>
          </div>
          {grade !== undefined && (
            <div className="text-right">
              <div className={`text-4xl font-bold ${getGradeColor(grade, assignment.points)}`}>
                {grade}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                / {assignment.points} points
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round((grade / assignment.points) * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* Submission Time */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            <span>Submitted {formatTimeAgo(submittedAt)}</span>
          </div>
          <span>•</span>
          <span>{formatDate(submittedAt)}</span>
          {lateSubmission && (
            <>
              <span>•</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                Submitted after deadline
              </span>
            </>
          )}
        </div>
      </div>

      {/* Submission Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Submission
        </h4>
        
        {content && (
          <div className="prose dark:prose-invert max-w-none mb-6">
            <div
              className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}

        {/* Attached Files */}
        {files.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Attached Files ({files.length})
            </h5>
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FiFile className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    leftIcon={<FiDownload />}
                    onClick={() => onDownloadFile && onDownloadFile(file)}
                  >
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiMessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Instructor Feedback
          </h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {feedback}
            </p>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comments ({comments.length})
          </h4>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <Avatar
                  src={comment.author.avatar}
                  name={comment.author.name}
                  size="medium"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Section (for instructors) */}
      {showGrading && status === 'submitted' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Grade Submission
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            This submission is pending grading. Click below to grade this assignment.
          </p>
          <Button variant="primary">
            Grade This Submission
          </Button>
        </div>
      )}
    </div>
  );
};

SubmissionView.propTypes = {
  submission: PropTypes.shape({
    student: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    submittedAt: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    content: PropTypes.string,
    grade: PropTypes.number,
    feedback: PropTypes.string,
    status: PropTypes.oneOf(['submitted', 'graded']).isRequired,
    lateSubmission: PropTypes.bool,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        author: PropTypes.shape({
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string,
        }).isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  assignment: PropTypes.shape({
    points: PropTypes.number.isRequired,
  }).isRequired,
  onDownloadFile: PropTypes.func,
  onAddComment: PropTypes.func,
  showGrading: PropTypes.bool,
};

export default SubmissionView;