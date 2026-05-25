import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please verify your Secrets in Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "talentflow-client",
        },
      },
    });
  }
  return aiClient;
}

function getSmartFallback(jobTitle: string) {
  const cleanTitle = jobTitle.trim();
  const lower = cleanTitle.toLowerCase();

  if (lower.includes("customer success") || lower.includes("csm") || lower.includes("success manager")) {
    return {
      role: cleanTitle + " (Smart Fallback Mode Enabled)",
      rationale: "To gauge a Customer Success Manager in an early-stage company, we must move past service-desk mentalities. Good CSMs are strategic growth partners who possess a strong product sense, handle high-stakes customer friction constructively, and operate proactively using data rather than reactivity.",
      questions: [
        {
          num: 1,
          questionText: "Describe a time when a high-value customer demanded an immediate custom feature that was completely outside your product roadmap. How did you handle the escalation without burning the relationship or over-committing engineering resources?",
          intent: "Diagnoses the ability to manage complex high-stress escalations, communicate effectively under pressure, and align customer needs with product constraints.",
          idealIndicators: [
            "Speaks of defining boundaries and finding creative operational turnarounds instead of making false roadmap promises.",
            "Focuses on exploring the customer's root business problem instead of just passing the raw feature request to engineering.",
            "Demonstrates strong cross-functional alignment and respect for engineering constraints."
          ]
        },
        {
          num: 2,
          questionText: "In early-stage startups, customer success often looks like product management. How have you translated negative feedback from a churn-risk trial customer into a structured feature spec, and how did you measure its success after deployment?",
          intent: "Evaluates product-mindedness, feedback loops translation ability, and the proactive initiative expected of a founding CSM.",
          idealIndicators: [
            "Explains structuring qualitative complaints into structured user stories, prioritized wireframes, or clear functional specs.",
            "Mentions tracking concrete post-release adoption metrics (e.g., license usage, NPS indicators, or customer retention).",
            "Details how they collaborated side-by-side with engineers to ship the resolution quickly."
          ]
        },
        {
          num: 3,
          questionText: "Walk me through how you segment your customer accounts to proactively identify warning signs of churn before the renewal date, and what automated versus high-touch interventions you deploy.",
          intent: "Tests operational sophistication, analytical dashboard tracking, and ability to scale customer relations systematically.",
          idealIndicators: [
            "Details proactive warning triggers such as license adoption drop-offs, champion sponsor departures, or stagnant API event triggers.",
            "Balances automated system-level triggers with high-touch, trust-building strategic touchpoints.",
            "Demonstrates structured customer-health dashboarding practices."
          ]
        }
      ]
    };
  }

  if (lower.includes("engineer") || lower.includes("developer") || lower.includes("cto") || lower.includes("architect") || lower.includes("tech") || lower.includes("founding")) {
    return {
      role: cleanTitle + " (Smart Fallback Mode Enabled)",
      rationale: "Founding engineers face early-stage ambiguity where speed, architectural pragmatism, and ownership matter vastly more than raw specialization. We seek builders who make reasonable technical-debt tradeoffs and communicate modular architecture clearly directly to a non-technical founder.",
      questions: [
        {
          num: 1,
          questionText: "We are an early-stage startup balancing speed against scalability. Walk me through a concrete technical decision where you intentionally introduced technical debt to ship faster, and how you managed the fallout of that decision.",
          intent: "Diagnoses architectural honesty, pragmatism, and strategic understanding of startup build trade-offs.",
          idealIndicators: [
            "Acknowledges trade-offs openly and maps explicit cost-benefit analysis behind technical debt.",
            "Defines clear future triggers or engineering milestones to refactor and repay the technical debt once verified.",
            "Fosters high speed of delivery without introducing catastrophic baseline structural rot."
          ]
        },
        {
          num: 2,
          questionText: "As a founding engineer, you'll be writing code with incomplete requirements from a non-technical founder. How do you design systems that are modular enough to withstand rapid pivots, and how do you ensure team alignment?",
          intent: "Tests adaptability, communication clarity under high-ambiguity conditions, and architectural foresight.",
          idealIndicators: [
            "Uses decoupled, interface-driven patterns or simple micro-modules to facilitate easy platform rewrites.",
            "Recommends continuous show-and-tell milestones, quick mockups, and tight stakeholder feedback loops instead of silent long-term builds.",
            "Avoids speculative over-engineering of early product features."
          ]
        },
        {
          num: 3,
          questionText: "You built a feature that broke in production at 2:00 AM on a weekend. No other engineers are awake. Walk me through your diagnostics protocol to isolate the issue, fix it, and establish future post-mortem safeguards.",
          intent: "Verifies end-to-end operational ownership, diagnostic discipline, and system restoration maturity.",
          idealIndicators: [
            "Prioritizes system stability first (e.g., instant rollbacks or feature-flag dynamic toggles) before diving into lines of local edits.",
            "Consults structured log files, cloud error traces, and remote container telemetry over speculative local code guesswork.",
            "Implements automated alerts, telemetry tests, and post-mortem writeups to block reoccurrences."
          ]
        }
      ]
    };
  }

  // Generic Dynamic Synthesized responses
  return {
    role: cleanTitle + " (Smart Fallback Mode Enabled)",
    rationale: `This diagnostic assessment evaluates the core tactical and strategic duties of the ${cleanTitle} within a high-growth, early-stage environment. It addresses scenario-based problem solving, proactive leadership alignment, and high-agency situational judgment.`,
    questions: [
      {
        num: 1,
        questionText: `What is the most common misconception about the role of a ${cleanTitle} in a fast-paced environment, and how do you structure your daily workflow to ensure you focus on high-impact strategic outcomes rather than busywork?`,
        intent: `Diagnoses role maturity, self-awareness, and time-management frameworks for a ${cleanTitle}.`,
        idealIndicators: [
          "Identifies clear distinctions between high-leverage business activities and vanity operational metrics.",
          "Explains concrete time-blocking or prioritization protocols used during high-ambiguity periods.",
          "Demonstrates strong bias for self-driven leverage."
        ]
      },
      {
        num: 2,
        questionText: `Describe a time when you had to make a high-stakes decision for the ${cleanTitle} domain with highly incomplete information. What was your analytical framework and how did you mitigate downstream risks?`,
        intent: "Evaluates decision making under extreme ambiguity, intellectual humility, and calculated risk assessment.",
        idealIndicators: [
          "Walks through systematic reduction of variables and leveraging raw baseline telemetry or signals.",
          "Maintains high accountability for outcomes, showing rapid course correction when new signals arrived.",
          "Establishes flexible, testable parameters rather than overcommitting early."
        ]
      },
      {
        num: 3,
        questionText: "If we hire you, what is your diagnostic blueprint for your first 30 days to identify systemic gaps in our existing setup, and how do you build trust with current stakeholders?",
        intent: "Tests systematic onset strategy, strategic maturity, and low-friction team integration skills.",
        idealIndicators: [
          "Prioritizes open listening, context gathering, and low-risk diagnostic audits before pushing massive overhauls.",
          "Targets early, low-cost 'quick wins' to establish immediate execution credibility with founders.",
          "Defines measurable, transparent checkpoints for the 30-day onboarding period."
        ]
      }
    ]
  };
}

