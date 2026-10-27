
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-[#F5F2EA] text-[#22231F]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10 sm:py-6 lg:px-16"
      >
        <Link
          to="/"
          aria-label="NexTalk home"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <img src="/favicon.svg" alt="NexTalk" className="h-8 w-auto" />
        </Link>

        <div className="flex shrink-0 items-center gap-5 sm:gap-8 md:gap-10">
          <Link
            to="/"
            className="text-sm font-medium text-[#22231F] transition-colors hover:text-[#777A62]"
          >
            About
          </Link>

          <Link
            to="/register"
            className="text-sm font-medium text-[#22231F] transition-colors hover:text-[#777A62]"
          >
            Sign Up
          </Link>

          <Link
            to="/login"
            className="text-sm font-medium text-[#22231F] transition-colors hover:text-[#777A62]"
          >
            Log In
          </Link>
        </div>
      </nav>
    </header>
  );
}
