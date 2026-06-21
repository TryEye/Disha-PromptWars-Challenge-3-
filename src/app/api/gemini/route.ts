import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

export const runtime = "nodejs";

type GeminiRole = "user" | "model";

interface GeminiHistoryItem {
  role: GeminiRole;
  content: string;
}

interface GeminiRequestBody {
  message?: string;
  history?: GeminiHistoryItem[];
}

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  role: GeminiRole;
  parts: GeminiContentPart[];
}

const SYSTEM_PROMPT =
  "You are Disha, an AI sustainability coach embedded in a carbon footprint tracking app. Give concise, actionable advice to reduce carbon emissions. Be encouraging, not preachy. Use numbers when helpful. Keep responses under 120 words.";

/**
 * Gemini POST endpoint for the Disha coach experience.
 */
export async function POST(request: Request) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) {
    return Response.json(
      { error: "Gemini API key is not configured." },
      { status: 500 },
    );
  }

  let body: GeminiRequestBody;

  try {
    body = (await request.json()) as GeminiRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    return Response.json({ error: "A message is required." }, { status: 400 });
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const chat = model.startChat({
    history: buildHistory(history),
  });

  try {
    const result = await chat.sendMessage(message);
    const responseText = result.response.text().trim();

    if (!responseText) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 502 },
      );
    }

    return Response.json({ response: responseText }, { status: 200 });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Gemini request failed.";

    return Response.json(
      { error: "We could not reach the Gemini API.", details },
      { status: 502 },
    );
  }
}

/**
 * Normalizes chat history into the format expected by Gemini.
 */
function buildHistory(history: GeminiHistoryItem[]): GeminiContent[] {
  return history
    .filter((entry) => entry.content.trim().length > 0)
    .map<GeminiContent>((entry) => ({
      role: entry.role,
      parts: [{ text: entry.content.trim() }],
    }));
}

/**
 * Reads the Gemini API key from the environment, with a local file fallback.
 */
async function getGeminiApiKey(): Promise<string | undefined> {
  const envKey = process.env.GEMINI_API_KEY?.trim();

  if (envKey) {
    return envKey;
  }

  try {
    let currentDir = process.cwd();

    for (let depth = 0; depth < 6; depth += 1) {
      const candidatePath = join(currentDir, ".env.local");

      if (existsSync(candidatePath)) {
        const envFile = await readFile(candidatePath, "utf8");
        const match = envFile.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/m);
        return match?.[1]?.trim();
      }

      const parentDir = join(currentDir, "..");
      if (parentDir === currentDir) {
        break;
      }

      currentDir = parentDir;
    }
  } catch {
    return undefined;
  }

  return undefined;
}
