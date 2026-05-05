import { NextRequest, NextResponse } from "next/server";

import type { CVResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

const DEFAULT_N8N_TIMEOUT_MS = 280000;
const MIN_N8N_TIMEOUT_MS = 10000;
const MAX_N8N_TIMEOUT_MS = 600000;

const MOCK_RESULT: CVResult = {
  success: true,
  analyzed_at: new Date().toISOString(),
  candidate: {
    name: "Demo Student",
    level: "Junior",
    skills: ["Python", "React", "FastAPI", "SQL", "Git", "Machine Learning"],
    score: 64,
    education: "Master ESTIN 2025",
    experience_years: 1,
    summary:
      "Motivated computer science student with hands-on experience in AI and web development.",
    email: "demo@estin.dz",
    phone: null,
    linkedin: null,
    github: null,
  },
  matches: [
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
      company: "Ooredoo",
      score: 74,
      skills_match: ["Python", "Machine Learning"],
      skills_missing: ["PyTorch", "MLflow"],
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
      skills_missing: ["Power BI", "Tableau"],
      comment: "Technical base is there, visualization tools needed",
    },
    {
      id: 5,
      title: "Fullstack Developer",
      company: "Fatima Startup",
      score: 42,
      skills_match: ["React", "Python"],
      skills_missing: ["Node.js", "MongoDB", "DevOps"],
      comment: "Potential is there but many gaps to fill",
    },
  ],
  roadmap: [
    {
      skill: "Docker",
      priority: "High",
      companies: 8,
      time: "2 weeks",
      resource: "https://youtube.com/docker",
    },
    {
      skill: "TypeScript",
      priority: "High",
      companies: 6,
      time: "2 weeks",
      resource: "https://youtube.com/typescript",
    },
    {
      skill: "Node.js",
      priority: "Medium",
      companies: 4,
      time: "3 weeks",
      resource: "https://youtube.com/nodejs",
    },
    {
      skill: "AWS Basics",
      priority: "Low",
      companies: 3,
      time: "4 weeks",
      resource: "https://youtube.com/aws",
    },
  ],
};

function isWebhookNotRegistered(status: number, body: string) {
  return status === 404 && /requested webhook|not registered/i.test(body);
}

function extractUpstreamError(body: string) {
  try {
    const parsed = JSON.parse(body) as { message?: string; error?: string; hint?: string };
    const parts = [parsed.error, parsed.message, parsed.hint].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(" ");
    }
  } catch {
    // Ignore parse errors and fallback to plain text.
  }

  const compactBody = body.replace(/\s+/g, " ").trim();

  if (/<\s*(!doctype|html|head|body)\b/i.test(compactBody)) {
    return "Upstream returned an HTML error page instead of JSON.";
  }

  return compactBody.length > 260 ? `${compactBody.slice(0, 260)}...` : compactBody;
}

function buildN8nWorkflowHint(upstreamError: string) {
  const normalized = upstreamError.toLowerCase();

  if (normalized.includes("unused respond to webhook node")) {
    return [
      "In n8n, align the Webhook Response Mode with your nodes:",
      "if mode is On Received or Last Node, remove Respond to Webhook nodes;",
      "if mode is Using Respond to Webhook Node, keep exactly one Respond to Webhook node on every execution path.",
    ].join(" ");
  }

  return null;
}

function buildWebhookSetupHint(webhookUrl: string) {
  if (webhookUrl.includes("/webhook-test/")) {
    const productionWebhookUrl = webhookUrl.replace("/webhook-test/", "/webhook/");
    return `Current URL uses test mode. Click "Execute workflow" in n8n before each test call, or activate the workflow and use ${productionWebhookUrl}.`;
  }

  return "Activate the n8n workflow so this webhook is registered.";
}

function buildN8n524Hint() {
  return [
    "n8n did not answer in time (Cloudflare 524).",
    "In n8n, keep a single Respond to Webhook path and make sure total runtime stays under Cloudflare limits (~100s).",
    "Reduce LLM workload or split long processing into async/background steps.",
  ].join(" ");
}

