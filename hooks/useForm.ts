"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm as useReactHookForm,
  type DefaultValues,
  type FieldValues
} from "react-hook-form";
import type { ZodType } from "zod";

export function useForm<TFieldValues extends FieldValues>({
  schema,
  defaultValues
}: {
  schema: ZodType<TFieldValues>;
  defaultValues?: DefaultValues<TFieldValues>;
}) {
  return useReactHookForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues
  });
}
