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

// Generování unikátního Message-ID pro anti-spam
$domain = parse_url($config['security']['allowed_origins'][0] ?? 'martin-stastny.cz', PHP_URL_HOST) ?? 'martin-stastny.cz';
$messageId = sprintf("<%s.%s@%s>", time(), uniqid(), $domain);

// Sestavení emailu PRO TRENÉRA
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

// Headers pro hlavní email (anti-spam optimalizované)
$headers = [];
$headers[] = "From: {$config['email']['from_name']} <{$config['email']['from']}>";
$headers[] = "Reply-To: $name <$email>";
$headers[] = "Return-Path: {$config['email']['from']}";
$headers[] = "Message-ID: $messageId";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "Content-Transfer-Encoding: 8bit";
$headers[] = "X-Mailer: MartinStastnyWeb/1.0";
$headers[] = "X-Originating-IP: {$_SERVER['REMOTE_ADDR']}";
$headers[] = "X-Priority: 3"; // Normal priority
$headers[] = "Importance: Normal";
$headers[] = "List-Unsubscribe: <mailto:{$config['email']['from']}?subject=Unsubscribe>";
$headers[] = "List-Unsubscribe-Post: List-Unsubscribe=One-Click";
$headers[] = "Date: " . date('r');

$headersString = implode("\r\n", $headers);

// Odeslání
try {
    $sent = mail($to, $subject, $body, $headersString);

    if ($sent) {
        // Log úspěšného odeslání
        error_log("[FORM] Email sent to $to from $email at " . date('Y-m-d H:i:s'));

        // Automatická odpověď odesílateli (na email z formuláře)
        if (!empty($config['auto_reply']['enabled']) && $config['auto_reply']['enabled'] === true) {
            $autoReplySubject = $config['auto_reply']['subject'] ?? 'Děkujeme za Vaši zprávu';
            $autoReplyMessage = $config['auto_reply']['message'] ?? "Děkujeme za Vaši poptávku. Brzy se Vám ozveme.";

            // Personalizovat zprávu jménem odesílatele
            $autoReplyMessage = str_replace('{name}', $name, $autoReplyMessage);

            // Generování nového Message-ID pro auto-reply
            $autoReplyMessageId = sprintf("<%s.%s.autoreply@%s>", time(), uniqid(), $domain);

            // Anti-spam headers pro automatickou odpověď
            $autoReplyHeaders = [];
            $autoReplyHeaders[] = "From: {$config['email']['from_name']} <{$config['email']['from']}>";
            $autoReplyHeaders[] = "Reply-To: {$config['email']['from_name']} <{$config['email']['to']}>";
            $autoReplyHeaders[] = "Return-Path: {$config['email']['from']}";
            $autoReplyHeaders[] = "Message-ID: $autoReplyMessageId";
            $autoReplyHeaders[] = "MIME-Version: 1.0";
            $autoReplyHeaders[] = "Content-Type: text/plain; charset=UTF-8";
            $autoReplyHeaders[] = "Content-Transfer-Encoding: 8bit";
            $autoReplyHeaders[] = "X-Mailer: MartinStastnyWeb/1.0";
            $autoReplyHeaders[] = "X-Auto-Response-Suppress: All";
            $autoReplyHeaders[] = "Auto-Submitted: auto-replied";
            $autoReplyHeaders[] = "Precedence: bulk";
            $autoReplyHeaders[] = "Date: " . date('r');

            $autoReplyHeadersString = implode("\r\n", $autoReplyHeaders);

            // Odeslat na email z formuláře ($email je z inputu uživatele)
            $autoReplySent = mail($email, $autoReplySubject, $autoReplyMessage, $autoReplyHeadersString);

            if ($autoReplySent) {
                error_log("[FORM] Auto-reply sent to $email at " . date('Y-m-d H:i:s'));
            } else {
                error_log("[FORM WARNING] Failed to send auto-reply to $email");
            }
        }

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
