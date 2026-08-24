import { useState, useEffect } from 'react';
import { FiFile, FiCalendar, FiAward, FiAlertCircle, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import { validateForm } from '@utils/validators';

const AssignmentForm = ({
  assignment = null,
  courses = [],
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    points: 100,
    type: 'individual',
    difficulty: 'medium',
    attachments: [],
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        course: assignment.course?._id || '',
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().slice(0, 16)
          : '',
        points: assignment.points || 100,
        type: assignment.type || 'individual',
        difficulty: assignment.difficulty || 'medium',
        attachments: assignment.attachments || [],
      });
    }
  }, [assignment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationRules = {
      title: { required: true, minLength: 3 },
      description: { required: true, minLength: 10 },
      course: { required: true },
      dueDate: { required: true },
      points: { required: true, min: 1, max: 1000 },
    };

    const validationErrors = validateForm(formData, validationRules);

    // Check if due date is in the future
    const dueDate = new Date(formData.dueDate);
    const now = new Date();
    if (dueDate <= now) {
      validationErrors.dueDate = 'Due date must be in the future';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'attachments') {
        submitData.append(key, formData[key]);
      }
    });

    files.forEach((file) => {
      submitData.append('files', file);
    });

    onSubmit(submitData);
  };

  const typeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'group', label: 'Group' },
    { value: 'peer-review', label: 'Peer Review' },
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Assignment Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="e.g., Web Development Project"
        required
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.description
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Provide detailed instructions for the assignment..."
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <FiAlertCircle className="w-4 h-4 mr-1" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Course Selection */}
      <Select
        label="Course"
        name="course"
        value={formData.course}
        onChange={handleChange}
        error={errors.course}
        options={[
          { value: '', label: 'Select a course' },
          ...courses.map((c) => ({ value: c._id, label: c.title })),
        ]}
        required
      />

      {/* Due Date and Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          leftIcon={<FiCalendar />}
          required
        />
        <Input
          label="Points"
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
          error={errors.points}
          leftIcon={<FiAward />}
          min="1"
          max="1000"
          required
        />
      </div>

      {/* Type and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Assignment Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
          required
        />
        <Select
          label="Difficulty Level"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          options={difficultyOptions}
          required
        />
      </div>

      {/* File Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Attachments (Optional)
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiFile className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOC, DOCX, ZIP (Max 10MB)
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
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
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

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {assignment ? 'Update Assignment' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  );
};

AssignmentForm.propTypes = {
  assignment: PropTypes.object,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AssignmentForm;