import type { SeriesMetadata } from '../utils/series';

export const series: Record<string, SeriesMetadata> = {
  "ai-musings": {
    title: "AI musings",
    description: "Trying to figure out what I think about AI, and the implications of it for society, technology, and software development.",
  },
  "ai-field-reports": {
    title: "AI Field Reports",
    description: "I share my experiences with AI tools, how I use them, what works and what doesn't, for me.",
  },
  "deleuze-for-developers": {
    title: "Deleuze for Developers",
    description:
      "If you truly want to understand technology today, then you should at least be familiar with the philosophy of Gilles Deleuze. Unfortunately for technologists, Deleuze is rooted firmly in a philosophical tradition and a writing style that they probably find opaque. In this blog series, I plan on explaining Deleuze's philosophy in terms that programmers can understand.",
  },
  "buck-rust": {
    title: "Using Buck to Build Rust Projects",
    description: "A guide to using Buck2, Meta's open-source build system, for building Rust projects. Covers the basics, integrating with crates.io, and keeping up with updates.",
  },
};