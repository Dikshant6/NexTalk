export default function AuthLayout({ children }) {
  return (
    <main className="flex-1 bg-[#F5F2EA] text-[#22231F]">
      <section className="mx-auto grid min-h-[75vh] w-full max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 md:grid-cols-2 md:gap-20 lg:px-16">
        <div className="max-w-xl">
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Conversations
            <br />
            that feel
            <br />
            <span className="font-serif font-normal italic">closer.</span>
          </h1>

          <p className="mt-7 max-w-sm text-base leading-7 text-[#68685F]">
            A quieter place for the conversations that matter. Connect, share,
            and pick up right where you left off.
          </p>
        </div>

        {children}
      </section>
    </main>
  );
}
