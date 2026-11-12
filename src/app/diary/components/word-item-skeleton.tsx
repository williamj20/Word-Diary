const WordItemSkeleton = () => (
  <div className="mt-3 w-full max-w-6xl animate-pulse overflow-hidden rounded-[1.75rem] border border-[var(--brass)] bg-[var(--paper-card)] px-3.5 py-2 sm:px-5 sm:py-2.5">
    <div className="flex h-10 min-w-max items-center gap-3">
      <div className="h-5 w-24 rounded-full bg-[var(--paper-muted)]" />
      <div className="ml-auto h-8 w-20 rounded-full bg-[var(--paper-muted)]" />
    </div>
  </div>
);
export default WordItemSkeleton;
