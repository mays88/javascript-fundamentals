// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50,
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150,
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500,
        },
    ],
};

// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47,
        },
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150,
        },
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400,
        },
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39,
        },
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140,
        },
    },
];

function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    // console.log(ag.assignments[0].points_possible);
    try {
        if (
            !isValidCourse(course) ||
            !isValidAssignmentGroup(ag) ||
            !isValidLearnerSubmissions(submissions)
        ) {
            throw new Error("Invalid input data.");
        }

        if (!isAssignmentGroupInCourse(course, ag)) {
            throw new Error("Assignment Group does not belong to Course.");
        }

        const learnerData = {};

        // Initialize learnerData object
        submissions.forEach((submission) => {
            if (!learnerData[submission.learner_id]) {
                learnerData[submission.learner_id] = {
                    id: submission.learner_id,
                    totalPoints: 0,
                    weightedPoints: 0,
                    assignmentScores: {},
                };
            }
        });

        ag.assignments.forEach((assignment) => {
            submissions.forEach((submission) => {
                if (submission.assignment_id === assignment.id) {
                    const learner = learnerData[submission.learner_id];
                    const assignmentDueDate = new Date(assignment.due_at);
                    const submissionDate = new Date(
                        submission.submission.submitted_at
                    );
                    const lateSubmissionPenalty =
                        submissionDate > assignmentDueDate ? 0.9 : 1;

                    // Exclude assignments that are not yet due
                    if (submissionDate <= assignmentDueDate) {
                        const score =
                            submission.submission.score * lateSubmissionPenalty;
                        const maxPoints = assignment.points_possible;

                        learner.totalPoints += maxPoints;
                        learner.weightedPoints += score;

                        if (maxPoints !== 0) {
                            // Avoid division by zero
                            const percentageScore = (score / maxPoints) * 100;
                            learner.assignmentScores[assignment.id] =
                                percentageScore;
                        }
                    }
                }
            });
        });

        const result = Object.values(learnerData).map((learner) => {
            const avg =
                learner.totalPoints !== 0
                    ? (learner.weightedPoints / learner.totalPoints) * 100
                    : 0;
            return {
                id: learner.id,
                avg: avg,
                ...learner.assignmentScores,
            };
        });

        return result;
    } catch (error) {
        console.log(error);
    }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

function isAssignmentGroupInCourse(course, ag) {
    return course.id === ag.course_id;
}

function isValidCourse(course) {
    return (
        course &&
        typeof course === "object" &&
        course.hasOwnProperty("id") &&
        typeof course.id === "number" &&
        course.hasOwnProperty("name") &&
        typeof course.name === "string"
    );
}

function isValidAssignmentGroup(ag) {
    if (!ag || typeof ag !== "object") return false;
    if (!ag.hasOwnProperty("id") || typeof ag.id !== "number") return false;
    if (!ag.hasOwnProperty("name") || typeof ag.name !== "string") return false;
    if (!ag.hasOwnProperty("course_id") || typeof ag.course_id !== "number")
        return false;
    if (
        !ag.hasOwnProperty("group_weight") ||
        typeof ag.group_weight !== "number"
    )
        return false;
    if (!ag.hasOwnProperty("assignments") || !Array.isArray(ag.assignments))
        return false;

    if (!pointsPossible(ag)) return false;
    return true;
}

function pointsPossible(ag) {
    let result = true;
    for (i = 0; i < ag.assignments.length; i++) {
        if (ag.assignments[i].points_possible <= 0) {
            result = false;
        }
    }
    return result;
}
function isValidLearnerSubmissions(submissions) {
    if (!Array.isArray(submissions)) return false;
    for (const submission of submissions) {
        if (typeof submission !== "object") return false;
        if (
            !submission.hasOwnProperty("learner_id") ||
            typeof submission.learner_id !== "number"
        )
            return false;
        if (
            !submission.hasOwnProperty("assignment_id") ||
            typeof submission.assignment_id !== "number"
        )
            return false;
        if (
            !submission.hasOwnProperty("submission") ||
            typeof submission.submission !== "object"
        )
            return false;
        const {
            submission: { submitted_at, score },
        } = submission;
        if (typeof submitted_at !== "string" || isNaN(new Date(submitted_at)))
            return false;
        if (typeof score !== "number") return false;
    }
    return true;
}
