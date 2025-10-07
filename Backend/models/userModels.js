import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: false },
    password: { type: String },
    role: { type: Number, default: 0 }
},{ timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;   