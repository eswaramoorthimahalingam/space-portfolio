const bookingSteps = [
  { title: "Find your pitch", description: "Browse turfs by location and compare venues." },
  { title: "Pick your time", description: "Check available slots and choose when to play." },
  { title: "Book your game", description: "Complete your booking and payment online." },
];

export const Projects = () => (
  <section id="projects" aria-labelledby="product-heading" className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
    <div className="overflow-hidden rounded-[24px] border border-[#b28d45]/30 bg-[#15120c] text-white">
      <div className="grid gap-12 p-7 sm:p-12 lg:p-16">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[.2em] text-[#c8b994]">Our product / Built by Nottam InfoTech</p>
          <p className="mb-7 text-xl font-semibold text-[#e5bc60]">BookYourTurf</p>
          <h2 id="product-heading" className="max-w-[24ch] text-balance text-[clamp(2.7rem,5vw,4.7rem)] font-semibold leading-[1.02] tracking-tight">Own the pitch.<br />Book it in seconds.</h2>
          <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-[#ded5c1]">Find a turf, check available slots, and book your next game. One platform for players and turf owners.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="https://bookyourturf.net/" target="_blank" rel="noreferrer noopener" className="rounded-xl bg-[#e5bc60] px-6 py-4 font-semibold text-[#21180b] transition-colors hover:bg-[#f3d58c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Find a turf near you ↗</a>
            <a href="#booking-flow" className="rounded-xl border border-white/30 px-6 py-4 font-semibold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">See how it works ↓</a>
          </div>
        </div>
      </div>
      <div id="booking-flow" className="border-t border-white/15 bg-black/15 p-7 sm:p-12 lg:px-16">
        <h3 className="mb-7 text-xl font-semibold">From finding a turf to playing the game.</h3>
        <ol className="grid gap-7 md:grid-cols-3">
          {bookingSteps.map((step, index) => (
            <li key={step.title}>
              <span className="font-mono text-sm text-[#e5bc60]">0{index + 1}</span>
              <h4 className="mt-3 font-semibold">{step.title}</h4>
              <p className="mt-2 text-sm leading-6 text-[#c8b994]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
