import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun
} from 'docx';
import { EMPTY_ANSWERS, sanitizeRichTextHtml } from './answerContent';

export const PART1_QUESTIONS = [
  'What languages do you speak?',
  'Where do you work or study?',
  'What’s your favourite kind of food?',
  'What sports do you do?',
  'What time do you get up?'
];

export const PART3_QUESTIONS = [
  ['Jasmine', 'Hi and welcome! Do you prefer listening to music or making it?'],
  ['Leo', 'What was the best live music experience you’ve had?'],
  ['Amira', "We're planning a playlist for the next club meeting. Which songs or artists would you recommend, and why?"]
];

export const PART4_SOURCE_EMAIL = [
  'Dear Member,',
  'We are writing to let you know that next week’s music club meeting has been changed. Unfortunately, the guest speaker - local musician and music teacher Ms Rachel Dean - is no longer available due to illness.',
  'Instead, we will show a documentary about her life and career, and there will be a short discussion afterwards. The event will still take place at the usual time, and we hope you will enjoy the new format.',
  'If you have any suggestions or questions, please contact the club organiser.',
  'Kind regards,',
  'The Music Club Team'
];

export function getNormalizedSubmission(loaded) {
  return {
    part1: Array.isArray(loaded?.[1]) ? loaded[1] : EMPTY_ANSWERS[1],
    part2: typeof loaded?.[2] === 'string' ? sanitizeRichTextHtml(loaded[2]) : EMPTY_ANSWERS[2],
    part3: Array.isArray(loaded?.[3])
      ? loaded[3].map((answer) => sanitizeRichTextHtml(answer))
      : EMPTY_ANSWERS[3],
    part4: Array.isArray(loaded?.[4])
      ? loaded[4].map((answer) => sanitizeRichTextHtml(answer))
      : EMPTY_ANSWERS[4]
  };
}

export function getSubmissionFileBase(submissionId) {
  return `aptis-general-writing-${submissionId || 'submission'}`;
}

function makeAnswerRunsFromNode(node, formatting = {}) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (!text) {
      return [];
    }

    return [new TextRun({
      text,
      bold: formatting.bold,
      italics: formatting.italics,
      underline: formatting.underline ? {} : undefined,
      strike: formatting.strike
    })];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const tag = node.nodeName.toUpperCase();
  const nextFormatting = {
    bold: formatting.bold || tag === 'B' || tag === 'STRONG',
    italics: formatting.italics || tag === 'I' || tag === 'EM',
    underline: formatting.underline || tag === 'U',
    strike: formatting.strike || tag === 'S' || tag === 'STRIKE'
  };

  if (tag === 'BR') {
    return [new TextRun({ break: 1 })];
  }

  const childRuns = Array.from(node.childNodes).flatMap((child) =>
    makeAnswerRunsFromNode(child, nextFormatting)
  );

  if (tag === 'DIV' || tag === 'P') {
    childRuns.push(new TextRun({ break: 1 }));
  }

  return childRuns;
}

export function htmlToTextRuns(html) {
  if (!html) {
    return [new TextRun({ text: '(no answer)', italics: true })];
  }

  const container = document.createElement('div');
  container.innerHTML = sanitizeRichTextHtml(html);
  const runs = Array.from(container.childNodes).flatMap((node) => makeAnswerRunsFromNode(node));

  if (!runs.length) {
    return [new TextRun({ text: '(no answer)', italics: true })];
  }

  return runs;
}

function answerParagraph(html) {
  return new Paragraph({
    children: htmlToTextRuns(html),
    spacing: { after: 180 }
  });
}

function questionParagraph(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true })],
    spacing: { after: 120 }
  });
}

function bodyParagraph(text, options = {}) {
  return new Paragraph({
    text,
    spacing: { after: 140 },
    ...options
  });
}

export async function downloadSubmissionDocx({ submissionId, submission }) {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Aptos',
            size: 24
          },
          paragraph: {
            spacing: {
              line: 276
            }
          }
        }
      },
      paragraphStyles: [
        {
          id: 'TitleStyle',
          name: 'Title Style',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Aptos',
            size: 32,
            bold: true
          },
          paragraph: {
            spacing: { after: 240 }
          }
        },
        {
          id: 'HeadingOneStyle',
          name: 'Heading One Style',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            font: 'Aptos',
            size: 28,
            bold: true
          },
          paragraph: {
            spacing: { before: 200, after: 120 }
          }
        }
      ]
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'Aptis General Practice Test - Writing',
            style: 'TitleStyle'
          }),
          bodyParagraph('The test has four parts and takes up to 50 minutes.'),
          bodyParagraph('Recommended times:', { spacing: { after: 80 } }),
          ...[
            'Part One: 3 minutes',
            'Part Two: 7 minutes',
            'Part Three: 10 minutes',
            'Part Four: 30 minutes'
          ].map((item) => new Paragraph({
            text: item,
            bullet: { level: 0 },
            spacing: { after: 80 }
          })),
          new Paragraph({ text: '', spacing: { after: 160 } }),
          new Paragraph({
            text: 'Part One: Short answers',
            style: 'HeadingOneStyle'
          }),
          bodyParagraph('You want to join a music club. You have 5 messages from a member of the club. Write short answers (1-5 words) to each message. Recommended time: 3 minutes.'),
          ...PART1_QUESTIONS.flatMap((question, index) => [
            questionParagraph(question),
            answerParagraph(submission.part1[index] || '')
          ]),
          new Paragraph({
            text: 'Part Two: Form completion',
            style: 'HeadingOneStyle',
            pageBreakBefore: true
          }),
          bodyParagraph('You are a new member of the Music Club. Fill in the form. Write in sentences. Use 20-30 words. Recommended time: 7 minutes.'),
          questionParagraph('Please tell us about the music you like and when you usually listen to it.'),
          answerParagraph(submission.part2),
          new Paragraph({
            text: 'Part Three: Chat room',
            style: 'HeadingOneStyle'
          }),
          bodyParagraph('You are communicating with other members of the club in the chat room. Reply to their questions. Write in sentences. Use 30-40 words per answer. Recommended time: 10 minutes.'),
          ...PART3_QUESTIONS.flatMap(([speaker, text], index) => [
            questionParagraph(`${speaker}: ${text}`),
            answerParagraph(submission.part3[index] || '')
          ]),
          new Paragraph({
            text: 'Part Four: Emails',
            style: 'HeadingOneStyle',
            pageBreakBefore: true
          }),
          bodyParagraph('You are a member of a music club. You have received this email from the club:'),
          ...PART4_SOURCE_EMAIL.map((line) =>
            bodyParagraph(line, {
              indent: { left: 360 },
              border: {
                left: { color: 'AAAAAA', size: 6, space: 10 }
              }
            })
          ),
          questionParagraph('1) Write an email to your friend. Write about your feelings and what you think the club should do about the situation. Write about 50 words. Recommended time: 10 minutes.'),
          answerParagraph(submission.part4[0] || ''),
          questionParagraph('2) Write an email to the president of the club. Write about your feelings and what you think the club should do about the situation. Write 120-150 words. Recommended time: 20 minutes.'),
          answerParagraph(submission.part4[1] || ''),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Submission ID: ${submissionId}`,
                italics: true
              })
            ],
            spacing: { before: 300 }
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${getSubmissionFileBase(submissionId)}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
