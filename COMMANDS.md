npx prisma db seed
npx tsx --env-file=.env prisma/seeds/run-offers-only.ts

npx prisma migrate dev --name init_hrms


npx n8n start
set NODE_OPTIONS=--dns-result-order=ipv4first && npx n8n start