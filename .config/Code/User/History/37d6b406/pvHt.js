import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

const sql = postgres(process.env.DATABASE_URL);

async function testConnection() {
    try {
        // Test DB connection
        const result = await sql`SELECT NOW() AS current_time;`;
        console.log('✅ Database connected successfully');
        console.log('Current DB time:', result[0].current_time);

        // Optional: Create a notes table if it doesn't exist
        await sql`
        CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        `;
        console.log('✅ Notes table is ready');

        // Optional: Insert a test note
        await sql`
        INSERT INTO notes (title, content)
        VALUES ('Test Note', 'This is a test note from Node.js');
        `;
        console.log('✅ Test note inserted');

        // Optional: Fetch all notes
        const notes = await sql`SELECT * FROM notes;`;
        console.log('📋 Current notes in DB:', notes);

    } catch (err) {
        console.error('❌ Database connection failed:', err);
    } finally {
        await sql.end(); // Close DB connection
    }
}

testConnection();
