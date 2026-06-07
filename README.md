# EvoEdge HRMS

## Folder Structure

```
.
├── AGENTS.md
├── CLAUDE.md
├── COMMANDS.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
├── tsconfig.json
├── ui_components_explain_prompt.md
├── prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations
│       ├── migration_lock.toml
│       ├── 20260510144921_init_hrms
│       │   └── migration.sql
│       ├── 20260604052102_add_job_offers
│       │   └── migration.sql
│       ├── 20260604083517_add_job_offers_enums
│       │   └── migration.sql
│       └── 20260604175809_add_job_offers_enums2
│           └── migration.sql
├── public
│   └── icon
└── src
    ├── middleware.ts
    ├── actions
    │   ├── auth.actions.ts
    │   └── offer.actions.ts
    ├── app
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── (auth)
    │   │   ├── login
    │   │   │   └── page.tsx
    │   │   └── signup
    │   │       └── page.tsx
    │   ├── (dashboards)
    │   │   ├── layout.tsx
    │   │   ├── dashboard
    │   │   │   └── page.tsx
    │   │   ├── employee
    │   │   │   └── page.tsx
    │   │   ├── help
    │   │   │   └── page.tsx
    │   │   ├── lead
    │   │   │   ├── page.tsx
    │   │   │   └── create
    │   │   │       └── page.tsx
    │   │   ├── leaves
    │   │   │   └── page.tsx
    │   │   ├── payroll
    │   │   │   └── page.tsx
    │   │   ├── resignation
    │   │   │   └── page.tsx
    │   │   └── settings
    │   │       └── page.tsx
    │   ├── api
    │   │   └── webhooks
    │   │       └── n8n
    │   └── offer
    │       └── [token]
    │           └── page.tsx
    ├── components
    │   ├── common
    │   │   └── searchable-dropdown.tsx
    │   ├── features
    │   │   ├── auth
    │   │   │   ├── AuthBranding.tsx
    │   │   │   ├── LoginForm.tsx
    │   │   │   └── SignupForm.tsx
    │   │   ├── dashboards
    │   │   │   ├── EmployeeDashboard.tsx
    │   │   │   ├── HodDashboard.tsx
    │   │   │   └── ...
    │   │   ├── leads
    │   │   ├── leaves
    │   │   └── ...
    │   ├── icons
    │   │   └── logo.tsx
    │   ├── layout
    │   │   ├── Header.tsx
    │   │   ├── PageHeader.tsx
    │   │   └── Sidebar.tsx
    │   └── ui
    │       ├── alert-dialog.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── command.tsx
    │       ├── confirm-modal.tsx
    │       ├── dialog.tsx
    │       ├── input-group.tsx
    │       ├── input.tsx
    │       ├── popover.tsx
    │       ├── select.tsx
    │       ├── sonner.tsx
    │       ├── text.tsx
    │       └── textarea.tsx
    ├── config
    │   └── routes.ts
    ├── constants
    │   ├── auth.constants.ts
    │   ├── n8n.constant.ts
    │   ├── offer.constants.ts
    │   └── sidebar.constants.ts
    ├── core
    │   ├── db
    │   │   └── db.client.ts
    │   ├── repositories
    │   │   ├── company.repository.ts
    │   │   ├── department.repository.ts
    │   │   ├── employee.repository.ts
    │   │   ├── jobOffer.repository.ts
    │   │   └── user.repository.ts
    │   └── services
    │       ├── auth.service.ts
    │       ├── n8n.client.ts
    │       └── offer.service.ts
    ├── lib
    │   ├── formatters.ts
    │   └── utils.ts
    └── types
        ├── action.types.ts
        ├── auth.types.ts
        ├── n8n.types.ts
        ├── offer.types.ts
        ├── session.types.ts
        └── schemas
            ├── auth.schema.ts
            └── offer.schema.ts
```
