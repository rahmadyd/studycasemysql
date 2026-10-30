import { NextResponse } from 'next/server';

export async function GET() {
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.EMERGENT_LLM_KEY);
  const hasMysql = Boolean(process.env.MYSQL_URL);

  return NextResponse.json({
    status: 'ok',
    services: {
      ai: hasGroq ? 'groq' : hasGemini ? 'gemini' : 'mock_ready',
      mysql: hasMysql ? 'configured' : 'unconfigured',
    },
    timestamp: new Date().toISOString(),
  });
}
