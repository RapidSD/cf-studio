'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Studio
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Cloudflare Studio</h1>
        
        <div className="space-y-6 text-gray-300">
          <p>
            Cloudflare Studio is an unofficial, experimental project designed to provide a user-friendly interface for building and deploying applications to Cloudflare's platform.
          </p>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Important Notice</h2>
            <p>
              This project is not affiliated with, endorsed by, or connected to Cloudflare in any official capacity. It is an independent initiative created to explore and experiment with Cloudflare's services.
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
              <li>Integrating with Cloudflare's services (KV, R2, D1, etc.)</li>
              <li>Deploying applications to Cloudflare's network</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Rationale</h2>
            <p>
              I'm tired of Replit, Cursor, and other AI IDEs not knowing capabilities of Cloudflare. When I'm building a project, I want AI agent to suggest to put files into R2, serve images and videos via Stream, use D1 as database and build workers upon workers upon workers to solve a problem.
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
      </div>
    </div>
  );
} 