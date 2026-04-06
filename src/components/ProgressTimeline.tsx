'use client';

import React from 'react';

interface ProgressStep {
  label: string;
  completed: boolean;
  description?: string;
}

interface ProgressTimelineProps {
  steps: ProgressStep[];
  currentStep?: number;
}

export function ProgressTimeline({ steps, currentStep = 0 }: ProgressTimelineProps) {
  return (
    <div className="space-y-6">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`timeline-item ${step.completed ? 'completed' : ''} ${
            idx === currentStep ? 'animate-pulse-glow' : ''
          }`}
        >
          <div className="timeline-dot" />
          <div className="timeline-content">
            <h4 className="font-bold text-[var(--accent-light)]">
              {idx < currentStep ? '✓' : idx === currentStep ? '→' : '○'} {step.label}
            </h4>
            {step.description && (
              <p className="text-sm text-[var(--foreground)]/70 mt-1">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
