// Resolve the API key at call time so users can paste a key into Settings
// without a rebuild. Falls back to the build-time env var.
export function getGeminiApiKey() {
  try {
    const fromStorage = localStorage.getItem('gemini_api_key');
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
  } catch {
    // localStorage may be unavailable (SSR, privacy mode); ignore.
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function generateBattleQuestions(deckTopics) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `You are a hardware electronics quiz master. Generate exactly 10 multiple choice questions for a quiz battle.

The player's deck covers these topics: ${deckTopics.join(', ')}

Rules:
- Each question must be about one of the listed topics
- 4 answer options (A, B, C, D) — only one correct
- Difficulty matches the topic depth: LIGHT=easy, MEDIUM=moderate, DEEP=hard, DEEPEST=expert
- Questions should test real understanding, not just definitions
- Include calculation questions where appropriate
- Return ONLY valid JSON array, no markdown:

[
  {
    "id": 1,
    "topic": "Ohm's Law",
    "depth": "DEEP",
    "question": "question text here",
    "options": ["A) text", "B) text", "C) text", "D) text"],
    "correct": "A",
    "explanation": "Brief explanation of correct answer"
  }
]`;

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  // Clean and parse JSON
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// Fallback questions when API is unavailable
export function getFallbackQuestions(_deckTopics) {
  const fallbacks = [
    {
      id: 1,
      topic: 'Ohm\'s Law',
      depth: 'DEEP',
      question: 'A resistor has 220\u03A9. Current is 45mA. What is the voltage drop?',
      options: ['A) 9.9V', 'B) 12.1V', 'C) 4.9V', 'D) 19.8V'],
      correct: 'A',
      explanation: 'V = IR = 0.045A \u00D7 220\u03A9 = 9.9V',
    },
    {
      id: 2,
      topic: 'Capacitors',
      depth: 'MEDIUM',
      question: 'What happens to capacitive reactance as frequency increases?',
      options: ['A) Increases', 'B) Decreases', 'C) Stays the same', 'D) Becomes zero'],
      correct: 'B',
      explanation: 'XC = 1/(2\u03C0fC), so as frequency increases, reactance decreases.',
    },
    {
      id: 3,
      topic: 'Diodes',
      depth: 'DEEP',
      question: 'A silicon diode forward voltage drop is typically:',
      options: ['A) 0.3V', 'B) 0.7V', 'C) 1.2V', 'D) 5.0V'],
      correct: 'B',
      explanation: 'Silicon diodes have a typical forward voltage drop of 0.6-0.7V.',
    },
    {
      id: 4,
      topic: 'Transistors',
      depth: 'DEEP',
      question: 'In which region does a BJT act as a closed switch?',
      options: ['A) Cutoff', 'B) Active', 'C) Saturation', 'D) Breakdown'],
      correct: 'C',
      explanation: 'In saturation, both junctions are forward biased and the transistor acts as a closed switch.',
    },
    {
      id: 5,
      topic: 'Power',
      depth: 'MEDIUM',
      question: 'A device dissipates 2W with 12V supply. What current does it draw?',
      options: ['A) 6A', 'B) 167mA', 'C) 24A', 'D) 144mA'],
      correct: 'B',
      explanation: 'I = P/V = 2W/12V = 0.167A = 167mA.',
    },
    {
      id: 6,
      topic: 'Filters',
      depth: 'DEEP',
      question: 'A Sallen-Key low-pass filter uses:',
      options: ['A) Only passive components', 'B) An op-amp with RC network', 'C) Only inductors', 'D) A transformer'],
      correct: 'B',
      explanation: 'Sallen-Key topology uses an op-amp gain stage with an RC network for filtering.',
    },
    {
      id: 7,
      topic: 'Oscillators',
      depth: 'DEEP',
      question: 'The Barkhausen criterion requires:',
      options: ['A) Loop gain < 1', 'B) Loop gain = 1 and phase shift = 0\u00B0', 'C) Loop gain > 1', 'D) Phase shift = 180\u00B0'],
      correct: 'B',
      explanation: 'For sustained oscillation, loop gain must equal 1 with 0\u00B0 (or 360\u00B0) phase shift.',
    },
    {
      id: 8,
      topic: 'PCB Design',
      depth: 'DEEPEST',
      question: 'For a 4-layer PCB, the recommended layer stackup for signal integrity is:',
      options: ['A) Signal-Ground-Power-Signal', 'B) Signal-Signal-Ground-Power', 'C) Ground-Signal-Signal-Power', 'D) Signal-Power-Ground-Signal'],
      correct: 'A',
      explanation: 'Signal-Ground-Power-Signal provides reference planes for both signal layers.',
    },
    {
      id: 9,
      topic: 'Buck Converter',
      depth: 'DEEP',
      question: 'A buck converter with 24V input and 50% duty cycle outputs:',
      options: ['A) 24V', 'B) 12V', 'C) 6V', 'D) 48V'],
      correct: 'B',
      explanation: 'Vout = D \u00D7 Vin = 0.5 \u00D7 24V = 12V.',
    },
    {
      id: 10,
      topic: 'Op-Amps',
      depth: 'DEEP',
      question: 'The virtual ground concept in an inverting amplifier means:',
      options: ['A) The output is zero', 'B) Both inputs are at ground potential', 'C) The inverting input is at the same potential as the non-inverting input', 'D) No current flows'],
      correct: 'C',
      explanation: 'Negative feedback forces the inverting input to match the non-inverting input (ground), creating a virtual ground.',
    },
  ];

  return fallbacks;
}
