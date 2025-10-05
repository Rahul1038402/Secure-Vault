import mongoose, { Schema, Model } from 'mongoose';
import { VaultItem } from '@/types';

const VaultItemSchema = new Schema<VaultItem>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

VaultItemSchema.index({ userId: 1, createdAt: -1 });

const VaultItemModel: Model<VaultItem> =
  mongoose.models.VaultItem ||
  mongoose.model<VaultItem>('VaultItem', VaultItemSchema);

export default VaultItemModel;
