import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
AdminSchema.pre("save", async function (this: IAdmin) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
