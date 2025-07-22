// Vercel Backend API - Enhanced Bot Protection Services
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

interface ThreatIntelligence {
  ip: string;
  riskScore: number;
  threats: string[];
  lastSeen: number;
  country?: string;
  isp?: string;
}

interface AIDetectionResult {
  isAI: boolean;
  confidence: number;
  aiType: string[];
  reasoning: string[];
}

class EnhancedBotProtection {
  private threatDatabase = new Map<string, ThreatIntelligence>();
  private aiSignatures = new Map<string, number>();
  
  // Advanced AI detection patterns
  private aiModels = [
    'gpt', 'chatgpt', 'openai', 'claude', 'anthropic', 'bard', 'gemini',
    'llama', 'alpaca', 'vicuna', 'palm', 'lamda', 'bert', 'transformer',
    'neural', 'ai-agent', 'assistant', 'copilot', 'codex'
  ];

  private suspiciousHeaders = [
    'x-openai', 'x-anthropic', 'x-ai', 'x-bot', 'x-automated',
    'x-scraper', 'x-crawler', 'x-agent', 'x-research'
  ];

  constructor() {
    this.initializeThreatIntelligence();
  }

  initializeThreatIntelligence() {
    // Initialize with known threat patterns
    const knownThreats = [
      { ip: '0.0.0.0', riskScore: 1.0, threats: ['known-bot-network'] },
      // Add more known threats here
    ];

    knownThreats.forEach(threat => {
      this.threatDatabase.set(threat.ip, {
        ...threat,
        lastSeen: Date.now()
      });
    });
  }

  analyzeAISignatures(userAgent: string, headers: Headers): AIDetectionResult {
    const reasoning: string[] = [];
    let confidence = 0;
    const aiTypes: string[] = [];

    // Check user agent for AI model names
    const userAgentLower = userAgent.toLowerCase();
    this.aiModels.forEach(model => {
      if (userAgentLower.includes(model)) {
        confidence += 0.8;
        aiTypes.push(model);
        reasoning.push(`Contains AI model identifier: ${model}`);
      }
    });

    // Check for suspicious headers
    this.suspiciousHeaders.forEach(header => {
      if (headers.get(header)) {
        confidence += 0.7;
        reasoning.push(`Suspicious header detected: ${header}`);
      }
    });

    // Advanced pattern analysis
    const patterns = [
      { pattern: /python.*requests/i, weight: 0.6, type: 'automation' },
      { pattern: /selenium|puppeteer|playwright/i, weight: 0.8, type: 'automation' },
      { pattern: /api.*client/i, weight: 0.5, type: 'api-client' },
      { pattern: /research|academic|paper/i, weight: 0.4, type: 'research' },
      { pattern: /data.*collection|scraping/i, weight: 0.7, type: 'scraping' },
      { pattern: /monitoring|testing|checking/i, weight: 0.3, type: 'monitoring' }
    ];

    patterns.forEach(({ pattern, weight, type }) => {
      if (pattern.test(userAgent)) {
        confidence += weight;
        aiTypes.push(type);
        reasoning.push(`Matched ${type} pattern`);
      }
    });

    // Check for missing standard browser headers
    const standardHeaders = ['accept', 'accept-language', 'accept-encoding'];
    const missingHeaders = standardHeaders.filter(h => !headers.get(h));
    
    if (missingHeaders.length > 0) {
      confidence += missingHeaders.length * 0.2;
      reasoning.push(`Missing standard headers: ${missingHeaders.join(', ')}`);
    }

    // Behavioral analysis
    const acceptHeader = headers.get('accept') || '';
    if (!acceptHeader.includes('text/html')) {
      confidence += 0.4;
      reasoning.push('Does not accept HTML content');
    }

    return {
      isAI: confidence > 0.5,
      confidence: Math.min(confidence, 1.0),
      aiType: [...new Set(aiTypes)],
      reasoning
    };
  }

  updateThreatIntelligence(ip: string, threat: string, severity: number) {
    const existing = this.threatDatabase.get(ip) || {
      ip,
      riskScore: 0,
      threats: [],
      lastSeen: 0
    };

    existing.threats.push(threat);
    existing.riskScore = Math.min(existing.riskScore + severity, 1.0);
    existing.lastSeen = Date.now();

    this.threatDatabase.set(ip, existing);
  }

  getThreatIntelligence(ip: string): ThreatIntelligence | null {
    return this.threatDatabase.get(ip) || null;
  }

