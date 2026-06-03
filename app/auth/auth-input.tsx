"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import type { AuthInputType } from "./types";

const inputClass =
  "rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-violet-400";

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export type AuthInputProps = BaseInputProps & {
  id: string;
  name: string;
  label: string;
  type: AuthInputType;
  trailingLabelSlot?: ReactNode;
};

export function AuthInput({
  id,
  name,
  label,
  type,
  trailingLabelSlot,
  ...props
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
        {trailingLabelSlot}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        className={inputClass}
        {...props}
      />
    </div>
  );
}
