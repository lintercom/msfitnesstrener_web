# Nastavení automatického ukládání na server

## Co bylo přidáno

Systém nyní automaticky ukládá změny z adminu přímo na server, takže ostatní uživatelé vidí změny okamžitě.

## Nastavení

### 1. Nastavení Admin Tokenu

Pro bezpečnost je potřeba nastavit admin token, který chrání endpoint před neoprávněným přístupem.

#### Varianta A: Přes environment proměnnou (doporučeno)

Na serveru nastavte environment proměnnou:
```bash
export ADMIN_TOKEN="cc9d77a0ef3b71ee98a5b32e149297b3e12ce5717c87975bc4126b4dea2d5b1e"
```

A upravte `public/api/config.php`:
```php
'admin' => [
    'token' => getenv('ADMIN_TOKEN') ?: 'change-this-to-strong-random-string-in-production'
]
```

#### Varianta B: Přímo v config.php

Upravte `public/api/config.php` a nastavte token přímo:
```php
'admin' => [
    'token' => 'vas-silny-nahodny-retezec-zde-minimum-32-znaku'
]
```

**⚠️ DŮLEŽITÉ:** Použijte silný náhodný řetězec (minimálně 32 znaků). Můžete vygenerovat například:
```bash
openssl rand -hex 32
```

### 2. Nastavení na frontendu

Vytvořte soubor `.env` v kořenovém adresáři projektu:
```
VITE_ADMIN_TOKEN=vas-silny-nahodny-retezec-zde
```

**⚠️ DŮLEŽITÉ:** 
- `.env` soubor NIKDY necommitovat do gitu (mělo by být v `.gitignore`)
- Token v `.env` musí být stejný jako token v `public/api/config.php`

### 3. Oprávnění na serveru

Ujistěte se, že adresář, kde je `website_content.json`, má správná oprávnění pro zápis:

```bash
chmod 755 /cesta/k/webu
chmod 644 /cesta/k/webu/website_content.json
```

Nebo pokud soubor ještě neexistuje:
```bash
touch /cesta/k/webu/website_content.json
chmod 644 /cesta/k/webu/website_content.json
```

## Jak to funguje

1. **Admin upraví obsah** v adminu
2. **Klikne na "Uložit"**
3. **Systém automaticky:**
   - Uloží do localStorage (pro rychlý přístup)
   - Pošle data na server přes `/api/save-content.php`
   - Server uloží data do `website_content.json`
4. **Ostatní uživatelé** vidí změny po obnovení stránky (načítají z `website_content.json`)

## Bezpečnost

- Endpoint je chráněn admin tokenem
- Pouze POST requesty jsou povoleny
- CORS je nastaven pouze pro povolené domény
- Data jsou validována před uložením
- Starý soubor je automaticky zálohován před přepsáním

## Troubleshooting

### "Neautorizovaný přístup"
- Zkontrolujte, že token v `.env` (frontend) odpovídá tokenu v `config.php` (backend)

### "Adresář není zapisovatelný"
- Zkontrolujte oprávnění adresáře na serveru
- Ujistěte se, že PHP proces má práva k zápisu

### "Server nedostupný"
- Zkontrolujte, že PHP soubor `save-content.php` je na serveru
- Zkontrolujte CORS nastavení v `config.php`
- Zkontrolujte PHP error logy na serveru

## Fallback

Pokud server není dostupný nebo není nastaven admin token, systém:
- Uloží data do localStorage (admin je vidí)
- Zobrazí varování, že se nepodařilo nahrát na server
- Admin může použít tlačítko "📥 Export" pro ruční nahrání
