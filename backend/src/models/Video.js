import mongoose from "mongoose";

const videoSchmea = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    url: { type: String },
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    allowDomains: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Video", videoSchmea);
