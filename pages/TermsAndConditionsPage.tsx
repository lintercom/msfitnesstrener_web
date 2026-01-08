
import React from 'react';
import { PageHero, BlueprintGrid } from '../components/PageDecorations';
import SEO from '../components/SEO';

const TermsAndConditionsPage: React.FC = () => {
    return (
        <div className="bg-background min-h-screen">
            <SEO
                title="Obchodní podmínky"
                description="Všeobecné obchodní podmínky poskytování fitness služeb."
            />
            <PageHero
                titlePart1="Obchodní"
                titlePart2Accent="podmínky"
                description=""
                subTitle="Všeobecná ustanovení a pravidla spolupráce"
            />

            <div className="bg-surface pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
                <BlueprintGrid className="opacity-[0.03] grayscale invert" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto bg-surface-light rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-premium">
                        <div className="prose prose-slate max-w-none space-y-10">

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">1. Úvodní ustanovení</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Tyto obchodní podmínky upravují smluvní vztah mezi poskytovatelem služeb a klientem vznikající na základě objednávky služeb prostřednictvím webových stránek, rezervačního systému nebo jiné formy komunikace.
                                </p>
                                <p className="text-surface-dark/75 leading-relaxed text-lg font-bold italic">
                                    Odesláním objednávky nebo provedením rezervace klient potvrzuje, že se s těmito obchodními podmínkami seznámil a souhlasí s nimi.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">2. Poskytovatel služeb</h2>
                                <div className="p-6 bg-surface-light border border-surface-dark/5 rounded-2xl space-y-2">
                                    <p className="font-bold text-surface-dark text-xl">Martin Šťastný</p>
                                    <p className="text-surface-dark/70">Vizovice</p>
                                    <p className="text-surface-dark/70">E-mail: <span className="ms-gradient-text font-bold">info@martinstastny.cz</span></p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">3. Poskytované služby</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Poskytovatel nabízí zejména tyto služby:
                                </p>
                                <ul className="list-disc list-inside text-surface-dark/70 space-y-2 ml-4 text-lg md:text-xl font-medium">
                                    <li>Osobní tréninky</li>
                                    <li>Individuální tréninkové plány</li>
                                    <li>Konzultace v oblasti fitness a zdravého životního stylu</li>
                                </ul>
                                <p className="text-surface-dark/75 leading-relaxed text-lg pt-2">
                                    Konkrétní rozsah, forma a termín služby jsou vždy dohodnuty individuálně mezi poskytovatelem a klientem.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">4. Objednávka a smlouva</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Smluvní vztah vzniká potvrzením objednávky nebo rezervace ze strany poskytovatele. Objednávku lze provést přes formulář na webu, rezervační systém, e-mailem nebo telefonicky.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">5. Rezervace termínů (Reenio)</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Rezervace termínů probíhá prostřednictvím systému <strong className="text-surface-dark">Reenio</strong>. Klient bere na vědomí, že:
                                </p>
                                <ul className="list-disc list-inside text-surface-dark/70 space-y-2 ml-4 text-lg md:text-xl font-medium">
                                    <li>Rezervace, změny a rušení probíhají primárně v tomto systému.</li>
                                    <li>Potvrzení rezervace je odesíláno automaticky.</li>
                                    <li>Poskytovatel neodpovídá za technické výpadky rezervačního systému.</li>
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">6. Cena a platba</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Cena je uvedena na webu nebo stanovena dohodou. Platba probíhá hotově, bankovním převodem nebo jiným dohodnutým způsobem. Poskytovatel není plátcem DPH (pokud není uvedeno jinak).
                                </p>
                            </section>

                            <section className="space-y-4 border-2 border-neon-orange/10 p-8 rounded-[2rem] bg-orange-50/10">
                                <h2 className="text-3xl font-black text-neon-orange uppercase tracking-tighter">7. Storno podmínky</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <p className="text-surface-dark/70 font-bold text-lg md:text-xl">Zrušení více než 24 hodin předem – BEZ POPLATKU</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                        <p className="text-surface-dark/70 font-bold text-lg md:text-xl">Zrušení méně než 24 hodin předem – STORNO POPLATEK 100% CENY</p>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">8. Práva a povinnosti klienta</h2>
                                <p className="text-surface-dark/75 leading-relaxed text-lg">
                                    Klient se zavazuje uvádět pravdivé informace o svém zdravotním stavu a dodržovat pokyny poskytovatele. Sportovní aktivity jsou spojeny s rizikem a klient se jich účastní na vlastní odpovědnost.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">10. Reklamační řád</h2>
                                <p className="text-surface-dark/75 leading-relaxed text-lg">
                                    Reklamaci lze uplatnit písemně na e-mailovou adresu. Vzhledem k povaze služeb nelze reklamovat subjektivní pocity nespokojenosti nebo nedosažení výsledků, pokud byla služba poskytnuta řádně.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">11. Odstoupení od smlouvy</h2>
                                <p className="text-surface-dark/75 leading-relaxed text-lg">
                                    Klient má právo odstoupit od smlouvy uzavřené na dálku do 14 dnů, pokud dosud nezačalo plnění služby. Souhlasem se zahájením poskytování služby toto právo zaniká.
                                </p>
                            </section>

                            <div className="pt-12 border-t border-surface-dark/5">
                                <p className="text-surface-dark/40 text-sm font-bold uppercase tracking-widest italic">
                                    Platné a účinné od 8. ledna 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
