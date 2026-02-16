import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import SearchInput from '@components/common/SearchInput';
import Tabs from '@components/common/Tabs';
import EmptyState from '@components/common/EmptyState';
import Button from '@components/common/Button';
import { FiBell, FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import { formatDate, formatTime } from '@utils/formatters';

function NoticeBoardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const announcements = [
    {
      id: 1,
      title: 'New Course: Advanced Machine Learning',
      content: 'We are excited to announce the launch of our new Advanced Machine Learning course. Enroll now!',
      author: 'Admin',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      priority: 'high',
      pinned: true,
    },
    {
      id: 2,
      title: 'Platform Maintenance Scheduled',
      content: 'The platform will be under maintenance on Sunday from 2 AM to 6 AM EST.',
      author: 'System Admin',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      pinned: false,
    },
    {
      id: 3,
      title: 'Assignment Deadline Extension',
      content: 'The deadline for the Data Structures assignment has been extended by 2 days.',
      author: 'Dr. Sarah Johnson',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      priority: 'low',
      pinned: false,
    },
  ];

  const events = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Learn modern web development techniques and best practices.',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '2:00 PM',
      location: 'Online - Zoom',
      attendees: 45,
      maxAttendees: 50,
      registered: false,
    },
    {
      id: 2,
      title: 'Coding Competition',
      description: 'Test your coding skills in our monthly programming challenge.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      location: 'Virtual Platform',
      attendees: 120,
      maxAttendees: 200,
      registered: true,
    },
    {
      id: 3,
      title: 'Guest Lecture: AI in Healthcare',
      description: 'Join us for an insightful talk on AI applications in healthcare.',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      time: '4:00 PM',
      location: 'Auditorium Hall',
      attendees: 80,
      maxAttendees: 100,
      registered: false,
    },
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'danger',
      medium: 'warning',
      low: 'info',
    };
    return colors[priority] || 'gray';
  };

  const AnnouncementCard = ({ announcement }) => (
    <Card hover className={announcement.pinned ? 'border-2 border-primary-200 dark:border-primary-800' : ''}>
      {announcement.pinned && (
        <Badge variant="info" className="mb-3">
          📌 Pinned
        </Badge>
      )}
      <div className="flex items-start justify-between mb-3">
        <Link to={`/notice-board/announcements/${announcement.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {announcement.title}
          </h3>
        </Link>
        <Badge variant={getPriorityColor(announcement.priority)} size="small">
          {announcement.priority}
        </Badge>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {announcement.content}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>By {announcement.author}</span>
        <span>{formatDate(announcement.date)}</span>
      </div>
    </Card>
  );

  const EventCard = ({ event }) => {
    const spotsLeft = event.maxAttendees - event.attendees;
    const isFull = spotsLeft <= 0;

    return (
      <Card hover>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <Link to={`/notice-board/events/${event.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {event.title}
              </h3>
            </Link>
            {event.registered && (
              <Badge variant="success">Registered</Badge>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            {event.description}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiClock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiMapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FiUsers className="w-4 h-4" />
              <span>
                {event.attendees}/{event.maxAttendees} registered
                {!isFull && <span className="text-success-600 ml-1">({spotsLeft} spots left)</span>}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {event.registered ? (
              <Button variant="outline" fullWidth disabled>
                Already Registered
              </Button>
            ) : isFull ? (
              <Button variant="ghost" fullWidth disabled>
                Event Full
              </Button>
            ) : (
              <Link to={`/notice-board/events/${event.id}`}>
                <Button variant="primary" fullWidth>
                  Register Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const announcementsTab = (
    <div>
      {announcements.length === 0 ? (
        <EmptyState
          icon={FiBell}
          title="No announcements"
          description="There are no announcements at this time."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}
    </div>
  );

  const eventsTab = (
    <div>
      {events.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title="No upcoming events"
          description="There are no events scheduled at this time."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Notice Board
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay updated with announcements and upcoming events
        </p>
      </div>

      {/* Search */}
      <Card>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search announcements and events..."
        />
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            label: 'Announcements',
            content: announcementsTab,
            icon: <FiBell className="w-4 h-4" />,
            badge: announcements.length,
          },
          {
            label: 'Events',
            content: eventsTab,
            icon: <FiCalendar className="w-4 h-4" />,
            badge: events.length,
          },
        ]}
      />
    </div>
  );
}

export default NoticeBoardPage;