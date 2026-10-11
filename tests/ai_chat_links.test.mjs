import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = process.env.TEST_URL || 'http://localhost:4173';

test('AI Copilot Chat: Endpoint responds with 200 and valid JSON schema', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Muéstrame los detalles del buzo Andes Hoodie',
      userContext: {
        name: 'Felipe',
        city: 'Bogotá D.C.'
      },
      history: []
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(typeof data.reply === 'string' && data.reply.length > 0);
  assert.ok(Array.isArray(data.actions));
  console.log('\n--- RESPUESTA DE LA IA [Consulta de Producto] ---');
  console.log(data.reply);
  console.log('Engine/Source:', data.source);
});

test('AI Copilot Chat: Cart context interaction payload schema', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'viste lo que puse en el carrito',
      userContext: {
        name: 'Felipe',
        cart: [
          {
            name: 'ANDES HEAVY HOODIE',
            size: 'XL',
            quantity: 1,
            color: 'Verde',
            price: 210000
          }
        ]
      },
      history: []
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(typeof data.reply === 'string');
  assert.ok(Array.isArray(data.actions));
  console.log('\n--- RESPUESTA DE LA IA [Consulta de Carrito] ---');
  console.log(data.reply);
});

