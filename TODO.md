# Fix Product Filters TODO

- [x] Read Product model and controller to understand schema and current filter logic
- [x] Fix `search` filter: case-insensitive regex on `name` and `description`
- [x] Fix `sizes` filter: parse input and use `$in` operator on `sizes` array field
- [x] Fix `categories` filter: parse input and use `$in` operator on `category` field (singular in schema)
- [x] Fix `minPrice` / `maxPrice` filter: use `$gte` / `$lte` on the `price` field
- [x] Test endpoint with combined query parameters

