import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey, model, customEndpoint } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Key is required" }, { status: 400 });
    }

    let endpoint = "https://api.deepseek.com/v1/chat/completions";
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    let body: Record<string, unknown> = {
      model: model || "deepseek-chat",
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 10,
    };

    if (provider === "openai") {
      endpoint = "https://api.openai.com/v1/chat/completions";
    } else if (provider === "anthropic") {
      endpoint = "https://api.anthropic.com/v1/messages";
      headers = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      };
      body = {
        model: model || "claude-3-haiku-20240307",
        max_tokens: 10,
        messages: [{ role: "user", content: "Hi" }],
      };
    } else if (provider === "custom" && customEndpoint) {
      endpoint = customEndpoint;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: response.ok });
  } catch {
    return NextResponse.json({ success: false, error: "Connection test failed" });
  }
}
