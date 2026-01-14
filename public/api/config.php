<?php
/**
 * Konfigurace PHP backendu pro martin-stastny.cz
 */
return [
    'email' => [
        // Kam se budou posílat poptávky
        'to' => 'info@martin-stastny.cz',

        // Odesílatel (musí být z vaší domény)
        'from' => 'web@martin-stastny.cz',
        'from_name' => 'Martin Šťastný Web',

        // Předmět emailu
        'subject_prefix' => 'Nová poptávka z webu: '
    ],

    // Automatická odpověď odesílateli
    'auto_reply' => [
        'enabled' => true,
        'subject' => 'Děkuji za Vaši poptávku | Martin Šťastný',
        'message' => "Dobrý den,\n\nděkuji za Vaši poptávku. Obdržel jsem Vaši zprávu a ozvu se Vám co nejdříve.\n\nS pozdravem,\nMartin Šťastný\nFitness Coach\n\n---\nToto je automatická odpověď. Neodpovídejte na tento email."
    ],

    'security' => [
        // Povolené domény pro CORS
        'allowed_origins' => [
            'https://martin-stastny.cz',
            'https://www.martin-stastny.cz',
            'http://localhost:3000', // Pro lokální vývoj
            'http://localhost:5173'  // Pro Vite dev server
        ]
    ],

    // Admin token pro ukládání obsahu
    // ⚠️ DŮLEŽITÉ: Tento token musí být stejný jako VITE_ADMIN_TOKEN v .env souboru!
    'admin' => [
        'token' => 'cc9d77a0ef3b71ee98a5b32e149297b3e12ce5717c87975bc4126b4dea2d5b1e'
    ]
];
