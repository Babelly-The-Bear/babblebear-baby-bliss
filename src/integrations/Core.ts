// Core integration for AI analysis

export interface LLMRequest {
  prompt: string;
  response_json_schema?: any;
}

export interface LLMResponse {
  babble_score: number;
  phoneme_diversity: number;
  sound_types: string[];
  total_vocalizations: number;
  longest_vocalization: number;
  flags: string[];
}

export async function InvokeLLM(request: LLMRequest): Promise<LLMResponse> {
  // Mock AI analysis response
  const mockResponses = [
    {
      babble_score: 87,
      phoneme_diversity: 12,
      sound_types: ["ba", "da", "ma", "ga"],
      total_vocalizations: 45,
      longest_vocalization: 3.2,
      flags: []
    },
    {
      babble_score: 73,
      phoneme_diversity: 8,
      sound_types: ["ba", "da", "ma"],
      total_vocalizations: 32,
      longest_vocalization: 2.1,
      flags: ["limited_variety"]
    },
    {
      babble_score: 92,
      phoneme_diversity: 15,
      sound_types: ["ba", "da", "ma", "ga", "pa", "ta"],
      total_vocalizations: 58,
      longest_vocalization: 4.5,
      flags: []
    },
    {
      babble_score: 0,
      phoneme_diversity: 0,
      sound_types: [],
      total_vocalizations: 0,
      longest_vocalization: 0,
      flags: ["no_vocalization_detected"]
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Return a random mock response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
} 