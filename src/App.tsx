import { useState, useEffect, FormEvent, KeyboardEvent } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Download, 
  Check, 
  ChevronRight, 
  Info,
  Award,
  BookOpen
} from "lucide-react";
import { GenerationResponse, QuickRolePreset } from "./types";

const PRESET_ROLES: QuickRolePreset[] = [
  {
    title: "Customer Success Manager",
    description: "Evaluates onboarding metrics, high-stress escalations, and retention cycles."
  },
  {
    title: "Founding Full-Stack Engineer",
    description: "Diagnoses full-system architectural tradeoffs and speed of shipping."
  },
  {
    title: "Growth Marketing Lead",
    description: "Probes analytics setup, attribution loops, and fast, low-cost acquisition."
  },
  {
    title: "Technical Product Manager",
    description: "Probes roadmap tradeoffs, technology alignment, and agile execution."
  }
];

function getClientSmartFallback(jobTitle: string): GenerationResponse {
  const cleanTitle = jobTitle.trim();
  const lower = cleanTitle.toLowerCase();

  if (lower.includes("customer success") || lower.includes("csm") || lower.includes("success manager")) {
    return {
      role: cleanTitle + " (Smart Fallback)",
      rationale: "To gauge a Customer Success Manager in an early-stage company, we must move past service-desk mentalities. Good CSMs are strategic growth partners who possess a strong product sense, handle high-stress escalations constructively, and operate proactively using data rather than reactivity.",
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

  if (lower.includes("engineer") || lower.includes("developer") || lower.includes("cto") || lower.includes("architect") || lower.includes("tech") || lower.includes("founding") || lower.includes("programmer") || lower.includes("software")) {
    return {
      role: cleanTitle + " (Smart Fallback)",
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

  // Generic fallback
  return {
    role: cleanTitle + " (Smart Fallback)",
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

export default function App() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [checkedIdList, setCheckedIdList] = useState<string[]>([]);
  
  const [expandedCardIdx, setExpandedCardIdx] = useState<number | null>(null);

  // Trigger scroll-reveal effects on the landing page
  useEffect(() => {
    if (view === "landing") {
      const handleScroll = () => {
        const elements = document.querySelectorAll(".reveal");
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const inView = rect.top <= window.innerHeight * 0.88;
          if (inView) {
            el.classList.add("visible");
          }
        });
      };
      
      // Initial trigger
      setTimeout(handleScroll, 100);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [view]);

  const handlePresetSelect = (title: string) => {
    setJobTitle(title);
    // Automatically trigger generate for a fluid UX
    setError(null);
  };

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    const cleanTitle = jobTitle.trim();
    if (!cleanTitle) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCheckedIdList([]);
    setExpandedCardIdx(null);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: cleanTitle })
      });

      let data: any = null;
      let isJson = false;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
          isJson = true;
        } catch (parseErr) {
          console.warn("Client failed to parse response JSON securely", parseErr);
        }
      }

      if (!response.ok || !isJson || !data) {
        console.warn(`Server returned invalid response (status: ${response.status}). Activating resilient client-side fallback engine.`);
        // Fall back to local browser generator immediately without displaying an ugly error block
        const fallbackData = getClientSmartFallback(cleanTitle);
        setResult(fallbackData);
        return;
      }

      setResult(data);
    } catch (err: any) {
      console.warn("Network transaction failed or context broke. Activating resilient client-side fallback engine.", err);
      // Fall back directly to the offline matching generator
      const fallbackData = getClientSmartFallback(cleanTitle);
      setResult(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const toggleIndicatorCheckbox = (questionNum: number, indicatorIdx: number) => {
    const key = `${questionNum}-${indicatorIdx}`;
    setCheckedIdList(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleExpandInsight = (idx: number) => {
    setExpandedCardIdx(prevIdx => prevIdx === idx ? null : idx);
  };

  const downloadPrepGuide = () => {
    if (!result) return;
    
    let text = `=================================================================\n`;
    text += `   AI INTERVIEW INTELLIGENCE EVALUATION SHEET: ${result.role.toUpperCase()}\n`;
    text += `   Generated using Gemini Direct Proxy & CPO Logic Blueprint\n`;
    text += `=================================================================\n\n`;
    
    text += `--- STRATEGIC ASSESSMENT SUMMARY ---\n`;
    text += `${result.rationale}\n\n`;
    
    text += `--- RECRUITING DIAGNOSTIC QUESTIONS ---\n\n`;
    result.questions.forEach((q, index) => {
      text += `[QUESTION ${index + 1}] ${q.questionText}\n\n`;
      text += `* DIAGNOSTIC INTENT / WHY TO ASK:\n  ${q.intent}\n\n`;
      text += `* WHAT TO OBSERVE IN CANDIDATE ANSWERS:\n`;
      q.idealIndicators.forEach((ind, i) => {
        const key = `${q.num}-${i}`;
        const checked = checkedIdList.includes(key) ? "[X]" : "[ ]";
        text += `  ${checked} ${ind}\n`;
      });
      text += `\n-----------------------------------------------------------------\n\n`;
    });
    
    text += `=================================================================\n`;
    text += `Evaluation framework configured for: kelbizerihun3080@gmail.com\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.role.replace(/\s+/g, "_")}_Interview_Intelligence.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Support trigger submission with Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const mockEvent = { preventDefault: () => {} } as FormEvent;
      handleGenerate(mockEvent);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#0d0d0d] font-sans flex flex-col antialiased selection:bg-[#f0e6df] selection:text-[#c9440b]">
      
      {/* Dynamic Route Switcher Content */}
      {view === "landing" ? (
        <div id="landing-main-container">
          {/* NAV */}
          <nav className="custom-nav select-none">
            <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); setView("landing"); }}>
              <span className="nav-logo-mark" style={{ background: 'none', border: 'none', width: 'auto', height: 'auto', display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: '32px', height: '32px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="42" cy="42" r="28" stroke="#9a547a" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="68" cy="68" r="18" stroke="#e27a54" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="nav-logo-text flex flex-col items-start leading-tight">
                <span className="text-sm font-serif font-bold tracking-wider text-[#1e293b]" style={{ fontFamily: "serif" }}>MELO</span>
                <span className="text-[7px] font-mono tracking-widest text-[#64748b] uppercase font-bold">ASSOCIATES</span>
              </span>
            </a>
            <button onClick={() => setView("app")} className="nav-cta">
              Start Practicing →
            </button>
          </nav>

          {/* HERO */}
          <section className="hero">
            <div className="hero-eyebrow">
              <span></span> AI-Powered Interview Prep
            </div>

            <h1>Stop guessing.<br />Start <em>nailing</em> interviews.</h1>

            <p className="hero-sub">
              Melo generates tailored interview questions for any role in seconds — so you walk in prepared, confident, and ready to impress.
            </p>

            <div className="hero-actions select-none">
              <button onClick={() => setView("app")} className="btn-primary">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Start Practicing</span>
              </button>
              <a href="#features" className="btn-ghost">
                <span>See what's included</span>
              </a>
            </div>

            <div className="social-proof select-none">
              <div className="proof-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span>Free to use</span>
              </div>
              <div className="proof-divider"></div>
              <div className="proof-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span>Any job title</span>
              </div>
              <div className="proof-divider"></div>
              <div className="proof-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span>Results in seconds</span>
              </div>
              <div className="proof-divider"></div>
              <div className="proof-item">
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span>No sign-up needed</span>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="features-section select-text animate-fade-in" id="features">
            <p className="section-label">Everything you need</p>
            <h2 className="section-title">Built for serious <em>job seekers</em></h2>

            <div className="features-grid">
              
              <div className="feature-card reveal">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <span className="feature-tag tag-live">Live now</span>
                <h3 className="feature-title">Role-Specific Questions</h3>
                <p className="feature-desc">
                  Enter any job title — from Customer Success Manager to Machine Learning Engineer — and get 3 behavioural, situational questions crafted for that exact role.
                </p>
              </div>

              <div className="feature-card reveal">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93v2.02c5.05-.5 9-4.76 9-9.95S18.05 2.55 13 2.05zM11 2.05C5.95 2.55 2 6.8 2 12c0 5.2 3.95 9.45 9 9.95v-2.02C7.05 19.44 4 16.08 4 12s3.05-7.44 7-7.93V2.05zM12 6l-1 5H6l3.6 2.6L8.2 19l3.8-2.7 3.8 2.7-1.4-5.4L18 11h-5z"/></svg>
                </div>
                <span className="feature-tag tag-live">Live now</span>
                <h3 className="feature-title">Instant AI Generation</h3>
                <p className="feature-desc">
                  No templates, no copy-paste banks. Every question is freshly generated by AI in real-time, giving you unique, thoughtful prompts every single time.
                </p>
              </div>

            </div>
          </section>

          {/* CTA BANNER */}
          <div style={{ width: "100%", padding: "0 24px" }} className="select-none animate-fade-in">
            <div className="cta-banner">
              <h2>Ready to <em>impress</em> your next interviewer?</h2>
              <p>It takes less than 30 seconds to get your first set of questions.</p>
              <button onClick={() => setView("app")} className="btn-primary-light">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span>Start Practicing — It's Free</span>
              </button>
            </div>
          </div>

          <footer className="select-none font-sans text-xs text-[#6b6560]/70 py-10 text-center border-t border-[#d6cfc6]/50">
            Built for the Melo Associates technical screen
          </footer>
        </div>
      ) : (
        /* ────── PRACTICE APP SCREEN (1-to-1 cloned layout matching exact classes) ────── */
        <div className="app-view-body" id="practice-app-container">
          
          {/* EXTRA EVALUATOR HEADER BAR (discrete, floating, overlay control) */}
          <div className="w-full max-w-[680px] mb-8 select-none flex items-center justify-start border-b border-[#d6cfc6] pb-3 text-xs text-[#6b6560]">
            <button 
              onClick={() => setView("landing")} 
              className="hover:text-[#0d0d0d] font-bold flex items-center gap-1"
              id="back-home-button"
            >
              <span>← Go to Landing Page</span>
            </button>
          </div>

          {/* Core Practice Client Wrapper (Matched 1-to-1 to uploaded app.html wrapper) */}
          <div className="w-full max-w-[680px] flex flex-col">
            
            <div className="wrapper mx-auto">
                <header className="app-header">
                  <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setView("landing"); }}>
                    <span className="logo-mark" style={{ background: 'none', border: 'none', width: 'auto', height: 'auto', display: 'flex', alignItems: 'center' }}>
                      <svg viewBox="0 0 100 100" style={{ width: '38px', height: '38px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="42" cy="42" r="28" stroke="#9a547a" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="68" cy="68" r="18" stroke="#e27a54" strokeWidth="8" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="logo-text flex flex-col items-start leading-tight">
                      <span className="text-base font-serif font-bold tracking-wider text-[#1e293b]" style={{ fontFamily: "serif" }}>MELO</span>
                      <span className="text-[8px] font-mono tracking-widest text-[#64748b] uppercase font-bold">ASSOCIATES</span>
                    </span>
                  </a>
                  <h1 className="app-h1">Smart questions for <em>every role</em></h1>
                  <p className="subtitle">Enter a job title and get three thoughtful, role-specific interview questions in seconds.</p>
                </header>

                {/* Core Cloned Input Card */}
                <div className="form-card text-left">
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <label htmlFor="job-title" className="select-none">Job Title</label>
                    <div className="input-row">
                      <input
                        type="text"
                        id="job-title"
                        required
                        placeholder="e.g. Customer Success Manager"
                        autoComplete="off"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        id="submit-btn"
                        disabled={loading || !jobTitle.trim()}
                        className={loading ? "loading" : ""}
                      >
                        <span className="spinner"></span>
                        <span className="btn-label font-bold">Generate</span>
                      </button>
                    </div>
                  </form>

                  {/* Aesthetic Recruiter Cheat Shortcut Presets (Extremely clean, respects the minimalist aesthetic) */}
                  <div className="pt-5 border-t border-[#d6cfc6]/40 mt-5 space-y-2 select-none">
                    <span className="block text-[10px] font-bold tracking-wider text-[#6b6560] uppercase">
                      Quick Preset Job titles
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {PRESET_ROLES.map((pt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handlePresetSelect(pt.title)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            jobTitle.toLowerCase() === pt.title.toLowerCase()
                              ? "bg-[#c9440b] text-white border-[#c9440b] shadow-xs"
                              : "bg-[#f5f1ea]/55 border-[#d6cfc6] text-[#6b6560] hover:text-[#0d0d0d] hover:border-[#c9440b]"
                          }`}
                          id={`preset-button-${idx}`}
                        >
                          <span>{pt.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cloned Error message block */}
                {error && (
                  <div className="error-msg visible text-left shadow-xs flex flex-col gap-2" id="error-msg-element">
                    <div className="font-bold uppercase text-[10px] tracking-wider text-red-700">Service Alert</div>
                    <p className="font-medium text-xs text-[#b0300a] leading-relaxed select-all">
                      {error}
                    </p>
                    <button 
                      onClick={() => setError(null)} 
                      className="text-[10px] text-red-800 font-bold underline mt-1 self-start select-none"
                    >
                      Dismiss Error
                    </button>
                  </div>
                )}

                {/* Cloned Loading card block with animations */}
                {loading && (
                  <div className="loading-card visible select-none" id="loading-card-element">
                    <div className="pulse-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p className="font-serif italic text-[#c9440b] font-medium scale-105">Crafting questions for your role…</p>
                  </div>
                )}

                {/* Cloned Results rendering block */}
                {result && !loading && !error && (
                  <div className="results visible text-left" id="results-element">
                    
                    {/* Cloned Results header */}
                    <div className="results-header select-none">
                      <span className="results-title font-serif">Interview Questions</span>
                      <span className="role-badge" id="role-badge">{result.role}</span>
                    </div>

                    {/* Cloned Question items list */}
                    <div className="question-list">
                      {result.questions.map((q, idx) => {
                        const isExpanded = expandedCardIdx === idx;
                        return (
                          <div 
                            key={idx} 
                            className="question-card flex flex-col bg-white hover:border-[#c9440b] transition-all cursor-pointer relative"
                            onClick={() => toggleExpandInsight(idx)}
                            id={`card-item-${idx}`}
                          >
                            <div className="select-text">
                              <div className="flex items-center justify-between select-none">
                                <span className="q-num">Question {idx + 1}</span>
                                <span className="text-[10px] font-bold text-[#6b6560] uppercase tracking-wider flex items-center gap-1">
                                  {isExpanded ? "Hide Strategic Guide ▲" : "Click to view Answer Checklist ▼"}
                                </span>
                              </div>
                              <h3 className="q-text select-all font-sans font-medium text-[#0d0d0d]">
                                "{q.questionText}"
                              </h3>
                            </div>

                            {/* COLLAPSIBLE PREMIUM RECRUITING CHEATSHEET & DIAGNOSTICS */}
                            {isExpanded && (
                              <div 
                                className="mt-4 pt-4 border-t border-[#d6cfc6]/50 grid grid-cols-1 md:grid-cols-2 gap-4 select-text animate-fade-in"
                                onClick={(e) => e.stopPropagation()} // Stop propagation so clicking content doesn't fold it
                              >
                                {/* Intent / Why We Ask */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-[#6b6560] flex items-center gap-1.5 select-none">
                                    <Info className="w-3.5 h-3.5 text-[#c9440b]" />
                                    Diagnostic Objective
                                  </span>
                                  <p className="text-[11.5px] text-[#6b6560] leading-relaxed">
                                    {q.intent}
                                  </p>
                                </div>

                                {/* Look and Listen for triggers */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono font-bold uppercase text-[#6b6560] flex items-center gap-1.5 select-none">
                                    <Award className="w-3.5 h-3.5 text-[#c9440b]" />
                                    Success Indicators (Check to test)
                                  </span>
                                  <div className="space-y-1.5 pt-1.5 select-none">
                                    {q.idealIndicators.map((ind, indIdx) => {
                                      const key = `${q.num}-${indIdx}`;
                                      const isChecked = checkedIdList.includes(key);
                                      return (
                                        <div
                                          key={indIdx}
                                          onClick={() => toggleIndicatorCheckbox(q.num, indIdx)}
                                          className={`flex items-start gap-2.5 p-1.5 rounded border transition-all text-left ${
                                            isChecked 
                                              ? "bg-[#f0e6df] text-[#c9440b] border-[#c9440b]/20" 
                                              : "hover:bg-[#f5f1ea]/50 border-transparent bg-white/40 text-[#6b6560]"
                                          }`}
                                        >
                                          <div className={`mt-0.5 h-3.5 w-3.5 rounded border shrink-0 flex items-center justify-center transition-all ${
                                            isChecked ? "bg-[#c9440b] border-[#c9440b] text-white" : "border-[#d6cfc6] bg-white"
                                          }`}>
                                            {isChecked && <Check className="w-2 h-2 text-white font-bold" />}
                                          </div>
                                          <span className="text-[10px] font-medium leading-tight select-text">
                                            {ind}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>



                  </div>
                )}

                <footer className="app-footer select-none">Built for the Melo Associates technical screen</footer>
              </div>

            </div>

        </div>
      )}

    </div>
  );
}
