'use client'

import { useState } from 'react'

export default function FeedbackForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://saurabhumai-123.app.n8n.cloud/webhook/feedback-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', feedback: '' })
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

            {/* Custom Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitStatus === 'success' && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-center">
                  <p className="text-green-300">Thank you for your feedback! We've received your message.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-center">
                  <p className="text-red-300">Something went wrong. Please try again later.</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-slate-300 mb-2">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 resize-none"
                  placeholder="Share your thoughts, suggestions, or report issues..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>

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
