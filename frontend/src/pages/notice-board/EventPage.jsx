import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiShare2,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi';
import { useApi } from '@hooks/useApi';
import  noticeBoardApi  from '@api/noticeBoardApi';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Avatar from '@components/common/Avatar';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import { formatDate, formatTime } from '@utils/formatters';
import toast from 'react-hot-toast';

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { loading, execute } = useApi(noticeBoardApi.getEventById);
  const { loading: registering, execute: registerExecute } = useApi(
    noticeBoardApi.registerForEvent
  );
  const { loading: canceling, execute: cancelExecute } = useApi(
    noticeBoardApi.cancelEventRegistration
  );

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await execute(id);
      setEvent(data);
      setIsRegistered(data.isRegistered || false);
    } catch (error) {
      toast.error('Failed to load event');
      navigate('/notice-board');
    }
  };

  const handleRegister = async () => {
    try {
      await registerExecute(id);
      setIsRegistered(true);
      setEvent((prev) => ({
        ...prev,
        attendeesCount: (prev.attendeesCount || 0) + 1,
      }));
      toast.success('Successfully registered for event!');
    } catch (error) {
      toast.error('Failed to register for event');
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await cancelExecute(id);
      setIsRegistered(false);
      setEvent((prev) => ({
        ...prev,
        attendeesCount: Math.max((prev.attendeesCount || 0) - 1, 0),
      }));
      setShowCancelModal(false);
      toast.success('Registration cancelled');
    } catch (error) {
      toast.error('Failed to cancel registration');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'past';
  };

  const isEventFull = () => {
    if (!event.maxAttendees) return false;
    return event.attendeesCount >= event.maxAttendees;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/notice-board')}>
            Back to Notice Board
          </Button>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus();
  const spotsRemaining = event.maxAttendees
    ? event.maxAttendees - (event.attendeesCount || 0)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => navigate('/notice-board')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Notice Board</span>
      </button>

      {/* Event Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Event Image/Banner */}
        {event.image && (
          <div className="h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={
                    eventStatus === 'upcoming'
                      ? 'info'
                      : eventStatus === 'ongoing'
                      ? 'success'
                      : 'gray'
                  }
                >
                  {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
                </Badge>
                {isRegistered && (
                  <Badge variant="success" leftIcon={<FiCheckCircle />}>
                    Registered
                  </Badge>
                )}
                {event.category && <Badge variant="gray">{event.category}</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={handleShare}
              leftIcon={<FiShare2 />}
            >
              Share
            </Button>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Date & Time */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Date & Time
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(event.startDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Location
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.location || 'Online Event'}
                </p>
              </div>
            </div>

            {/* Attendees */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Attendees
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {event.attendeesCount || 0}
                  {event.maxAttendees && ` / ${event.maxAttendees}`} registered
                </p>
                {spotsRemaining !== null && spotsRemaining > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {spotsRemaining} spots remaining
                  </p>
                )}
              </div>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Avatar
                  src={event.organizer.avatar}
                  name={event.organizer.name}
                  size="medium"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Organized by
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.organizer.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {event.content && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About This Event
            </h3>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          </div>
        )}

        {/* Registration Section */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
          {eventStatus === 'past' ? (
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                This event has ended
              </p>
            </div>
          ) : isEventFull() && !isRegistered ? (
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300">
                This event is fully booked
              </p>
            </div>
          ) : isRegistered ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-300 font-medium">
                  You're registered for this event!
                </p>
              </div>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowCancelModal(true)}
                leftIcon={<FiX />}
              >
                Cancel Registration
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleRegister}
              loading={registering}
            >
              Register for Event
            </Button>
          )}
        </div>
      </motion.div>

      {/* Cancel Registration Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Registration"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Registration
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelRegistration}
              loading={canceling}
            >
              Cancel Registration
            </Button>
          </>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to cancel your registration for this event? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default EventPage;