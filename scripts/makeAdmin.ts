import User from "../models/User.js";
import connectDB from "../config/db.js";
import { clerkClient } from '@clerk/express'
import "dotenv/config";
const makeAdmin = async () => {
    // connectDB called in server.ts
    const adminEmail = process.env.ADMIN_EMAIL as string;
    try {
        const user = await User.findOne({ email: adminEmail });
        if (!user) {
            console.log(`No user found with email: ${adminEmail}`);
            return;
        }
        user.role = 'admin';
        await clerkClient.users.updateUserMetadata(user.clerkId as string, { publicMetadata: { role: 'admin' } });
        await user.save();
        console.log(`User with email ${adminEmail} has been promoted to admin.`);
    } catch (error:any) {
        console.error('Error promoting user to admin:', error);
    }   finally {
        process.exit();
    }   
}
export default makeAdmin;