const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PlacementQuestion = require('../models/PlacementQuestion');

dotenv.config();

const placementQuestions = [
    // ============== EASY QUESTIONS ==============

    // Acronym Matching - Easy
    {
        questionText: 'Match the following acronyms with their correct meanings:',
        questionType: 'acronym-matching',
        category: 'general',
        difficulty: 'easy',
        matchingPairs: {
            leftColumn: [
                { id: 'L1', text: 'API' },
                { id: 'L2', text: 'RAM' },
                { id: 'L3', text: 'CPU' },
                { id: 'L4', text: 'URL' }
            ],
            rightColumn: [
                { id: 'R1', text: 'Random Access Memory' },
                { id: 'R2', text: 'Application Programming Interface' },
                { id: 'R3', text: 'Uniform Resource Locator' },
                { id: 'R4', text: 'Central Processing Unit' }
            ],
            correctMatches: [
                { leftId: 'L1', rightId: 'R2' },
                { leftId: 'L2', rightId: 'R1' },
                { leftId: 'L3', rightId: 'R4' },
                { leftId: 'L4', rightId: 'R3' }
            ]
        },
        explanation: 'API is Application Programming Interface, RAM is Random Access Memory, CPU is Central Processing Unit, and URL is Uniform Resource Locator.',
        points: 2,
        timeAllocation: 90,
        skillsTested: ['recognition', 'definition']
    },

    // Definition Choice - Easy
    {
        questionText: 'What is a "variable" in programming?',
        questionType: 'definition-choice',
        category: 'programming',
        difficulty: 'easy',
        options: [
            { id: 'A', text: 'A fixed value that never changes' },
            { id: 'B', text: 'A named storage location that can hold different values' },
            { id: 'C', text: 'A type of programming language' },
            { id: 'D', text: 'A hardware component' }
        ],
        correctAnswer: 'B',
        explanation: 'A variable is a named storage location in computer memory that can hold different values during program execution.',
        points: 1,
        timeAllocation: 45,
        skillsTested: ['definition']
    },

    // True/False - Easy
    {
        questionText: 'HTML is a programming language.',
        questionType: 'true-false',
        category: 'web-development',
        difficulty: 'easy',
        options: [
            { id: 'T', text: 'True' },
            { id: 'F', text: 'False' }
        ],
        correctAnswer: 'F',
        explanation: 'HTML (HyperText Markup Language) is a markup language, not a programming language. It is used to structure content on web pages.',
        points: 1,
        timeAllocation: 30,
        skillsTested: ['definition', 'recognition']
    },

    // Definition Choice - Easy
    {
        questionText: 'What does "debugging" mean in programming?',
        questionType: 'definition-choice',
        category: 'programming',
        difficulty: 'easy',
        options: [
            { id: 'A', text: 'Adding new features to a program' },
            { id: 'B', text: 'Finding and fixing errors in code' },
            { id: 'C', text: 'Compiling the program' },
            { id: 'D', text: 'Installing software' }
        ],
        correctAnswer: 'B',
        explanation: 'Debugging is the process of identifying, analyzing, and removing errors (bugs) from computer programs.',
        points: 1,
        timeAllocation: 45,
        skillsTested: ['definition']
    },

    // Fill in Blank - Easy
    {
        questionText: 'Complete the sentence: "A _______ is a step-by-step procedure for solving a problem or accomplishing a task."',
        questionType: 'fill-in-blank',
        category: 'algorithms',
        difficulty: 'easy',
        options: [
            { id: 'A', text: 'Variable' },
            { id: 'B', text: 'Algorithm' },
            { id: 'C', text: 'Database' },
            { id: 'D', text: 'Browser' }
        ],
        correctAnswer: 'B',
        explanation: 'An algorithm is a step-by-step procedure or set of rules for solving a problem or accomplishing a task.',
        points: 1,
        timeAllocation: 45,
        skillsTested: ['definition', 'context-usage']
    },

    // Usage in Sentence - Easy
    {
        questionText: 'Which sentence uses the term "compile" correctly?',
        questionType: 'usage-in-sentence',
        category: 'programming',
        difficulty: 'easy',
        options: [
            { id: 'A', text: 'I need to compile my breakfast before leaving.' },
            { id: 'B', text: 'The compiler translates source code into machine code.' },
            { id: 'C', text: 'Let me compile the internet connection.' },
            { id: 'D', text: 'We should compile the keyboard.' }
        ],
        correctAnswer: 'B',
        explanation: 'Compiling is the process of translating source code written in a programming language into machine code that can be executed by a computer.',
        points: 1,
        timeAllocation: 45,
        skillsTested: ['context-usage']
    },

    // Acronym Matching - Easy
    {
        questionText: 'Match the web-related acronyms with their meanings:',
        questionType: 'acronym-matching',
        category: 'web-development',
        difficulty: 'easy',
        matchingPairs: {
            leftColumn: [
                { id: 'L1', text: 'HTML' },
                { id: 'L2', text: 'CSS' },
                { id: 'L3', text: 'HTTP' }
            ],
            rightColumn: [
                { id: 'R1', text: 'Cascading Style Sheets' },
                { id: 'R2', text: 'HyperText Transfer Protocol' },
                { id: 'R3', text: 'HyperText Markup Language' }
            ],
            correctMatches: [
                { leftId: 'L1', rightId: 'R3' },
                { leftId: 'L2', rightId: 'R1' },
                { leftId: 'L3', rightId: 'R2' }
            ]
        },
        explanation: 'HTML is HyperText Markup Language, CSS is Cascading Style Sheets, and HTTP is HyperText Transfer Protocol.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['recognition', 'definition']
    },

    // Definition Choice - Easy
    {
        questionText: 'What is a "function" in programming?',
        questionType: 'definition-choice',
        category: 'programming',
        difficulty: 'easy',
        options: [
            { id: 'A', text: 'A type of computer virus' },
            { id: 'B', text: 'A reusable block of code that performs a specific task' },
            { id: 'C', text: 'A physical component of the computer' },
            { id: 'D', text: 'A type of internet connection' }
        ],
        correctAnswer: 'B',
        explanation: 'A function is a reusable block of code designed to perform a particular task, which can be called multiple times throughout a program.',
        points: 1,
        timeAllocation: 45,
        skillsTested: ['definition']
    },

    // ============== MEDIUM QUESTIONS ==============

    // Definition Choice - Medium
    {
        questionText: 'What is "recursion" in programming?',
        questionType: 'definition-choice',
        category: 'programming',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'A loop that runs forever' },
            { id: 'B', text: 'A technique where a function calls itself to solve a problem' },
            { id: 'C', text: 'A way to store data permanently' },
            { id: 'D', text: 'A method for connecting to the internet' }
        ],
        correctAnswer: 'B',
        explanation: 'Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller subproblems.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['definition', 'comprehension']
    },

    // Usage in Sentence - Medium
    {
        questionText: 'Which sentence correctly uses the term "multithreading"?',
        questionType: 'usage-in-sentence',
        category: 'programming',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'The application uses multithreading to perform multiple operations concurrently.' },
            { id: 'B', text: 'I multithreaded my shoes before going out.' },
            { id: 'C', text: 'The multithreading button on the keyboard is broken.' },
            { id: 'D', text: 'We need to multithread the database tables.' }
        ],
        correctAnswer: 'A',
        explanation: 'Multithreading is a technique that allows a program to perform multiple operations concurrently by executing multiple threads of execution.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['context-usage', 'definition']
    },

    // Acronym Matching - Medium
    {
        questionText: 'Match the database-related acronyms with their meanings:',
        questionType: 'acronym-matching',
        category: 'database',
        difficulty: 'medium',
        matchingPairs: {
            leftColumn: [
                { id: 'L1', text: 'SQL' },
                { id: 'L2', text: 'DBMS' },
                { id: 'L3', text: 'CRUD' },
                { id: 'L4', text: 'NoSQL' }
            ],
            rightColumn: [
                { id: 'R1', text: 'Create, Read, Update, Delete' },
                { id: 'R2', text: 'Not Only SQL' },
                { id: 'R3', text: 'Structured Query Language' },
                { id: 'R4', text: 'Database Management System' }
            ],
            correctMatches: [
                { leftId: 'L1', rightId: 'R3' },
                { leftId: 'L2', rightId: 'R4' },
                { leftId: 'L3', rightId: 'R1' },
                { leftId: 'L4', rightId: 'R2' }
            ]
        },
        explanation: 'SQL is Structured Query Language, DBMS is Database Management System, CRUD represents Create/Read/Update/Delete operations, and NoSQL means Not Only SQL.',
        points: 2,
        timeAllocation: 90,
        skillsTested: ['recognition', 'definition']
    },

    // Comprehension - Medium
    {
        questionText: 'Read the following passage and answer the questions:',
        questionType: 'comprehension',
        category: 'networking',
        difficulty: 'medium',
        passage: `TCP/IP (Transmission Control Protocol/Internet Protocol) is the fundamental communication protocol of the Internet. It defines how data should be packaged, addressed, transmitted, routed, and received. TCP ensures reliable, ordered delivery of data between applications, while IP handles addressing and routing of packets across networks. Together, they form the backbone of internet communication, enabling everything from web browsing to email and video streaming.`,
        subQuestions: [
            {
                questionText: 'What does TCP ensure in network communication?',
                options: [
                    { id: 'A', text: 'Fast but unreliable data transfer' },
                    { id: 'B', text: 'Reliable, ordered delivery of data' },
                    { id: 'C', text: 'Only video streaming' },
                    { id: 'D', text: 'Hardware compatibility' }
                ],
                correctAnswer: 'B'
            },
            {
                questionText: 'What is the role of IP in TCP/IP?',
                options: [
                    { id: 'A', text: 'Data encryption' },
                    { id: 'B', text: 'Addressing and routing of packets' },
                    { id: 'C', text: 'User authentication' },
                    { id: 'D', text: 'File compression' }
                ],
                correctAnswer: 'B'
            }
        ],
        explanation: 'TCP ensures reliable, ordered delivery of data, while IP handles addressing and routing of data packets across networks.',
        points: 3,
        timeAllocation: 120,
        skillsTested: ['comprehension', 'context-usage']
    },

    // Definition Choice - Medium
    {
        questionText: 'What is "polymorphism" in object-oriented programming?',
        questionType: 'definition-choice',
        category: 'programming',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'The ability of a variable to store multiple data types' },
            { id: 'B', text: 'The ability of objects to take on multiple forms and respond differently to the same method call' },
            { id: 'C', text: 'A way to make programs run faster' },
            { id: 'D', text: 'A security feature to protect data' }
        ],
        correctAnswer: 'B',
        explanation: 'Polymorphism allows objects of different classes to respond to the same method call in different ways, enabling more flexible and reusable code.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['definition']
    },

    // Fill in Blank - Medium
    {
        questionText: 'Complete: "A _______ is a data structure that follows the Last-In-First-Out (LIFO) principle."',
        questionType: 'fill-in-blank',
        category: 'data-structures',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'Queue' },
            { id: 'B', text: 'Stack' },
            { id: 'C', text: 'Array' },
            { id: 'D', text: 'Tree' }
        ],
        correctAnswer: 'B',
        explanation: 'A Stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle, where the last element added is the first to be removed.',
        points: 2,
        timeAllocation: 45,
        skillsTested: ['definition', 'context-usage']
    },

    // Usage in Sentence - Medium
    {
        questionText: 'Which sentence correctly uses "encapsulation"?',
        questionType: 'usage-in-sentence',
        category: 'programming',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'Encapsulation helps bundle data and methods together while hiding internal details.' },
            { id: 'B', text: 'The encapsulation of the coffee was strong this morning.' },
            { id: 'C', text: 'We need to encapsulation the network cables.' },
            { id: 'D', text: 'My computer has great encapsulation speed.' }
        ],
        correctAnswer: 'A',
        explanation: 'Encapsulation is an OOP principle that bundles data and methods that operate on that data within a single unit (class), restricting direct access to some components.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['context-usage']
    },

    // Definition Choice - Medium
    {
        questionText: 'What is an "API endpoint"?',
        questionType: 'definition-choice',
        category: 'web-development',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'The physical end of a network cable' },
            { id: 'B', text: 'A specific URL where an API can be accessed to perform operations' },
            { id: 'C', text: 'The last line of code in a program' },
            { id: 'D', text: 'A button on a website' }
        ],
        correctAnswer: 'B',
        explanation: 'An API endpoint is a specific URL (Uniform Resource Locator) where an API can receive requests and send responses for performing specific operations.',
        points: 2,
        timeAllocation: 45,
        skillsTested: ['definition']
    },

    // Acronym Matching - Medium
    {
        questionText: 'Match the networking acronyms with their meanings:',
        questionType: 'acronym-matching',
        category: 'networking',
        difficulty: 'medium',
        matchingPairs: {
            leftColumn: [
                { id: 'L1', text: 'DNS' },
                { id: 'L2', text: 'FTP' },
                { id: 'L3', text: 'VPN' },
                { id: 'L4', text: 'LAN' }
            ],
            rightColumn: [
                { id: 'R1', text: 'Virtual Private Network' },
                { id: 'R2', text: 'Domain Name System' },
                { id: 'R3', text: 'Local Area Network' },
                { id: 'R4', text: 'File Transfer Protocol' }
            ],
            correctMatches: [
                { leftId: 'L1', rightId: 'R2' },
                { leftId: 'L2', rightId: 'R4' },
                { leftId: 'L3', rightId: 'R1' },
                { leftId: 'L4', rightId: 'R3' }
            ]
        },
        explanation: 'DNS is Domain Name System, FTP is File Transfer Protocol, VPN is Virtual Private Network, and LAN is Local Area Network.',
        points: 2,
        timeAllocation: 90,
        skillsTested: ['recognition', 'definition']
    },

    // Definition Choice - Medium
    {
        questionText: 'What is "latency" in computing?',
        questionType: 'definition-choice',
        category: 'networking',
        difficulty: 'medium',
        options: [
            { id: 'A', text: 'The amount of data transferred per second' },
            { id: 'B', text: 'The delay between a request and response' },
            { id: 'C', text: 'The size of a network packet' },
            { id: 'D', text: 'The number of users connected' }
        ],
        correctAnswer: 'B',
        explanation: 'Latency is the time delay between when a request is made and when the response is received, often measured in milliseconds.',
        points: 2,
        timeAllocation: 45,
        skillsTested: ['definition']
    },

    // ============== HARD QUESTIONS ==============

    // Comprehension - Hard
    {
        questionText: 'Read the following technical passage and answer the questions:',
        questionType: 'comprehension',
        category: 'software-engineering',
        difficulty: 'hard',
        passage: `Microservices architecture is an approach to developing a single application as a suite of small, independently deployable services, each running in its own process and communicating through lightweight mechanisms like HTTP APIs. Unlike monolithic architectures where all functionality is tightly coupled, microservices allow teams to develop, deploy, and scale individual components independently. This architectural style promotes continuous delivery and enables organizations to build more resilient systems through service isolation, though it introduces complexity in areas like distributed data management, inter-service communication, and operational overhead.`,
        subQuestions: [
            {
                questionText: 'What is a key advantage of microservices over monolithic architecture?',
                options: [
                    { id: 'A', text: 'Simpler deployment process' },
                    { id: 'B', text: 'Independent development and scaling of components' },
                    { id: 'C', text: 'Lower operational costs' },
                    { id: 'D', text: 'Easier data management' }
                ],
                correctAnswer: 'B'
            },
            {
                questionText: 'What challenge does microservices architecture introduce?',
                options: [
                    { id: 'A', text: 'Tight coupling between components' },
                    { id: 'B', text: 'Inability to scale' },
                    { id: 'C', text: 'Complexity in distributed data management' },
                    { id: 'D', text: 'Single point of failure' }
                ],
                correctAnswer: 'C'
            },
            {
                questionText: 'How do microservices typically communicate?',
                options: [
                    { id: 'A', text: 'Through shared databases only' },
                    { id: 'B', text: 'Through lightweight mechanisms like HTTP APIs' },
                    { id: 'C', text: 'Through direct memory access' },
                    { id: 'D', text: 'They cannot communicate with each other' }
                ],
                correctAnswer: 'B'
            }
        ],
        explanation: 'Microservices enable independent development and scaling but introduce complexity in distributed systems management. They communicate through lightweight protocols like HTTP APIs.',
        points: 4,
        timeAllocation: 180,
        skillsTested: ['comprehension', 'application']
    },

    // Definition Choice - Hard
    {
        questionText: 'What is "dependency injection" in software development?',
        questionType: 'definition-choice',
        category: 'software-engineering',
        difficulty: 'hard',
        options: [
            { id: 'A', text: 'A technique for installing software dependencies automatically' },
            { id: 'B', text: 'A design pattern where dependencies are provided to a class rather than created internally' },
            { id: 'C', text: 'A method for injecting malicious code into applications' },
            { id: 'D', text: 'A way to speed up database queries' }
        ],
        correctAnswer: 'B',
        explanation: 'Dependency Injection is a design pattern where an object receives its dependencies from external sources rather than creating them internally, promoting loose coupling and testability.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['definition', 'application']
    },

    // Usage in Sentence - Hard
    {
        questionText: 'Which sentence correctly uses "idempotent"?',
        questionType: 'usage-in-sentence',
        category: 'web-development',
        difficulty: 'hard',
        options: [
            { id: 'A', text: 'The GET request is idempotent because making it multiple times produces the same result.' },
            { id: 'B', text: 'My code is very idempotent and runs slowly.' },
            { id: 'C', text: 'The idempotent of the server crashed last night.' },
            { id: 'D', text: 'We need more idempotent RAM for the computer.' }
        ],
        correctAnswer: 'A',
        explanation: 'Idempotent operations produce the same result regardless of how many times they are executed. HTTP GET is idempotent because multiple identical requests have the same effect as a single request.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['context-usage', 'application']
    },

    // Acronym Matching - Hard
    {
        questionText: 'Match the advanced computing acronyms with their meanings:',
        questionType: 'acronym-matching',
        category: 'software-engineering',
        difficulty: 'hard',
        matchingPairs: {
            leftColumn: [
                { id: 'L1', text: 'SOLID' },
                { id: 'L2', text: 'REST' },
                { id: 'L3', text: 'CI/CD' },
                { id: 'L4', text: 'ORM' }
            ],
            rightColumn: [
                { id: 'R1', text: 'Representational State Transfer' },
                { id: 'R2', text: 'Object-Relational Mapping' },
                { id: 'R3', text: 'Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion' },
                { id: 'R4', text: 'Continuous Integration / Continuous Deployment' }
            ],
            correctMatches: [
                { leftId: 'L1', rightId: 'R3' },
                { leftId: 'L2', rightId: 'R1' },
                { leftId: 'L3', rightId: 'R4' },
                { leftId: 'L4', rightId: 'R2' }
            ]
        },
        explanation: 'SOLID represents five design principles, REST is an architectural style for APIs, CI/CD is a development practice, and ORM maps objects to database tables.',
        points: 3,
        timeAllocation: 120,
        skillsTested: ['recognition', 'definition']
    },

    // Definition Choice - Hard
    {
        questionText: 'What is a "race condition" in concurrent programming?',
        questionType: 'definition-choice',
        category: 'programming',
        difficulty: 'hard',
        options: [
            { id: 'A', text: 'A condition where programs compete for the fastest execution time' },
            { id: 'B', text: 'A bug where the system behavior depends on the sequence or timing of uncontrollable events' },
            { id: 'C', text: 'A type of performance optimization' },
            { id: 'D', text: 'A network protocol for high-speed data transfer' }
        ],
        correctAnswer: 'B',
        explanation: 'A race condition occurs when two or more threads access shared data simultaneously, and the final outcome depends on the order of execution, leading to unpredictable behavior.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['definition', 'application']
    },

    // Comprehension - Hard
    {
        questionText: 'Read the following and answer the questions:',
        questionType: 'comprehension',
        category: 'security',
        difficulty: 'hard',
        passage: `Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. There are three main types: Stored XSS, where the malicious script is permanently stored on the target server; Reflected XSS, where the script is reflected off a web server in error messages or search results; and DOM-based XSS, where the vulnerability exists in client-side code rather than server-side. Prevention measures include input validation, output encoding, Content Security Policy (CSP) headers, and using modern frameworks that automatically escape content.`,
        subQuestions: [
            {
                questionText: 'Which type of XSS involves permanently storing malicious scripts on the server?',
                options: [
                    { id: 'A', text: 'Reflected XSS' },
                    { id: 'B', text: 'DOM-based XSS' },
                    { id: 'C', text: 'Stored XSS' },
                    { id: 'D', text: 'Session XSS' }
                ],
                correctAnswer: 'C'
            },
            {
                questionText: 'Which prevention measure is specifically mentioned for XSS protection?',
                options: [
                    { id: 'A', text: 'Two-factor authentication' },
                    { id: 'B', text: 'Content Security Policy headers' },
                    { id: 'C', text: 'Firewall configuration' },
                    { id: 'D', text: 'Password hashing' }
                ],
                correctAnswer: 'B'
            }
        ],
        explanation: 'Stored XSS permanently stores scripts on the server. CSP headers are a key prevention measure that restricts the sources from which scripts can be loaded.',
        points: 3,
        timeAllocation: 150,
        skillsTested: ['comprehension', 'application']
    },

    // Definition Choice - Hard
    {
        questionText: 'What is "sharding" in database systems?',
        questionType: 'definition-choice',
        category: 'database',
        difficulty: 'hard',
        options: [
            { id: 'A', text: 'Backing up database data regularly' },
            { id: 'B', text: 'Horizontally partitioning data across multiple database instances' },
            { id: 'C', text: 'Encrypting sensitive database fields' },
            { id: 'D', text: 'Creating indexes for faster queries' }
        ],
        correctAnswer: 'B',
        explanation: 'Sharding is a database scaling technique that horizontally partitions data across multiple database instances (shards), allowing the database to handle more data and traffic.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['definition']
    },

    // Usage in Sentence - Hard
    {
        questionText: 'Which sentence correctly uses "containerization"?',
        questionType: 'usage-in-sentence',
        category: 'software-engineering',
        difficulty: 'hard',
        options: [
            { id: 'A', text: 'We used containerization with Docker to package our application and its dependencies together.' },
            { id: 'B', text: 'The containerization of the coffee beans improved the taste.' },
            { id: 'C', text: 'My computer needs better containerization to run faster.' },
            { id: 'D', text: 'The containerization protocol crashed the network.' }
        ],
        correctAnswer: 'A',
        explanation: 'Containerization is a lightweight virtualization technology that packages applications with their dependencies into containers (like Docker), ensuring consistent behavior across environments.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['context-usage', 'application']
    },

    // Definition Choice - Hard (AI/ML)
    {
        questionText: 'What is "overfitting" in machine learning?',
        questionType: 'definition-choice',
        category: 'ai-ml',
        difficulty: 'hard',
        options: [
            { id: 'A', text: 'When a model is too simple to capture patterns in data' },
            { id: 'B', text: 'When a model learns training data too well, including noise, and fails to generalize' },
            { id: 'C', text: 'When training takes too long' },
            { id: 'D', text: 'When the dataset is too large' }
        ],
        correctAnswer: 'B',
        explanation: 'Overfitting occurs when a model learns the training data too well, including random noise and outliers, resulting in poor generalization to new, unseen data.',
        points: 2,
        timeAllocation: 60,
        skillsTested: ['definition', 'application']
    },

    // True/False - Hard
    {
        questionText: 'In a RESTful API, PUT requests are typically used for partial updates, while PATCH is used for complete replacements.',
        questionType: 'true-false',
        category: 'web-development',
        difficulty: 'hard',
        options: [
            { id: 'T', text: 'True' },
            { id: 'F', text: 'False' }
        ],
        correctAnswer: 'F',
        explanation: 'This is false. In REST, PUT is used for complete replacements (the entire resource), while PATCH is used for partial updates (only the fields being modified).',
        points: 2,
        timeAllocation: 45,
        skillsTested: ['definition', 'application']
    }
];

const seedPlacementQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing questions
        await PlacementQuestion.deleteMany({});
        console.log('Cleared existing placement questions');

        // Insert new questions
        await PlacementQuestion.insertMany(placementQuestions);
        console.log(`Inserted ${placementQuestions.length} placement questions`);

        console.log('Placement question seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding placement questions:', error);
        process.exit(1);
    }
};

seedPlacementQuestions();