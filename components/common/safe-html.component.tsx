import DOMPurify from 'dompurify';
export default function SafeHtmlComponent({ htmlContent }: { htmlContent: string }) {
  // Sanitize the HTML content
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
