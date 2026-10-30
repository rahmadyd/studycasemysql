export async function callGroq(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Kunci API GROQ_API_KEY belum dikonfigurasi.');
  }

  const primaryModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const fallbackModel = process.env.GROQ_FALLBACK_MODEL || 'llama-3.1-8b-instant';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const makeRequest = async (modelToUse: string) => {
    const payload = {
      model: modelToUse,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API Error (${response.status}) [${modelToUse}]: ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error(`Groq (${modelToUse}) tidak mengembalikan output pesan yang valid.`);
    }

    return text;
  };

  try {
    return await makeRequest(primaryModel);
  } catch (err: any) {
    // If fallbackModel is defined and different, retry with fallback model
    if (fallbackModel && fallbackModel !== primaryModel) {
      console.warn(`Model utama '${primaryModel}' gagal, mencoba fallback model '${fallbackModel}'...`);
      return await makeRequest(fallbackModel);
    }
    throw err;
  }
}
