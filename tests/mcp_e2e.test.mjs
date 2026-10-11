import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_URL || 'http://localhost:4173';

test('MCP Endpoint [GET /api/mcp]: Discovery and Health Status', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'online');
  assert.equal(data.protocolVersion, '2024-11-05');
  assert.equal(data.server.name, 'noctis-urbano-mcp');
  assert.ok(data.summary.toolsCount >= 6);
  assert.ok(data.summary.resourcesCount >= 4);
});

test('MCP Endpoint [POST /api/mcp]: initialize handshake', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'init-1',
      method: 'initialize',
      params: { protocolVersion: '2024-11-05' }
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.jsonrpc, '2.0');
  assert.equal(data.id, 'init-1');
  assert.equal(data.result.protocolVersion, '2024-11-05');
  assert.equal(data.result.serverInfo.name, 'noctis-urbano-mcp');
  assert.ok(data.result.capabilities.tools);
});

test('MCP Endpoint [POST /api/mcp]: tools/list schema verification', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'tools-list-1',
      method: 'tools/list'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.result.tools));
  const toolNames = data.result.tools.map(t => t.name);
  assert.ok(toolNames.includes('noctis_search_products'));
  assert.ok(toolNames.includes('noctis_get_product_detail'));
  assert.ok(toolNames.includes('noctis_check_stock'));
  assert.ok(toolNames.includes('noctis_calculate_order'));
  assert.ok(toolNames.includes('noctis_validate_coupon'));
  assert.ok(toolNames.includes('noctis_get_brand_ethos'));
  assert.ok(toolNames.includes('noctis_get_graph_recommendations'));
});

test('MCP Endpoint [POST /api/mcp]: tools/call noctis_get_graph_recommendations (Knowledge Graph)', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'graph-1',
      method: 'tools/call',
      params: {
        name: 'noctis_get_graph_recommendations',
        arguments: { productId: 'prod-andes-hoodie' }
      }
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.result.content);
  const payload = JSON.parse(data.result.content[0].text);
  assert.equal(payload.targetProduct, 'prod-andes-hoodie');
  assert.ok(Array.isArray(payload.connectedGraphEntities));
  assert.ok(payload.connectedGraphEntities.length > 0);
  const pufferMatch = payload.connectedGraphEntities.find(e => e.id === 'prod-noctis-puffer');
  assert.ok(pufferMatch, 'El buzo Andes debe conectarse con la Puffer en el Grafo de Capas');
});

test('MCP Endpoint [POST /api/mcp]: tools/call noctis_search_products and stock calculation', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'call-1',
      method: 'tools/call',
      params: {
        name: 'noctis_search_products',
        arguments: { query: 'hoodie' }
      }
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.result.content);
  assert.equal(data.result.content[0].type, 'text');
  const payload = JSON.parse(data.result.content[0].text);
  assert.ok(payload.count > 0);
  assert.ok(payload.products.some(p => p.name.toLowerCase().includes('hoodie')));
});

test('MCP Endpoint [POST /api/mcp]: tools/call noctis_validate_coupon', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'coupon-1',
      method: 'tools/call',
      params: {
        name: 'noctis_validate_coupon',
        arguments: { couponCode: 'NOCTIS10' }
      }
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  const payload = JSON.parse(data.result.content[0].text);
  assert.equal(payload.isValid, true);
  assert.equal(payload.discountPercent, 10);
});

test('MCP Endpoint [POST /api/mcp]: JSON-RPC invalid method error handling (-32601)', async () => {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'err-1',
      method: 'invalid_method'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.error);
  assert.equal(data.error.code, -32601);
});
