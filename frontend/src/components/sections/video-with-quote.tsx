"use client"

import React from 'react';

export function VideoWithQuote() {
  return (
    <section className="relative h-96 flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        src="/home_page_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      {/* Quote Text */}
      <div className="relative z-20 text-center px-4">
        <h2 className="text-white text-3xl md:text-4xl font-semibold leading-tight text-balance">
          &ldquo;Excellence in every detail. Service that exceeds expectations.&rdquo;
        </h2>
      </div>
    </section>
  );
}
