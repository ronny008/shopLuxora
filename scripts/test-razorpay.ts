import Razorpay from 'razorpay';
import fs from 'fs';
import path from 'path';

// Load .env.local manually for test script
const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const envLines = envContent.split('\n');
for (const line of envLines) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    process.env[key] = val;
  }
}

console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('KEY_SECRET length:', process.env.RAZORPAY_KEY_SECRET?.length);

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function main() {
  try {
    const order = await rzp.orders.create({
      amount: 50000, // 500 INR in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
    });
    console.log('Razorpay Order created successfully:', order);
  } catch (err: any) {
    console.error('Razorpay Order creation FAILED:');
    console.error('Error details:', err);
    if (err.error) console.error('API Error Response:', err.error);
  }
}

main();
