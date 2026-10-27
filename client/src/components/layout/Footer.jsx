import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F2EA] text-[#22231F]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-4 border-t border-[#DCD7CC] py-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            aria-label="NexTalk home"
            className="text-sm font-semibold tracking-tight text-[#22231F] transition-opacity hover:opacity-80"
          >
            NexTalk<span className="text-[#777A62]">.</span>
          </Link>

          <nav aria-label="Footer navigation" className="flex items-center gap-6 text-sm text-[#22231F]">
            <Link to="/login" className="transition-colors hover:text-[#777A62]">
              Log In
            </Link>
            <Link to="/register" className="transition-colors hover:text-[#777A62]">
              Sign Up
            </Link>
            <a
              href="https://github.com/Dikshant6/NexTalk"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#777A62]"
            >
              GitHub ↗
            </a>
          </nav>

          <p className="text-xs text-[#89877D]">
            © {currentYear} NexTalk
          </p>
        </div>
      </div>
    </footer>
  );
}
