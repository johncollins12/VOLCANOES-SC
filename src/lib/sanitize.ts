import sanitizeHtml from 'sanitize-html';

/**
 * SECURITY (Production Readiness phase): RichTextEditor
 * (components/cms/RichTextEditor.tsx) stores whatever HTML the browser's
 * contentEditable + execCommand produces, and that HTML was being saved
 * to NewsArticle.body / MatchReport.body and later rendered on public
 * pages via dangerouslySetInnerHTML with NO sanitization anywhere in the
 * pipeline — a textbook stored-XSS hole. A compromised (or just
 * careless — e.g. pasting rich content from an untrusted source) admin
 * account could have injected <script>, event-handler attributes
 * (onerror=...), or javascript: URLs that would execute in every
 * visitor's browser.
 *
 * Fixed by sanitizing at the write boundary (inside the Server Actions
 * that persist body content — see news.actions.ts and
 * match-reports.actions.ts) rather than at render time: sanitizing once
 * on ingestion is cheaper than re-sanitizing identical content on every
 * page view, and it means the database only ever holds content that's
 * already safe to render, which is a stronger invariant to depend on.
 *
 * The allowlist matches exactly what RichTextEditor's toolbar can
 * produce (bold, italic, headings, lists, links) — nothing else is
 * needed, so nothing else is allowed.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'br', 'blockquote'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
  });
}
