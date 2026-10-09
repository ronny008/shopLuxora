import dbConnect from '../lib/db/connect';
import { seedDatabase } from '../lib/db/seed';

async function main() {
  console.log('Starting seed...');
  await dbConnect();
  await seedDatabase();
  console.log('Seed completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
