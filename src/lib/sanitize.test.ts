import { describe, it, expect } from 'vitest';
import { sanitizeRichText } from './sanitize';

describe('sanitizeRichText', () => {
  it('strips <script> tags entirely', () => {
    const result = sanitizeRichText('<p>Hello</p><script>alert(1)</script>');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert(1)');
    expect(result).toContain('<p>Hello</p>');
  });

  it('strips event-handler attributes like onerror', () => {
    const result = sanitizeRichText('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
  });

  it('strips javascript: URLs from links', () => {
    const result = sanitizeRichText('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain('javascript:');
  });

  it('keeps allowlisted formatting tags produced by RichTextEditor', () => {
    const input = '<h2>Heading</h2><p>Some <strong>bold</strong> and <em>italic</em> text.</p><ul><li>One</li></ul>';
    const result = sanitizeRichText(input);
    expect(result).toContain('<h2>Heading</h2>');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<ul>');
  });

  it('keeps safe http(s) links and adds rel="noopener noreferrer"', () => {
    const result = sanitizeRichText('<a href="https://example.com">link</a>');
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('strips disallowed tags like <style> and <iframe>', () => {
    const result = sanitizeRichText('<style>body{display:none}</style><iframe src="evil.com"></iframe><p>ok</p>');
    expect(result).not.toContain('<style');
    expect(result).not.toContain('<iframe');
    expect(result).toContain('<p>ok</p>');
  });
});
