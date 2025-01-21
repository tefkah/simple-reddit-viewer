export function decodeHtml(html: string) {
  if (!html) return '';
  return (
    html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // .replace(/&#39;/g, "'");
      .replace(/&amp;#39;|&#x27;|&apos;/g, "'")
  );

  // .replace(/&quot;/g, '"');
}
