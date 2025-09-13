"use client"

import React from 'react';

export function VideoWithQuote() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
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
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      {/* Quote Text */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <h2 className="text-white text-3xl md:text-5xl font-semibold leading-tight text-balance">
          Welcome to the home of Hemant Aqua Solutions.
        </h2>
        <p className="text-white text-lg md:text-xl mt-6 leading-relaxed">
          Your Partner in Irrigation Solutions, Sustainable Water and Energy Management
        </p>
      </div>
    </section>
  );
}
