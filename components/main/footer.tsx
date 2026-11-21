"use client";

import Image from "next/image";
import { FooterWordmark } from "@/components/sub/footer-wordmark";
import { FOOTER_DATA, OFFICE_DATA } from "@/constants";

export function Footer() {
  const contact = FOOTER_DATA[2].data[0];

  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-[#0c0906] text-[#f8efd9]">
      <div aria-hidden="true" className="footer-orb" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 xl:grid-cols-[1.15fr_2fr_1fr] md:items-start md:py-20 lg:px-12">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <Image src="/nottam-logo.jpeg" alt="" width={64} height={64} className="rounded-lg" />
            <strong className="tracking-wide">NOTTAM INFOTECH</strong>
          </div>
          <p className="my-6 max-w-md font-mono text-sm leading-6 text-[#cec2aa]">We build websites and business software, including BookYourTurf, our platform for turf bookings.</p>
          <a href={contact.link} className="break-words text-[clamp(1rem,1.4vw,1.25rem)] font-semibold leading-snug tracking-tight transition-colors hover:text-[#f3cf78]">{contact.name}</a>
        </div>
        <section aria-labelledby="offices-heading">
          <h2 id="offices-heading" className="mb-5 font-mono text-xs uppercase tracking-[.18em] text-[#d3b77a]">Offices</h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
            {OFFICE_DATA.map(({ name, address, link }) => (
              <address key={name} className="not-italic">
                <h3 className="mb-1 text-sm font-semibold text-[#e3c779]">{name}</h3>
                <a href={link} target="_blank" rel="noreferrer" className="text-sm leading-6 text-[#cec2aa] hover:underline">{address}</a>
              </address>
            ))}
          </div>
        </section>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-5 pb-2 md:col-span-2 xl:col-span-1">
          {FOOTER_DATA.slice(0, 2).map(({ title, data }) => (
            <div key={title}>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-[#d3b77a]">{title}</h2>
              {data.map(({ name, link }) => (
                <a key={link} href={link} className="mb-3 block text-sm hover:underline">{name}</a>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="footer-gold">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 pt-6 font-mono text-[10px] uppercase tracking-[.18em] sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} Nottam InfoTech</span>
          <span>All rights reserved</span>
        </div>
        <FooterWordmark />
        <div className="px-5 pb-6 pt-3 text-center">
          <a
            href="https://www.gatewaysoftwaresolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm text-xs leading-6 text-[#38260e] underline-offset-4 transition-colors hover:text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38260e]"
          >
            Powered by <span className="font-semibold">Gateway Software Solutions</span>
            <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