  generateAdvancedChallenge(): { type: string; challenge: any; solution: string } {
    const challengeTypes = ['logic', 'pattern', 'math', 'sequence', 'riddle'];
    const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

    switch (type) {
      case 'logic':
        const logicProblems = [
          {
            question: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
            options: ["Yes", "No", "Cannot be determined"],
            answer: "Cannot be determined"
          },
          {
            question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
            options: ["$0.10", "$0.05", "$0.15"],
            answer: "$0.05"
          }
        ];
        const logic = logicProblems[Math.floor(Math.random() * logicProblems.length)];
        return {
          type: 'logic',
          challenge: logic,
          solution: logic.answer
        };

      case 'pattern':
        const patterns = [
          { sequence: [1, 1, 2, 3, 5, 8], next: 13, rule: "Fibonacci" },
          { sequence: [2, 6, 12, 20, 30], next: 42, rule: "n(n+1)" },
          { sequence: [1, 4, 9, 16, 25], next: 36, rule: "Perfect squares" }
        ];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        return {
          type: 'pattern',
          challenge: {
            question: `What comes next in this sequence: ${pattern.sequence.join(', ')}, ?`,
            sequence: pattern.sequence,
            rule: pattern.rule
          },
          solution: pattern.next.toString()
        };

      case 'riddle':
        const riddles = [
          {
            question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
            answer: "fire"
          },
          {
            question: "The more you take, the more you leave behind. What am I?",
            answer: "footsteps"
          }
        ];
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        return {
          type: 'riddle',
          challenge: riddle,
          solution: riddle.answer.toLowerCase()
        };

      default:
        return {
          type: 'math',
          challenge: {
            question: "What is 7 × 8?",
            hint: "Think multiplication"
          },
          solution: "56"
        };
    }
  }
}

const protection = new EnhancedBotProtection();

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  return "127.0.0.1";
}

// Main Vercel serverless function handler
export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "";

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Forwarded-For",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // AI Detection endpoint
    if (url.pathname.includes("/analyze-ai")) {
      const aiAnalysis = protection.analyzeAISignatures(userAgent, request.headers);
      
      // Update threat intelligence if AI detected
      if (aiAnalysis.isAI) {
        protection.updateThreatIntelligence(ip, 'ai-detected', aiAnalysis.confidence);
      }

      return new Response(
        JSON.stringify({
          ...aiAnalysis,
          timestamp: new Date().toISOString(),
          ip: ip.substring(0, 8) + "***" // Partial IP for privacy
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Threat Intelligence endpoint
    if (url.pathname.includes("/threat-intel")) {
      const threat = protection.getThreatIntelligence(ip);
      
      return new Response(
        JSON.stringify({
          hasThreatData: !!threat,
          riskScore: threat?.riskScore || 0,
          threatCount: threat?.threats.length || 0,
          lastSeen: threat?.lastSeen || null
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Advanced Challenge endpoint
    if (url.pathname.includes("/advanced-challenge")) {
      const challenge = protection.generateAdvancedChallenge();
      
      return new Response(
        JSON.stringify({
          challengeId: crypto.randomUUID(),
          ...challenge,
          timestamp: Date.now()
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Verify Challenge endpoint
    if (url.pathname.includes("/verify-challenge") && request.method === "POST") {
      const body = await request.json();
      const { challengeId, answer, solution } = body;

      const isCorrect = answer?.toString().toLowerCase().trim() === solution?.toString().toLowerCase().trim();
      
      if (isCorrect) {
        // Reduce threat score for successful verification
        const threat = protection.getThreatIntelligence(ip);
        if (threat) {
          threat.riskScore = Math.max(0, threat.riskScore - 0.2);
        }
      } else {
        // Increase threat score for failed verification
        protection.updateThreatIntelligence(ip, 'failed-challenge', 0.1);
      }

      return new Response(
        JSON.stringify({
          verified: isCorrect,
          challengeId,
          timestamp: Date.now()
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Main API info endpoint
    return new Response(
      JSON.stringify({
        service: "🛡️ Enhanced Bot Protection API",
        version: "2.0.0",
        endpoints: {
          "/api/analyze-ai": "Advanced AI detection analysis",
          "/api/threat-intel": "Threat intelligence lookup",
          "/api/advanced-challenge": "Generate advanced verification challenges",
          "/api/verify-challenge": "Verify challenge responses (POST)"
        },
        features: {
          aiDetection: "Advanced AI model signature detection",
          threatIntel: "Real-time threat intelligence",
          challenges: "Multi-type verification challenges",
          behavioral: "Behavioral pattern analysis"
        },
        protection: {
          aiModels: protection.aiModels.length,
          threatDatabase: protection.threatDatabase.size,
          challengeTypes: 5
        },
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );

  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      }
    );
  }
}

