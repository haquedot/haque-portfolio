import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  date: Date;
  updatedAt?: Date;
  image?: string;
  tags: string[];
  readTime: number;
  views: number;
  likes: number;
  series?: string;
  featured: boolean;
  published: boolean;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true, default: "Haque" },
    authorBio: { type: String },
    authorImage: { type: String },
    date: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    image: { type: String },
    tags: { type: [String], default: [] },
    readTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    series: { type: String },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
BlogPostSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
