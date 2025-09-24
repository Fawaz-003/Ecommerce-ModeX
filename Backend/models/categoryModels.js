import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subcategory : {
        type : Array,
        required : true,
    }
});

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;