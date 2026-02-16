import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import SearchInput from '@components/common/SearchInput';
import Select from '@components/common/Select';
import Tabs from '@components/common/Tabs';
import EmptyState from '@components/common/EmptyState';
import { FiFileText, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { formatDeadline } from '@utils/formatters';

function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Mock data
  const assignments = [
    {
      id: 1,
      title: 'Binary Tree Implementation',
      course: 'Data Structures & Algorithms',
      description: 'Implement a binary search tree with insert, delete, and search operations.',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      totalPoints: 100,
      status: 'pending',
      submitted: false,
    },
    {
      id: 2,
      title: 'Responsive Website Design',
      course: 'Web Development Fundamentals',
      description: 'Create a responsive landing page using HTML, CSS, and JavaScript.',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalPoints: 150,
      status: 'in_progress',
      submitted: false,
    },
    {
      id: 3,
      title: 'Database Normalization Exercise',
      course: 'Database Management Systems',
      description: 'Normalize the given database schema to 3NF.',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalPoints: 80,
      status: 'not_started',
      submitted: false,
    },
    {
      id: 4,
      title: 'Sorting Algorithms Analysis',
      course: 'Data Structures & Algorithms',
      description: 'Compare and analyze different sorting algorithms.',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      totalPoints: 120,
      status: 'submitted',
      submitted: true,
      submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      score: 115,
      grade: 'A',
    },
    {
      id: 5,
      title: 'CSS Grid Layout Project',
      course: 'Web Development Fundamentals',
      description: 'Build a photo gallery using CSS Grid.',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      totalPoints: 100,
      status: 'submitted',
      submitted: true,
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      score: 92,
      grade: 'A-',
    },
  ];

  const courses = [
    { value: 'all', label: 'All Courses' },
    { value: 'dsa', label: 'Data Structures & Algorithms' },
    { value: 'web', label: 'Web Development' },
    { value: 'db', label: 'Database Systems' },
  ];

  const getStatusBadge = (status, dueDate) => {
    const now = new Date();
    const isOverdue = new Date(dueDate) < now && !status.includes('submitted');

    if (status === 'submitted' || status === 'graded') {
      return <Badge variant="success">Submitted</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="danger">Overdue</Badge>;
    }
    if (status === 'in_progress') {
      return <Badge variant="warning">In Progress</Badge>;
    }
    return <Badge variant="gray">Not Started</Badge>;
  };

  const pendingAssignments = assignments.filter(a => !a.submitted);
  const submittedAssignments = assignments.filter(a => a.submitted);

  const AssignmentCard = ({ assignment }) => {
    const isOverdue = new Date(assignment.dueDate) < new Date() && !assignment.submitted;

    return (
      <Card hover>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link to={`/assignments/${assignment.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {assignment.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {assignment.course}
            </p>
          </div>
          {getStatusBadge(assignment.status, assignment.dueDate)}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FiClock className={`w-4 h-4 ${isOverdue ? 'text-danger-600' : ''}`} />
              <span className={isOverdue ? 'text-danger-600' : ''}>
                {formatDeadline(assignment.dueDate)}
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {assignment.totalPoints} points
            </span>
          </div>

          {assignment.submitted ? (
            <div className="flex items-center gap-2">
              {assignment.score && (
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {assignment.score}/{assignment.totalPoints}
                </span>
              )}
              <Badge variant="success">{assignment.grade || 'Pending'}</Badge>
            </div>
          ) : (
            <Link to={`/assignments/${assignment.id}`}>
              <Button variant="outline" size="small">
                {assignment.status === 'in_progress' ? 'Continue' : 'Start'}
              </Button>
            </Link>
          )}
        </div>
      </Card>
    );
  };

  const pendingTab = (
    <div>
      {pendingAssignments.length === 0 ? (
        <EmptyState
          icon={FiCheckCircle}
          title="All caught up!"
          description="You don't have any pending assignments."
        />
      ) : (
        <div className="space-y-4">
          {pendingAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );

  const submittedTab = (
    <div>
      {submittedAssignments.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No submitted assignments"
          description="Your submitted assignments will appear here."
        />
      ) : (
        <div className="space-y-4">
          {submittedAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );

  const allTab = (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Assignments
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage and submit your course assignments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingAssignments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {submittedAssignments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                A-
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <FiFileText className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid md:grid-cols-2 gap-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search assignments..."
          />
          <Select
            options={courses}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          {
            label: 'Pending',
            content: pendingTab,
            badge: pendingAssignments.length,
          },
          {
            label: 'Submitted',
            content: submittedTab,
            badge: submittedAssignments.length,
          },
          {
            label: 'All',
            content: allTab,
          },
        ]}
      />
    </div>
  );
}

export default AssignmentsPage;