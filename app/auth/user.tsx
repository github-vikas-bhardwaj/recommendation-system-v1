type UserProps = {
  name: string;
};

export default function User({ name }: UserProps) {
  return (
    <button
      type="submit"
      className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none transition-colors hover:bg-zinc-100 focus-visible:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
    >
      <span
        title={name}
        aria-label={name}
        className="peer flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-sm shadow-violet-600/20 ring-1 ring-white/20 dark:ring-white/10"
      >
        <UserIcon />
      </span>

      <span className="grid">
        <span className="col-start-1 row-start-1 truncate transition-opacity peer-hover:opacity-0 peer-focus-visible:opacity-0">
          Log Out
        </span>
        <span className="col-start-1 row-start-1 truncate text-rose-600 opacity-0 transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 dark:text-rose-400">
          Log out
        </span>
      </span>
    </button>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.25c1.6-3 4.1-4.5 6.5-4.5s4.9 1.5 6.5 4.5" />
    </svg>
  );
}
