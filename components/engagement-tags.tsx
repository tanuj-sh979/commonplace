import { getReadingSignal } from "@/lib/signals";
import type { Article } from "@/lib/types";

export function EngagementTags({ article }: { article: Article }) {
  const signal = getReadingSignal(article);

  return (
    <div className="flex flex-wrap gap-1.5">
      <SignalTag label={signal.primaryBadge} title={signal.reasonLabel} />
      <SignalTag label={signal.metricLine} title={signal.reasonLabel} />
    </div>
  );
}

function SignalTag({
  label,
  title
}: {
  label: string;
  title: string;
}) {
  const className =
    "rounded-full border border-rule bg-paper px-2.5 py-1 text-[11px] font-semibold leading-none text-muted transition hover:border-clay/50 hover:bg-clay-soft/40 hover:text-clay";
  return (
    <span className={className} title={title}>
      {label}
    </span>
  );
}
