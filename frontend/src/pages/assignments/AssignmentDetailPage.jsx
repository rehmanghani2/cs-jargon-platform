import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Tabs from '@components/common/Tabs';
import Modal from '@components/common/Modal';
import {
  FiArrowLeft,
  FiClock,
  FiFileText,
  FiDownload,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { formatDeadline, formatDate } from '@utils/formatters';

function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock data
  const assignment = {
    id: assignmentId,
    title: 'Binary Tree Implementation',
    course: 'Data Structures & Algorithms',
    description: 'Implement a binary search tree with the following operations: insert, delete, search, and traversal (inorder, preorder, postorder).',
    instructions: `
      1. Create a BinarySearchTree class with a Node inner class
      2. Implement the insert method to add nodes
      3. Implement the delete method to remove nodes
      4. Implement the search method to find nodes
      5. Implement all three traversal methods
      6. Include proper error handling
      7. Add comprehensive test cases
      8. Document your code with comments
    `,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    totalPoints: 100,
    status: 'pending',
    submitted: false,
    attachments: [
      { id: 1, name: 'Assignment_Template.zip', size: '2.5 MB', url: '#' },
      { id: 2, name: 'Test_Cases.txt', size: '15 KB', url: '#' },
    ],
    rubric: [
      { criteria: 'Code Quality & Style', points: 20 },
      { criteria: 'Insert Operation', points: 20 },
      { criteria: 'Delete Operation', points: 20 },
      { criteria: 'Search Operation', points: 15 },
      { criteria: 'Traversal Methods', points: 15 },
      { criteria: 'Test Cases', points: 10 },
    ],
    submission: null, // or submission data if exists
  };

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const canSubmit = !isOverdue && !assignment.submitted;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    // Submit assignment logic
    navigate('/assignments');
  };

  const detailsTab = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Description
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {assignment.description}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Instructions
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
            {assignment.instructions}
          </pre>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Requirements
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <FiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 dark:text-gray-400">
              Submit a single ZIP file containing all source code
            </span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 dark:text-gray-400">
              Include a README with setup and running instructions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 dark:text-gray-400">
              Code must be well-commented and follow best practices
            </span>
          </li>
        </ul>
      </div>

      {assignment.attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Attachments
          </h3>
          <div className="space-y-2">
            {assignment.attachments.map((file) => (
              <a
                key={file.id}
                href={file.url}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiFileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {file.size}
                    </p>
                  </div>
                </div>
                <FiDownload className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const rubricTab = (
    <div className="space-y-3">
      {assignment.rubric.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
        >
          <span className="text-gray-900 dark:text-white font-medium">
            {item.criteria}
          </span>
          <Badge variant="info">{item.points} points</Badge>
        </div>
      ))}
      <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-2 border-primary-200 dark:border-primary-800">
        <span className="font-semibold text-gray-900 dark:text-white">
          Total Points
        </span>
        <span className="text-xl font-bold text-primary-600">
          {assignment.totalPoints}
        </span>
      </div>
    </div>
  );

  const submissionTab = assignment.submitted ? (
    <div className="space-y-6">
      <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
        <div className="flex items-start gap-3">
          <FiCheckCircle className="w-5 h-5 text-success-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-success-900 dark:text-success-200 mb-1">
              Assignment Submitted
            </h3>
            <p className="text-sm text-success-800 dark:text-success-300">
              Submitted on {formatDate(assignment.submission?.submittedDate)}
            </p>
          </div>
        </div>
      </div>

      {assignment.submission?.score && (
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your Score
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {assignment.submission.score}/{assignment.totalPoints}
            </p>
            <Badge variant="success" className="mt-3">
              {assignment.submission.grade}
            </Badge>
          </div>
        </Card>
      )}

      {assignment.submission?.feedback && (
        <Card title="Instructor Feedback">
          <p className="text-gray-700 dark:text-gray-300">
            {assignment.submission.feedback}
          </p>
        </Card>
      )}
    </div>
  ) : (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center space-y-4">
          <FiUpload className="w-12 h-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Upload Your Assignment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select a file to upload (ZIP format recommended)
            </p>
          </div>
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".zip,.rar,.pdf"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" as="span">
              Choose File
            </Button>
          </label>
          {selectedFile && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-danger-600 hover:text-danger-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Comments (Optional)
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Add any comments or notes about your submission..."
        />
      </div>

      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={!selectedFile || !canSubmit}
        fullWidth
      >
        Submit Assignment
      </Button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/assignments"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      {/* Header */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {assignment.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {assignment.course}
              </p>
            </div>
            <Badge
              variant={
                assignment.submitted
                  ? 'success'
                  : isOverdue
                  ? 'danger'
                  : 'warning'
              }
            >
              {assignment.submitted
                ? 'Submitted'
                : isOverdue
                ? 'Overdue'
                : 'Pending'}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Due Date
              </p>
              <div className="flex items-center gap-2">
                <FiClock
                  className={`w-4 h-4 ${
                    isOverdue ? 'text-danger-600' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`font-medium ${
                    isOverdue
                      ? 'text-danger-600'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {formatDeadline(assignment.dueDate)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Points
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {assignment.totalPoints} points
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Status
              </p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {assignment.status.replace('_', ' ')}
              </p>
            </div>
          </div>

          {isOverdue && !assignment.submitted && (
            <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-danger-900 dark:text-danger-200 mb-1">
                    Assignment Overdue
                  </h3>
                  <p className="text-sm text-danger-800 dark:text-danger-300">
                    This assignment is past the due date. Late submissions may receive reduced credit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { label: 'Details', content: detailsTab },
          { label: 'Grading Rubric', content: rubricTab },
          { label: 'Submission', content: submissionTab },
        ]}
      />

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assignment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmSubmit}>
              Confirm Submission
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to submit this assignment? You won't be able to modify your submission after this.
          </p>
          {selectedFile && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                File to submit:
              </p>
              <div className="flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AssignmentDetailPage;