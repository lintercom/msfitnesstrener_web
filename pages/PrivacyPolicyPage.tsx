
import React from 'react';
import { PageHero, BlueprintGrid } from '../components/PageDecorations';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="bg-background min-h-screen">
            <SEO
                title="Ochrana soukromí"
                description="Informace o zpracování osobních údajů a zásady ochrany soukromí."
            />
            <PageHero
                titlePart1="Ochrana"
                titlePart2Accent="soukromí"
                description=""
                subTitle="Zásady zpracování osobních údajů"
            />

            <div className="bg-surface pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
                <BlueprintGrid className="opacity-[0.03] grayscale invert" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto bg-surface-light rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-premium">
                        <div className="prose prose-slate max-w-none space-y-10">
                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">1. Úvodní ustanovení</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Vaše soukromí je pro mě důležité. Tyto zásady ochrany osobních údajů vysvětlují, jakým způsobem zpracovávám osobní údaje v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR).
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">2. Správce osobních údajů</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Správcem osobních údajů je:
                                </p>
                                <div className="p-6 bg-surface-light border border-surface-dark/5 rounded-2xl space-y-2">
                                    <p className="font-bold text-surface-dark text-xl">Martin Šťastný</p>
                                    <p className="text-surface-dark/70">Vizovice</p>
                                    <p className="text-surface-dark/70">E-mail: <span className="ms-gradient-text font-bold">info@martinstastny.cz</span></p>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">3. Jaké osobní údaje zpracovávám</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Zpracovávám pouze osobní údaje, které mi dobrovolně poskytnete prostřednictvím kontaktního nebo objednávkového formuláře na tomto webu, konkrétně:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'Jméno a příjmení',
                                        'E-mailová adresa',
                                        'Telefonní číslo',
                                        'Informace týkající se fitness cílů nebo poptávky'
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-surface-dark/5">
                                            <div className="w-2 h-2 rounded-full bg-neon-blaze"></div>
                                            <span className="text-surface-dark/70 font-medium text-lg md:text-xl">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">4. Účel a právní základ zpracování</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Vaše osobní údaje zpracovávám za účelem:
                                </p>
                                <ul className="list-disc list-inside text-surface-dark/70 space-y-2 ml-4 text-lg md:text-xl font-medium">
                                    <li>Vyřízení vaší poptávky nebo objednávky</li>
                                    <li>Vzájemné komunikace</li>
                                    <li>Sjednání a realizace osobního tréninku nebo souvisejících služeb</li>
                                </ul>
                                <p className="text-surface-dark/75 leading-relaxed text-lg pt-4 text-sm italic">
                                    Právním základem zpracování je plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR), případně váš souhlas (čl. 6 odst. 1 písm. a) GDPR).
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">5. Doba uchování osobních údajů</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Osobní údaje uchovávám pouze po dobu nezbytně nutnou po dobu vyřízení poptávky nebo spolupráce, případně po dobu stanovenou platnými právními předpisy. Po uplynutí této doby jsou osobní údaje bezpečně odstraněny.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">6. Příjemci osobních údajů</h2>
                                <p className="text-surface-dark/70 leading-relaxed text-lg md:text-xl font-medium">
                                    Vaše osobní údaje nepředávám žádným třetím stranám a nejsou předávány mimo Evropskou unii. Výjimkou mohou být pouze technické služby nezbytné pro provoz webu (např. hosting).
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">7. Cookies</h2>
                                <p className="text-surface-dark/75 leading-relaxed text-lg">
                                    Tento web používá soubory cookies za účelem zajištění správné funkčnosti webu (technické cookies) a analýzy návštěvnosti (analytické cookies).
                                </p>
                                <p className="text-surface-dark/75 leading-relaxed text-lg">
                                    Používání analytických cookies je možné pouze na základě vašeho souhlasu uděleného prostřednictvím cookie lišty. Tento souhlas můžete kdykoliv odvolat změnou nastavení ve svém prohlížeči.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-3xl font-black text-surface-dark uppercase tracking-tighter">8. Vaše práva</h2>
                                <p className="text-surface-dark/75 leading-relaxed text-lg">
                                    V souvislosti se zpracováním osobních údajů máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost údajů a vznést námitku. Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz).
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

export default PrivacyPolicyPage;
