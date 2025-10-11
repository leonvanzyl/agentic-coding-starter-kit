import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createMCPServer, MCP_TOOLS } from "@/lib/mcp-config";

// MCP server instance
let mcpServer: ReturnType<typeof createMCPServer> | null = null;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Initialize MCP server if not already done
  if (!mcpServer) {
    mcpServer = createMCPServer();
  }

  // Convert messages to model format
  const modelMessages = convertToModelMessages(messages);

  // Add system message with MCP tools information
  const systemMessage: { role: 'system'; content: string } = {
    role: 'system',
    content: `You are an AI assistant with access to MCP (Model Context Protocol) tools. You can use these tools to help users with coding tasks:

${MCP_TOOLS.map(tool => `- ${tool.name}: ${tool.description}`).join('\n')}

When you need to use a tool, respond with a JSON object in this format:
{
  "type": "tool_call",
  "tool_name": "tool_name_here",
  "arguments": {
    "arg1": "value1"
  }
}

The available tools are:
${MCP_TOOLS.map(tool => `
${tool.name}: ${tool.description}
Input schema: ${JSON.stringify(tool.inputSchema, null, 2)}
`).join('\n')}

If you don't need to use any tools, just respond normally with your message.`
  };

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL || "gpt-5-mini"),
    messages: [systemMessage, ...modelMessages],
    // Enable tool calling
    tools: {
      // MCP tools will be handled through the system message for now
      // In a more advanced implementation, you could integrate directly with MCP SDK
    },
  });

  return (
    result as unknown as { toUIMessageStreamResponse: () => Response }
  ).toUIMessageStreamResponse();
}
