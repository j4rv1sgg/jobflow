import { CohereClientV2 } from 'cohere-ai';
import { NextResponse } from 'next/server';

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY!, 
});

export async function POST(req: Request) {
  const { company, title, description } = await req.json();
  const prompt = `
  You are an experienced recruiter and copywriter. 
  Write a professional, concise, and personalized cover letter for a frontend developer job.

  Applicant information:
  - Name: Andrii Chumak
  - Location: Wrocław, Poland
  - Email: andrii.chumak1@gmail.com
  - LinkedIn: https://www.linkedin.com/in/andrii-chumak
  - GitHub: https://github.com/j4rv1sgg
  - Experience: 3+ years as a frontend developer, specializing in React, Next.js, and TypeScript.
  - Strengths: performance optimization (Core Web Vitals), building responsive UIs, state management with Redux, accessibility (WCAG), testing with Jest, and modern development workflows (CI/CD, GitHub).
  - Notable projects: 
    - WebPulse – optimized LCP by 25%, created reusable UI components, improved authentication & form validation.
    - Asmeteo.pl – built interactive weather data visualizations using React and map-based components.

  Job details:
  - Position: ${title}
  - Company: ${company}
  - Job description: ${description}

  Guidelines:
  - Keep the tone professional, enthusiastic, and specific to the company and role.
  - Highlight how Andrii’s technical background and teamwork experience align with the company’s goals.
  - Keep the length between 3–5 paragraphs (max ~300 words).
  - Do not restate his CV line by line — focus on motivation, fit, and value.
  - Conclude politely with openness to further discussion.

  Output format:
  Plain text only — no markdown, no greetings like “Dear Hiring Manager” unless relevant.
  `;

  const response = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return NextResponse.json(response);
}
