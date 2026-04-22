import User from "../models/User.js";
import connectDB from "../config/db.js";
import { clerkClient } from '@clerk/express';
import "dotenv/config";

export const makeAdmin = async (adminEmail?: string) => {
    console.log('[makeAdmin] Starting admin promotion script...');
    
    // Validate email
    adminEmail = adminEmail || process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.error('[makeAdmin] ERROR: No ADMIN_EMAIL in .env or CLI arg provided.');
        console.log('[makeAdmin] Usage: npx tsx scripts/makeAdmin.ts user@example.com');
        process.exit(1);
    }
    console.log(`[makeAdmin] Looking for user: ${adminEmail}`);

    let dbConnected = false;
    try {
        // Connect to DB (required for User.findOne)
        await connectDB();
        dbConnected = true;
        console.log('[makeAdmin] Connected to MongoDB');
    } catch (error) {
        console.error('[makeAdmin] ERROR: Failed to connect to DB:', error);
        process.exit(1);
    }

    try {
        const user = await User.findOne({ email: adminEmail });
        if (!user) {
            console.log(`[makeAdmin] No user found with email: ${adminEmail}`);
            process.exit(1);  // Now after log flushes
        }
        console.log(`[makeAdmin] Found user: ${user.name || user.email} (ID: ${user._id})`);

        // Update DB role
        if (user.role === 'admin') {
            console.log('[makeAdmin] User already admin.');
            return;
        }
        user.role = 'admin';
        await user.save();
        console.log('[makeAdmin] Updated DB role to admin');

        // Sync to Clerk if clerkId exists
        if (user.clerkId) {
            await clerkClient.users.updateUserMetadata(user.clerkId, { 
                publicMetadata: { role: 'admin' } 
            });
            console.log('[makeAdmin] Synced role to Clerk');
        } else {
            console.log('[makeAdmin] No clerkId found - skipped Clerk sync (using DB role)');
        }

        console.log(`[makeAdmin] SUCCESS: User ${adminEmail} promoted to admin.`);
    } catch (error: any) {
        console.error('[makeAdmin] ERROR promoting user:', error.message || error);
        process.exit(1);
    } finally {
        if (dbConnected) {
            // Graceful disconnect - optional, mongoose handles
            console.log('[makeAdmin] Script complete.');
        }
    }
};


