const WordItemSkeleton = () => (
  <div className="mt-3 w-full min-w-min max-w-6xl animate-pulse rounded-[1.75rem] border border-[var(--paper-muted)] bg-[var(--paper-card)] px-3 py-2 sm:px-5 sm:py-2.5 lg:px-6 [background-image:linear-gradient(135deg,var(--paper-card),var(--paper))]">
    <div className="flex h-8 min-w-max items-center gap-3 sm:h-10">
      <div className="h-5 w-24 rounded-full bg-[var(--paper-muted)]" />
      <div className="ml-auto h-8 w-20 rounded-full bg-[var(--paper-muted)]" />
    </div>
  </div>
);
export default WordItemSkeleton;
