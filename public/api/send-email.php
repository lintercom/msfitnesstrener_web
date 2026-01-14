<?php
/**
 * API Endpoint: Odeslání emailu z kontaktního formuláře
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
header('Access-Control-Allow-Headers: Content-Type');
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
$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Validace povinných polí
$required = ['name', 'email'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Chybí povinné pole: $field"]);
        exit;
    }
}

// Validace emailu
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Neplatná emailová adresa']);
    exit;
}

// Sanitizace vstupu
$name = htmlspecialchars(strip_tags($input['name']), ENT_QUOTES, 'UTF-8');
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(strip_tags($input['phone'] ?? 'Neuvedeno'), ENT_QUOTES, 'UTF-8');
$services = htmlspecialchars(strip_tags($input['services'] ?? 'Nevybrány'), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(strip_tags($input['message'] ?? 'Žádná zpráva'), ENT_QUOTES, 'UTF-8');

// Sestavení emailu
$to = $config['email']['to'];
$subject = $config['email']['subject_prefix'] . $name;

$body = <<<EMAIL
===========================================
NOVÁ POPTÁVKA Z WEBU
===========================================

Jméno: $name
Email: $email
Telefon: $phone

-------------------------------------------
Vybrané služby:
$services

-------------------------------------------
Zpráva od klienta:
$message

-------------------------------------------
Odesláno: {$_SERVER['REQUEST_TIME']}
IP: {$_SERVER['REMOTE_ADDR']}
===========================================
EMAIL;

// Headers
$headers = [];
$headers[] = "From: {$config['email']['from_name']} <{$config['email']['from']}>";
$headers[] = "Reply-To: $name <$email>";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "X-Priority: 1";

$headersString = implode("\r\n", $headers);

// Odeslání
try {
    $sent = mail($to, $subject, $body, $headersString);

    if ($sent) {
        // Log úspěšného odeslání (volitelné)
        error_log("[FORM] Email sent to $to from $email at " . date('Y-m-d H:i:s'));

        echo json_encode([
            'success' => true,
            'message' => 'Email byl úspěšně odeslán'
        ]);
    } else {
        throw new Exception('mail() returned false');
    }
} catch (Exception $e) {
    error_log("[FORM ERROR] Failed to send email: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Nepodařilo se odeslat email. Zkuste to prosím později.'
    ]);
}