// API endpoint to generate interview questions
app.post("/api/generate-questions", async (req, res) => {
  try {
    const { jobTitle } = req.body;
    if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim() === "") {
      return res.status(400).json({ error: "Job title is required and must be a valid string." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.log(`GEMINI_API_KEY is not configured or placeholder in environment. Serving smart fallback diagnostic for '${jobTitle}'.`);
      const fallback = getSmartFallback(jobTitle);
      return res.json(fallback);
    }

    let data;
    try {
      const ai = getGeminiClient();
      const prompt = `Generate exactly 3 extremely thoughtful, highly role-specific, and non-generic interview questions for the job title: "${jobTitle.trim()}".
The questions should avoid clichés like "What are your weaknesses?" and instead focus on deep behavioral scenarios, critical thinking, early-stage ambiguity handling, and core responsibilities of this position.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert Chief People Officer (CPO) and a world-class Executive Advisor specializing in designing diagnostic, high-signal, and deeply educational interview questions for startups and high-performing teams. You formulate questions that reveal concrete behaviors and technical/logical approaches rather than rehearsed answers.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    num: { type: Type.INTEGER },
                    questionText: { type: Type.STRING },
                    intent: { type: Type.STRING, description: "The deep rationale behind asking this question, explaining exactly what specific trait or professional competency is being diagnosed." },
                    idealIndicators: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "3 highly visible/audible positive elements or concrete actions to listen for in a high-performing response."
                    },
                  },
                  required: ["num", "questionText", "intent", "idealIndicators"],
                },
              },
              rationale: { type: Type.STRING, description: "A high-level synthesis explaining the holistic strategy behind these 3 selected questions for this particular role." },
            },
            required: ["role", "questions", "rationale"],
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Failure generating interview questions; empty text received from the AI model.");
      }

      data = JSON.parse(resultText);
    } catch (genError: any) {
      console.warn("Gemini Live Generation failed (e.g., key leaked, expired, quota limit, or error). Falling back to Smart Static Engine.", genError);
      
      // Serve beautiful, pre-crafted high-quality fallback questions matching the entered job title
      data = getSmartFallback(jobTitle);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: error.message || "An unexpected server-side error occurred." });
  }
});

async function startServer() {
  if (process.env.DISABLE_HMR === "true" || process.env.NODE_ENV === "production") {
    // Standard serving of dist folder or vite in middleware
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
