import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String },
    username: { type: String, required: true },
    profilepic: { type: String },
    coverpic: { type: String },

    // Razorpay credentials (for backward compatibility)
    razorpayid: { type: String },
    razorpaysecret: { type: String },

    // Google Pay (Wallet API) credentials
    issuerId: { type: String }, 
    serviceAccountEmail: { type: String },
    credentialsPath: { type: String },  // path to JSON key file OR key string
    gpayToken: { type: String }, // optional - for session/payment tracking
    gatewayMerchantId: { type: String }, // Gateway merchant ID for Google Pay

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || model("User", UserSchema);


// import mongoose from "mongoose";
// const { Schema, model } = mongoose;

// const UserSchema = new Schema({
//     email: { type: String, required: true },
//     name: { type: String},
//     username: { type: String, required: true },
//     profilepic: {type: String},
//     coverpic: {type: String},
//     razorpayid: { type: String },
//     razorpaysecret: { type: String },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//     });

 
// export default mongoose.models.User || model("User", UserSchema);;