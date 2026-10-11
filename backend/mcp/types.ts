/**
 * MODEL CONTEXT PROTOCOL (MCP) - TIPOS Y ESPECIFICACIÓN TÉCNICA
 * Protocol Version: 2024-11-05
 * Especificación formal para interoperabilidad con ChatGPT, Claude y Agentes Externos
 */

export interface JsonRpcRequest<T = any> {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: T;
}

export interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: T;
  error?: JsonRpcError;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: any;
}

export const JSON_RPC_ERRORS = {
  PARSE_ERROR: { code: -32700, message: 'Parse error: JSON no válido' },
  INVALID_REQUEST: { code: -32600, message: 'Invalid Request: Solicitud JSON-RPC inválida' },
  METHOD_NOT_FOUND: { code: -32601, message: 'Method not found: Método no soportado' },
  INVALID_PARAMS: { code: -32602, message: 'Invalid params: Parámetros inválidos' },
  INTERNAL_ERROR: { code: -32603, message: 'Internal error: Error interno del servidor MCP' },
};

export interface McpServerInfo {
  name: string;
  version: string;
}

export interface McpServerCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: Record<string, any>;
}

export interface McpToolParameterSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description: string;
    enum?: string[];
    default?: any;
    items?: { type: string };
  }>;
  required?: string[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: McpToolParameterSchema;
}

export interface McpToolResultContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
}

export interface McpToolCallResult {
  content: McpToolResultContent[];
  isError?: boolean;
}

export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface McpResourceContent {
  uri: string;
  mimeType: string;
  text?: string;
  blob?: string;
}

export interface McpPromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

export interface McpPrompt {
  name: string;
  description: string;
  arguments?: McpPromptArgument[];
}

export interface McpPromptMessage {
  role: 'user' | 'assistant';
  content: {
    type: 'text';
    text: string;
  };
}
