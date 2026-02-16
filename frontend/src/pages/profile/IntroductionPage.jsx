import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import ProgressBar from '@components/common/ProgressBar';
import { FiUser, FiTarget, FiCalendar, FiCheckCircle } from 'react-icons/fi';

function IntroductionPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    goals: [],
    availability: '',
    interests: [],
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - Just starting out' },
    { value: 'intermediate', label: 'Intermediate - Some experience' },
    { value: 'advanced', label: 'Advanced - Experienced developer' },
  ];

  const availabilityOptions = [
    { value: '1-5', label: '1-5 hours per week' },
    { value: '5-10', label: '5-10 hours per week' },
    { value: '10-20', label: '10-20 hours per week' },
    { value: '20+', label: '20+ hours per week' },
  ];

  const goalOptions = [
    'Get a job in tech',
    'Learn new skills',
    'Career advancement',
    'Build projects',
    'Prepare for interviews',
    'Complete certifications',
  ];

  const interestOptions = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Game Development',
    'DevOps',
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Save user preferences
    await updateUser({
      ...formData,
      hasCompletedIntroduction: true,
    });
    navigate('/dashboard');
  };

  const toggleGoal = (goal) => {
    setFormData({
      ...formData,
      goals: formData.goals.includes(goal)
        ? formData.goals.filter(g => g !== goal)
        : [...formData.goals, goal],
    });
  };

  const toggleInterest = (interest) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter(i => i !== interest)
        : [...formData.interests, interest],
    });
  };

  const steps = [
    {
      title: 'Welcome to CS Jargon!',
      icon: FiUser,
      content: (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
            <FiUser className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome, {user?.name}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Let's personalize your learning experience. This will only take a minute.
            </p>
          </div>
          <Input
            label="Tell us a bit about yourself"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="E.g., Computer Science student, career changer, etc."
            fullWidth
          />
        </div>
      ),
    },
    {
      title: 'Your Experience Level',
      icon: FiTarget,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              What's your experience level?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This helps us recommend the right courses for you
            </p>
          </div>
          <Select
            label="Experience Level"
            options={[
              { value: '', label: 'Select your level' },
              ...experienceLevels,
            ]}
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            fullWidth
          />
        </div>
      ),
    },
    {
      title: 'Your Learning Goals',
      icon: FiTarget,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              What are your goals?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select all that apply
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.goals.includes(goal)
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.goals.includes(goal)
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {formData.goals.includes(goal) && (
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white">{goal}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Almost Done!',
      icon: FiCalendar,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Final step!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Help us personalize your learning path
            </p>
          </div>
          
          <Select
            label="How much time can you dedicate per week?"
            options={[
              { value: '', label: 'Select availability' },
              ...availabilityOptions,
            ]}
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Areas of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* Content */}
        <Card>
          <div className="min-h-[400px] flex flex-col">
            {currentStepData.content}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary-600 w-8'
                    : index < currentStep
                    ? 'bg-primary-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps - 1 ? (
            <Button variant="primary" onClick={handleComplete}>
              Complete Setup
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default IntroductionPage;