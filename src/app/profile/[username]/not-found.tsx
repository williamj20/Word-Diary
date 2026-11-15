import Link from 'next/link';

const UserNotFound = () => {
  return (
    <main className="mx-auto w-full max-w-3xl rounded-[2rem] border border-[var(--paper-muted)] bg-[var(--paper-card)] px-5 py-8 text-center sm:px-8 sm:py-10">
      <h2 className="text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
        User not found
      </h2>
      <Link href="/" className="action-button action-button-primary mt-5">
        Back to home
      </Link>
    </main>
  );
};

export default UserNotFound;
