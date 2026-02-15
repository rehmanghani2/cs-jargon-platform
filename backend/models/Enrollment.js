const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    // Enrollment info
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    enrollmentType: {
        type: String,
        enum: ['placement', 'promotion', 'admin-assigned', 'self-enrolled'],
        default: 'placement'
    },
    // Progress
    currentModuleIndex: {
        type: Number,
        default: 0
    },
    modulesCompleted: [{
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module'
        },
        completedAt: Date,
        quizScore: Number
    }],
    totalModulesCompleted: {
        type: Number,
        default: 0
    },
    progressPercentage: {
        type: Number,
        default: 0
    },
    // Grades
    grades: {
        quizAverage: {
            type: Number,
            default: 0
        },
        assignmentAverage: {
            type: Number,
            default: 0
        },
        attendancePercentage: {
            type: Number,
            default: 0
        },
        finalExamScore: Number,
        overallGrade: Number,
        letterGrade: String
    },
    // Status
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped', 'on-hold'],
        default: 'active'
    },
    completedAt: Date,
    droppedAt: Date,
    dropReason: String,
    // Certificate eligibility
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateIssuedAt: Date,
    certificateId: String,
    // Time tracking
    totalTimeSpent: {
        type: Number, // in minutes
        default: 0
    },
    lastAccessedAt: Date,
    // Expected completion
    expectedCompletionDate: Date,
    actualCompletionDate: Date
}, {
    timestamps: true
});

// Compound index for unique enrollment
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Calculate overall grade
EnrollmentSchema.methods.calculateOverallGrade = function(gradeWeights) {
    const weights = gradeWeights || {
        quizzes: 30,
        assignments: 40,
        attendance: 15,
        finalExam: 15
    };
    
    let overallGrade = 0;
    overallGrade += (this.grades.quizAverage || 0) * (weights.quizzes / 100);
    overallGrade += (this.grades.assignmentAverage || 0) * (weights.assignments / 100);
    overallGrade += (this.grades.attendancePercentage || 0) * (weights.attendance / 100);
    overallGrade += (this.grades.finalExamScore || 0) * (weights.finalExam / 100);
    
    this.grades.overallGrade = Math.round(overallGrade);
    
    // Assign letter grade
    if (overallGrade >= 90) this.grades.letterGrade = 'A';
    else if (overallGrade >= 80) this.grades.letterGrade = 'B';
    else if (overallGrade >= 70) this.grades.letterGrade = 'C';
    else if (overallGrade >= 60) this.grades.letterGrade = 'D';
    else this.grades.letterGrade = 'F';
    
    return this.grades;
};

module.exports = mongoose.model('Enrollment', EnrollmentSchema);