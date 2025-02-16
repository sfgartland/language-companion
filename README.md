# Language Companion

A small desktop app that uses generative AI to help in the process of learning a new language.

The app is designed to be used as a desktop application, the latest release can be found [here](https://github.com/sfgartland/language-companion/releases/latest). To try it out, check out the [online demo](https://language-companion-sigma.vercel.app/).

Generative AI might not (yet) be the greatest at providing detailed and accurate domain specific information in natural language. But where it shines is in it's understanding the natural language with which we interact with it. This app leverages this fact, and provides a handy interface to let AI correct your writing, explain grammatical structures and vocabulary, and more.

## Features
- [x] **Text Correction**: The app can correct grammatical errors and suggest improvements in your writing.
- [x] **Explanation**: The app can explain grammatical structures and vocabulary. It excels at explaining nuances in meaning between words and structures that traditional resources cannot.
- [ ] **Practice**: The app can generate exercises to help you practice and reinforce what you've learned.

## Tech Stack
- **UI**: 
  - React
  - Tailwind CSS
  - Framer Motion - for animations
  - Remark - For Markdown rendering of gen AI output
- **State Management**: Zustand
- **AI**: Vercel AI SDK to interface with OpenAI API
- **Application Framwork**: Tauri - enables multi-platform support and auto-updating from Github releases