# Static Reviews Data

Questa directory contiene i dati statici delle recensioni pre-tradotte per eliminare le chiamate API live.

## Struttura

- `static-reviews.json` - File principale con tutte le recensioni tradotte
- `backup/` - Backup dei dati precedenti
- `scripts/` - Script per aggiornamenti

## Vantaggi del Sistema Statico

- ✅ **Zero costi OpenAI** in produzione
- ✅ **Zero rate limiting** Airbnb 
- ✅ **Performance ultra-veloce** (0ms latenza)
- ✅ **Scalabilità infinita** per traffico Google Ads
- ✅ **Controllo qualità** traduzioni

## Formato Dati

```json
{
  "metadata": {
    "createdAt": "2025-07-30T23:30:00Z",
    "source": "batch-translation", 
    "languages": ["en", "it", "fr", "de", "es"],
    "properties": ["fienaroli", "moro"]
  },
  "reviews": {
    "fienaroli": {
      "en": { "reviews": [...], "totalCount": 12, ... },
      "it": { "reviews": [...], "totalCount": 12, ... },
      "fr": { "reviews": [...], "totalCount": 12, ... },
      "de": { "reviews": [...], "totalCount": 12, ... },
      "es": { "reviews": [...], "totalCount": 12, ... }
    },
    "moro": { /* same structure */ }
  }
}
```

## Aggiornamento

Per aggiornare le recensioni:

1. `npm run extract-reviews` - Estrae dati freschi da Airbnb
2. `npm run translate-reviews` - Traduce tutto in 5 lingue  
3. `npm run deploy-static` - Deploy dei nuovi dati

## Script Disponibili

- `extract-real-reviews.mjs` - Estrazione dati live
- `translate-reviews-batch.mjs` - Traduzione batch
- `deploy-static.mjs` - Deploy aggiornamenti