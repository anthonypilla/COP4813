
// Assignment 11 - Dynamic Objects
// BSIT Course Advisor

const completedCoursesContainer = document.getElementById("completedCourses");
const progressMessage = document.getElementById("progressMessage");
const courseList = document.getElementById("courseList");
const fallCoursesContainer = document.getElementById("fallCourses");
const springCoursesContainer = document.getElementById("springCourses");
const planMessage = document.getElementById("planMessage");
const courseInformation = document.getElementById("courseInformation");

// Store course data and student selections.
let courses = [];
let completedCourses = new Set();
let fallPlan = [];
let springPlan = [];

// Load the course information from the JSON file.
async function loadCourses() {
    try {
        const response = await fetch("courses.json");

        if (!response.ok) {
            throw new Error("Could not load courses.json");
        }

        const data = await response.json();
        courses = data.courses;

        displayCompletedCourses();
        displayAvailableCourses();
        displayCoursePlan();

    } catch (error) {
        console.error("Error loading course data:", error);

        courseList.textContent =
            "There was an error loading the course information. Make sure courses.json is in the same folder as this page.";
    }
}

// Find a course using its course code.
function findCourse(courseCode) {
    return courses.find(course => course.code === courseCode);
}

// Check whether a course prerequisite has been completed.
function checkPrerequisites(requirement) {
    if (!requirement || requirement.type === "none_listed") {
        return true;
    }

    // Check individual course requirements.
    if (requirement.courses) {
        if (requirement.type === "all") {
            return requirement.courses.every(code =>
                completedCourses.has(code)
            );
        }

        if (requirement.type === "any") {
            return requirement.courses.some(code =>
                completedCourses.has(code)
            );
        }
    }

    // Check nested prerequisite groups.
    if (requirement.groups) {
        if (requirement.type === "all") {
            return requirement.groups.every(group =>
                checkPrerequisites(group)
            );
        }

        if (requirement.type === "any") {
            return requirement.groups.some(group =>
                checkPrerequisites(group)
            );
        }
    }

    return true;
}

// Create a readable explanation of prerequisite requirements.
function getPrerequisiteDescription(requirement, parentType = null) {
    if (!requirement || requirement.type === "none_listed") {
        return "No prerequisites required.";
    }

    let description = "";

    if (requirement.type === "all") {
        if (requirement.groups) {
            description = requirement.groups
                .map(group => getPrerequisiteDescription(group, "all"))
                .join(" AND ");
        } else {
            description = requirement.courses
                .map(code => {
                    const course = findCourse(code);
                    return course ? `${course.code} - ${course.name}` : code;
                })
                .join(" AND ");
        }
    }

    if (requirement.type === "any") {
        description = requirement.courses
            .map(code => {
                const course = findCourse(code);
                return course ? `${course.code} - ${course.name}` : code;
            })
            .join(" OR ");
    }

    // Add parentheses when an OR group is part of an AND requirement.
    if (parentType === "all" && requirement.type === "any") {
        return `(${description})`;
    }

    return description;
}

// Identify which prerequisites are still missing.
function getMissingPrerequisites(requirement) {
    if (!requirement || requirement.type === "none_listed") {
        return [];
    }

    if (requirement.courses) {
        const missing = requirement.courses.filter(code =>
            !completedCourses.has(code)
        );

        if (requirement.type === "all") {
            return missing;
        }

        // An OR requirement is satisfied if any option is completed.
        if (requirement.type === "any") {
            return requirement.courses.some(code =>
                completedCourses.has(code)
            ) ? [] : requirement.courses;
        }
    }

    if (requirement.groups) {
        if (requirement.type === "all") {
            return requirement.groups.flatMap(group =>
                getMissingPrerequisites(group)
            );
        }

        if (requirement.type === "any") {
            return requirement.groups.some(group =>
                checkPrerequisites(group)
            ) ? [] : requirement.groups.flatMap(group =>
                getMissingPrerequisites(group)
            );
        }
    }

    return [];
}

// Get the display name for a course category.
function getCategoryName(category) {
    const categories = {
        "lower-level": "Lower-Level Course",
        "bsit-core": "BSIT Core Requirement",
        "technical-elective": "Upper-Level Technical Elective",
        "supporting-prerequisite": "Supporting Prerequisite"
    };

    return categories[category] || "Course";
}

