const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Jargon = require('../models/Jargon');

dotenv.config();

// Sample jargons for seeding
const sampleJargons = [
    // Beginner jargons
    { term: 'Variable', definition: { simple: 'A named storage location for data', technical: 'A symbolic name associated with a value and whose associated value may be changed' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Function', definition: { simple: 'A reusable block of code that performs a specific task', technical: 'A self-contained module of code that accomplishes a specific task' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Loop', definition: { simple: 'Code that repeats a set of instructions', technical: 'A control flow statement for specifying iteration' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Array', definition: { simple: 'A collection of items stored at contiguous memory locations', technical: 'A data structure consisting of a collection of elements identified by index' }, category: 'data-structures', difficulty: 'beginner' },
    { term: 'String', definition: { simple: 'A sequence of characters', technical: 'An array of characters terminated by a null character' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Boolean', definition: { simple: 'A data type with only two values: true or false', technical: 'A binary variable having two possible values' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Syntax', definition: { simple: 'The rules for writing code in a programming language', technical: 'The set of rules that defines the combinations of symbols' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Bug', definition: { simple: 'An error or flaw in a program', technical: 'A software bug is an error, flaw or fault in a computer program' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Debug', definition: { simple: 'The process of finding and fixing errors', technical: 'The process of detecting and removing existing and potential errors' }, category: 'programming', difficulty: 'beginner' },
    { term: 'Compiler', definition: { simple: 'A program that translates code into machine language', technical: 'A program that converts source code into executable machine code' }, category: 'programming', difficulty: 'beginner' },
    
    // Intermediate jargons
    { term: 'Recursion', definition: { simple: 'When a function calls itself', technical: 'A method where the solution depends on solutions to smaller instances of the same problem' }, category: 'programming', difficulty: 'intermediate' },
    { term: 'Polymorphism', definition: { simple: 'Objects taking multiple forms', technical: 'The provision of a single interface to entities of different types' }, category: 'programming', difficulty: 'intermediate' },
    { term: 'Encapsulation', definition: { simple: 'Bundling data and methods that operate on that data', technical: 'The bundling of data with the methods that operate on that data, restricting direct access' }, category: 'programming', difficulty: 'intermediate' },
    { term: 'Inheritance', definition: { simple: 'A class acquiring properties from another class', technical: 'A mechanism wherein a new class is derived from an existing class' }, category: 'programming', difficulty: 'intermediate' },
    { term: 'API', definition: { simple: 'A way for programs to communicate with each other', technical: 'Application Programming Interface - a set of protocols for building software' }, category: 'web-development', difficulty: 'intermediate' },
    
    // Advanced jargons
    { term: 'Microservices', definition: { simple: 'Small, independent services working together', technical: 'An architectural style that structures an application as a collection of loosely coupled services' }, category: 'software-engineering', difficulty: 'advanced' },
    { term: 'Containerization', definition: { simple: 'Packaging software with its dependencies', technical: 'OS-level virtualization method for deploying and running distributed applications' }, category: 'software-engineering', difficulty: 'advanced' },
    { term: 'Sharding', definition: { simple: 'Splitting a database across multiple servers', technical: 'A type of database partitioning that separates large databases into smaller parts' }, category: 'database', difficulty: 'advanced' },
    { term: 'Idempotent', definition: { simple: 'An operation that produces the same result no matter how many times it runs', technical: 'An operation that can be applied multiple times without changing the result beyond the initial application' }, category: 'web-development', difficulty: 'advanced' },
    { term: 'Race Condition', definition: { simple: 'A bug caused by timing issues in concurrent code', technical: 'A condition where the behavior depends on the sequence or timing of uncontrollable events' }, category: 'programming', difficulty: 'advanced' }
];

// Course definitions
const courses = [
    {
        title: 'Beginner CS Jargons - Fundamentals',
        level: 'beginner',
        description: {
            short: 'Master fundamental Computer Science terminology with flashcards and examples.',
            full: 'This beginner course is designed to help you understand and use essential Computer Science jargons. You will learn basic programming terms, data types, and fundamental concepts through interactive flashcards, reading materials, and practical exercises. Perfect for students new to Computer Science.'
        },
        objectives: [
            'Understand basic programming terminology',
            'Learn common data types and their uses',
            'Master fundamental CS acronyms',
            'Build confidence in using technical vocabulary',
            'Prepare for intermediate-level learning'
        ],
        prerequisites: 'None - suitable for complete beginners',
        duration: { weeks: 6, hoursPerWeek: 5 }
    },
    {
        title: 'Intermediate CS Jargons - Contextual Usage',
        level: 'intermediate',
        description: {
            short: 'Learn to use CS jargons in context through texts, problem descriptions, and explanations.',
            full: 'This intermediate course builds on fundamental knowledge to help you use Computer Science jargons in real-world contexts. You will learn object-oriented programming concepts, web development terminology, and database-related terms. The course emphasizes contextual usage through reading comprehension, technical writing, and practical applications.'
        },
        objectives: [
            'Use CS jargons correctly in technical writing',
            'Understand OOP terminology and concepts',
            'Master web development vocabulary',
            'Learn database and networking terms',
            'Apply jargons in problem-solving contexts'
        ],
        prerequisites: 'Completion of Beginner course or equivalent knowledge',
        duration: { weeks: 8, hoursPerWeek: 6 }
    },
    {
        title: 'Advanced CS Jargons - Professional Mastery',
        level: 'advanced',
        description: {
            short: 'Apply professional jargon in research papers, documentation, and presentations.',
            full: 'This advanced course is designed for students who want to master professional-level Computer Science terminology. You will learn advanced concepts in software engineering, system design, and specialized fields like AI/ML and cybersecurity. The course focuses on using jargons in research papers, technical documentation, and professional presentations.'
        },
        objectives: [
            'Use jargons in academic writing and research',
            'Master software architecture terminology',
            'Understand advanced system design concepts',
            'Learn AI/ML and cybersecurity vocabulary',
            'Prepare for technical interviews and presentations'
        ],
        prerequisites: 'Completion of Intermediate course or equivalent knowledge',
        duration: { weeks: 14, hoursPerWeek: 7 }
    }
];

// Module generator function
const generateModules = (level, courseId, jargonIds) => {
    const moduleTemplates = {
        beginner: [
            {
                title: 'Introduction to Programming Terms',
                description: 'Learn the most basic programming terminology that every CS student should know.',
                weekNumber: 1,
                order: 1,
                objectives: ['Define basic programming terms', 'Identify common jargons', 'Use terms in simple sentences'],
                lessons: [
                    {
                        title: 'What is Programming?',
                        type: 'reading',
                        content: {
                            htmlContent: `<h2>Understanding Programming</h2>
                            <p>Programming is the process of creating a set of instructions that tell a computer how to perform a task. These instructions are written in a <strong>programming language</strong>.</p>
                            <h3>Key Terms</h3>
                            <ul>
                                <li><strong>Code</strong>: The text written in a programming language</li>
                                <li><strong>Syntax</strong>: The rules for writing valid code</li>
                                <li><strong>Compiler</strong>: A program that translates code into machine language</li>
                            </ul>`
                        },
                        duration: 10,
                        order: 1,
                        isRequired: true
                    },
                    {
                        title: 'Variables and Data Types',
                        type: 'flashcard',
                        content: {
                            flashcards: [
                                { term: 'Variable', definition: 'A named storage location for data', example: 'let age = 25;' },
                                { term: 'Integer', definition: 'A whole number without decimals', example: '42, -17, 0' },
                                { term: 'String', definition: 'A sequence of characters', example: '"Hello World"' },
                                { term: 'Boolean', definition: 'A true or false value', example: 'true, false' },
                                { term: 'Float', definition: 'A number with decimal points', example: '3.14, -0.5' }
                            ]
                        },
                        duration: 15,
                        order: 2,
                        isRequired: true
                    },
                    {
                        title: 'Practice: Basic Terms',
                        type: 'practice',
                        content: {
                            exercises: [
                                {
                                    type: 'fill-blank',
                                    question: 'A _______ is a named storage location that can hold different values.',
                                    options: ['variable', 'constant', 'operator', 'function'],
                                    correctAnswer: 'variable',
                                    explanation: 'A variable is a named storage location in memory.'
                                },
                                {
                                    type: 'multiple-choice',
                                    question: 'Which data type would you use to store "Hello World"?',
                                    options: ['Integer', 'Boolean', 'String', 'Float'],
                                    correctAnswer: 'String',
                                    explanation: 'Strings are used to store text/character sequences.'
                                }
                            ]
                        },
                        duration: 10,
                        order: 3,
                        isRequired: true
                    }
                ],
                quiz: {
                    title: 'Programming Basics Quiz',
                    description: 'Test your understanding of basic programming terms',
                    instructions: ['Read each question carefully', 'You have 3 attempts', 'Passing score is 60%'],
                    passingScore: 60,
                    timeLimit: 10,
                    attemptsAllowed: 3,
                    questions: [
                        {
                            question: 'What is a variable in programming?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'A fixed value that never changes' },
                                { id: 'B', text: 'A named storage location for data' },
                                { id: 'C', text: 'A type of loop' },
                                { id: 'D', text: 'A programming language' }
                            ],
                            correctAnswer: 'B',
                            explanation: 'A variable is a named storage location that can hold different values.',
                            points: 1
                        },
                        {
                            question: 'True or False: A Boolean can have three values: true, false, or maybe.',
                            questionType: 'true-false',
                            options: [
                                { id: 'T', text: 'True' },
                                { id: 'F', text: 'False' }
                            ],
                            correctAnswer: 'F',
                            explanation: 'A Boolean has only two values: true or false.',
                            points: 1
                        },
                        {
                            question: 'Which data type stores whole numbers?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'String' },
                                { id: 'B', text: 'Boolean' },
                                { id: 'C', text: 'Integer' },
                                { id: 'D', text: 'Float' }
                            ],
                            correctAnswer: 'C',
                            explanation: 'Integers store whole numbers without decimal points.',
                            points: 1
                        }
                    ]
                }
            },
            {
                title: 'Control Structures',
                description: 'Learn about loops, conditions, and flow control in programming.',
                weekNumber: 2,
                order: 2,
                objectives: ['Understand conditional statements', 'Learn different types of loops', 'Master flow control terminology'],
                lessons: [
                    {
                        title: 'Conditional Statements',
                        type: 'reading',
                        content: {
                            htmlContent: `<h2>Making Decisions in Code</h2>
                            <p>Conditional statements allow your program to make decisions based on certain conditions.</p>
                            <h3>Key Terms</h3>
                            <ul>
                                <li><strong>If Statement</strong>: Executes code if a condition is true</li>
                                <li><strong>Else</strong>: Executes code if the condition is false</li>
                                <li><strong>Condition</strong>: An expression that evaluates to true or false</li>
                            </ul>`
                        },
                        duration: 10,
                        order: 1,
                        isRequired: true
                    },
                    {
                        title: 'Loops Vocabulary',
                        type: 'flashcard',
                        content: {
                            flashcards: [
                                { term: 'Loop', definition: 'A sequence of instructions that repeats', example: 'for, while, do-while' },
                                { term: 'Iteration', definition: 'One complete pass through a loop', example: 'Each repetition of the loop body' },
                                { term: 'For Loop', definition: 'A loop that runs a specific number of times', example: 'for(i=0; i<10; i++)' },
                                { term: 'While Loop', definition: 'A loop that runs while a condition is true', example: 'while(count > 0)' },
                                { term: 'Infinite Loop', definition: 'A loop that never ends', example: 'while(true)' }
                            ]
                        },
                        duration: 15,
                        order: 2,
                        isRequired: true
                    }
                ],
                quiz: {
                    title: 'Control Structures Quiz',
                    description: 'Test your knowledge of control structures',
                    passingScore: 60,
                    timeLimit: 8,
                    attemptsAllowed: 3,
                    questions: [
                        {
                            question: 'What type of loop runs a specific number of times?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'While loop' },
                                { id: 'B', text: 'For loop' },
                                { id: 'C', text: 'Infinite loop' },
                                { id: 'D', text: 'Do-while loop' }
                            ],
                            correctAnswer: 'B',
                            explanation: 'A for loop is designed to run a predetermined number of times.',
                            points: 1
                        },
                        {
                            question: 'What is one complete pass through a loop called?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'Recursion' },
                                { id: 'B', text: 'Iteration' },
                                { id: 'C', text: 'Compilation' },
                                { id: 'D', text: 'Execution' }
                            ],
                            correctAnswer: 'B',
                            explanation: 'Each repetition of a loop is called an iteration.',
                            points: 1
                        }
                    ]
                }
            },
            {
                title: 'Functions and Methods',
                description: 'Understand how to organize code into reusable blocks.',
                weekNumber: 3,
                order: 3,
                objectives: ['Define functions and their purpose', 'Understand parameters and return values', 'Learn method terminology'],
                lessons: [
                    {
                        title: 'What are Functions?',
                        type: 'reading',
                        content: {
                            htmlContent: `<h2>Organizing Code with Functions</h2>
                            <p>Functions are reusable blocks of code that perform specific tasks.</p>
                            <h3>Key Concepts</h3>
                            <ul>
                                <li><strong>Function</strong>: A named block of reusable code</li>
                                <li><strong>Parameter</strong>: Input values passed to a function</li>
                                <li><strong>Return Value</strong>: The output of a function</li>
                                <li><strong>Function Call</strong>: Executing a function</li>
                            </ul>`
                        },
                        duration: 12,
                        order: 1,
                        isRequired: true
                    },
                    {
                        title: 'Function Terminology',
                        type: 'flashcard',
                        content: {
                            flashcards: [
                                { term: 'Function', definition: 'A reusable block of code', example: 'function greet() { }' },
                                { term: 'Parameter', definition: 'A variable listed in the function definition', example: 'function add(a, b)' },
                                { term: 'Argument', definition: 'The actual value passed to a function', example: 'add(5, 3)' },
                                { term: 'Return', definition: 'Sending a value back from a function', example: 'return result;' },
                                { term: 'Scope', definition: 'Where variables can be accessed', example: 'local vs global scope' }
                            ]
                        },
                        duration: 15,
                        order: 2,
                        isRequired: true
                    }
                ],
                quiz: {
                    title: 'Functions Quiz',
                    description: 'Test your understanding of functions',
                    passingScore: 60,
                    timeLimit: 8,
                    attemptsAllowed: 3,
                    questions: [
                        {
                            question: 'What is the difference between a parameter and an argument?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'They are the same thing' },
                                { id: 'B', text: 'Parameter is in definition, argument is the actual value' },
                                { id: 'C', text: 'Argument is in definition, parameter is the actual value' },
                                { id: 'D', text: 'Neither are related to functions' }
                            ],
                            correctAnswer: 'B',
                            explanation: 'Parameters are in the function definition, arguments are actual values passed.',
                            points: 1
                        }
                    ]
                }
            }
        ],
        intermediate: [
            {
                title: 'Object-Oriented Programming Concepts',
                description: 'Master OOP terminology and concepts for modern software development.',
                weekNumber: 1,
                order: 1,
                objectives: ['Understand classes and objects', 'Learn inheritance and polymorphism', 'Master encapsulation concepts'],
                lessons: [
                    {
                        title: 'Classes and Objects',
                        type: 'reading',
                        content: {
                            htmlContent: `<h2>Object-Oriented Programming</h2>
                            <p>OOP is a programming paradigm based on the concept of objects.</p>
                            <h3>Core Concepts</h3>
                            <ul>
                                <li><strong>Class</strong>: A blueprint for creating objects</li>
                                <li><strong>Object</strong>: An instance of a class</li>
                                <li><strong>Attribute</strong>: Data stored in an object</li>
                                <li><strong>Method</strong>: A function that belongs to an object</li>
                            </ul>`
                        },
                        duration: 15,
                        order: 1,
                        isRequired: true
                    },
                    {
                        title: 'OOP Principles',
                        type: 'flashcard',
                        content: {
                            flashcards: [
                                { term: 'Encapsulation', definition: 'Bundling data and methods, hiding internal details', example: 'private variables with public getters/setters' },
                                { term: 'Inheritance', definition: 'A class acquiring properties from another class', example: 'class Dog extends Animal' },
                                { term: 'Polymorphism', definition: 'Objects taking multiple forms', example: 'method overriding' },
                                { term: 'Abstraction', definition: 'Hiding complex implementation details', example: 'abstract classes and interfaces' }
                            ]
                        },
                        duration: 20,
                        order: 2,
                        isRequired: true
                    }
                ],
                quiz: {
                    title: 'OOP Concepts Quiz',
                    passingScore: 65,
                    timeLimit: 12,
                    attemptsAllowed: 3,
                    questions: [
                        {
                            question: 'Which OOP principle hides internal implementation details?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'Inheritance' },
                                { id: 'B', text: 'Polymorphism' },
                                { id: 'C', text: 'Encapsulation' },
                                { id: 'D', text: 'Compilation' }
                            ],
                            correctAnswer: 'C',
                            points: 2
                        }
                    ]
                }
            }
        ],
        advanced: [
            {
                title: 'Software Architecture Patterns',
                description: 'Learn professional architecture terminology used in enterprise development.',
                weekNumber: 1,
                order: 1,
                objectives: ['Understand microservices architecture', 'Learn design patterns terminology', 'Master scalability concepts'],
                lessons: [
                    {
                        title: 'Microservices Architecture',
                        type: 'reading',
                        content: {
                            htmlContent: `<h2>Modern Architecture Patterns</h2>
                            <p>Microservices architecture decomposes applications into small, independent services.</p>
                            <h3>Key Concepts</h3>
                            <ul>
                                <li><strong>Microservice</strong>: A small, independently deployable service</li>
                                <li><strong>API Gateway</strong>: Entry point for all client requests</li>
                                <li><strong>Service Discovery</strong>: Automatic detection of service instances</li>
                                <li><strong>Load Balancer</strong>: Distributes traffic across servers</li>
                            </ul>`
                        },
                        duration: 20,
                        order: 1,
                        isRequired: true
                    }
                ],
                quiz: {
                    title: 'Architecture Patterns Quiz',
                    passingScore: 70,
                    timeLimit: 15,
                    attemptsAllowed: 3,
                    questions: [
                        {
                            question: 'What is the main benefit of microservices architecture?',
                            questionType: 'multiple-choice',
                            options: [
                                { id: 'A', text: 'Simpler deployment' },
                                { id: 'B', text: 'Independent scaling and deployment of services' },
                                { id: 'C', text: 'Reduced code complexity' },
                                { id: 'D', text: 'Lower hardware costs' }
                            ],
                            correctAnswer: 'B',
                            points: 2
                        }
                    ]
                }
            }
        ]
    };

    return moduleTemplates[level]?.map((template, index) => ({
        ...template,
        course: courseId,
        jargonsToLearn: jargonIds.slice(0, 5),
        isLocked: index > 0,
        isActive: true,
        isPublished: true
    })) || [];
};

