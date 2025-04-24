'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Response shape for changelog API
interface ChangeLogResponse {
  entries?: string[];
  error?: string;
}

export default function About() {
  // Vibe-Coding Days Counter (update manually)
  const vibeCodingDays = 2;

  // Todo list state
  const [tasks] = useState<{ id: number; label: string; done: boolean }[]>([
    { id: 1, label: 'First interface draft', done: true },
    { id: 2, label: 'Auth server', done: true },
    { id: 3, label: 'AutoRAG with Cloudflare documentation', done: true },
    { id: 4, label: 'Studio protected by auth', done: true },
    { id: 5, label: 'List of projects', done: false },
    { id: 6, label: 'Agent chat replies something', done: true },
    { id: 7, label: 'Markdown -> HTML for chat', done: true },
    { id: 8, label: 'Persist agent chats', done: false },
    { id: 9, label: 'Create files', done: false }
  ]);

  // Changelog entries
  const [changelogEntries, setChangelogEntries] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/changelog');
        const data = (await res.json()) as ChangeLogResponse;
        setChangelogEntries(data.entries || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Studio
      </Link>
      
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2 space-y-6 text-gray-300">
            <h1 className="text-4xl font-bold mb-6">About Cloudflare Studio</h1>
            
            <p>
              Cloudflare Studio is an unofficial, experimental project designed to provide a user-friendly interface for building and deploying applications to Cloudflare&apos;s platform.
            </p>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Important Notice</h2>
              <p>
                This project is not affiliated with, endorsed by, or connected to Cloudflare in any official capacity. It is an independent initiative created to explore and experiment with Cloudflare&apos;s services.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Purpose</h2>
              <p>
                The goal of this project is to provide developers with an intuitive interface for:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Building web applications and websites</li>
                <li>Managing Cloudflare Workers and Pages</li>
                <li>Integrating with Cloudflare&apos;s services (KV, R2, D1, etc.)</li>
                <li>Deploying applications to Cloudflare&apos;s network</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Rationale</h2>
              <p>
                I&apos;m tired of Replit, Cursor, and other AI IDEs not knowing capabilities of Cloudflare. When I&apos;m building a project, I want AI agent to suggest to put files into R2, serve images and videos via Stream, use D1 as database and build workers upon workers upon workers to solve a problem.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Experimental Status</h2>
              <p>
                As an experimental project, features may be incomplete, change without notice, or contain bugs. Data may be lost without warning. Users should exercise caution and not rely on this tool for production environments without thorough testing.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Feedback and Contributions</h2>
              <p>
                While this is an experimental project, feedback and contributions from the community are welcome. Please ensure you understand the unofficial nature of this project before using it or contributing.
              </p>
              <p>
                  <a href="https://github.com/rapidsd/cf-studio" className="text-blue-500 hover:text-blue-400">Github</a><br/>
                  <a href="https://x.com/devaurus" className="text-blue-500 hover:text-blue-400">X/Twitter</a>
              </p>
            </div>
          </div>

          <div className="md:w-1/2 bg-gray-800 rounded-lg p-6 space-y-8">
            {/* Vibe-Coding Days Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">Vibe-Coding Days</h2>
              <p className="text-5xl font-bold">{vibeCodingDays}</p>
            </div>

            {/* Todo List Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">Todo List</h2>
              <ul className="list-disc list-inside space-y-2">
                {tasks.map(task => (
                  <li key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.done}
                      disabled
                      className="mr-2 opacity-75 cursor-not-allowed"
                    />
                    <span className={task.done ? 'text-gray-500' : ''}>
                      {task.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Changelog Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">Changelog</h2>
              <ul className="list-inside space-y-1">
                {changelogEntries.map((entry, idx) => (
                  <li key={idx} className="text-gray-300">
                    <span className="font-mono text-sm">{entry}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 