import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateAndValidateCase } from '@/lib/ai/provider';
import { GenerationRequest } from '@/types/case-study';

const requestBodySchema = z.object({
  role: z.enum(['Database Administrator', 'Data Engineer', 'Data Analyst']),
  level: z.enum(['easy', 'middle', 'advance', 'portfolio']),
  industry: z.string().min(2, 'Nama industri minimal 2 karakter').max(50, 'Nama industri maksimal 50 karakter'),
  responsibilities: z.string().max(500, 'Tanggung jawab maksimal 500 karakter').optional(),
  taskCount: z.number().int().min(3, 'Jumlah tugas minimal 3').max(15, 'Jumlah tugas maksimal 15'),
  mysqlVersion: z.enum(['8.0', '8.4']),
  seed: z.union([z.string(), z.number(), z.null()]).optional(),
});

export async function POST(req: NextRequest) {
  // 1. IP extraction & rate limiting
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Batas permintaan tercapai. Silakan coba lagi dalam ${rateLimit.resetInSec} detik.`,
          details: null,
        },
      },
      { status: 429 }
    );
  }

  // 2. Validate request body
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_JSON',
          message: 'Format data permintaan harus berupa JSON yang valid.',
          details: null,
        },
      },
      { status: 400 }
    );
  }

  const parseResult = requestBodySchema.safeParse(body);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map(
      (e) => `${e.path.join('.')}: ${e.message}`
    );
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: errorMessages.join(', '),
          details: null,
        },
      },
      { status: 400 }
    );
  }

  const validReq: GenerationRequest = parseResult.data;

  // 3. Generate and validate
  try {
    const result = await generateAndValidateCase(validReq);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('Error generating case study:', err);
    return NextResponse.json(
      {
        error: {
          code: 'GENERATION_FAILED',
          message:
            'Gagal membuat studi kasus. Terjadi kesalahan pada proses generasi AI atau validasi.',
          details: null,
        },
      },
      { status: 500 }
    );
  }
}
