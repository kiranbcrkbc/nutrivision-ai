import React from 'react';
import { Link } from 'react-router-dom';
export const AboutPage: React.FC = () => <article className="max-w-3xl mx-auto p-6 sm:py-16 space-y-6">
  <p className="text-sm font-semibold text-health-700">NUTRITION, MADE CLEARER</p>
  <h1 className="text-3xl sm:text-4xl font-bold">Understand your concerns. Take an informed next step.</h1>
  <p className="text-lg text-slate-600 dark:text-slate-300">Vitamin Deficiency helps you record photos and symptoms, explore food sources, and prepare for a conversation with a healthcare professional.</p>
  <h2 className="text-xl font-semibold">A useful record, all in one place</h2>
  <p>Check photo quality and body-area suitability, save your symptoms, review your history, and print a summary to discuss at an appointment. Explore everyday food ideas that match your dietary preferences.</p>
  <h2 className="text-xl font-semibold">Clear about its limits</h2>
  <p>This app does not diagnose vitamin deficiencies or measure vitamin levels. Photo checks can make mistakes. Persistent or concerning symptoms should be assessed by a qualified clinician, who can decide whether tests are needed.</p>
  <Link to="/assessment/new" className="inline-block bg-health-700 text-white px-6 py-3 rounded-xl">Create your first record</Link>
</article>;
