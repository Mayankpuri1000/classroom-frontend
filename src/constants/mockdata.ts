import { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science & Engineering",
    description:
      "An entry-level course covering the fundamental concepts of computation, problem-solving, and programming using Python.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "BIO204",
    name: "Genetics and Heredity",
    department: "Biological Sciences",
    description:
      "An exploration of the mechanisms of inheritance, gene expression, and the role of DNA in evolutionary biology.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "ECON310",
    name: "Macroeconomic Theory",
    department: "Economics",
    description:
      "A deep dive into national income accounting, inflation, unemployment, and the impact of fiscal and monetary policy on global markets.",
    createdAt: new Date().toISOString(),
  },
];