function getN8nTimeoutMs() {
  const raw = Number(process.env.N8N_WEBHOOK_TIMEOUT_MS ?? DEFAULT_N8N_TIMEOUT_MS);

  if (!Number.isFinite(raw)) {
    return DEFAULT_N8N_TIMEOUT_MS;
  }

  const normalized = Math.trunc(raw);
  if (normalized < MIN_N8N_TIMEOUT_MS || normalized > MAX_N8N_TIMEOUT_MS) {
    return DEFAULT_N8N_TIMEOUT_MS;
  }

  return normalized;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function stripCodeFence(value: string) {
  const trimmed = value.trim();

  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  return trimmed
    .replace(/^```[a-zA-Z0-9_-]*\s*/u, "")
    .replace(/```$/u, "")
    .trim();
}

function parseJsonLike(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const cleaned = stripCodeFence(value);
  if (!cleaned) {
    return value;
  }

  // n8n expression outputs can start with '=' (example: ={ "foo": 1 })
  const expressionCleaned = cleaned.replace(/^=\s*/u, "").trim();
  if (!expressionCleaned) {
    return value;
  }

  const firstChar = expressionCleaned[0];
  if (firstChar !== "{" && firstChar !== "[") {
    return value;
  }

  try {
    const parsed = JSON.parse(expressionCleaned) as unknown;

    // Some webhooks return JSON encoded as a string inside another JSON layer.
    if (typeof parsed === "string") {
      return parseJsonLike(parsed);
    }

    return parsed;
  } catch {
    return value;
  }
}

function toNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = Number(value);
    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return fallback;
}

