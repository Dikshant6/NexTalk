export default function BrandIntro({ eyebrow, description }) {
  return (
    <div className="max-w-xl">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-hover">
          {eyebrow}
        </p>
      )}

      <h1
        className={`${eyebrow ? "mt-6" : ""} text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-7xl`}
      >
        Conversations
        <br />
        that feel{" "}
        <span className="font-serif font-normal italic text-primary-hover">
          closer.
        </span>
      </h1>

      <p className="mt-7 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
        {description}
      </p>
    </div>
  );
}
