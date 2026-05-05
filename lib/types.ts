/*
n8n response contract expected by this app:
{
  "success": true,
  "candidate": {
    "name": "string",
    "level": "Junior" | "Mid" | "Senior",
    "skills": ["string"],
    "score": number,
    "education": "string",
    "experience_years": number,
    "summary": "string",
    "email": "string | null",
    "phone": "string | null",
    "linkedin": "string | null",
    "github": "string | null"
  },
  "matches": [
    {
      "id": number,
      "title": "string",
      "company": "string",
      "score": number,
      "skills_match": ["string"],
      "skills_missing": ["string"],
      "comment": "string"
    }
  ],
  "roadmap": [
    {
      "skill": "string",
      "priority": "High" | "Medium" | "Low",
      "companies": number,
      "time": "string",
      "resource": "string"
    }
  ],
  "analyzed_at": "ISO 8601 string"
}

If n8n fails:
{
  "success": false,
  "error": "description"
}
*/

export interface Candidate {
  name: string;
  level: "Junior" | "Mid" | "Senior";
  skills: string[];
  score: number;
  education: string;
  experience_years: number;
  summary: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

export interface JobMatch {
  id: number;
  title: string;
  company: string;
  score: number;
  skills_match: string[];
  skills_missing: string[];
  comment: string;
}

export interface RoadmapItem {
  skill: string;
  priority: "High" | "Medium" | "Low";
  companies: number;
  time: string;
  resource: string;
}

export interface CVResult {
  success: boolean;
  candidate: Candidate;
  matches: JobMatch[];
  roadmap: RoadmapItem[];
  analyzed_at: string;
  error?: string;
}

export interface HistoryEntry {
  version: string;
  date: string;
  filename: string;
  score: number;
  level: string;
  skills: string[];
  delta: number | null;
  topMatch:
    | {
        company: string;
        role: string;
        score: number;
      }
    | null;
  result: CVResult;
}

export type AnalysisStatus =
  | "idle"
  | "uploading"
  | "extracting"
  | "analyzing"
  | "matching"
  | "done"
  | "error";
