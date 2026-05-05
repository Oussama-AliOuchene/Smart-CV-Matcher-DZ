import "server-only";

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

import type { CVResult, HistoryEntry } from "@/lib/types";

const HISTORY_FILE = join(process.cwd(), ".history.json");
const LEGACY_USER_ID = "legacy-public";
const USER_HISTORY_LIMIT = 20;

type StoredHistoryEntry = HistoryEntry & {
  userId: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function cleanString(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function cleanNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function cleanSkills(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function cleanTopMatch(value: unknown, result: CVResult): HistoryEntry["topMatch"] {
  const record = asRecord(value);

  if (record) {
    const company = cleanString(record.company);
    const role = cleanString(record.role);
    const score = cleanNumber(record.score, 0);

    if (company && role) {
      return { company, role, score };
    }
  }

  const firstMatch = result.matches[0];
  if (!firstMatch) {
    return null;
  }

  return {
    company: firstMatch.company,
    role: firstMatch.title,
    score: firstMatch.score,
  };
}

function normalizeResult(value: unknown): CVResult | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const candidate = asRecord(record.candidate);
  const matches = Array.isArray(record.matches) ? record.matches : [];
  const roadmap = Array.isArray(record.roadmap) ? record.roadmap : [];

  if (!candidate) {
    return null;
  }

  return {
    success: typeof record.success === "boolean" ? record.success : true,
    analyzed_at: cleanString(record.analyzed_at, new Date().toISOString()),
    candidate: {
      name: cleanString(candidate.name, "Unknown"),
      level:
        cleanString(candidate.level, "Junior") === "Senior"
          ? "Senior"
          : cleanString(candidate.level, "Junior") === "Mid"
          ? "Mid"
          : "Junior",
      skills: cleanSkills(candidate.skills),
      score: cleanNumber(candidate.score, 0),
      education: cleanString(candidate.education, "Not provided"),
      experience_years: cleanNumber(candidate.experience_years, 0),
      summary: cleanString(candidate.summary, ""),
      email: cleanString(candidate.email, "") || null,
      phone: cleanString(candidate.phone, "") || null,
      linkedin: cleanString(candidate.linkedin, "") || null,
      github: cleanString(candidate.github, "") || null,
    },
    matches: matches
      .map((item, index) => {
        const match = asRecord(item);
        if (!match) {
          return null;
        }

        return {
          id: cleanNumber(match.id, index + 1),
          title: cleanString(match.title, "Untitled role"),
          company: cleanString(match.company, "Unknown company"),
          score: cleanNumber(match.score, 0),
          skills_match: cleanSkills(match.skills_match),
          skills_missing: cleanSkills(match.skills_missing),
          comment: cleanString(match.comment, ""),
        };
      })
      .filter((item): item is CVResult["matches"][number] => item !== null),
    roadmap: roadmap
      .map((item) => {
        const step = asRecord(item);
        if (!step) {
          return null;
        }

        const priority = cleanString(step.priority, "Low");

        return {
          skill: cleanString(step.skill, "Skill"),
          priority:
            priority === "High" ? "High" : priority === "Medium" ? "Medium" : "Low",
          companies: cleanNumber(step.companies, 0),
          time: cleanString(step.time, "N/A"),
          resource: cleanString(step.resource, "#"),
        };
      })
      .filter((item): item is CVResult["roadmap"][number] => item !== null),
    error: cleanString(record.error, "") || undefined,
  };
}

function normalizeHistoryEntry(value: unknown, index: number): StoredHistoryEntry | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const result = normalizeResult(record.result);
  if (!result) {
    return null;
  }

  const score = cleanNumber(record.score, result.candidate.score);
  const skills = cleanSkills(record.skills);
  const version = cleanString(record.version, `V${index + 1}`);
  const date = cleanString(record.date, new Date().toISOString());
  const filename = cleanString(record.filename, "cv.pdf");
  const level = cleanString(record.level, result.candidate.level);
  const delta =
    typeof record.delta === "number" && Number.isFinite(record.delta)
      ? record.delta
      : null;
  const userId = cleanString(record.userId, LEGACY_USER_ID);

  return {
    version,
    date,
    filename,
    score,
    level,
    skills: skills.length > 0 ? skills : result.candidate.skills,
    delta,
    topMatch: cleanTopMatch(record.topMatch, result),
    result,
    userId,
  };
}

function readAllStoredHistory(): StoredHistoryEntry[] {
  if (!existsSync(HISTORY_FILE)) {
    return [];
  }

  try {
    const raw = readFileSync(HISTORY_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry, index) => normalizeHistoryEntry(entry, index))
      .filter((entry): entry is StoredHistoryEntry => entry !== null);
  } catch {
    return [];
  }
}

function writeAllStoredHistory(entries: StoredHistoryEntry[]) {
  const sorted = [...entries].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      return 0;
    }

    return bTime - aTime;
  });

  writeFileSync(HISTORY_FILE, JSON.stringify(sorted, null, 2));
}

function toPublicEntry(entry: StoredHistoryEntry): HistoryEntry {
  const { userId: _userId, ...publicEntry } = entry;
  return publicEntry;
}

function getUserScopedEntries(allEntries: StoredHistoryEntry[], userId: string) {
  const ownEntries = allEntries.filter((entry) => entry.userId === userId);
  if (ownEntries.length > 0) {
    return ownEntries;
  }

  return allEntries.filter((entry) => entry.userId === LEGACY_USER_ID);
}

export function getHistoryForUser(userId: string): HistoryEntry[] {
  return getUserScopedEntries(readAllStoredHistory(), userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((entry) => toPublicEntry(entry));
}

export function saveHistoryForUser(input: {
  userId: string;
  filename: string;
  result: CVResult;
}) {
  const allEntries = readAllStoredHistory();
  const userEntries = allEntries
    .filter((entry) => entry.userId === input.userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const previous = userEntries[0];
  const delta = previous ? input.result.candidate.score - previous.score : null;

  const entry: StoredHistoryEntry = {
    userId: input.userId,
    version: `V${userEntries.length + 1}`,
    date: new Date().toISOString(),
    filename: input.filename,
    score: input.result.candidate.score,
    level: input.result.candidate.level,
    skills: input.result.candidate.skills,
    delta,
    topMatch: input.result.matches[0]
      ? {
          company: input.result.matches[0].company,
          role: input.result.matches[0].title,
          score: input.result.matches[0].score,
        }
      : null,
    result: input.result,
  };

  const otherEntries = allEntries.filter((item) => item.userId !== input.userId);
  const limitedUserEntries = [entry, ...userEntries].slice(0, USER_HISTORY_LIMIT);

  writeAllStoredHistory([...otherEntries, ...limitedUserEntries]);

  return toPublicEntry(entry);
}

export function deleteHistoryForUser(userId: string, version?: string) {
  const allEntries = readAllStoredHistory();

  const filteredEntries = allEntries.filter((entry) => {
    if (entry.userId !== userId) {
      return true;
    }

    if (!version) {
      return false;
    }

    return entry.version !== version;
  });

  const deletedCount = allEntries.length - filteredEntries.length;
  if (deletedCount > 0) {
    writeAllStoredHistory(filteredEntries);
  }

  return deletedCount;
}
