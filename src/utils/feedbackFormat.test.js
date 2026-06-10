import { buildFeedbackReport } from './feedbackFormat';

describe('feedback report formatting', () => {
  test('keeps Part 1 longer answers as optional suggestions, not mistakes', () => {
    const report = buildFeedbackReport('part1', {
      feedback: {
        overall: {
          summary: 'Mostly clear.',
          communication: 'clear',
          lengthControl: 'mixed'
        },
        answers: [
          {
            question: 'What do you do?',
            answer: 'I am a primary school teacher.',
            suggestedAnswer: 'Primary school teacher.',
            length: { status: 'too_long' },
            wordCount: 6,
            learningFeedback: 'You can shorten it.'
          },
          {
            question: 'Where do you live?',
            answer: 'Barcelona.',
            suggestedAnswer: 'Barcelona.',
            length: { status: 'good' }
          }
        ],
        teacherComment: 'Keep answers short.'
      }
    });

    expect(report.sections).toHaveLength(1);
    expect(report.sections[0].mistakes).toBeUndefined();
    expect(report.sections[0].suggestions).toHaveLength(1);
    expect(report.sections[0].suggestions[0]).toMatchObject({
      original: 'I am a primary school teacher.',
      correction: 'Primary school teacher.'
    });
  });

  test('compacts Part 4 language errors into mistakes to fix', () => {
    const report = buildFeedbackReport('part4', {
      feedback: {
        overall: {
          summary: 'Relevant answer.',
          mainPriorities: ['Improve accuracy.']
        },
        informalEmail: {
          taskFulfilment: { feedback: 'Mostly answers the prompt.' },
          languageErrors: [
            {
              category: 'spelling',
              original: 'recieved',
              correction: 'received',
              explanation: 'The spelling is incorrect.'
            },
            {
              category: 'register',
              original: 'Hi Max!',
              correction: 'Hi Max!',
              explanation: 'This is already fine.'
            }
          ],
          improvedVersion: 'Hi Max! I just received the email.'
        }
      }
    });

    expect(report.sections[0].mistakes).toHaveLength(1);
    expect(report.sections[0].mistakes[0].original).toBe('recieved');
    expect(report.sections[0].improvedVersion).toContain('received');
  });

  test('filters preference-only rewrites from mistakes to fix', () => {
    const report = buildFeedbackReport('part4', {
      feedback: {
        formalEmail: {
          languageErrors: [
            {
              category: 'style',
              original: 'I would be delighted to participate',
              correction: 'I would like to take part',
              explanation: 'This is simpler and more natural.'
            },
            {
              category: 'word_order',
              original: 'Not only you can find',
              correction: 'Not only can you find',
              explanation: 'The word order is incorrect.'
            }
          ]
        }
      }
    });

    expect(report.sections[0].mistakes).toHaveLength(1);
    expect(report.sections[0].mistakes[0].original).toBe('Not only you can find');
  });

  test('separates Part 2 question from the student response', () => {
    const report = buildFeedbackReport('part2', {
      feedback: {
        part: 'part2',
        answers: [
          {
            prompt: 'Please tell us about your experience with photography.',
            answer: 'I have always been a huge fan of photography.',
            taskFulfilment: 'strong',
            improvedVersion: 'I have always been a huge fan of photography.'
          }
        ]
      }
    });

    expect(report.sections[0].question).toBe('Please tell us about your experience with photography.');
    expect(report.sections[0].studentAnswer).toBe('I have always been a huge fan of photography.');
  });

  test('shows Part 2 language errors as mistakes to fix', () => {
    const report = buildFeedbackReport('part2', {
      feedback: {
        part: 'part2',
        answers: [
          {
            prompt: 'Please tell us about your experience.',
            answer: 'I am a passionate but I do not have a lot of knowledge.',
            languageErrors: [
              {
                category: 'grammar',
                original: 'I am a passionate',
                correction: 'I am passionate about photography',
                explanation: 'The adjective needs a complement here.'
              }
            ],
            improvedVersion: 'I am passionate about photography, but I do not have much experience yet.'
          }
        ]
      }
    });

    expect(report.sections[0].mistakes).toHaveLength(1);
    expect(report.sections[0].mistakes[0]).toMatchObject({
      original: 'I am a passionate',
      correction: 'I am passionate about photography'
    });
  });
});
