const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Jargon = require('../models/Jargon');

dotenv.config();

const jargons = [
    {
        term: "API",
        acronym: "API",
        pronunciation: "/ˈeɪ.piː.aɪ/",
        definition: {
            simple: "A way for different software programs to communicate with each other",
            technical: "Application Programming Interface - a set of rules and protocols for building and interacting with software applications"
        },
        category: "web-development",
        difficulty: "beginner",
        partOfSpeech: "noun",
        examples: [
            {
                sentence: "The weather app uses an API to get current conditions.",
                context: "conversation",
                difficulty: "beginner"
            },
            {
                sentence: "We need to document our RESTful API endpoints for external developers.",
                context: "professional",
                difficulty: "intermediate"
            }
        ],
        relatedTerms: [],
        synonyms: ["interface", "endpoint"],
        usageInContext: {
            researchPaper: "The proposed framework exposes a comprehensive API for third-party integration.",
            documentation: "See the API reference for available endpoints and parameters.",
            interview: "Can you explain the difference between REST and SOAP APIs?",
            conversation: "I'm trying to use the Twitter API to fetch tweets."
        },
        multimedia: {
            video: "https://example.com/api-intro.mp4"
        },
        commonMistakes: [
            "Confusing API with UI (user interface)",
            "Thinking APIs are only for web services"
        ],
        tips: [
            "Think of an API as a waiter taking orders between your application and a service",
            "REST APIs typically use HTTP methods like GET, POST, PUT, DELETE"
        ],
        isActive: true,
        isVerified: true
    },
    {
        term: "Algorithm",
        acronym: "",
        pronunciation: "/ˈælɡəˌrɪðəm/",
        definition: {
            simple: "A step-by-step procedure for solving a problem or completing a task",
            technical: "A finite sequence of well-defined instructions for calculating a function, starting from an initial state and input, through a series of well-defined states, eventually ending in a final state with output"
        },
        category: "algorithms",
        difficulty: "beginner",
        partOfSpeech: "noun",
        examples: [
            {
                sentence: "The sorting algorithm arranges the numbers from smallest to largest.",
                context: "code",
                difficulty: "beginner"
            },
            {
                sentence: "Machine learning algorithms can identify patterns in large datasets.",
                context: "researchPaper",
                difficulty: "intermediate"
            }
        ],
        relatedTerms: [],
        synonyms: ["procedure", "process"],
        antonyms: ["heuristic"],
        usageInContext: {
            researchPaper: "We propose a novel algorithm for optimizing network routing.",
            documentation: "The algorithm complexity is O(n log n) in the average case.",
            interview: "Explain how binary search works and its time complexity.",
            conversation: "What algorithm would you use to find the shortest path?"
        },
        multimedia: {
            video: "https://example.com/algorithm-animation.mp4"
        },
        commonMistakes: [
            "Assuming all algorithms are equally efficient",
            "Not considering edge cases in algorithm design"
        ],
        tips: [
            "Break complex problems into smaller subproblems",
            "Consider time and space complexity when choosing algorithms"
        ],
        isActive: true,
        isVerified: true
    },
    {
        term: "Recursion",
        acronym: "",
        pronunciation: "/rɪˈkɜːrʒn/",
        definition: {
            simple: "When a function calls itself to solve a problem",
            technical: "A programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller instances of the same problem"
        },
        category: "programming",
        difficulty: "intermediate",
        partOfSpeech: "noun",
        examples: [
            {
                sentence: "The recursive function calculates factorials by calling itself with smaller values.",
                context: "code",
                difficulty: "intermediate"
            },
            {
                sentence: "Recursive algorithms are elegant but can lead to stack overflow if not properly managed.",
                context: "documentation",
                difficulty: "advanced"
            }
        ],
        relatedTerms: [],
        synonyms: ["self-reference"],
        antonyms: ["iteration"],
        usageInContext: {
            researchPaper: "Our recursive approach reduces the problem complexity by dividing it into subproblems.",
            documentation: "Be sure to include a base case to prevent infinite recursion.",
            interview: "Implement a recursive solution for tree traversal.",
            conversation: "I finally understand how recursion works!"
        },
        multimedia: {
            video: "https://example.com/recursion-explained.mp4"
        },
        commonMistakes: [
            "Forgetting to define a base case",
            "Using recursion when iteration would be more efficient"
        ],
        tips: [
            "Always ask: What is my base case?",
            "Visualize the call stack to understand recursion depth"
        ],
        isActive: true,
        isVerified: true
    },
    {
        term: "Microservices",
        acronym: "",
        pronunciation: "/ˈmaɪkroʊsɜːrvɪsɪz/",
        definition: {
            simple: "An architectural style where an application is made up of small, independent services",
            technical: "A method of developing software systems that structures an application as a collection of loosely coupled services, which implement business capabilities and can be developed, deployed, and scaled independently"
        },
        category: "software-engineering",
        difficulty: "advanced",
        partOfSpeech: "noun",
        examples: [
            {
                sentence: "Our e-commerce platform uses microservices for user management, inventory, and payments.",
                context: "professional",
                difficulty: "advanced"
            },
            {
                sentence: "Microservices architecture allows teams to deploy features independently.",
                context: "conversation",
                difficulty: "intermediate"
            }
        ],
        relatedTerms: [],
        synonyms: ["service-oriented architecture"],
        antonyms: ["monolithic architecture"],
        usageInContext: {
            researchPaper: "The microservices architecture improved scalability and deployment frequency.",
            documentation: "Each microservice should have its own database to ensure loose coupling.",
            interview: "What are the advantages and disadvantages of microservices?",
            conversation: "We're migrating from monolith to microservices."
        },
        multimedia: {
            video: "https://example.com/microservices-overview.mp4"
        },
        commonMistakes: [
            "Creating too many fine-grained services",
            "Not properly handling inter-service communication"
        ],
        tips: [
            "Start with domain-driven design to identify bounded contexts",
            "Use API gateways to manage requests across services"
        ],
        isActive: true,
        isVerified: true
    },
    {
        term: "Containerization",
        acronym: "",
        pronunciation: "/kənˈteɪnəraɪˈzeɪʃn/",
        definition: {
            simple: "Packaging software with all its dependencies so it can run anywhere",
            technical: "A lightweight form of virtualization that packages an application and its dependencies together in a container that can run on any compatible host system"
        },
        category: "software-engineering",
        difficulty: "advanced",
        partOfSpeech: "noun",
        examples: [
            {
                sentence: "We use Docker containers to ensure consistent environments from development to production.",
                context: "professional",
                difficulty: "advanced"
            },
            {
                sentence: "Containerization solves the 'it works on my machine' problem.",
                context: "conversation",
                difficulty: "intermediate"
            }
        ],
        relatedTerms: [],
        synonyms: ["container-based virtualization"],
        antonyms: ["traditional virtualization"],
        usageInContext: {
            researchPaper: "Containerization enables rapid scaling and deployment of applications.",
            documentation: "Each container runs in isolated user spaces sharing the host OS kernel.",
            interview: "How do containers differ from virtual machines?",
            conversation: "Have you worked with Kubernetes for orchestrating containers?"
        },
        multimedia: {
            video: "https://example.com/containerization-basics.mp4"
        },
        commonMistakes: [
            "Running multiple processes in a single container",
            "Not setting resource limits for containers"
        ],
        tips: [
            "Follow the single responsibility principle for containers",
            "Use orchestration tools like Kubernetes for production workloads"
        ],
        isActive: true,
        isVerified: true
    }
];

const seedJargons = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing jargons
        await Jargon.deleteMany({});
        console.log('Cleared existing jargons');

        // Insert new jargons
        await Jargon.insertMany(jargons);
        console.log(`Inserted ${jargons.length} jargons`);

        console.log('Jargon seeding completed!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding jargons:', error);
        process.exit(1);
    }
};

seedJargons();