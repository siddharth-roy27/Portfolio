import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

const sql = postgres(process.env.DATABASE_URL);

async function testConnection() {
    try {
        const result = await sql`SELECT NOW() AS current_time;`;
        console.log('✅ Database connected successfully');
        console.log('Current DB time:', result[0].current_time);
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    } finally {
        await sql.end();
    }
}

testConnection();
