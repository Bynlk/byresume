import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const { messages, config, systemPrompt } = await req.json();

        if (!config?.apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }

        const provider = config.provider || "deepseek";
        const model = config.model || "deepseek-chat";
        const apiKey = config.apiKey;
        const customEndpoint = config.customEndpoint;

        let endpoint = "https://api.deepseek.com/v1/chat/completions";
        let headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        };
        let body: any = {
            model,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2048,
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
            // Anthropic requires content to be an array of content blocks
            const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                content: [{ type: "text", text: m.content }],
            }));
            body = {
                model,
                max_tokens: 2048,
                system: systemPrompt,
                messages: anthropicMessages,
                stream: true,
            };
        } else if (provider === "custom" && customEndpoint) {
            endpoint = customEndpoint;
            // 自定义端点可能需要不同的认证方式，保持通用
            if (!headers["Authorization"]) {
                headers["Authorization"] = `Bearer ${apiKey}`;
            }
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Provider API Error: ${errorText}` },
                { status: response.status }
            );
        }

        // Proxy the stream
        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });

    } catch (error) {
        console.error("AI Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
