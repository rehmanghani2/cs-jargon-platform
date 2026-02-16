import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import Tabs from '@components/common/Tabs';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiMessageSquare,
} from 'react-icons/fi';

function LessonPage() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');

  // Mock data
  const lesson = {
    id: lessonId,
    title: 'Array Operations',
    type: 'video',
    content: `
      <h2>Understanding Array Operations</h2>
      <p>Arrays are one of the most fundamental data structures in computer science. In this lesson, we'll explore common array operations and their time complexities.</p>
      
      <h3>Common Array Operations:</h3>
      <ul>
        <li><strong>Access:</strong> O(1) - Direct index access</li>
        <li><strong>Search:</strong> O(n) - Linear search through elements</li>
        <li><strong>Insertion:</strong> O(n) - May require shifting elements</li>
        <li><strong>Deletion:</strong> O(n) - May require shifting elements</li>
      </ul>

      <h3>Code Example:</h3>
      <pre>
// Inserting an element at a specific position
function insertAt(arr, index, element) {
  arr.splice(index, 0, element);
  return arr;
}

// Deleting an element at a specific position
function deleteAt(arr, index) {
  arr.splice(index, 1);
  return arr;
}

// Searching for an element
function search(arr, target) {
  return arr.indexOf(target);
}
      </pre>
    `,
    videoUrl: 'https://example.com/video.mp4',
    duration: '20 min',
    moduleTitle: 'Arrays and Strings',
    courseTitle: 'Data Structures & Algorithms',
    resources: [
      { id: 1, name: 'Lecture Slides.pdf', size: '2.5 MB', url: '#' },
      { id: 2, name: 'Code Examples.zip', size: '500 KB', url: '#' },
    ],
    transcript: `Welcome to this lesson on array operations...`,
    nextLesson: {
      id: 3,
      title: 'Array Algorithms',
    },
    previousLesson: {
      id: 1,
      title: 'Introduction to Arrays',
    },
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

  const handleSaveNotes = () => {
    // Save notes logic
    console.log('Notes saved:', notes);
  };

  const contentTab = (
    <div className="space-y-6">
      {/* Video Player Placeholder */}
      {lesson.type === 'video' && (
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
            </div>
            <p className="text-lg font-medium">Video Player</p>
            <p className="text-sm text-gray-300 mt-1">{lesson.duration}</p>
          </div>
        </div>
      )}

      {/* Lesson Content */}
      <Card>
        <div
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      </Card>

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <Card title="Downloadable Resources">
          <div className="space-y-2">
            {lesson.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiFileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {resource.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.size}
                    </p>
                  </div>
                </div>
                <FiDownload className="w-5 h-5 text-gray-400" />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const notesTab = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={10}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Take notes while learning..."
        />
      </div>
      <Button onClick={handleSaveNotes}>Save Notes</Button>
    </div>
  );

  const transcriptTab = lesson.transcript ? (
    <Card>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {lesson.transcript}
        </p>
      </div>
    </Card>
  ) : (
    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
      No transcript available for this lesson.
    </p>
  );

  const discussionTab = (
    <div className="space-y-4">
      <Card>
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Discussion feature coming soon</p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link to="/courses" className="hover:text-primary-600 dark:hover:text-primary-400">
          Courses
        </Link>
        <span>/</span>
        <Link
          to={`/courses/${courseId}`}
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          {lesson.courseTitle}
        </Link>
        <span>/</span>
        <Link
          to={`/courses/${courseId}/modules/${moduleId}`}
          className="hover:text-primary-600 dark:hover:text-primary-400"
        >
          {lesson.moduleTitle}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{lesson.title}</span>
      </div>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <Badge variant="info">{lesson.type}</Badge>
              <span>{lesson.duration}</span>
            </div>
          </div>
          {!isCompleted ? (
            <Button
              variant="success"
              leftIcon={<FiCheckCircle />}
              onClick={handleMarkComplete}
            >
              Mark as Complete
            </Button>
          ) : (
            <Badge variant="success" className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4" />
              Completed
            </Badge>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={[
          { label: 'Content', content: contentTab },
          { label: 'Notes', content: notesTab },
          { label: 'Transcript', content: transcriptTab },
          { label: 'Discussion', content: discussionTab },
        ]}
      />

      {/* Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          {lesson.previousLesson ? (
            <Link to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.previousLesson.id}`}>
              <Button variant="outline" leftIcon={<FiArrowLeft />}>
                Previous: {lesson.previousLesson.title}
              </Button>
            </Link>
          ) : (
            <div></div>
          )}

          {lesson.nextLesson ? (
            <Link to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.nextLesson.id}`}>
              <Button variant="primary" rightIcon={<FiArrowRight />}>
                Next: {lesson.nextLesson.title}
              </Button>
            </Link>
          ) : (
            <Link to={`/courses/${courseId}/modules/${moduleId}`}>
              <Button variant="primary">Back to Module</Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}

export default LessonPage;