function toStringList(value: unknown): string[] {
  const parsedValue = parseJsonLike(value);

  if (Array.isArray(parsedValue)) {
    return parsedValue
      .map((entry) => {
        if (typeof entry === "string") {
          return entry.trim();
        }

        return String(entry ?? "").trim();
      })
      .filter((entry) => entry.length > 0);
  }

  if (typeof parsedValue === "string") {
    return parsedValue
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
}

function normalizeLevel(value: unknown): "Junior" | "Mid" | "Senior" {
  const normalized = toNonEmptyString(value)?.toLowerCase();

  if (normalized === "senior") {
    return "Senior";
  }

  if (normalized === "mid" || normalized === "middle") {
    return "Mid";
  }

  return "Junior";
}

function normalizePriority(value: unknown): "High" | "Medium" | "Low" {
  const normalized = toNonEmptyString(value)?.toLowerCase();

  if (normalized === "high") {
    return "High";
  }

  if (normalized === "medium") {
    return "Medium";
  }

  return "Low";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function extractFirstResourceLinkFromSprint(sprint: UnknownRecord) {
  const weeklyMissions = parseJsonLike(sprint.weeklyMissions);
  if (!Array.isArray(weeklyMissions)) {
    return null;
  }

  for (const mission of weeklyMissions) {
    const missionRecord = asRecord(parseJsonLike(mission));
    if (!missionRecord) {
      continue;
    }

    const resources = parseJsonLike(missionRecord.resources);
    if (!Array.isArray(resources)) {
      continue;
    }

    for (const resource of resources) {
      const resourceRecord = asRecord(parseJsonLike(resource));
      if (!resourceRecord) {
        continue;
      }

      const link = toNonEmptyString(resourceRecord.link);
      if (link) {
        return link;
      }
    }
  }

  return null;
}

function mapPlanPayloadToResult(
  payload: UnknownRecord,
  fallback: {
    fullName: string;
    dreamCompany: string;
    targetRole: string;
  }
): CVResult {
  const studentName = toNonEmptyString(payload.studentName) ?? fallback.fullName;
  const targetCompany = toNonEmptyString(payload.targetCompany) ?? fallback.dreamCompany;
  const targetRole = toNonEmptyString(payload.targetRole) ?? fallback.targetRole;
  const currentMatchScore = clampScore(toNumber(payload.currentMatchScore, 0));
  const projectedMatchScore = clampScore(
    toNumber(payload.projectedMatchScore, currentMatchScore)
  );
  const planSummary =
    toNonEmptyString(payload.planSummary) ??
    `Target role: ${targetRole}. Dream company: ${targetCompany}.`;

  const sprintsInput = parseJsonLike(payload.sprints);
  const roadmap = (Array.isArray(sprintsInput) ? sprintsInput : [])
    .map((entry, index) => {
      const sprint = asRecord(parseJsonLike(entry));
      if (!sprint) {
        return null;
      }

      const title = toNonEmptyString(sprint.title) ?? `Sprint ${index + 1}`;
      const days = toNonEmptyString(sprint.days) ?? "N/A";
      const priority: "High" | "Medium" | "Low" =
        index === 0 ? "High" : index === 1 ? "Medium" : "Low";

      return {
        skill: title,
        priority,
        companies: 1,
        time: days,
        resource: extractFirstResourceLinkFromSprint(sprint) ?? "#",
      };
    })
    .filter((item): item is CVResult["roadmap"][number] => item !== null);

  return {
    success: true,
    analyzed_at: new Date().toISOString(),
    candidate: {
      name: studentName,
      level: "Junior",
      skills: [],
      score: currentMatchScore,
      education: "Not provided",
      experience_years: 0,
      summary: planSummary,
      email: null,
      phone: null,
      linkedin: null,
      github: null,
    },
    matches: [
      {
        id: 1,
        title: targetRole,
        company: targetCompany,
        score: projectedMatchScore,
        skills_match: [],
        skills_missing: [],
        comment: planSummary,
      },
    ],
    roadmap,
  };
}

function unwrapWebhookPayload(value: unknown): UnknownRecord | null {
  let current: unknown = value;
  const wrapperKeys = [
    "json",
    "body",
    "data",
    "result",
    "response",
    "output",
    "text",
    "content",
    "payload",
  ];

  for (let depth = 0; depth < 8; depth += 1) {
    current = parseJsonLike(current);

    if (Array.isArray(current)) {
      if (current.length === 0) {
        return null;
      }

      current = current[0];
      continue;
    }

    const record = asRecord(current);
    if (!record) {
      return null;
    }

    if (record.success === false || record.candidate || record.matches || record.roadmap) {
      return record;
    }

    let moved = false;
    for (const key of wrapperKeys) {
      if (key in record) {
        current = record[key];
        moved = true;
        break;
      }
    }

    if (!moved) {
      return record;
    }
  }

  return asRecord(current);
}

function normalizeWebhookResult(
  rawPayload: unknown,
  fallback: {
    fullName: string;
    dreamCompany: string;
    targetRole: string;
  }
): { result?: CVResult; error?: string } {
  const payload = unwrapWebhookPayload(rawPayload);

  if (!payload) {
    return { error: "Webhook response payload is empty or unreadable." };
  }

  if (payload.success === false) {
    return {
      error:
        toNonEmptyString(payload.error) ??
        toNonEmptyString(payload.message) ??
        "n8n failed to analyze CV",
    };
  }

  const hasPlanPayload =
    toNonEmptyString(payload.studentName) !== null ||
    toNonEmptyString(payload.targetCompany) !== null ||
    toNonEmptyString(payload.targetRole) !== null ||
    payload.sprints !== undefined;

  if (hasPlanPayload) {
    return { result: mapPlanPayloadToResult(payload, fallback) };
  }

  const candidate = asRecord(parseJsonLike(payload.candidate)) ?? {};
  const matchesInput = parseJsonLike(payload.matches);
  const roadmapInput = parseJsonLike(payload.roadmap);

  const matches = (Array.isArray(matchesInput) ? matchesInput : [])
    .map((item, index) => {
      const record = asRecord(parseJsonLike(item));
      if (!record) {
        return null;
      }

      return {
        id: Math.max(1, Math.trunc(toNumber(record.id, index + 1))),
        title: toNonEmptyString(record.title) ?? "Untitled role",
        company: toNonEmptyString(record.company) ?? "Unknown company",
        score: clampScore(toNumber(record.score, 0)),
        skills_match: toStringList(record.skills_match ?? record.skillsMatch),
        skills_missing: toStringList(record.skills_missing ?? record.skillsMissing),
        comment: toNonEmptyString(record.comment) ?? "",
      };
    })
    .filter((item): item is CVResult["matches"][number] => item !== null);

  const roadmap = (Array.isArray(roadmapInput) ? roadmapInput : [])
    .map((item) => {
      const record = asRecord(parseJsonLike(item));
      if (!record) {
        return null;
      }

      return {
        skill: toNonEmptyString(record.skill) ?? "Skill",
        priority: normalizePriority(record.priority),
        companies: Math.max(0, Math.round(toNumber(record.companies, 0))),
        time: toNonEmptyString(record.time) ?? "N/A",
        resource: toNonEmptyString(record.resource) ?? "#",
      };
    })
    .filter((item): item is CVResult["roadmap"][number] => item !== null);

  const fallbackSummary = `Target role: ${fallback.targetRole}. Dream company: ${fallback.dreamCompany}.`;

  const normalizedResult: CVResult = {
    success: true,
    analyzed_at: toNonEmptyString(payload.analyzed_at) ?? new Date().toISOString(),
    candidate: {
      name: toNonEmptyString(candidate.name) ?? fallback.fullName,
      level: normalizeLevel(candidate.level),
      skills: toStringList(candidate.skills),
      score: clampScore(toNumber(candidate.score, 0)),
      education: toNonEmptyString(candidate.education) ?? "Not provided",
      experience_years: Math.max(
        0,
        Math.round(toNumber(candidate.experience_years ?? candidate.experienceYears, 0))
      ),
      summary: toNonEmptyString(candidate.summary) ?? fallbackSummary,
      email: toNonEmptyString(candidate.email),
      phone: toNonEmptyString(candidate.phone),
      linkedin: toNonEmptyString(candidate.linkedin),
      github: toNonEmptyString(candidate.github),
    },
    matches,
    roadmap,
  };

  return { result: normalizedResult };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv") as File;
    const fullName = formData.get("fullName")?.toString().trim() ?? "";
    const dreamCompany = formData.get("dreamCompany")?.toString().trim() ?? "";
    const targetRole = formData.get("targetRole")?.toString().trim() ?? "";

    if (!file) {
      return NextResponse.json({ error: "No CV file provided" }, { status: 400 });
    }

    if (!fullName || !dreamCompany || !targetRole) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Required: cv, fullName, dreamCompany, targetRole",
        },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files accepted" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl === "mock") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return NextResponse.json({
        ...MOCK_RESULT,
        analyzed_at: new Date().toISOString(),
      });
    }

    const n8nForm = new FormData();
    n8nForm.append("cv", file, file.name);
    n8nForm.append("fullName", fullName);
    n8nForm.append("dreamCompany", dreamCompany);
    n8nForm.append("targetRole", targetRole);
    n8nForm.append("source", "nextjs-app");
    n8nForm.append("timestamp", new Date().toISOString());

    const controller = new AbortController();
    const timeoutMs = getN8nTimeoutMs();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let n8nRes: Response;
    try {
      n8nRes = await fetch(webhookUrl, {
        method: "POST",
        body: n8nForm,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!n8nRes.ok) {
      const text = await n8nRes.text();

      if (n8nRes.status === 524) {
        return NextResponse.json(
          {
            error: "n8n request timed out (524)",
            details: buildN8n524Hint(),
          },
          { status: 504 }
        );
      }

      if (isWebhookNotRegistered(n8nRes.status, text)) {
        return NextResponse.json(
          {
            error: "n8n webhook is not active.",
            details: buildWebhookSetupHint(webhookUrl),
          },
          { status: 503 }
        );
      }

      const upstreamDetails = extractUpstreamError(text) || "Unknown upstream error";
      const workflowHint = buildN8nWorkflowHint(upstreamDetails);

      if (workflowHint) {
        return NextResponse.json(
          {
            error: "Invalid n8n workflow configuration",
            details: `${upstreamDetails} ${workflowHint}`,
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          error: `n8n responded ${n8nRes.status}`,
          details: upstreamDetails,
        },
        { status: 502 }
      );
    }

    const responseBody = await n8nRes.text();
    const normalized = normalizeWebhookResult(parseJsonLike(responseBody), {
      fullName,
      dreamCompany,
      targetRole,
    });

    if (!normalized.result) {
      return NextResponse.json(
        {
          error: normalized.error ?? "Invalid response from n8n",
          details: extractUpstreamError(responseBody) || "Expected a valid CV analysis payload",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(normalized.result);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        {
          error: "Analysis timeout. Please try again.",
          details:
            "n8n took too long to respond. Increase N8N_WEBHOOK_TIMEOUT_MS (10s to 600s) or optimize the n8n workflow.",
        },
        { status: 504 }
      );
    }

    if (err instanceof TypeError) {
      return NextResponse.json(
        {
          error: "Unable to reach n8n webhook",
          details: err.message,
        },
        { status: 502 }
      );
    }

    console.error("[analyze-cv]", err);

    const details = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process CV", details },
      { status: 500 }
    );
  }
}
