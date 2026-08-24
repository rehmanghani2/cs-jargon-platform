import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare, FiSend } from 'react-icons/fi';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import { validateForm } from '@utils/validators';
import toast from 'react-hot-toast';

const PeerReviewForm = ({ submission, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    strengths: '',
    improvements: '',
    additionalComments: '',
  });
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const criteria = [
    { id: 'completeness', label: 'Completeness', rating: 0 },
    { id: 'quality', label: 'Quality of Work', rating: 0 },
    { id: 'creativity', label: 'Creativity', rating: 0 },
    { id: 'presentation', label: 'Presentation', rating: 0 },
  ];

  const [criteriaRatings, setCriteriaRatings] = useState(
    criteria.reduce((acc, c) => ({ ...acc, [c.id]: 0 }), {})
  );

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleCriteriaRating = (criteriaId, rating) => {
    setCriteriaRatings((prev) => ({ ...prev, [criteriaId]: rating }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationRules = {
      strengths: { required: true, minLength: 20 },
      improvements: { required: true, minLength: 20 },
    };

    const validationErrors = validateForm(formData, validationRules);

    if (formData.rating === 0) {
      validationErrors.rating = 'Please provide an overall rating';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ ...formData, criteriaRatings });
      toast.success('Peer review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit peer review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submission Preview */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Reviewing: {submission.student.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assignment: {submission.assignment.title}
        </p>
      </div>

      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Overall Rating *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <FiStar
                className={`w-8 h-8 ${
                  star <= (hoveredRating || formData.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </motion.button>
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {formData.rating > 0
              ? `${formData.rating} out of 5`
              : 'Select a rating'}
          </span>
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.rating}
          </p>
        )}
      </div>

      {/* Criteria Ratings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Rate by Criteria
        </label>
        <div className="space-y-3">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {criterion.label}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleCriteriaRating(criterion.id, star)}
                    className="focus:outline-none"
                  >
                    <FiStar
                      className={`w-5 h-5 ${
                        star <= criteriaRatings[criterion.id]
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Strengths *
        </label>
        <textarea
          name="strengths"
          value={formData.strengths}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.strengths
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="What did the student do well? Be specific and constructive..."
        />
        {errors.strengths && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.strengths}
          </p>
        )}
      </div>

      {/* Areas for Improvement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Areas for Improvement *
        </label>
        <textarea
          name="improvements"
          value={formData.improvements}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.improvements
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="What could be improved? Provide constructive feedback..."
        />
        {errors.improvements && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.improvements}
          </p>
        )}
      </div>

      {/* Additional Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          name="additionalComments"
          value={formData.additionalComments}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Any other thoughts or suggestions..."
        />
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
          Peer Review Guidelines:
        </p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>Be respectful and constructive in your feedback</li>
          <li>Focus on the work, not the person</li>
          <li>Provide specific examples when possible</li>
          <li>Balance criticism with positive observations</li>
        </ul>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={<FiSend />}
          fullWidth
        >
          Submit Review
        </Button>
      </div>
    </form>
  );
};

PeerReviewForm.propTypes = {
  submission: PropTypes.shape({
    student: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    assignment: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PeerReviewForm;