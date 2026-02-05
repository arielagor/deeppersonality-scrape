# Rebuilding DeepPersonality.app

This guide explains how to recreate the Deep Personality website using Andrew Wilkinson's original methodology.

---

## 🎯 The Wilkinson Method: "Vibe Coding" with AI

Andrew Wilkinson built Deep Personality by talking to Claude Code like a human employee. Here's his process:

### Step 1: Define the Problem

Ask ChatGPT/Claude a loaded question:

> "What information would you need in order to become the ultimate personalized relationship coach?"

The AI will respond with a list of validated psychological tests psychologists use.

### Step 2: Curate the Tests

Wilkinson combined these psychological assessments (all available online):

| Category                      | What It Measures                                                     |
| ----------------------------- | -------------------------------------------------------------------- |
| **Big Five Personality**      | Why you do what you do (gold standard)                               |
| **Attachment Styles**         | Patterns of pushing away, clinging, or choosing unavailable partners |
| **Anxiety & Depression**      | Mental health screening beyond "just stress"                         |
| **Relationship Satisfaction** | Real health of relationships                                         |
| **Sensory Processing**        | Why environments drain or energize you                               |
| **Neurodivergence**           | ADHD and autism-spectrum traits                                      |
| **Trauma**                    | Early experiences shaping triggers                                   |
| **Values & Career Fit**       | What actually motivates you                                          |

**Total: 30+ psychological screens, 300+ questions**

### Step 3: Build the App with AI

Use Claude Code (or similar AI coding assistant):

```
"Build a web app that combines all these psychological tests into one
beautiful interface. I want users to pound through them as one big test
instead of filling out scattered PDFs."
```

Key prompting approach:

- Talk to AI like a human employee
- Describe desired outcomes, not technical specs
- Iterate rapidly ("make it more beautiful", "add this feature")

### Step 4: Generate AI Analysis

After collecting test results, export to ChatGPT/Claude with this prompt:

> "Based on this person's psychological test results, tell me as much as you can about their personality, patterns, and potential challenges."

For couples:

> "Based on this couple's psychological test results, tell me as much as you can about their relationship dynamics."

---

## 🛠️ Technology Stack

| Component | Technology               | Purpose                          |
| --------- | ------------------------ | -------------------------------- |
| Framework | Next.js 14+ (App Router) | React-based, SEO-friendly        |
| Styling   | Tailwind CSS             | Rapid UI development             |
| Icons     | Lucide React             | Modern icon library              |
| Hosting   | Vercel                   | Seamless Next.js deployment      |
| Analytics | PostHog                  | User behavior tracking           |
| Auth      | NextAuth.js or Clerk     | Google OAuth, Email, Magic Links |

---

## 📋 Core Features to Implement

### 1. Assessment Engine

- Single-page questionnaire flow
- Progress tracking (0-100%)
- 300+ question database across 30+ screens
- Immediate save/resume functionality

### 2. Report Generation (50+ pages)

- Personality deep dive
- Compatibility analysis (for couples)
- Severity flags and thresholds
- Actionable recommendations

### 3. AI Integration

Generate custom prompts pre-loaded with user's psychological data:

```
Based on my test results, I have:
- Attachment Style: [X]
- Big Five: [scores]
- Anxiety: [level]
- Trauma indicators: [Y]
...

Act as my personalized therapist who already understands my patterns.
```

### 4. Export Options

- **Clinical PDF**: Raw scores, thresholds, severity flags, citations
- **AI Prompt**: Custom prompt for ChatGPT/Claude/any AI
- **Dating Bios**: Generated profiles for Hinge, Bumble, Tinder

### 5. Comparison Features

- Couples relationship analysis
- Work relationship dynamics
- Friendship compatibility

---

## 🚀 Quick Start

### 1. Create New Next.js Project

```bash
npx create-next-app@latest deeppersonality-rebuild --typescript --tailwind --app
cd deeppersonality-rebuild
npm install lucide-react
```

### 2. Extract Content from Scraped HTML

Review these scraped files:

- `scraped-content/pages/index.html` - Homepage structure & copy
- `scraped-content/pages/privacy.html` - Privacy policy text
- `scraped-content/pages/terms.html` - Terms of service text

### 3. Key Components to Build

```
src/
├── app/
│   ├── page.tsx              # Landing/Assessment page
│   ├── privacy/page.tsx      # Privacy policy
│   ├── terms/page.tsx        # Terms of service
│   └── api/
│       └── generate-report/  # AI report generation
├── components/
│   ├── Assessment/
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ResultsSummary.tsx
│   ├── Report/
│   │   ├── PersonalityProfile.tsx
│   │   └── CompatibilityChart.tsx
│   └── Auth/
│       └── LoginModal.tsx
└── lib/
    ├── tests/                # Psychological test definitions
    ├── scoring/              # Test scoring algorithms
    └── ai/                   # AI prompt generation
```

### 4. Psychological Tests Sources

Research and implement validated tests:

- **OCEAN/Big Five**: Public domain personality assessment
- **ECR-R**: Experiences in Close Relationships (attachment)
- **PHQ-9**: Patient Health Questionnaire (depression)
- **GAD-7**: Generalized Anxiety Disorder scale
- **ACE**: Adverse Childhood Experiences (trauma)
- **RAADS-R**: Ritvo Autism Asperger Diagnostic Scale

### 5. Deploy

```bash
npx vercel
```

---

## 💡 Pro Tips from Wilkinson

1. **Vibe Code**: Talk to AI naturally, not technically
2. **Iterate Fast**: Hours, not months
3. **Make it Beautiful**: First impressions matter ($50k design for $500)
4. **Solve Real Problems**: This replaces expensive evaluations
5. **Emotional Impact**: Users should have "jaws on floor" moments

---

## 📊 Pricing Reference

| Tier        | Price | Features                |
| ----------- | ----- | ----------------------- |
| Basic       | Free  | Basic analysis          |
| Full Report | $19   | 50+ page deep dive      |
| Couples     | $29   | Relationship comparison |

---

## 📁 Scraped Files Reference

```
scraped-content/
├── pages/
│   ├── index.html          # Homepage with hero, features
│   ├── privacy.html        # Full privacy policy
│   ├── terms.html          # Full terms of service
│   ├── assessment.html     # Assessment start screen
│   ├── *.png               # Full-page screenshots
├── assets/
│   └── js/                 # PostHog analytics scripts
└── metadata/
    ├── assets.json         # All discovered asset URLs
    └── urls.json           # Page URL manifest
```

---

## 🔗 Resources

- **Original Repo**: [github.com/arielagor/deeppersonality-scrape](https://github.com/arielagor/deeppersonality-scrape)
- **Live Site**: [deeppersonality.app](https://deeppersonality.app)
- **Wilkinson's Process**: Andrew Wilkinson's X thread on vibe coding
