type DetailSeed = {
  subject: string;
  className: string;
  chapter: string;
  timeAllowedMinutes: number;
  maxMarks: number;
  difficultyTag: string;
};

const schoolName = "Delhi Public School, Sector-4, Bokaro";

const buildDetails = (seed: DetailSeed) => ({
  introMessage: `Certainly, Lakshya! Here are customized question paper details for your ${seed.subject} class based on ${seed.chapter}.`,
  schoolName,
  subject: seed.subject,
  className: seed.className,
  timeAllowedMinutes: seed.timeAllowedMinutes,
  maxMarks: seed.maxMarks,
  generalInstructions: [
    "All questions are compulsory unless stated otherwise.",
    "Write neat and complete steps for descriptive and numerical answers.",
    `Difficulty Mix: ${seed.difficultyTag}`,
  ],
  studentInfoFields: ["Name", "Roll Number", "Class/Section"],
  sections: [
    {
      id: "sec-a",
      title: "Section A",
      heading: "Short Answer Questions",
      notes: "Attempt all questions. Each question carries 2 marks.",
      questions: [
        `Define one key concept from ${seed.chapter} with one example.`,
        `Explain the importance of ${seed.chapter} in day-to-day life.`,
        `Differentiate between two related terms from ${seed.chapter}.`,
        `List two applications connected to ${seed.chapter}.`,
        `Write one challenge-level question and solve it briefly.`,
      ],
    },
    {
      id: "sec-b",
      title: "Section B",
      heading: "Long Answer Questions",
      notes: "Attempt any 3 questions. Each question carries 5 marks.",
      questions: [
        `Describe ${seed.chapter} in detail with suitable examples.`,
        `Explain a practical case study based on ${seed.chapter}.`,
        `Write a step-wise explanation with a diagram/table wherever required.`,
        `Analyze common mistakes students make in ${seed.chapter} and how to avoid them.`,
      ],
    },
  ],
  answerKey: [
    `${seed.chapter} should be explained with definition, properties, and one real-world example.`,
    "Answers must include clear reasoning, not only final statements.",
    "For long answers, include structured points: concept, process, application, conclusion.",
    "Numerical or logic-based responses should include all intermediate steps.",
    "Award partial marks for correct approach even if final result has minor error.",
  ],
});

