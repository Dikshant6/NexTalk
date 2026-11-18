import BrandIntro from "../BrandIntro";

export default function AuthLayout({ children }) {
  return (
    <main className="flex-1 bg-app text-text-main">
      <section className="mx-auto grid min-h-[75vh] w-full max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 md:grid-cols-2 md:gap-20 lg:px-16">
        <div className="self-stretch pt-20">
          <BrandIntro description="A quieter place for the conversations that matter. Connect, share, and pick up right where you left off." />
        </div>

        {children}
      </section>
    </main>
  );
}
