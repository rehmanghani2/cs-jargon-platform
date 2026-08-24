import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiFile,
  FiX,
  FiUpload,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { useApi } from '@hooks/useApi';
import  assignmentApi  from '@api/assignmentApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Loader from '@components/common/Loader';
import { formatDate, formatTimeAgo } from '@utils/formatters';
import toast from 'react-hot-toast';

const SubmissionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, execute } = useApi(assignmentApi.getAssignmentById);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    try {
      const data = await execute(id);
      setAssignment(data);
      
      // If already submitted, redirect to detail page
      if (data.submission) {
        navigate(`/assignments/${id}`);
      }
    } catch (error) {
      toast.error('Failed to load assignment');
      navigate('/assignments');
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file size (max 10MB per file)
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && files.length === 0) {
      toast.error('Please provide submission content or upload files');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('content', content);
      files.forEach((file) => {
        formData.append('files', file);
      });

      await assignmentApi.submitAssignment(id, formData);
      toast.success('Assignment submitted successfully!');
      navigate(`/assignments/${id}`);
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Assignment Not Found
          </h2>
          <Button variant="primary" onClick={() => navigate('/assignments')}>
            Back to Assignments
          </Button>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/assignments/${id}`)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Assignment</span>
      </button>

      {/* Assignment Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {assignment.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {assignment.course.title}
            </p>
          </div>
          <Badge variant={isOverdue ? 'danger' : 'info'}>
            {getDaysRemaining()}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Due: {formatDate(assignment.dueDate)}</span>
          <span>•</span>
          <span>{assignment.points} points</span>
        </div>

        {isOverdue && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <FiAlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">
                This assignment is past the due date. Late submissions may receive reduced points.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submission Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Submit Your Work
        </h2>

        {/* Text Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Submission Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Write your submission here or upload files below..."
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You can write your answer here, upload files, or both
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachments
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, DOCX, ZIP (Max 10MB per file)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <FiFile className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submission Info */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Before you submit:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure all files are uploaded correctly</li>
                <li>Review your submission for completeness</li>
                <li>You can only submit once</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/assignments/${id}`)}
            disabled={isSubmitting}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting || (!content && files.length === 0)}
            fullWidth
            leftIcon={<FiCheckCircle />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default SubmissionPage;