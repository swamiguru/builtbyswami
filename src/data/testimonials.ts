/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * LinkedIn recommendations, republished with attribution.
 *
 * `quote` is an extracted pull quote — the sentence carrying an actual claim.
 * `full` is the complete text as written, shown when a card is expanded.
 * Nothing here changes an author's meaning; ellipses mark omissions.
 *
 * `forServices` picks the subset shown on /work-with-me. Keep that list to
 * three — the services page wants proof of delivery, not a wall of praise.
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
    quote:
      "Driving market growth through launches in markets like the Middle East for Vogue, GQ, AD and CNT… he proved adept at leading engineers on global projects full of market nuances. The Market Directors recognized his sensitivity to revenue implications — Swami was able to hold both, a critical combination for successful product managers.",
    full: "Swami was one of the first members of our product team in India, first working on GQ as a product manager, before moving into a Senior Product Manager role driving market growth through launches in markets like the Middle East for Vogue, GQ, AD and CNT. He proved adept at leading engineers on these global projects that were full of market nuances that he always had the patience and curiosity to dig into. This endeared him to the Market Directors who recognized his sensitivity to revenue implications to customer facing work. Swami was able to hold both — a critical combination for successful product managers here. He also became a natural leader and mentor to others in the Bangalore office looking to learn our shared stack and capabilities, partner more effectively with design and engineering and also come up with creative solutions to complex problems. I would welcome the opportunity to work with Swami again.",
  },
  {
    id: "rohit-gupta",
    name: "Rohit Gupta",
    title: "VP / Head of Product · Platform & Agentic AI",
    relationship: "Senior stakeholder",
    date: "2026-05-20",
    forServices: true,
    quote:
      "Exceptional in leading multiple growth initiatives and new market launches at Condé Nast. He combines sharp product instincts with strong execution, and works seamlessly across global cross-functional teams.",
    full: "Swami has been exceptional in leading multiple growth initiatives and new market launches at Condé Nast. One of his biggest strengths is understanding audiences deeply across different markets and shaping products and experiences that genuinely resonate locally. He combines sharp product instincts with strong execution, works seamlessly across global cross-functional teams, and brings a level of curiosity that consistently drives better outcomes and business growth. If you're looking for an AI-native, growth-oriented product manager who can translate market insight into real impact, I'd highly recommend him.",
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
    full: "It was my first PM when I joined Condé Nast, and we shared such an amazing ride at GQ during a time of great transformation. World Cup 2022 coverage, the new Men of the Year digital experience, and the new GQ Sports vertical: all moments that redefined the way users interact with our websites, taking our brands to the next level. None of this would have been possible without the wise guidance of Swami. Hard deadlines, global scale (11+ markets), opinionated stakeholders: nothing stopped him from keeping the team focused on delivering high-quality, high-impact work. As a designer, I would always love to have someone like Swami in my team — a person who has a clear understanding of what a good product is and what it requires.",
  },
  {
    id: "lisa-maria-gutierrez",
    name: "Lisa María Gutiérrez",
    title: "Senior Technical Program Manager",
    relationship: "Same team",
    date: "2026-03-01",
    quote:
      "He managed engineering teams while onboarding new brands and driving expansion initiatives. He handles scale and complexity with calm precision, making high-impact work look almost effortless.",
    full: "I had the opportunity to work closely with Swami for several years at Condé Nast and witnessed his growth into a highly effective product leader. Swami combines strategic thinking with a practical, execution-focused mindset. He is direct, collaborative, and strong at stakeholder management; able to align different perspectives while keeping momentum. In the last year especially, I was impressed by how seamlessly he managed engineering teams while onboarding new brands and driving expansion initiatives. He handles scale and complexity with calm precision, making high-impact work look almost effortless. Swami also has a strong ability to position and “sell” initiatives into new markets. He understands both the product and the business narrative, which allows him to drive growth in a way that feels structured and intentional. He brings clarity, ownership, and strong commercial awareness to everything he leads.",
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
      "He analyses dependencies, edge cases, stakeholder expectations and execution risks well in advance. He drives initiatives end-to-end with accountability and calmness, even in high-pressure launch environments.",
    full: "I had the opportunity to work closely with Swami at Condé Nast on multiple high-visibility brand launches including Vogue, WIRED, GQ and CNTraveller, and he has been one of the strongest Product Managers I've collaborated with. What sets Swami apart is his ability to go deep into every requirement, user story, and business expectation with exceptional clarity and structure. He does not operate at a surface level — he analyses dependencies, edge cases, stakeholder expectations, execution risks, and long-term impacts well in advance. That level of preparation gives engineering teams a very strong foundation to plan architecture, technical execution, and delivery effectively. From stakeholder management to execution tracking, he drives initiatives end-to-end with accountability and calmness, even in high-pressure launch environments. He creates a smooth bridge between business stakeholders, product expectations, and engineering teams, ensuring alignment across all functions without creating execution friction.",
  },
  {
    id: "s-vivekananda",
    name: "S Vivekananda",
    title: "Senior Full Stack Developer",
    company: "Condé Nast",
    relationship: "Same team",
    date: "2026-06-30",
    quote:
      "I worked with Swami on several major brand launches, including Vogue, WIRED, GQ and CNTraveller… His planning gives the engineering team a clear direction and helps avoid surprises later in the development cycle.",
    full: "I had the pleasure of working with Swami at Condé Nast on several major brand launches, including Vogue, WIRED, GQ, and CNTraveller. Over that time, I got to see firsthand how much value he brings as a Product Manager, and he's easily one of the best I've had the chance to work with. What I appreciate most about Swami is the amount of thought he puts into everything before execution begins. Whether it's understanding business goals, refining requirements, identifying edge cases, or thinking through technical dependencies, he always comes prepared. His planning gives the engineering team a clear direction and helps avoid surprises later in the development cycle. He takes ownership of his work, keeps everyone aligned, and makes sure projects continue moving forward, even when timelines are tight or priorities change. No matter how busy things get, he stays calm, organised, and focused on finding the right solution. Working with him never feels like product versus engineering — he brings people together, encourages discussions, listens to different perspectives, and helps everyone stay focused on the same goal.",
  },
  {
    id: "mohammed-ameen",
    name: "Mohammed Ameen",
    title: "Engineering Manager",
    company: "Condé Nast",
    relationship: "Partner team",
    date: "2026-05-14",
    quote:
      "Easily one of the smartest Product Managers I've worked with. What always stood out was his ability to think end-to-end, from product vision and strategy to execution and delivery.",
    full: "I've had the opportunity to work closely with Swami during our time at Condé Nast, especially in the GQ team where we collaborated across multiple brand initiatives and product experiences. Swami is easily one of the smartest Product Managers I've worked with. What always stood out was his ability to think end-to-end, from product vision and strategy to execution and delivery. He has a rare combination of strong product intuition, leadership, and execution excellence that makes him incredibly effective at building impactful products. Beyond product thinking, Swami is a great leader who brings teams together, drives alignment across stakeholders, and creates an environment where people can do their best work. He consistently approaches complex challenges with clarity while keeping both business goals and user experience at the center of every decision.",
  },
  {
    id: "aditya-anand",
    name: "Aditya Anand",
    title: "Staff Engineer",
    company: "Warner Bros. Discovery",
    relationship: "Partner team",
    date: "2026-05-13",
    quote:
      "An exceptional product leader with a strong track record of successfully launching and scaling brands across the Middle East market — a rare combination of deep consumer understanding, commercial acumen and operational excellence.",
    full: "I have had the pleasure of working with Swami, and what consistently stands out is his ability to combine strategic product vision with flawless execution. He is an exceptional product leader with a strong track record of successfully launching and scaling brands across the Middle East market. Swami brings a rare combination of deep consumer understanding, commercial acumen, and operational excellence. His work on established brands such as GQ, along with his success in bringing new brands to market, demonstrates both his ability to build from scratch and elevate iconic brands.",
  },
  {
    id: "tim-smith",
    name: "Tim Smith",
    title: "Serial Innovator",
    relationship: "Same team",
    date: "2026-07-02",
    quote:
      "Swami has a gift for bringing out the best in people. He's light and crisp at describing what needs to be done without creating any counterproductive tensions. People feel safe and appreciated, and get stuff done.",
    full: "Swami has a gift for bringing out the best in people. He's light and crisp at describing what needs to be done without creating any counterproductive tensions. People feel safe and appreciated, and get stuff done. He is what all leaders try to be but few succeed. C-level material.",
  },
  {
    id: "marie-nakashima",
    name: "Marie Nakashima",
    title: "Senior Manager, Audience Development",
    company: "GQ Japan, Condé Nast",
    relationship: "Same team",
    date: "2026-04-27",
    quote:
      "Swami is a brilliant global communicator. His presence brought clarity to our business concerns. He never left a concern behind, and proposed solutions immediately.",
    full: "I had the opportunity to work with Swami at Condé Nast. He was responsible for product's global projects and I was a counterpart as the Japanese market's product manager. Swami is a brilliant global communicator. His presence brought clarity to our business concerns. He never left a concern behind, and proposed solutions immediately. It was my honour to work with Swami — a positive mindset and a great problem solver.",
  },
];

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
