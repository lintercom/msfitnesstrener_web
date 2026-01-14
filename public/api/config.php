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
    
    'security' => [
        // Povolené domény pro CORS
        'allowed_origins' => [
            'https://martin-stastny.cz',
            'https://www.martin-stastny.cz',
            'http://localhost:3000' // Pro lokální vývoj
        ]
    ]
];
