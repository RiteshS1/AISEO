'use client';

import React, { useState } from 'react';

const CALCOM_URL = 'https://cal.com/ritesh-sharma-hfn1t8/15min';
const whatsappNumber = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '';

const whatsappUrl = whatsappNumber
  ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`
  : null;
const mailtoUrl = contactEmail ? `mailto:${contactEmail}` : null;

const GLASS_BUTTON =
  'flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 transition-colors duration-300 ease-in-out hover:border-lime-400 hover:text-lime-400';
const TOOLTIP_CLASSES =
  'absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out whitespace-nowrap pointer-events-none border border-slate-700';

export default function FloatingContactWidget() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const expanded = open || hovered;

  const actions = [
    mailtoUrl && {
      href: mailtoUrl,
      tooltip: 'Write to Us',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: CALCOM_URL,
      tooltip: 'Schedule a call',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    whatsappUrl && {
      href: whatsappUrl,
      tooltip: 'Contact us right now',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
    },
  ].filter(Boolean) as Array<{ href: string; tooltip: string; icon: React.ReactNode }>;

  return (
    <div
      className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-3 py-1 pr-1 md:bottom-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vertical stack: actions slide up above FAB (visible on hover or click) */}
      <div
        className={`flex flex-col items-end gap-3 transition-[opacity,transform] duration-300 ease-in-out ${
          expanded ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {actions.map((action) => (
          <div key={action.tooltip} className="group relative">
            <span className={TOOLTIP_CLASSES}>{action.tooltip}</span>
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={GLASS_BUTTON}
              aria-label={action.tooltip}
            >
              {action.icon}
            </a>
          </div>
        ))}
      </div>

      {/* Main FAB – no focus ring, smooth glow and rotation */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-black border-2 border-lime-400/50 hover:bg-lime-300 focus:outline-none shadow-[0_0_15px_rgba(163,230,53,0.3),_0_0_30px_rgba(163,230,53,0.1)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5),_0_0_45px_rgba(163,230,53,0.2)] transition-[transform,box-shadow,background-color] duration-300 ease-in-out"
        style={{ transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)' }}
        aria-label={expanded ? 'Close contact options' : 'Contact options'}
        aria-expanded={expanded}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
}
