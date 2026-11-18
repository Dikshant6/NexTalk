import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full bg-app text-text-main">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-4 border-t border-app-border py-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            aria-label="NexTalk home"
            className="text-sm font-semibold tracking-tight text-text-main transition-opacity hover:opacity-80"
          >
            NexTalk<span className="text-primary-hover">.</span>
          </Link>

          <nav
            aria-label="Footer navigation"
            className="flex items-center gap-6 text-sm sm:gap-8"
          >
            <Link
              to="/login"
              className="font-medium transition-colors hover:text-primary-hover"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="font-medium transition-colors hover:text-primary-hover"
            >
              Sign Up
            </Link>

            <a
              href="https://github.com/Dikshant6/NexTalk"
              target="_blank"
              rel="noreferrer"
              className="font-medium transition-colors hover:text-primary-hover"
            >
              GitHub ↗
            </a>
          </nav>

          <p className="text-xs text-text-muted">© {currentYear} NexTalk</p>
        </div>
      </div>
    </footer>
  );
}