const seedCoursesAndModules = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Course.deleteMany({});
        await Module.deleteMany({});
        await Jargon.deleteMany({});
        console.log('Cleared existing courses, modules, and jargons');

        // Insert jargons
        const insertedJargons = await Jargon.insertMany(sampleJargons);
        console.log(`Inserted ${insertedJargons.length} jargons`);

        // Get jargon IDs by difficulty
        const jargonsByLevel = {
            beginner: insertedJargons.filter(j => j.difficulty === 'beginner').map(j => j._id),
            intermediate: insertedJargons.filter(j => j.difficulty === 'intermediate').map(j => j._id),
            advanced: insertedJargons.filter(j => j.difficulty === 'advanced').map(j => j._id)
        };

        // Insert courses and modules
        for (const courseData of courses) {
            // Create course first
            const course = await Course.create(courseData);
            console.log(`Created course: ${course.title}`);

            // Generate and create modules
            const moduleData = generateModules(course.level, course._id, jargonsByLevel[course.level]);
            const modules = await Module.insertMany(moduleData);
            console.log(`Created ${modules.length} modules for ${course.title}`);

            // Update course with module references
            course.modules = modules.map(m => m._id);
            course.totalModules = modules.length;
            course.totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
            course.totalJargons = jargonsByLevel[course.level].length;
            course.isPublished = true;
            course.publishedAt = new Date();
            await course.save();
        }

        console.log('Course and module seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
};

seedCoursesAndModules();