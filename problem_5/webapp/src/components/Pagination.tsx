export default function Pagination({
  page,
  goPrev,
  goNext,
  setPage,
  totalPages,
}: {
  page: number;
  goPrev: () => void;
  goNext: () => void;
  setPage: (p: number) => void;
  totalPages: number;
}) {
  return (
    <div className="flex items-center justify-center mt-6 gap-3 p-4">
      <button
        onClick={goPrev}
        disabled={page === 1}
        className="px-3 py-1 rounded-full text-sm border bg-white dark:bg-[#0b0b0b] border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
      >
        Prev
      </button>

      {/* pages */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`px-3 py-1 rounded-full text-sm border ${
            p === page
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
              : 'bg-white dark:bg-[#0b0b0b] text-zinc-700 dark:text-zinc-300'
          } border-zinc-200 dark:border-zinc-700`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={goNext}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-full text-sm border bg-white dark:bg-[#0b0b0b] border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
