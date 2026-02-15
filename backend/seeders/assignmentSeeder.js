const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Jargon = require('../models/Jargon');

dotenv.config();

const createSampleAssignments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing assignments
        await Assignment.deleteMany({});
        console.log('Cleared existing assignments');

        // Get courses and modules
        const beginnerCourse = await Course.findOne({ level: 'beginner' });
        const intermediateCourse = await Course.findOne({ level: 'intermediate' });
        
        if (!beginnerCourse) {
            console.log('No courses found. Run course seeder first.');
            process.exit(1);
        }

        const modules = await Module.find({ course: beginnerCourse._id }).sort({ order: 1 });
        const jargons = await Jargon.find({ difficulty: 'beginner' }).limit(10);

        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

        const assignments = [
            // Definition Writing Assignment
            {
                title: 'Define Programming Terms',
                description: 'Write clear and concise definitions for basic programming terms in your own words.',
                instructions: [
                    'Read each term carefully',
                    'Write a definition in simple words (2-3 sentences)',
                    'Include an example if possible',
                    'Avoid copying from external sources'
                ],
                course: beginnerCourse._id,
                module: modules[0]?._id,
                weekNumber: 1,
                type: 'definition-writing',
                questions: [
                    {
                        questionNumber: 1,
                        questionText: 'Define the term "Variable" in programming.',
                        questionType: 'definition',
                        instructions: 'Write a clear definition in 2-3 sentences. Include a simple example.',
                        termToDefine: 'Variable',
                        points: 10,
                        isAutoGraded: false,
                        rubric: {
                            criteria: ['Accuracy', 'Clarity', 'Example'],
                            maxPoints: 10
                        }
                    },
                    {
                        questionNumber: 2,
                        questionText: 'Define the term "Function" in programming.',
                        questionType: 'definition',
                        termToDefine: 'Function',
                        points: 10,
                        isAutoGraded: false
                    },
                    {
                        questionNumber: 3,
                        questionText: 'Define the term "Loop" in programming.',
                        questionType: 'definition',
                        termToDefine: 'Loop',
                        points: 10,
                        isAutoGraded: false
                    }
                ],
                totalPoints: 30,
                passingScore: 60,
                weightage: 10,
                availableFrom: now,
                dueDate: oneWeekFromNow,
                estimatedTime: 30,
                submissionType: 'online',
                rubric: [
                    {
                        criteria: 'Accuracy',
                        description: 'Definition correctly explains the term',
                        maxPoints: 4,
                        levels: [
                            { score: 4, description: 'Completely accurate' },
                            { score: 3, description: 'Mostly accurate with minor errors' },
                            { score: 2, description: 'Partially accurate' },
                            { score: 1, description: 'Mostly inaccurate' },
                            { score: 0, description: 'Incorrect' }
                        ]
                    },
                    {
                        criteria: 'Clarity',
                        description: 'Definition is clear and easy to understand',
                        maxPoints: 3,
                        levels: [
                            { score: 3, description: 'Very clear and concise' },
                            { score: 2, description: 'Understandable' },
                            { score: 1, description: 'Somewhat confusing' },
                            { score: 0, description: 'Unclear' }
                        ]
                    },
                    {
                        criteria: 'Example',
                        description: 'Includes a relevant example',
                        maxPoints: 3,
                        levels: [
                            { score: 3, description: 'Excellent, relevant example' },
                            { score: 2, description: 'Good example' },
                            { score: 1, description: 'Weak example' },
                            { score: 0, description: 'No example or irrelevant' }
                        ]
                    }
                ],
                jargonsFocused: jargons.slice(0, 3).map(j => j._id),
                status: 'published',
                publishedAt: now
            },

            // Jargon Matching Assignment
            {
                title: 'Match CS Jargons with Definitions',
                description: 'Match each Computer Science term with its correct definition.',
                instructions: [
                    'Read all terms and definitions first',
                    'Match each term on the left with its definition on the right',
                    'Each term has exactly one matching definition'
                ],
                course: beginnerCourse._id,
                module: modules[0]?._id,
                weekNumber: 1,
                type: 'jargon-matching',
                questions: [
                    {
                        questionNumber: 1,
                        questionText: 'Match the following programming terms with their definitions:',
                        questionType: 'matching',
                        matchingPairs: {
                            leftColumn: [
                                { id: 'T1', text: 'Compiler' },
                                { id: 'T2', text: 'Interpreter' },
                                { id: 'T3', text: 'Debug' },
                                { id: 'T4', text: 'Syntax' }
                            ],
                            rightColumn: [
                                { id: 'D1', text: 'The rules for writing valid code' },
                                { id: 'D2', text: 'Translates entire code before running' },
                                { id: 'D3', text: 'Find and fix errors in code' },
                                { id: 'D4', text: 'Translates code line by line' }
                            ],
                            correctMatches: [
                                { leftId: 'T1', rightId: 'D2' },
                                { leftId: 'T2', rightId: 'D4' },
                                { leftId: 'T3', rightId: 'D3' },
                                { leftId: 'T4', rightId: 'D1' }
                            ]
                        },
                        points: 8,
                        isAutoGraded: true
                    },
                    {
                        questionNumber: 2,
                        questionText: 'Match the data types with their descriptions:',
                        questionType: 'matching',
                        matchingPairs: {
                            leftColumn: [
                                { id: 'T1', text: 'Integer' },
                                { id: 'T2', text: 'Float' },
                                { id: 'T3', text: 'String' },
                                { id: 'T4', text: 'Boolean' }
                            ],
                            rightColumn: [
                                { id: 'D1', text: 'True or False values' },
                                { id: 'D2', text: 'Sequence of characters' },
                                { id: 'D3', text: 'Whole numbers' },
                                { id: 'D4', text: 'Decimal numbers' }
                            ],
                            correctMatches: [
                                { leftId: 'T1', rightId: 'D3' },
                                { leftId: 'T2', rightId: 'D4' },
                                { leftId: 'T3', rightId: 'D2' },
                                { leftId: 'T4', rightId: 'D1' }
                            ]
                        },
                        points: 8,
                        isAutoGraded: true
                    }
                ],
                totalPoints: 16,
                passingScore: 60,
                weightage: 5,
                availableFrom: now,
                dueDate: oneWeekFromNow,
                estimatedTime: 15,
                submissionType: 'online',
                isAutoGraded: true,
                status: 'published',
                publishedAt: now
            },

            // Fill-in-Blank Assignment
            {
                title: 'Complete the Sentences',
                description: 'Fill in the blanks with the correct programming terms.',
                instructions: [
                    'Read each sentence carefully',
                    'Choose the correct term from the options',
                    'Make sure the term makes sense in context'
                ],
                course: beginnerCourse._id,
                module: modules[1]?._id,
                weekNumber: 2,
                type: 'fill-in-blank',
                questions: [
                    {
                        questionNumber: 1,
                        questionText: 'Fill in the blank with the correct term.',
                        questionType: 'fill-blank',
                        blankSentence: 'A _______ is a block of code that repeats until a condition is met.',
                        acceptableAnswers: ['loop', 'Loop', 'LOOP'],
                        points: 5,
                        isAutoGraded: true
                    },
                    {
                        questionNumber: 2,
                        questionText: 'Fill in the blank.',
                        questionType: 'fill-blank',
                        blankSentence: 'A _______ is a reusable block of code that performs a specific task.',
                        acceptableAnswers: ['function', 'Function', 'FUNCTION', 'method', 'Method'],
                        points: 5,
                        isAutoGraded: true
                    },
                    {
                        questionNumber: 3,
                        questionText: 'Fill in the blank.',
                        questionType: 'fill-blank',
                        blankSentence: 'The process of finding and fixing errors in code is called _______.',
                        acceptableAnswers: ['debugging', 'Debugging', 'DEBUGGING', 'debug'],
                        points: 5,
                        isAutoGraded: true
                    },
                    {
                        questionNumber: 4,
                        questionText: 'Fill in the blank.',
                        questionType: 'fill-blank',
                        blankSentence: 'An _______ is a step-by-step procedure for solving a problem.',
                        acceptableAnswers: ['algorithm', 'Algorithm', 'ALGORITHM'],
                        points: 5,
                        isAutoGraded: true
                    }
                ],
                totalPoints: 20,
                passingScore: 60,
                weightage: 5,
                availableFrom: now,
                dueDate: oneWeekFromNow,
                estimatedTime: 10,
                submissionType: 'online',
                isAutoGraded: true,
                status: 'published',
                publishedAt: now
            },

            // Paraphrasing Assignment
            {
                title: 'Paraphrase Technical Sentences',
                description: 'Rewrite the following technical sentences in your own words while maintaining the meaning.',
                instructions: [
                    'Read each sentence carefully',
                    'Rewrite it in simpler terms',
                    'Maintain the technical accuracy',
                    'Do not just replace words with synonyms'
                ],
                course: beginnerCourse._id,
                module: modules[2]?._id,
                weekNumber: 3,
                type: 'paraphrasing',
                questions: [
                    {
                        questionNumber: 1,
                        questionText: 'Paraphrase the following sentence:',
                        questionType: 'paraphrase',
                        originalText: 'A compiler translates high-level source code into low-level machine code before the program is executed.',
                        instructions: 'Rewrite this sentence in simpler terms that a beginner would understand.',
                        points: 10,
                        isAutoGraded: false
                    },
                    {
                        questionNumber: 2,
                        questionText: 'Paraphrase the following sentence:',
                        questionType: 'paraphrase',
                        originalText: 'Variables are named storage locations in computer memory that can hold different values during program execution.',
                        points: 10,
                        isAutoGraded: false
                    }
                ],
                totalPoints: 20,
                passingScore: 60,
                weightage: 10,
                availableFrom: now,
                dueDate: twoWeeksFromNow,
                estimatedTime: 25,
                submissionType: 'online',
                rubric: [
                    {
                        criteria: 'Accuracy',
                        description: 'The paraphrase maintains the original meaning',
                        maxPoints: 5
                    },
                    {
                        criteria: 'Simplicity',
                        description: 'The paraphrase is simpler than the original',
                        maxPoints: 3
                    },
                    {
                        criteria: 'Originality',
                        description: 'The paraphrase is not a word-for-word substitution',
                        maxPoints: 2
                    }
                ],
                status: 'published',
                publishedAt: now
            },

            // Peer Review Assignment
            {
                title: 'Peer Review: Code Documentation',
                description: 'Review your peer\'s code documentation and provide constructive feedback.',
                instructions: [
                    'Read your assigned peer\'s submission carefully',
                    'Evaluate based on the rubric provided',
                    'Provide constructive feedback',
                    'Be respectful and helpful'
                ],
                course: beginnerCourse._id,
                weekNumber: 4,
                type: 'peer-review',
                questions: [
                    {
                        questionNumber: 1,
                        questionText: 'Write a brief documentation for a function that calculates the sum of two numbers.',
                        questionType: 'long-answer',
                        instructions: 'Include: function name, parameters, return value, and a usage example.',
                        points: 30,
                        isAutoGraded: false
                    }
                ],
                totalPoints: 30,
                passingScore: 60,
                weightage: 15,
                availableFrom: now,
                dueDate: twoWeeksFromNow,
                lateDueDate: new Date(twoWeeksFromNow.getTime() + 3 * 24 * 60 * 60 * 1000),
                lateSubmissionPenalty: 10,
                estimatedTime: 45,
                submissionType: 'online',
                isPeerReviewEnabled: true,
                peerReviewSettings: {
                    reviewsRequired: 2,
                    reviewDeadline: new Date(twoWeeksFromNow.getTime() + 5 * 24 * 60 * 60 * 1000),
                    isAnonymous: true,
                    reviewRubric: [
                        { criteria: 'Completeness', maxPoints: 5, description: 'All required elements are included' },
                        { criteria: 'Clarity', maxPoints: 5, description: 'Documentation is clear and easy to understand' },
                        { criteria: 'Technical Accuracy', maxPoints: 5, description: 'Technical details are correct' },
                        { criteria: 'Example Quality', maxPoints: 5, description: 'Usage example is helpful' }
                    ],
                    peerReviewWeight: 20
                },
                status: 'published',
                publishedAt: now
            },

            // Comprehension Assignment
            {
                title: 'Reading Comprehension: Technical Article',
                description: 'Read the following passage and answer questions about the CS jargons used.',
                course: beginnerCourse._id,
                weekNumber: 5,
                type: 'comprehension',
                passage: {
                    title: 'Understanding How Programs Run',
                    content: `When you write a program, you create source code using a programming language. This source code needs to be translated into machine code that the computer can understand. 

A compiler is a special program that translates all of your source code into machine code before the program runs. This creates an executable file that can be run multiple times without needing to compile again.

An interpreter, on the other hand, translates and executes the code line by line. This means the program runs immediately but may be slower than compiled programs.

Both compilers and interpreters help catch syntax errors - mistakes in how the code is written. Finding and fixing these errors is called debugging, which is an essential skill for every programmer.`,
                    source: 'CS Fundamentals Course Material'
                },
                questions: [
                    {
                        questionNumber: 1,
                        questionText: 'According to the passage, what does a compiler do?',
                        questionType: 'multiple-choice',
                        options: [
                            { id: 'A', text: 'Runs the program line by line' },
                            { id: 'B', text: 'Translates all source code before running' },
                            { id: 'C', text: 'Finds and fixes errors' },
                            { id: 'D', text: 'Creates source code' }
                        ],
                        correctAnswer: 'B',
                        points: 5,
                        isAutoGraded: true
                    },
                    {
                        questionNumber: 2,
                        questionText: 'What is the main difference between a compiler and an interpreter?',
                        questionType: 'short-answer',
                        instructions: 'Answer in 1-2 sentences.',
                        points: 10,
                        isAutoGraded: false
                    },
                    {
                        questionNumber: 3,
                        questionText: 'What is debugging?',
                        questionType: 'multiple-choice',
                        options: [
                            { id: 'A', text: 'Writing source code' },
                            { id: 'B', text: 'Creating an executable file' },
                            { id: 'C', text: 'Finding and fixing errors' },
                            { id: 'D', text: 'Translating code' }
                        ],
                        correctAnswer: 'C',
                        points: 5,
                        isAutoGraded: true
                    }
                ],
                totalPoints: 20,
                passingScore: 60,
                weightage: 10,
                availableFrom: now,
                dueDate: oneWeekFromNow,
                estimatedTime: 20,
                submissionType: 'online',
                status: 'published',
                publishedAt: now
            }
        ];

        await Assignment.insertMany(assignments);
        console.log(`Inserted ${assignments.length} sample assignments`);

        console.log('Assignment seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding assignments:', error);
        process.exit(1);
    }
};

createSampleAssignments();