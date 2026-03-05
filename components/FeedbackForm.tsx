'use client'

import { useState } from 'react'

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-indigo-500 p-4 text-white shadow-lg transition-all hover:bg-indigo-600 hover:scale-110"
        aria-label="Open feedback form"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl rounded-lg bg-slate-900 p-6 shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close feedback form"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Send Us Feedback</h2>
              <p className="mt-2 text-sm text-slate-300">
                We'd love to hear your thoughts about ProdVault. Your feedback helps us improve.
              </p>
            </div>

            {/* n8n Form Embed */}
            <div className="relative">
              <iframe
                src="https://saurabhumai-123.app.n8n.cloud/form/a9080614-55de-4a86-8aa1-7e478a9dbc04"
                className="h-96 w-full rounded-lg border border-white/10 bg-white"
                title="Feedback Form"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>

            {/* Form Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                Your feedback is securely handled through our trusted form provider.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
