import { NextRequest, NextResponse } from 'next/server';
import { dispatchMcpRequest, MCP_SERVER_INFO, MCP_PROTOCOL_VERSION, MCP_TOOLS, MCP_RESOURCES, MCP_PROMPTS } from '@/lib/mcp';

// Cabeceras CORS abiertas y seguras para clientes MCP y ChatGPT
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-MCP-Version, Accept',
};

/**
 * Pre-flight CORS handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

/**
 * GET: Descubrimiento de Capacidades y Verificación de Estado del Servidor MCP
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    server: MCP_SERVER_INFO,
    protocolVersion: MCP_PROTOCOL_VERSION,
    endpoint: '/api/mcp',
    supportedMethods: [
      'initialize',
      'ping',
      'tools/list',
      'tools/call',
      'resources/list',
      'resources/read',
      'prompts/list',
      'prompts/get'
    ],
    summary: {
      toolsCount: MCP_TOOLS.length,
      resourcesCount: MCP_RESOURCES.length,
      promptsCount: MCP_PROMPTS.length
    }
  }, {
    headers: CORS_HEADERS
  });
}

/**
 * POST: Procesamiento de llamadas JSON-RPC 2.0 estándar MCP
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Soporte para solicitudes por lotes (batch JSON-RPC)
    if (Array.isArray(body)) {
      const responses = await Promise.all(body.map(item => dispatchMcpRequest(item)));
      return NextResponse.json(responses, { headers: CORS_HEADERS });
    }

    // Solicitud individual
    const response = await dispatchMcpRequest(body);
    return NextResponse.json(response, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error: El cuerpo de la solicitud no es un JSON válido.',
        data: err?.message
      }
    }, {
      status: 400,
      headers: CORS_HEADERS
    });
  }
}
