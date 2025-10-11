import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Define MCP tools configuration
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// Example MCP tools - you can customize these based on your needs
export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'run_terminal_cmd',
    description: 'Execute terminal commands safely',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The terminal command to execute',
        },
        is_background: {
          type: 'boolean',
          description: 'Whether to run the command in background',
          default: false,
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'read_file',
    description: 'Read and display file contents with optional line ranges',
    inputSchema: {
      type: 'object',
      properties: {
        target_file: {
          type: 'string',
          description: 'Path to the file to read',
        },
        offset: {
          type: 'integer',
          description: 'Line number to start reading from',
        },
        limit: {
          type: 'integer',
          description: 'Number of lines to read',
        },
      },
      required: ['target_file'],
    },
  },
  {
    name: 'search_replace',
    description: 'Perform exact string replacements in files',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the file to modify',
        },
        old_string: {
          type: 'string',
          description: 'Text to replace',
        },
        new_string: {
          type: 'string',
          description: 'Replacement text',
        },
        replace_all: {
          type: 'boolean',
          description: 'Replace all occurrences',
          default: false,
        },
      },
      required: ['file_path', 'old_string', 'new_string'],
    },
  },
  {
    name: 'list_dir',
    description: 'List files and directories in a given path',
    inputSchema: {
      type: 'object',
      properties: {
        target_directory: {
          type: 'string',
          description: 'Path to directory to list contents of',
        },
        ignore_globs: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Optional glob patterns to ignore',
        },
      },
      required: ['target_directory'],
    },
  },
  {
    name: 'grep',
    description: 'Search for patterns in files using ripgrep',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          description: 'Regular expression pattern to search for',
        },
        path: {
          type: 'string',
          description: 'File or directory to search in',
        },
        glob: {
          type: 'string',
          description: 'Glob pattern to filter files',
        },
        output_mode: {
          type: 'string',
          enum: ['content', 'files_with_matches', 'count'],
          description: 'Output mode',
          default: 'content',
        },
        context: {
          type: 'integer',
          description: 'Number of lines of context to show',
        },
        head_limit: {
          type: 'integer',
          description: 'Limit output to first N lines/entries',
        },
      },
      required: ['pattern'],
    },
  },
];

// Create MCP server instance
export function createMCPServer() {
  const server = new Server(
    {
      name: 'colorsincodegenai-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: MCP_TOOLS.map((tool): Tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'run_terminal_cmd':
          return await handleTerminalCommand(args as { command: string; is_background?: boolean });
        case 'read_file':
          return await handleReadFile(args as { target_file: string; offset?: number; limit?: number });
        case 'search_replace':
          return await handleSearchReplace(args as { file_path: string; old_string: string; new_string: string; replace_all?: boolean });
        case 'list_dir':
          return await handleListDir(args as { target_directory: string; ignore_globs?: string[] });
        case 'grep':
          return await handleGrep(args as { pattern: string; path?: string; glob?: string; output_mode?: string; context?: number; head_limit?: number });
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });

  return server;
}

// Tool handler implementations
async function handleTerminalCommand(args: {
  command: string;
  is_background?: boolean;
}) {
  const { command, is_background } = args;

  // In a real implementation, you would execute the command safely
  // For now, we'll return a placeholder response
  return {
    content: [
      {
        type: 'text',
        text: `Command executed: ${command} (background: ${is_background})`,
      },
    ],
  };
}

async function handleReadFile(args: {
  target_file: string;
  offset?: number;
  limit?: number;
}) {
  const { target_file, offset, limit } = args;

  // In a real implementation, you would read the file
  // For now, we'll return a placeholder response
  return {
    content: [
      {
        type: 'text',
        text: `Reading file: ${target_file} (offset: ${offset}, limit: ${limit})`,
      },
    ],
  };
}

async function handleSearchReplace(args: {
  file_path: string;
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}) {
  const { file_path, old_string, new_string, replace_all } = args;

  // In a real implementation, you would perform the search and replace
  // For now, we'll return a placeholder response
  return {
    content: [
      {
        type: 'text',
        text: `Search and replace in ${file_path}: "${old_string}" -> "${new_string}" (replace_all: ${replace_all})`,
      },
    ],
  };
}

async function handleListDir(args: {
  target_directory: string;
  ignore_globs?: string[];
}) {
  const { target_directory, ignore_globs } = args;

  // In a real implementation, you would list the directory
  // For now, we'll return a placeholder response
  return {
    content: [
      {
        type: 'text',
        text: `Listing directory: ${target_directory} (ignore_globs: ${JSON.stringify(ignore_globs)})`,
      },
    ],
  };
}

async function handleGrep(args: {
  pattern: string;
  path?: string;
  glob?: string;
  output_mode?: string;
  context?: number;
  head_limit?: number;
}) {
  const { pattern, path, glob, output_mode, context, head_limit } = args;

  // In a real implementation, you would perform the grep search
  // For now, we'll return a placeholder response
  return {
    content: [
      {
        type: 'text',
        text: `Grep search: pattern="${pattern}" path="${path}" glob="${glob}" output_mode="${output_mode}" context="${context}" head_limit="${head_limit}"`,
      },
    ],
  };
}
