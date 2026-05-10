evoedge-hrms/
├── prisma/                             # Database schema and migrations
│   └── schema.prisma
├── src/
│   ├── app/                            # 1. THE PRESENTATION LAYER (Next.js)
│   │   ├── (auth)/                     # Route groups for layout management
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/                // Route group sharing the Sidebar/Header layout
│   │   │   ├── layout.tsx              // The master layout (Sidebar + Header)
│   │   │   │
│   │   │   ├── dashboard/              // URL: /dashboard (The Unified Home)
│   │   │   │   └── page.tsx            // The switch statement routing to features
│   │   │   │
│   │   │   └── leaves/                 // URL: /leaves (Answers your question!)
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── api/                        # Thin API endpoints for external clients (e.g., n8n)
│   │       └── webhooks/n8n/route.ts
│   │
│   ├── actions/ 
│   │       ├── leave.actions.ts
│   │       └── payroll.actions.ts
│   ├── components/                     # 2. THE UI LAYER
│   │   ├── ui/                         # Dumb, reusable components (buttons, modals)
│   │   └── features/                   # Smart, domain-specific components
│   │       ├── payroll/PayrollGrid.tsx
│   │       └── onboarding/CandidateForm.tsx
│   │
│   ├── core/                           # 3. THE EXTRACTION ZONE (Your Future Backend)
│   │   ├── services/                   # Pure business logic (No Next.js imports!)
│   │   │   ├── eosCalculator.service.ts
│   │   │   ├── payroll.service.ts
│   │   │   ├── leave.service.ts
│   │   │   └── onboarding.service.ts
│   │   ├── integrations/               # Wrappers for external APIs
│   │   │   ├── aws-s3.client.ts
│   │   │   ├── aws-textract.client.ts
│   │   │   └── n8n-webhook.client.ts
│   │   ├── db/                         # Database connection and repository pattern
│   │   │   └── db.client.ts            # (e.g., Prisma singleton)
│   │   └── utils/                      # Pure helper functions
│   │       └── financialMath.utils.ts  # Gratuity and prorated math formulas
│   │
│   └── types/                          # 4. SHARED TYPES
│       ├── schemas/                    # Zod validation schemas
│       │   └── payroll.schema.ts
│       └── index.d.ts
│
├── docker-compose.yml                  # VPS infrastructure (Postgres, PgBouncer, n8n)
├── middleware.ts                       # Next.js RBAC routing protection
└── package.json