/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * LinkedIn recommendations, republished with attribution.
 *
 * FIDELITY RULES — these are other people's words about Swami, so:
 *   • `full` is the COMPLETE text exactly as the author wrote it. Nothing is
 *     trimmed, reordered, or rephrased. Typos included.
 *   • `quote` is a verbatim extract. Every omission is marked with `…`.
 *     Katharine's is her complete recommendation, unabridged — including the
 *     "--" she typed and the missing "to" in "sensitivity Revenue implications".
 *   • No word is ever substituted, and no sentence is ever joined to another
 *     without an ellipsis showing the join.
 *
 * `forServices` picks the subset shown on /work-with-me. Keep that to three —
 * the services page wants proof of delivery, not a wall of praise.
 *
 * Dates are stored for ordering only and are deliberately never rendered.
 */

export type Relationship =
  | "Senior stakeholder"
  | "Same team"
  | "Partner team"
  | "Client";

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company?: string;
  relationship: Relationship;
  date: string; // ISO — sort only, never displayed
  quote: string;
  /** Optional typographic emphasis for the opening of `quote`. MUST be a
   *  verbatim prefix of `quote` — we emphasise where the author started, we
   *  never pick a favourite sentence out of the middle. Asserted below. */
  lead?: string;
  full: string;
  featured?: boolean; // the hero quote on /about
  forServices?: boolean; // also shown on /work-with-me
  initials?: string; // override when the derived pair reads badly
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "katharine-bailey",
    name: "Katharine Bailey",
    title: "SVP Audience Experience, Product & Design",
    relationship: "Senior stakeholder",
    date: "2026-05-13",
    featured: true,
    forServices: true,
    lead:
      "Swami was one of the first members of our product team in India, first working on GQ as a product manager, before moving into a Senior Product Manager role driving market growth through launches in markets like the Middle East for Vogue, GQ, AD and CNT.",
    quote:
      "Swami was one of the first members of our product team in India, first working on GQ as a product manager, before moving into a Senior Product Manager role driving market growth through launches in markets like the Middle East for Vogue, GQ, AD and CNT. He proved adept at leading engineers on these global projects that were full of market nuances that he always had the patience and curiosity to dig into. This endeared him to the Market Directors who recognized his sensitivity Revenue implications to customer facing work. Swami was able to hold both -- a critical combination for successful product managers here. He also became a natural leader and mentor to others in the Bangalore office looking to learn our shared stack and capabilities, partner more effectively with design and engineering and also come up with creative solutions to complex problems. I would welcome the opportunity to work with Swami again.",
    full: "Swami was one of the first members of our product team in India, first working on GQ as a product manager, before moving into a Senior Product Manager role driving market growth through launches in markets like the Middle East for Vogue, GQ, AD and CNT. He proved adept at leading engineers on these global projects that were full of market nuances that he always had the patience and curiosity to dig into. This endeared him to the Market Directors who recognized his sensitivity Revenue implications to customer facing work. Swami was able to hold both -- a critical combination for successful product managers here. He also became a natural leader and mentor to others in the Bangalore office looking to learn our shared stack and capabilities, partner more effectively with design and engineering and also come up with creative solutions to complex problems. I would welcome the opportunity to work with Swami again.",
  },
  {
    id: "rohit-gupta",
    name: "Rohit Gupta",
    title: "VP / Head of Product · Platform & Agentic AI",
    relationship: "Senior stakeholder",
    date: "2026-05-20",
    forServices: true,
    quote:
      "Swami has been exceptional in leading multiple growth initiatives and new market launches at Condé Nast… He combines sharp product instincts with strong execution, works seamlessly across global cross-functional teams, and brings a level of curiosity that consistently drives better outcomes and business growth.",
    full: "Swami has been exceptional in leading multiple growth initiatives and new market launches at Condé Nast.\nOne of his biggest strengths is understanding audiences deeply across different markets and shaping products and experiences that genuinely resonate locally. He combines sharp product instincts with strong execution, works seamlessly across global cross-functional teams, and brings a level of curiosity that consistently drives better outcomes and business growth.\nIf you’re looking for an AI-native, growth-oriented product manager who can translate market insight into real impact, I’d highly recommend him.",
  },
  {
    id: "elia-fulchignoni",
    name: "Elia Fulchignoni",
    title: "Senior Product Designer",
    company: "Condé Nast",
    relationship: "Partner team",
    date: "2026-05-13",
    forServices: true,
    quote:
      "Hard deadlines, global scale (11+ markets), opinionated stakeholders: nothing stopped him from keeping the team focused on delivering high-quality, high-impact work.",
    full: "Swami, true king!\n\nI will always be grateful for the chance of working with him.\nIt was my first PM when I joined Condé Nast, and we shared such an amazing ride at GQ during a time of great transformation.\n\nWorld Cup 2022 coverage, the new Men of the Year digital experience, and the new GQ Sports vertical: all moments that redefined the way users interact with our websites, taking our brands to the next level.\n\nNone of this would have been possible without the wise guidance of Swami.\nHard deadlines, global scale (11+ markets), opinionated stakeholders: nothing stopped him from keeping the team focused on delivering high-quality, high-impact work.\n\nAs a designer, I would always love to have someone like Swami in my team.\nA person who has a clear understanding of what a good product is and what it requires.\n\nAnyone should consider themselves lucky to have him on their roster.",
  },
  {
    id: "lisa-maria-gutierrez",
    name: "Lisa María Gutiérrez",
    title: "Senior Technical Program Manager",
    relationship: "Same team",
    date: "2026-03-01",
    quote:
      "I was impressed by how seamlessly he managed engineering teams while onboarding new brands and driving expansion initiatives. He handles scale and complexity with calm precision, making high-impact work look almost effortless.",
    full: "I had the opportunity to work closely with Swami for several years at Condé Nast and witnessed his growth into a highly effective product leader.\n\nSwami combines strategic thinking with a practical, execution-focused mindset. He is direct, collaborative, and strong at stakeholder management; able to align different perspectives while keeping momentum.\nOver time, I saw him take on increasingly complex responsibilities with confidence.\n\nIn the last year especially, I was impressed by how seamlessly he managed engineering teams while onboarding new brands and driving expansion initiatives. He handles scale and complexity with calm precision, making high-impact work look almost effortless.\n\nSwami also has a strong ability to position and “sell” initiatives into new markets. He understands both the product and the business narrative, which allows him to drive growth in a way that feels structured and intentional.\n\nHe brings clarity, ownership, and strong commercial awareness to everything he leads. Any organization focused on digital growth and expansion would benefit from his leadership.",
  },
  {
    id: "sri-saahithi-d",
    name: "Sri Saahithi D",
    title: "Engineering Manager",
    company: "The Walt Disney Company",
    relationship: "Same team",
    date: "2026-05-14",
    initials: "SS",
    quote:
      "He does not operate at a surface level — he analyses dependencies, edge cases, stakeholder expectations, execution risks, and long-term impacts well in advance… he drives initiatives end-to-end with accountability and calmness, even in high-pressure launch environments.",
    full: "I had the opportunity to work closely with Swami at Condé Nast on multiple high-visibility brand launches including Vogue, WIRED, and GQ, CNTraveller, and he has been one of the strongest Product Managers I’ve collaborated with.\n\nWhat sets Swami apart is his ability to go deep into every requirement, user story, and business expectation with exceptional clarity and structure. He does not operate at a surface level — he analyses dependencies, edge cases, stakeholder expectations, execution risks, and long-term impacts well in advance. That level of preparation gives engineering teams a very strong foundation to plan architecture, technical execution, and delivery effectively.\n\nHe brings a rare combination of product thinking, ownership, and operational discipline. From stakeholder management to execution tracking, he drives initiatives end-to-end with accountability and calmness, even in high-pressure launch environments.\n\nOne of the biggest strengths I observed while working with him was his collaboration style. He creates a smooth bridge between business stakeholders, product expectations, and engineering teams, ensuring alignment across all functions without creating execution friction.\n\nSwami is also someone who continuously evolves with the industry. He actively leverages modern AI-powered tools and platforms such as NotebookLM, Gemini, Jira, and Confluence to improve product planning, research, documentation, and execution efficiency. What stands out is his curiosity and learning mindset — he is always exploring new technologies, market trends, and smarter ways of working to enhance both product outcomes and team productivity.\n\nHe is detail-oriented, highly dependable, proactive in planning, and genuinely invested in delivering quality products with perfection. Any team looking for a Product Manager who can drive clarity, execution excellence, modern product thinking, and strong cross-functional alignment would be fortunate to have him.",
  },
  {
    id: "s-vivekananda",
    name: "S Vivekananda",
    title: "Senior Full Stack Developer",
    company: "Condé Nast",
    relationship: "Same team",
    date: "2026-06-30",
    quote:
      "I had the pleasure of working with Swami at Condé Nast on several major brand launches, including Vogue, WIRED, GQ, and CNTraveller… His planning gives the engineering team a clear direction and helps avoid surprises later in the development cycle.",
    full: "I had the pleasure of working with Swami at Condé Nast on several major brand launches, including Vogue, WIRED, GQ, and CNTraveller. Over that time, I got to see firsthand how much value he brings as a Product Manager, and he's easily one of the best I've had the chance to work with.\n\nWhat I appreciate most about Swami is the amount of thought he puts into everything before execution begins. Whether it's understanding business goals, refining requirements, identifying edge cases, or thinking through technical dependencies, he always comes prepared. His planning gives the engineering team a clear direction and helps avoid surprises later in the development cycle.\n\nSwami has a great balance of strategic thinking and execution. He takes ownership of his work, keeps everyone aligned, and makes sure projects continue moving forward, even when timelines are tight or priorities change. No matter how busy things get, he stays calm, organised, and focused on finding the right solution.\n\nHe's also someone who genuinely values collaboration. Working with him never feels like product versus engineering. Instead, he brings people together, encourages discussions, listens to different perspectives, and helps everyone stay focused on the same goal. That ability to connect business needs with engineering realities makes a huge difference during delivery.\n\nAnother thing I admire about Swami is his willingness to keep learning. He's always exploring new ways to improve the way teams work and has been quick to adopt AI tools like NotebookLM and Gemini, along with platforms like Jira and Confluence, to make product planning, documentation, and research more effective. It's clear that he enjoys learning new things and applying them in practical ways.\n\nAbove all, Swami is someone you can rely on. He's thoughtful, detail-oriented, approachable, and genuinely cares about building quality products. Any team looking for a Product Manager who combines strong product thinking with excellent execution and collaboration would be lucky to have him. I wouldn't hesitate to recommend him.",
  },
  {
    id: "mohammed-ameen",
    name: "Mohammed Ameen",
    title: "Engineering Manager",
    company: "Condé Nast",
    relationship: "Partner team",
    date: "2026-05-14",
    quote:
      "Swami is easily one of the smartest Product Managers I’ve worked with. What always stood out was his ability to think end-to-end, from product vision and strategy to execution and delivery.",
    full: "I’ve had the opportunity to work closely with Swami during our time at Condé Nast, especially in the GQ team where we collaborated across multiple brand initiatives and product experiences.\n\nSwami is easily one of the smartest Product Managers I’ve worked with. What always stood out was his ability to think end-to-end, from product vision and strategy to execution and delivery. He has a rare combination of strong product intuition, leadership, and execution excellence that makes him incredibly effective at building impactful products.\n\nBeyond product thinking, Swami is a great leader who brings teams together, drives alignment across stakeholders, and creates an environment where people can do their best work. He consistently approaches complex challenges with clarity while keeping both business goals and user experience at the center of every decision.\n\nI genuinely feel lucky to have worked with Swami at Condé Nast and would highly recommend him to any organization looking for a strong product leader and an exceptional end-to-end product builder.",
  },
  {
    id: "aditya-anand",
    name: "Aditya Anand",
    title: "Staff Engineer",
    company: "Warner Bros. Discovery",
    relationship: "Partner team",
    date: "2026-05-13",
    quote:
      "He is an exceptional product leader with a strong track record of successfully launching and scaling brands across the Middle East market. Swami brings a rare combination of deep consumer understanding, commercial acumen, and operational excellence.",
    full: "I have had the pleasure of working with Swami, and what consistently stands out is his ability to combine strategic product vision with flawless execution. He is an exceptional product leader with a strong track record of successfully launching and scaling brands across the Middle East market.\n\nSwami brings a rare combination of deep consumer understanding, commercial acumen, and operational excellence. His work on established brands such as GQ, along with his success in bringing new brands to market, demonstrates both his ability to build from scratch and elevate iconic brands.\n\nI would confidently recommend Swami to any organization looking for a product and brand leader who can drive growth, innovation, and measurable business impact.",
  },
  {
    id: "tim-smith",
    name: "Tim Smith",
    title: "Serial Innovator",
    relationship: "Same team",
    date: "2026-07-02",
    quote:
      "Swami has a gift for bringing out the best in people. He’s light and crisp at describing what needs to be done without creating any counterproductive tensions. People feel safe and appreciated, and get stuff done.",
    full: "Swami has a gift for bringing out the best in people. He’s light and crisp at describing what needs to be done without creating any counterproductive tensions. People feel safe and appreciated, and get stuff done. He is what all leaders try to be but few succeed. C-level material.",
  },
  {
    // TODO — Marie's text is published exactly as she wrote it, typos included,
    // because correcting someone else's words without asking is not our call.
    // Ask her whether she'd rather it were tidied; if yes, edit here and note it.
    id: "marie-nakashima",
    name: "Marie Nakashima",
    title: "Senior Manager, Audience Development",
    company: "GQ Japan, Condé Nast",
    relationship: "Same team",
    date: "2026-04-27",
    quote:
      "Swami is a brilliant global communicater. His presence brought us clarity to our business concerns. He never leave concerns behind and proposed us solutions immediately.",
    full: "I had opportunity to work with Swami at Conde Nast. He was resposible for product's global project and I was a counterpart as a Japanese market's product manager.\n\nSwami is a brilliant global communicater. His presence brought us clarity to our business concerns. He never leave concerns behind and proposed us solutions immediately.\n\nIt was my honor to work with Swami, a posive mind set great problem solver.",
  },
];

// A `lead` that is not a verbatim prefix would silently misquote the author,
// so fail loudly in development rather than shipping it.
for (const t of TESTIMONIALS) {
  if (t.lead && !t.quote.startsWith(t.lead)) {
    throw new Error(
      `Testimonial "${t.id}": lead is not a verbatim prefix of quote.`
    );
  }
}

export const HERO_TESTIMONIAL = TESTIMONIALS.find((t) => t.featured);

/** Everything except the hero, newest first — the /about grid. */
export const GRID_TESTIMONIALS = TESTIMONIALS.filter((t) => !t.featured).sort(
  (a, b) => b.date.localeCompare(a.date)
);

/** The tight cut for /work-with-me, in the order they should read. */
export const SERVICE_TESTIMONIALS = TESTIMONIALS.filter((t) => t.forServices);

/** Two initials for the monogram. Falls back to first + last name token. */
export const initialsFor = (t: Testimonial): string => {
  if (t.initials) return t.initials;
  const parts = t.name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};
