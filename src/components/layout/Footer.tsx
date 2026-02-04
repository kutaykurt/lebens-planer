'use client';

import Link from 'next/link';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative mt-20 pb-32 md:pb-10 border-t border-white/5 bg-zinc-950 overflow-hidden">
            {/* Decorative background gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <Heart className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">
                                Lebens<span className="text-[var(--accent-primary)]">Planer</span>
                            </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                            Dein persönliches Betriebssystem für ein strukturiertes, produktives und glückliches Leben.
                            Fokussiere dich auf das Wesentliche und erreiche deine Ziele.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="https://github.com" icon={Github} label="GitHub" />
                            <SocialLink href="https://twitter.com" icon={Twitter} label="Twitter" />
                            <SocialLink href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Navigation</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><Link href="/today" className="hover:text-[var(--accent-primary)] transition-colors">Tagesplan</Link></li>
                            <li><Link href="/goals" className="hover:text-[var(--accent-primary)] transition-colors">Ziele</Link></li>
                            <li><Link href="/finance" className="hover:text-[var(--accent-primary)] transition-colors">Finanzen</Link></li>
                            <li><Link href="/notebook" className="hover:text-[var(--accent-primary)] transition-colors">Notizen</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Rechtliches</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><Link href="/settings" className="hover:text-[var(--accent-primary)] transition-colors">Einstellungen</Link></li>
                            <li><span className="opacity-50 cursor-not-allowed">Datenschutz</span></li>
                            <li><span className="opacity-50 cursor-not-allowed">Impressum</span></li>
                            <li><span className="opacity-50 cursor-not-allowed">Nutzungsbedingungen</span></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                    <p className="text-xs text-zinc-500">
                        &copy; {new Date().getFullYear()} Lebensplaner. Alle Rechte vorbehalten.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse" />
                        <span>by Kutay Kurt</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-[var(--accent-primary)] hover:text-white hover:border-[var(--accent-primary)] transition-all duration-300 group"
            aria-label={label}
        >
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
    );
}
