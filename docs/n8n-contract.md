# n8n Contract

n8n Respond to Webhook node must return:

```json
{
  "success": true,
  "candidate": {
    "name": "string",
    "level": "Junior",
    "skills": ["string"],
    "score": 64,
    "education": "string",
    "experience_years": 1,
    "summary": "string",
    "email": "string | null",
    "phone": "string | null",
    "linkedin": "string | null",
    "github": "string | null"
  },
  "matches": [
    {
      "id": 1,
      "title": "string",
      "company": "string",
      "score": 87,
      "skills_match": ["string"],
      "skills_missing": ["string"],
      "comment": "string"
    }
  ],
  "roadmap": [
    {
      "skill": "string",
      "priority": "High",
      "companies": 8,
      "time": "2 weeks",
      "resource": "https://example.com"
    }
  ],
  "analyzed_at": "2026-04-18T10:00:00.000Z"
}
```

If n8n fails, it should return:

```json
{
  "success": false,
  "error": "description of what went wrong"
}
```