const assignmentSeeds: Array<{
  id: string;
  title: string;
  assignedOn: string;
  dueOn: string;
  detailSeed: DetailSeed;
}> = [
  {
    id: "a1",
    title: "Quiz on Electricity",
    assignedOn: "20-06-2025",
    dueOn: "21-06-2025",
    detailSeed: {
      subject: "Science",
      className: "8th",
      chapter: "Electric Current and Its Effects",
      timeAllowedMinutes: 45,
      maxMarks: 20,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a2",
    title: "Chemistry Lab Report",
    assignedOn: "22-06-2025",
    dueOn: "25-06-2025",
    detailSeed: {
      subject: "Chemistry",
      className: "9th",
      chapter: "Chemical Reactions and Equations",
      timeAllowedMinutes: 60,
      maxMarks: 30,
      difficultyTag: "Moderate + Challenge",
    },
  },
  {
    id: "a3",
    title: "Algebra Practice Set",
    assignedOn: "24-06-2025",
    dueOn: "28-06-2025",
    detailSeed: {
      subject: "Mathematics",
      className: "7th",
      chapter: "Algebraic Expressions",
      timeAllowedMinutes: 50,
      maxMarks: 25,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a4",
    title: "History Chapter 3 Worksheet",
    assignedOn: "26-06-2025",
    dueOn: "30-06-2025",
    detailSeed: {
      subject: "History",
      className: "6th",
      chapter: "From Hunting-Gathering to Growing Food",
      timeAllowedMinutes: 40,
      maxMarks: 20,
      difficultyTag: "Easy",
    },
  },
  {
    id: "a5",
    title: "Grammar and Comprehension",
    assignedOn: "28-06-2025",
    dueOn: "02-07-2025",
    detailSeed: {
      subject: "English",
      className: "5th",
      chapter: "Grammar and Reading Skills",
      timeAllowedMinutes: 45,
      maxMarks: 25,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a6",
    title: "Quiz on Magnetism",
    assignedOn: "30-06-2025",
    dueOn: "03-07-2025",
    detailSeed: {
      subject: "Science",
      className: "8th",
      chapter: "Magnetic Effects of Electric Current",
      timeAllowedMinutes: 45,
      maxMarks: 20,
      difficultyTag: "Moderate",
    },
  },
  {
    id: "a7",
    title: "Geography Map Activity",
    assignedOn: "01-07-2025",
    dueOn: "05-07-2025",
    detailSeed: {
      subject: "Geography",
      className: "7th",
      chapter: "Our Environment and Maps",
      timeAllowedMinutes: 50,
      maxMarks: 25,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a8",
    title: "Computer Basics MCQ",
    assignedOn: "03-07-2025",
    dueOn: "06-07-2025",
    detailSeed: {
      subject: "Computer Science",
      className: "6th",
      chapter: "Computer Fundamentals",
      timeAllowedMinutes: 35,
      maxMarks: 20,
      difficultyTag: "Easy",
    },
  },
  {
    id: "a9",
    title: "Biology Cell Structure",
    assignedOn: "05-07-2025",
    dueOn: "09-07-2025",
    detailSeed: {
      subject: "Biology",
      className: "9th",
      chapter: "Cell: Structure and Functions",
      timeAllowedMinutes: 55,
      maxMarks: 30,
      difficultyTag: "Moderate + Challenge",
    },
  },
  {
    id: "a10",
    title: "Hindi Writing Practice",
    assignedOn: "07-07-2025",
    dueOn: "10-07-2025",
    detailSeed: {
      subject: "Hindi",
      className: "6th",
      chapter: "Rachnatmak Lekhan",
      timeAllowedMinutes: 40,
      maxMarks: 20,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a11",
    title: "Quiz on Fractions",
    assignedOn: "09-07-2025",
    dueOn: "12-07-2025",
    detailSeed: {
      subject: "Mathematics",
      className: "5th",
      chapter: "Fractions and Decimals",
      timeAllowedMinutes: 45,
      maxMarks: 20,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a12",
    title: "Physics Numericals Set A",
    assignedOn: "11-07-2025",
    dueOn: "15-07-2025",
    detailSeed: {
      subject: "Physics",
      className: "10th",
      chapter: "Light - Reflection and Refraction",
      timeAllowedMinutes: 60,
      maxMarks: 30,
      difficultyTag: "Moderate + Challenge",
    },
  },
  {
    id: "a13",
    title: "Essay: Climate Change",
    assignedOn: "13-07-2025",
    dueOn: "17-07-2025",
    detailSeed: {
      subject: "English",
      className: "8th",
      chapter: "Essay Writing and Critical Thinking",
      timeAllowedMinutes: 50,
      maxMarks: 25,
      difficultyTag: "Moderate",
    },
  },
  {
    id: "a14",
    title: "Civics Case Study",
    assignedOn: "15-07-2025",
    dueOn: "19-07-2025",
    detailSeed: {
      subject: "Civics",
      className: "8th",
      chapter: "Understanding Laws and Governance",
      timeAllowedMinutes: 50,
      maxMarks: 25,
      difficultyTag: "Moderate + Challenge",
    },
  },
  {
    id: "a15",
    title: "Trigonometry Drill",
    assignedOn: "17-07-2025",
    dueOn: "20-07-2025",
    detailSeed: {
      subject: "Mathematics",
      className: "10th",
      chapter: "Introduction to Trigonometry",
      timeAllowedMinutes: 60,
      maxMarks: 30,
      difficultyTag: "Moderate + Challenge",
    },
  },
  {
    id: "a16",
    title: "Chemistry Formula Test",
    assignedOn: "19-07-2025",
    dueOn: "22-07-2025",
    detailSeed: {
      subject: "Chemistry",
      className: "10th",
      chapter: "Periodic Classification of Elements",
      timeAllowedMinutes: 45,
      maxMarks: 25,
      difficultyTag: "Moderate",
    },
  },
  {
    id: "a17",
    title: "Reading Assessment",
    assignedOn: "21-07-2025",
    dueOn: "24-07-2025",
    detailSeed: {
      subject: "English",
      className: "7th",
      chapter: "Reading Comprehension",
      timeAllowedMinutes: 40,
      maxMarks: 20,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a18",
    title: "Science Practical Submission",
    assignedOn: "23-07-2025",
    dueOn: "27-07-2025",
    detailSeed: {
      subject: "Science",
      className: "9th",
      chapter: "Matter in Our Surroundings",
      timeAllowedMinutes: 55,
      maxMarks: 30,
      difficultyTag: "Moderate",
    },
  },
  {
    id: "a19",
    title: "Math Unit Test Revision",
    assignedOn: "25-07-2025",
    dueOn: "29-07-2025",
    detailSeed: {
      subject: "Mathematics",
      className: "8th",
      chapter: "Linear Equations in One Variable",
      timeAllowedMinutes: 50,
      maxMarks: 25,
      difficultyTag: "Easy + Moderate",
    },
  },
  {
    id: "a20",
    title: "Final Quiz: Term I",
    assignedOn: "27-07-2025",
    dueOn: "31-07-2025",
    detailSeed: {
      subject: "General Science",
      className: "8th",
      chapter: "Term-I Mixed Topics",
      timeAllowedMinutes: 60,
      maxMarks: 30,
      difficultyTag: "Easy + Moderate + Challenge",
    },
  },
];

export const mockAssignments = [
  ...assignmentSeeds.map((item) => ({
    id: item.id,
    title: item.title,
    assignedOn: item.assignedOn,
    dueOn: item.dueOn,
    details: buildDetails(item.detailSeed),
  })),
];
