'use server';

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export const getSimilarEventsBySLug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();
        return await  Event.find({_id: { $ne: event._id} , tags: { $in: event.tags}}).limit(3).lean();

    } catch (error) {
        return [];
    }
};