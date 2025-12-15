# Clothes API

Lightweight Express API serving a clothing catalog from `db.json`. Images live in `public/images` and are exposed through absolute URLs at runtime. Data changes are kept in memory only (not written back to `db.json`).

## Quick start
- Prereqs: Node.js 18+ recommended.
- Install deps: `npm install`
- Start server: `npm start` (or `npm run dev` with nodemon)
- Default base URL: `http://localhost:5000/api`

## Endpoints
- `GET /api/clothes` — list all items.
- `GET /api/clothes/category/:category` — filter by category (case-insensitive).
- `GET /api/clothes/:id` — fetch one item by numeric id.
- `POST /api/clothes` — create item. Body fields (all required): `title`, `image`, `description`, `category`, `price`.
- `PUT /api/clothes/:id` — update any of the above fields (partial updates allowed).
- `DELETE /api/clothes/:id` — remove an item.

## Request example
```bash
curl -X POST http://localhost:5000/api/clothes \
  -H "Content-Type: application/json" \
  {
    "id" : 1,
    "title": "New T-Shirt",
    "image": "/images/new-tshirt.png",
    "description": "Soft cotton tee",
    "category": "mens",
    "price": "₹999"
  }'
```

## Notes
- Documentation page is served at `GET /api/` (renders `index.html`).
- Image paths starting with `/` are converted to absolute URLs in responses.
- Because data is in-memory, restart the server to reload the original `db.json` contents.

