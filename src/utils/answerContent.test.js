import {
  countWords,
  sanitizeRichTextHtml,
  stripHtmlToText
} from './answerContent';

describe('answerContent helpers', () => {
  test('sanitizes rich text and removes unsafe elements', () => {
    expect(
      sanitizeRichTextHtml(
        '<div>Hello <strong>there</strong><img src=x onerror=alert(1) /><script>alert(1)</script></div>'
      )
    ).toBe('<div>Hello <strong>there</strong>alert(1)</div>');
  });

  test('strips HTML to readable text', () => {
    expect(stripHtmlToText('<p>Hello <em>world</em></p>')).toContain('Hello');
  });

  test('counts words from plain text', () => {
    expect(countWords('one two   three')).toBe(3);
  });
});
