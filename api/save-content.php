<?php
/**
 * API Endpoint: Uložení obsahu webu (pouze pro admina)
 * Pro web: martin-stastny.cz
 */

// Načíst konfiguraci
$config = require_once __DIR__ . '/config.php';

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['security']['allowed_origins'])) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
header('Content-Type: application/json; charset=utf-8');

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Pouze POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Načíst JSON data z requestu
$rawBody = file_get_contents('php://input');
$input = json_decode($rawBody, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatný JSON']);
    exit;
}

// Bezpečnostní kontrola - admin token (jednoduchá ochrana)
// V produkci byste měli použít silnější autentizaci (JWT, session, atd.)
//
// Pozn.: některé hostingy blokují vlastní hlavičky, proto podporujeme i token v JSON body.
$adminToken =
    ($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '') ?:
    ($input['adminToken'] ?? '') ?:
    ($_POST['adminToken'] ?? '');

$expectedToken = $config['admin']['token'] ?? '';

if (empty($expectedToken)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Admin token není nakonfigurován']);
    exit;
}

if ($adminToken !== $expectedToken) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Neautorizovaný přístup']);
    exit;
}

if (empty($input['data'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Chybí data']);
    exit;
}

// Cesta k souboru website_content.json (v kořenovém adresáři webu)
// __DIR__ je /api, takže jdeme o úroveň výš do kořene
$contentFile = dirname(__DIR__) . '/website_content.json';

// Zkontrolovat, zda je adresář zapisovatelný
$contentDir = dirname($contentFile);
if (!is_writable($contentDir)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Adresář není zapisovatelný. Zkontrolujte oprávnění na serveru.'
    ]);
    exit;
}

// Validace a sanitizace dat (základní kontrola struktury)
$data = $input['data'];

// Zkontrolovat základní strukturu
if (!isset($data['general']) || !isset($data['services']) || !isset($data['gallery'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatná struktura dat']);
    exit;
}

// Převést data zpět na JSON s formátováním
$jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($jsonData === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Chyba při serializaci dat']);
    exit;
}

// Zálohovat starý soubor před přepsáním
if (file_exists($contentFile)) {
    $backupFile = $contentFile . '.backup.' . date('Y-m-d_H-i-s');
    if (!copy($contentFile, $backupFile)) {
        error_log("[SAVE-CONTENT] Warning: Failed to create backup");
    }
}

// Uložit nová data
try {
    $result = file_put_contents($contentFile, $jsonData, LOCK_EX);
    
    if ($result === false) {
        throw new Exception('file_put_contents returned false');
    }
    
    // Nastavit správná oprávnění (pokud je to možné)
    @chmod($contentFile, 0644);
    
    // Log úspěšného uložení
    error_log("[SAVE-CONTENT] Content saved successfully at " . date('Y-m-d H:i:s') . " by IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    
    echo json_encode([
        'success' => true,
        'message' => 'Obsah byl úspěšně uložen na server',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    error_log("[SAVE-CONTENT ERROR] Failed to save content: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Nepodařilo se uložit data na server. Zkuste to prosím později.'
    ]);
}
