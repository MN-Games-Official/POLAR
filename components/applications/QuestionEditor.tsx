"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Question } from "@/types";

const defaultQuestion = (): Question => ({
  id: `q_${Date.now()}`,
  type: "multiple_choice",
  text: "",
  options: ["", "", "", ""],
  correct_answer: 0,
  max_score: 10
});

export function QuestionEditor({
  open,
  initialQuestion,
  onClose,
  onSave
}: {
  open: boolean;
  initialQuestion?: Question | null;
  onClose: () => void;
  onSave: (question: Question) => void;
}) {
  const [question, setQuestion] = useState<Question>(initialQuestion ?? defaultQuestion());

  useEffect(() => {
    setQuestion(initialQuestion ?? defaultQuestion());
  }, [initialQuestion, open]);

  const updateOption = (index: number, value: string) => {
    const next = [...(question.options ?? ["", "", "", ""])];
    next[index] = value;
    setQuestion({ ...question, options: next });
  };

  return (
    <Modal
      open={open}
      title={initialQuestion ? "Edit question" : "Add question"}
      description="Configure grading, answer shape, and scoring."
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-[1fr_160px_140px]">
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Prompt</label>
            <Input
              value={question.text}
              onChange={(event) => setQuestion({ ...question, text: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Type</label>
            <Select
              value={question.type}
              onChange={(event) =>
                setQuestion({
                  ...question,
                  type: event.target.value as Question["type"],
                  options:
                    event.target.value === "multiple_choice"
                      ? question.options ?? ["", "", "", ""]
                      : undefined,
                  correct_answer:
                    event.target.value === "true_false"
                      ? true
                      : event.target.value === "multiple_choice"
                        ? 0
                        : ""
                })
              }
            >
              <option value="multiple_choice">Multiple choice</option>
              <option value="short_answer">Short answer</option>
              <option value="true_false">True / false</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Max score</label>
            <Input
              type="number"
              value={question.max_score}
              onChange={(event) =>
                setQuestion({ ...question, max_score: Number(event.target.value) || 0 })
              }
            />
          </div>
        </div>

        {question.type === "multiple_choice" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {(question.options ?? ["", "", "", ""]).map((option, index) => (
                <div key={`${question.id}-${index}`} className="space-y-2">
                  <label className="text-sm text-slate-200">Option {index + 1}</label>
                  <Input value={option} onChange={(event) => updateOption(index, event.target.value)} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Correct option</label>
              <Select
                value={String(question.correct_answer ?? 0)}
                onChange={(event) =>
                  setQuestion({ ...question, correct_answer: Number(event.target.value) })
                }
              >
                {(question.options ?? []).map((_, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ) : null}

        {question.type === "true_false" ? (
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Correct answer</label>
            <Select
              value={String(question.correct_answer ?? true)}
              onChange={(event) =>
                setQuestion({ ...question, correct_answer: event.target.value === "true" })
              }
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </Select>
          </div>
        ) : null}

        {question.type === "short_answer" ? (
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Grading criteria</label>
            <Textarea
              value={question.grading_criteria ?? ""}
              onChange={(event) =>
                setQuestion({ ...question, grading_criteria: event.target.value })
              }
            />
          </div>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave(question);
              onClose();
            }}
          >
            Save question
          </Button>
        </div>
      </div>
    </Modal>
  );
}
