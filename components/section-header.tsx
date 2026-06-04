import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  copy,
  action
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-rule pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-clay">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-balance text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink sm:text-6xl">
          {title}
        </h2>
        {copy ? (
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-muted">
            {copy}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
