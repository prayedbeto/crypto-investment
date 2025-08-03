# Crypto Investment Backend

Backend para la aplicación de inversión en criptomonedas con Node.js, Express, Sequelize y MySQL.

## Características

- API REST para gestión de criptomonedas
- Integración con APIs externas (CoinGecko)
- Base de datos MySQL con Sequelize ORM
- Migraciones automáticas
- Controladores para consultas de criptomonedas

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp env.example .env
```

Editar el archivo `.env` con tus credenciales de base de datos:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=crypto_investment
```

3. Configurar la base de datos:
```bash
npm run db:setup
```

## Uso

### Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### Ejecutar migraciones:
```bash
npm run db:migrate
```

### Poblar la base de datos:
```bash
npm run db:seed
```

### Probar la API de CoinMarketCap:
```bash
npm run test:api
```

## Endpoints de la API

### Criptomonedas

- `GET /api/cryptocurrencies` - Obtener todas las criptomonedas
- `GET /api/cryptocurrencies/active` - Obtener criptomonedas activas
- `GET /api/cryptocurrencies/:id` - Obtener criptomoneda por ID
- `GET /api/cryptocurrencies/symbol/:symbol` - Obtener criptomoneda por símbolo
- `GET /api/cryptocurrencies/with-metadata` - Obtener todas las criptomonedas con sus metadatos
- `GET /api/cryptocurrencies/:id/metadata` - Obtener metadatos de una criptomoneda específica
- `POST /api/cryptocurrencies/fetch` - Obtener datos de API externa y guardarlos

### Health Check

- `GET /api/health` - Verificar estado del servidor

## Modelos

### Criptomoneda

```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  rank: INTEGER,
  name: STRING,
  symbol: STRING(10),
  slug: STRING (Unique),
  is_active: BOOLEAN,
  status: INTEGER,
  first_historical_data: DATE,
  last_historical_data: DATE,
  platform: STRING,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Metadatos de Criptomoneda

```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  cryptocurrency_id: INTEGER (Foreign Key),
  logo: TEXT,
  description: TEXT,
  date_added: DATE,
  date_launched: DATE,
  tags: JSON,
  category: STRING,
  platform: JSON,
  website_urls: JSON,
  technical_doc_urls: JSON,
  twitter_urls: JSON,
  reddit_urls: JSON,
  message_board_urls: JSON,
  announcement_urls: JSON,
  chat_urls: JSON,
  explorer_urls: JSON,
  source_code_urls: JSON,
  facebook_urls: JSON,
  subreddit: STRING,
  twitter_username: STRING,
  is_hidden: BOOLEAN,
  notice: TEXT,
  tag_names: JSON,
  tag_groups: JSON,
  contract_addresses: JSON,
  self_reported_circulating_supply: TEXT,
  self_reported_market_cap: TEXT,
  self_reported_tags: TEXT,
  infinite_supply: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

## Ejemplos de uso

### Obtener todas las criptomonedas:
```bash
curl http://localhost:3001/api/cryptocurrencies
```

### Obtener Bitcoin por símbolo:
```bash
curl http://localhost:3001/api/cryptocurrencies/symbol/BTC
```

### Obtener datos de API externa:
```bash
curl -X POST http://localhost:3001/api/cryptocurrencies/fetch
```

### Obtener criptomonedas con metadatos:
```bash
curl http://localhost:3001/api/cryptocurrencies/with-metadata
```

### Obtener metadatos de Bitcoin:
```bash
curl http://localhost:3001/api/cryptocurrencies/1/metadata
```

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── cryptocurrencyController.js
│   ├── models/
│   │   ├── index.js
│   │   ├── Cryptocurrency.js
│   │   └── CryptocurrencyMetadata.js
│   ├── services/
│   │   └── cryptocurrencyService.js
│   ├── routes/
│   │   └── cryptocurrencies.js
│   └── app.js
├── migrations/
│   ├── 20250801194316-create-cryptocurrencies.js
│   └── 20250801201011-create-cryptocurrency-metadata.js
├── seeders/
│   └── 20250801201142-demo-cryptocurrencies.js
├── scripts/
│   └── setup-database.js
└── package.json
``` 