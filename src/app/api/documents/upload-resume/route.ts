import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PDFParse, VerbosityLevel } from 'pdf-parse';
import { CohereClientV2 } from 'cohere-ai';
import 'pdf-parse/worker';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { documents } from '@/db/schema';

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
  let sumarizedText = '';
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parsing PDF
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 400 },
      );
    }

    const filePath = `${uuid()}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const parser = new PDFParse({
      data: arrayBuffer,
      verbosity: VerbosityLevel.WARNINGS,
    });
    const pdfData = await parser.getText();
    await parser.destroy();

    // Uploading file to storage
    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    if (error) {
      console.log(error);
      return NextResponse.json(
        { error: 'An error occurred while uploading the file' },
        { status: 500 },
      );
    }

    // AI Summary
    try {
      const response = await cohere.chat({
        model: 'command-a-03-2025',
        messages: [
          {
            role: 'user',
            content: `Summarize the key points of this document:\n\n${pdfData.text}`,
          },
        ],
      });

      const contentItem = response?.message?.content?.[0];
      if (contentItem && 'text' in contentItem) {
        sumarizedText = contentItem.text;
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: 'An error occurred while summarizing the document' },
        { status: 500 },
      );
    }

    // Posting to DB
    try {
      await db.insert(documents).values({
        documentTitle: 'test',
        userId: authData.user.id,
        filePath: filePath,
        fileName: file.name,
        text: pdfData.text,
        summary: sumarizedText,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: 'An error occurred while uploading the document' },
        { status: 500 },
      );
    }

    // Response
    return NextResponse.json({ text: pdfData.text }, { status: 201 });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'An error occurred while processing the PDF' },
      { status: 500 },
    );
  }
}
