import { Document, FlatRecord } from 'mongoose';

// Schema to JSON transform options (no connection here)
export const schemaToJsonDefaultOption = {
  virtuals: true,
  transform: (doc: Document, ret: FlatRecord<Record<string, unknown>>) => {
    // Convert _id to id (string)
    ret.id = ret._id?.toString();
    
    // Remove unwanted fields
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Always remove password from JSON output
    
    return ret;
  }
};

