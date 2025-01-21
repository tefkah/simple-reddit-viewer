import { useState } from 'react';
import { useNavigate } from 'react-router';

const cleanAndNavigate = (url: string, navigate: (path: string) => void) => {
  const path = url.replace(/^\/|\/$/g, '');
  if (path.startsWith('r/')) {
    navigate(`/${path}`);
  }
};

export default function Home() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse the URL to extract the path
      const urlObj = new URL(url);
      cleanAndNavigate(urlObj.pathname, navigate);
      // Get everything after the domain, removing any trailing slashes
    } catch (error) {
      // If URL parsing fails, try treating the input as a direct path
      const pathWithHttps = `https://${url}`;
      if (URL.canParse(pathWithHttps)) {
        cleanAndNavigate(pathWithHttps, navigate);
        return;
      }

      cleanAndNavigate(url, navigate);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Reddit Viewer
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Reddit URL or path (e.g., https://reddit.com/r/typescript/comments/... or r/typescript/...)"
            className="flex-1 p-4 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-blue-500 text-white rounded-lg
                     hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Examples:
        <ul className="mt-2 space-y-1">
          <li>https://reddit.com/r/typescript/comments/abc123/post_title</li>
          <li>r/typescript/comments/abc123/post_title</li>
          <li>r/typescript</li>
        </ul>
      </div>
    </div>
  );
}
