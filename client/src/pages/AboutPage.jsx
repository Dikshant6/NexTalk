import { Link } from "react-router-dom";

const technologies = [
  "React",
  "Tailwind CSS",
  "shadcn/ui",
  "Node.js",
  "Express",
  "MongoDB",
];

export default function AboutPage() {
  return (
    <main className="flex-1 bg-[#F5F2EA] text-[#22231F]">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 sm:px-10 sm:pt-28 lg:px-16 lg:pb-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#777A62]">
          A space for meaningful conversations
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-7xl">
          Conversations
          <br />
          that feel{" "}
          <span className="font-serif font-normal italic">closer.</span>
        </h1>

        <p className="mt-7 max-w-xl text-base leading-7 text-[#68685F] sm:text-lg">
          NexTalk is a messaging application built to make connecting with
          people feel simple, thoughtful, and personal.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[#777A62] underline-offset-4 hover:text-[#777A62]"
        >
          Get started <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="border-t border-[#DCD7CC]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:px-10 md:grid-cols-2 lg:px-16 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777A62]">
              The project
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Built with intention.
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-[#68685F] sm:text-base">
            NexTalk is being developed as a full-stack project, with a focus on
            clear architecture, secure authentication, maintainable code, and a
            considered user experience.
          </p>
        </div>
      </section>

      <section className="border-t border-[#DCD7CC]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777A62]">
            The technology
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Thoughtfully engineered.
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-[#DCD7CC] px-4 py-2 text-sm text-[#45463F]"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#DCD7CC]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-14 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777A62]">
              Open source
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Explore how it works.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#68685F]">
              Explore the source code, learn from the implementation, and follow
              the project's development.
            </p>
          </div>

          <a
            href="https://github.com/Dikshant6/NexTalk"
            target="_blank"
            rel="noreferrer"
            className="w-fit text-sm font-semibold underline decoration-[#777A62] underline-offset-4 hover:text-[#777A62]"
          >
            View source code ↗
          </a>
        </div>
      </section>
    </main>
  );
}
