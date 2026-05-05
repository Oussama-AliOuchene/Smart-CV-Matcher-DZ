export type CVProfile = {
  name: string;
  level: "Junior" | "Mid" | "Senior";
  experience_years: number;
  education: string;
  skills: string[];
};

export type JobMatch = {
  id: number;
  title: string;
  company: string;
  score: number;
  skills_match: string[];
  skills_missing: string[];
  comment: string;
};

export const cvProfile: CVProfile = {
  name: "Oussama Benali",
  level: "Junior",
  experience_years: 1,
  education: "Master ESTIN 2025",
  skills: ["Python", "React", "FastAPI", "Machine Learning", "Git", "SQL"],
};

export const jobMatches: JobMatch[] = [
  {
    id: 1,
    title: "Backend Developer",
    company: "Yassir",
    score: 87,
    skills_match: ["Python", "FastAPI", "SQL"],
    skills_missing: ["Docker", "Redis"],
    comment: "Excellent profile, just add Docker to be perfect",
  },
  {
    id: 2,
    title: "ML Engineer",
    company: "Ooredoo Algeria",
    score: 74,
    skills_match: ["Python", "Machine Learning"],
    skills_missing: ["PyTorch", "Kubernetes", "MLflow"],
    comment: "Strong ML base, needs production tools",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Djezzy",
    score: 61,
    skills_match: ["React", "Git"],
    skills_missing: ["TypeScript", "Next.js", "Testing"],
    comment: "Good React knowledge, TypeScript is essential",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Mobilis",
    score: 55,
    skills_match: ["Python", "SQL"],
    skills_missing: ["Power BI", "Tableau", "Excel Advanced"],
    comment: "Technical base is there, visualization tools needed",
  },
  {
    id: 5,
    title: "Fullstack Developer",
    company: "Fatima Startup",
    score: 42,
    skills_match: ["React", "Python"],
    skills_missing: ["Node.js", "MongoDB", "DevOps", "AWS"],
    comment: "Potential is there but many gaps to fill",
  },
];

export const radarComparisonData = [
  { skill: "Python", candidate: 86, ideal: 92 },
  { skill: "Backend APIs", candidate: 82, ideal: 90 },
  { skill: "Cloud", candidate: 48, ideal: 80 },
  { skill: "DevOps", candidate: 45, ideal: 78 },
  { skill: "Databases", candidate: 74, ideal: 84 },
  { skill: "System Design", candidate: 56, ideal: 81 },
];

export const skillsRoadmap = [
  { skill: "Docker", learningTime: "2 weeks" },
  { skill: "Redis", learningTime: "1 week" },
  { skill: "Kubernetes", learningTime: "4 weeks" },
  { skill: "MLflow", learningTime: "1 week" },
  { skill: "TypeScript", learningTime: "3 weeks" },
];

export const landingStats = [
  { label: "Jobs Analyzed", value: 500, suffix: "+" },
  { label: "Students Matched", value: 200, suffix: "+" },
  { label: "Accuracy", value: 95, suffix: "%" },
];

export const landingSteps = [
  {
    title: "Upload CV",
    description: "Drag and drop your PDF and start your instant employability scan.",
  },
  {
    title: "AI Analysis",
    description: "Our model extracts your strengths and detects missing skills instantly.",
  },
  {
    title: "Get Matches",
    description: "Receive ranked job opportunities from Algeria's top tech employers.",
  },
];

export const landingTestimonials = [
  {
    name: "Rania M.",
    school: "ESTIN",
    role: "Data Science Student",
    quote:
      "I found my internship in less than two weeks after following the roadmap recommendations.",
  },
  {
    name: "Yacine B.",
    school: "ESTIN",
    role: "Software Engineering Student",
    quote:
      "The score breakdown helped me focus on Docker and land backend interviews quickly.",
  },
  {
    name: "Meriem K.",
    school: "ESTIN",
    role: "AI Student",
    quote:
      "The matching quality is surprisingly accurate and aligned with the Algerian market.",
  },
];

export const algerianCompanies = ["Yassir", "Djezzy", "Ooredoo", "Condor", "Mobilis", "Sonatrach"];

export const dashboardCards = [
  { title: "Total CVs Processed", value: "1,248", hint: "+18% vs last month" },
  { title: "Average Match Score", value: "68%", hint: "Across 450 active jobs" },
  { title: "Top Skill in Demand", value: "Python", hint: "Appears in 72% of listings" },
];

export const recentSubmissions = [
  { name: "Karim Boualem", level: "Junior", topMatch: "Backend Developer", score: "87%", date: "Apr 16, 2026" },
  { name: "Sarah Ait", level: "Mid", topMatch: "ML Engineer", score: "79%", date: "Apr 16, 2026" },
  { name: "Amine Benseghir", level: "Senior", topMatch: "Cloud Architect", score: "83%", date: "Apr 15, 2026" },
  { name: "Nour H.", level: "Junior", topMatch: "Data Analyst", score: "65%", date: "Apr 15, 2026" },
  { name: "Lina Boudiaf", level: "Mid", topMatch: "Frontend Developer", score: "71%", date: "Apr 14, 2026" },
];

export const commonMissingSkills = [
  { skill: "Docker", value: 48 },
  { skill: "TypeScript", value: 43 },
  { skill: "Kubernetes", value: 39 },
  { skill: "System Design", value: 32 },
  { skill: "CI/CD", value: 27 },
];

export const cvsPerDay = [
  { day: "Mon", count: 132 },
  { day: "Tue", count: 151 },
  { day: "Wed", count: 145 },
  { day: "Thu", count: 168 },
  { day: "Fri", count: 182 },
  { day: "Sat", count: 119 },
  { day: "Sun", count: 104 },
];
