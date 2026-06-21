"use client";

import { useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChecklistStep {
  id: string;
  label: string;
  description: string;
  done: boolean;
}

interface OnboardingChecklistProps {
  steps: ChecklistStep[];
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const [collapsed, setCollapsed] = useState(false);
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;

  if (allDone) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-blue-900">
            Getting Started ({doneCount}/{steps.length})
          </CardTitle>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-blue-600 hover:text-blue-800"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {steps.map((step) => (
              <li key={step.id} className="flex items-start gap-3">
                {step.done ? (
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={`text-sm font-medium ${step.done ? "line-through text-blue-400" : "text-blue-900"}`}>
                    {step.label}
                  </div>
                  {!step.done && (
                    <div className="text-xs text-blue-600">{step.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
