'use client';
import { useState } from 'react';
import { submitInquiry } from '@/lib/api';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Submitting...');
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };
    
    const response = await submitInquiry(data);
    if (response) {
      setStatus('Your message has been sent successfully!');
      (event.target as HTMLFormElement).reset();
    } else {
      setStatus('An error occurred. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea name="message" id="message" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>
      <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-green-700">Send Message</button>
      {status && <p className="mt-4 text-center">{status}</p>}
    </form>
  );
}