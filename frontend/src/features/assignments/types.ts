export type Assignment = {
  id: string;
  title: string;
  assignedOn: string;
  dueOn: string;
  details: AssignmentDetails;
};

export type AssignmentDetails = {
  introMessage: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowedMinutes: number;
  maxMarks: number;
  generalInstructions: string[];
  studentInfoFields: string[];
  sections: AssignmentSection[];
  answerKey: string[];
};

export type AssignmentSection = {
  id: string;
  title: string;
  heading: string;
  notes: string;
  questions: string[];
};
