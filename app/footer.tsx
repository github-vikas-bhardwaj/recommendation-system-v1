export function Footer() {
  return (
    <footer className="relative z-20 overflow-hidden bg-transparent">
      <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-between gap-2 px-6 py-4 text-sm text-zinc-600 sm:flex-row dark:text-zinc-400">
        <p>© {new Date().getFullYear()} Recommendation System</p>
        <p>Secure sign-in and account creation</p>
      </div>
    </footer>
  );
}