// Generate the completed-course checkbox list from JSON.
function displayCompletedCourses() {
    completedCoursesContainer.replaceChildren();

    const categoryOrder = [
        "lower-level",
        "bsit-core",
        "technical-elective",
        "supporting-prerequisite"
    ];

    categoryOrder.forEach(category => {
        const categoryCourses = courses.filter(course =>
            course.category === category
        );

        if (categoryCourses.length === 0) {
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent = getCategoryName(category);
        completedCoursesContainer.appendChild(heading);

        const group = document.createElement("div");
        group.className = "completed-course-group";

        categoryCourses.forEach(course => {
            const label = document.createElement("label");
            label.className = "completed-course-option";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = course.code;
            checkbox.checked = completedCourses.has(course.code);
            checkbox.dataset.courseCode = course.code;

            const text = document.createElement("span");
            text.textContent = `${course.code} - ${course.name}`;

            label.appendChild(checkbox);
            label.appendChild(text);
            group.appendChild(label);
        });

        completedCoursesContainer.appendChild(group);
    });

    progressMessage.textContent =
        `${completedCourses.size} course(s) marked as completed.`;
}

// Generate the available course cards.
function displayAvailableCourses() {
    courseList.replaceChildren();

    if (courses.length === 0) {
        courseList.textContent = "No courses are available.";
        return;
    }

    courses.forEach(course => {
        const card = document.createElement("div");
        card.className = "advisor-course-card";

        const title = document.createElement("h3");
        title.textContent = `${course.code} - ${course.name}`;
        card.appendChild(title);

        const category = document.createElement("p");
        category.textContent = getCategoryName(course.category);
        card.appendChild(category);

        const isCompleted = completedCourses.has(course.code);
        const isPlanned =
            fallPlan.includes(course.code) ||
            springPlan.includes(course.code);

        const eligible = checkPrerequisites(course.prerequisites);

        const status = document.createElement("p");
        status.className = "course-status";

        if (isCompleted) {
            status.textContent = "Completed";
        } else if (isPlanned) {
            status.textContent = "Added to Course Plan";
        } else if (eligible) {
            status.textContent = "Available - Prerequisites Met";
        } else {
            status.textContent = "Not Available - Prerequisites Needed";
        }

        card.appendChild(status);

        // Show missing prerequisite information for unavailable courses.
        if (!eligible && !isCompleted) {
            const missing = getMissingPrerequisites(
                course.prerequisites
            );

            const missingText = document.createElement("p");
            missingText.className = "missing-prerequisites";
            missingText.textContent =
                "Still needed: " + missing.join(", ");

            card.appendChild(missingText);
        }

        // Display preferred-course notes when available.
        if (course.notes) {
            const notes = document.createElement("p");
            notes.textContent = course.notes;
            card.appendChild(notes);
        }

        // Course information button.
        const infoButton = document.createElement("button");
        infoButton.type = "button";
        infoButton.textContent = "View Course Information";
        infoButton.dataset.action = "info";
        infoButton.dataset.courseCode = course.code;
        card.appendChild(infoButton);

        // Only allow eligible courses to be added to the plan.
        if (eligible && !isCompleted && !isPlanned) {
            const fallButton = document.createElement("button");
            fallButton.type = "button";
            fallButton.textContent = "Add to Fall";
            fallButton.dataset.action = "add-fall";
            fallButton.dataset.courseCode = course.code;
            card.appendChild(fallButton);

            const springButton = document.createElement("button");
            springButton.type = "button";
            springButton.textContent = "Add to Spring";
            springButton.dataset.action = "add-spring";
            springButton.dataset.courseCode = course.code;
            card.appendChild(springButton);
        }

        courseList.appendChild(card);
    });
}

// Display detailed information about a selected course.
function showCourseInformation(courseCode) {
    const course = findCourse(courseCode);

    if (!course) {
        return;
    }

    courseInformation.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = `${course.code} - ${course.name}`;
    courseInformation.appendChild(heading);

    const category = document.createElement("p");
    category.textContent = getCategoryName(course.category);
    courseInformation.appendChild(category);

    const prerequisiteHeading = document.createElement("h4");
    prerequisiteHeading.textContent = "Prerequisites";
    courseInformation.appendChild(prerequisiteHeading);

    const prerequisiteText = document.createElement("p");
    prerequisiteText.textContent =
        getPrerequisiteDescription(course.prerequisites);
    courseInformation.appendChild(prerequisiteText);

    const status = document.createElement("p");
    status.textContent = checkPrerequisites(course.prerequisites)
        ? "You have satisfied the listed prerequisites for this course."
        : "You have not yet satisfied all the listed prerequisites.";
    courseInformation.appendChild(status);

    if (course.notes) {
        const notesHeading = document.createElement("h4");
        notesHeading.textContent = "Additional Notes";
        courseInformation.appendChild(notesHeading);

        const notes = document.createElement("p");
        notes.textContent = course.notes;
        courseInformation.appendChild(notes);
    }
}

// Add a course to a semester plan.
function addCourseToPlan(courseCode, semester) {
    const course = findCourse(courseCode);

    if (!course) {
        return;
    }

    if (
        completedCourses.has(courseCode) ||
        !checkPrerequisites(course.prerequisites) ||
        fallPlan.includes(courseCode) ||
        springPlan.includes(courseCode)
    ) {
        return;
    }

    if (semester === "fall") {
        fallPlan.push(courseCode);
    } else if (semester === "spring") {
        springPlan.push(courseCode);
    }

    displayCoursePlan();
    displayAvailableCourses();

    planMessage.textContent =
        `${course.code} has been added to your ${semester} semester plan.`;
}

// Remove a course from a semester plan.
function removeCourseFromPlan(courseCode, semester) {
    if (semester === "fall") {
        fallPlan = fallPlan.filter(code => code !== courseCode);
    } else if (semester === "spring") {
        springPlan = springPlan.filter(code => code !== courseCode);
    }

    displayCoursePlan();
    displayAvailableCourses();

    planMessage.textContent =
        `${courseCode} has been removed from your course plan.`;
}

// Generate the course plan for both semesters.
function displayCoursePlan() {
    fallCoursesContainer.replaceChildren();
    springCoursesContainer.replaceChildren();

    displaySemesterCourses(fallPlan, fallCoursesContainer, "fall");
    displaySemesterCourses(springPlan, springCoursesContainer, "spring");

    if (fallPlan.length === 0 && springPlan.length === 0) {
        planMessage.textContent = "Your course plan is currently empty.";
    }
}

// Generate the courses for an individual semester.
function displaySemesterCourses(courseCodes, container, semester) {
    if (courseCodes.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No courses added yet.";
        container.appendChild(emptyMessage);
        return;
    }

    courseCodes.forEach(code => {
        const course = findCourse(code);

        if (!course) {
            return;
        }

        const item = document.createElement("div");
        item.className = "planned-course";

        const courseName = document.createElement("span");
        courseName.textContent = `${course.code} - ${course.name}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.dataset.action = "remove";
        removeButton.dataset.courseCode = code;
        removeButton.dataset.semester = semester;

        item.appendChild(courseName);
        item.appendChild(removeButton);
        container.appendChild(item);
    });
}

// Handle changes to dynamically generated completed-course checkboxes.
completedCoursesContainer.addEventListener("change", function(event) {
    const checkbox = event.target;

    if (!checkbox.matches("input[data-course-code]")) {
        return;
    }

    const courseCode = checkbox.dataset.courseCode;

    if (checkbox.checked) {
        completedCourses.add(courseCode);

        // Remove a completed course from either semester plan.
        fallPlan = fallPlan.filter(code => code !== courseCode);
        springPlan = springPlan.filter(code => code !== courseCode);
    } else {
        completedCourses.delete(courseCode);
    }

    displayCompletedCourses();
    displayAvailableCourses();
    displayCoursePlan();

    showCourseInformation(courseCode);

    progressMessage.textContent =
        `${completedCourses.size} course(s) marked as completed.`;
});

// Handle clicks on dynamically generated course buttons.
courseList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const courseCode = button.dataset.courseCode;
    const action = button.dataset.action;

    if (action === "info") {
        showCourseInformation(courseCode);
    } else if (action === "add-fall") {
        addCourseToPlan(courseCode, "fall");
    } else if (action === "add-spring") {
        addCourseToPlan(courseCode, "spring");
    }
});

// Handle clicks on dynamically generated Remove buttons.
function handlePlanRemoval(event) {
    const button = event.target.closest("button[data-action='remove']");

    if (!button) {
        return;
    }

    removeCourseFromPlan(
        button.dataset.courseCode,
        button.dataset.semester
    );
}

fallCoursesContainer.addEventListener("click", handlePlanRemoval);
springCoursesContainer.addEventListener("click", handlePlanRemoval);

// Start the course advisor.
loadCourses();

