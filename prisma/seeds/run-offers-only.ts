import { PrismaClient, OfferStatus, EmploymentType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { faker } from "@faker-js/faker";

// 1. Initialize Prisma with your pg adapter setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 2. The IDs you provided earlier
  const departmentIds = ["cmpfbd5fh00013ckkyy1xkj5o", "cmpfbd5fu00023ckkrvwkqfa6"];
  const createdById = "cmpfbd5il00033ckk1bjeszx5";
  const managerId = "cmpfbd5kf000a3ckk9brb2hg2";

  console.log("🔍 Fetching company context...");

  // 3. Dynamically resolve the companyId from the creator to prevent tenant mismatches
  const creator = await prisma.user.findUniqueOrThrow({
    where: { id: createdById },
    select: { companyId: true }
  });

  console.log(`🏢 Found Company ID: ${creator.companyId}`);
  console.log("Generating 50 dummy job offers...");

  // 4. Generate the payload
  const dummyOffers = Array.from({ length: 50 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    nicNumber: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
    jobPosition: faker.person.jobTitle(),
    employmentType: faker.helpers.arrayElement(Object.values(EmploymentType)),
    status: faker.helpers.arrayElement(Object.values(OfferStatus)),
    baseSalary: faker.number.float({ min: 40000, max: 150000, fractionDigits: 2 }),
    targetStartDate: faker.date.soon({ days: 45 }),
    offerContent: faker.lorem.paragraphs(2),
    
    // Relational mappings
    companyId: creator.companyId,
    departmentId: faker.helpers.arrayElement(departmentIds),
    createdById: createdById,
    managerId: managerId
  }));

  // 5. Bulk Insert
  const result = await prisma.jobOffer.createMany({
    data: dummyOffers,
  });

  console.log(`✅ Successfully added ${result.count} dummy job offers!`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to generate offers:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });