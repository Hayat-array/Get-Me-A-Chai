import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const PaymentSchema = new Schema(
  {
    name: { type: String, required: true },          // payer name
    to_user: { type: String, required: true },       // receiver userId / email / phone
    oid: { type: String, required: true, unique: true }, // order id, should be unique
    message: { type: String },                       // optional note
    amount: { type: Number, required: true },        // transaction amount
    done: { type: Boolean, default: false },         // payment status
    paymentMethod: { type: String },                 // payment method (razorpay/googlepay)
    paymentToken: { type: String },                  // payment token for verification
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

export default models.Payment || model("Payment", PaymentSchema);


// import mongoose from "mongoose";
// const { Schema, model } = mongoose;

// const PaymentSchema = new Schema({
//     name: { type: String, required: true },
//     to_user: { type: String, required: true },
//     oid: { type: String, required: true },
//     message: { type: String },
//     amount: { type: Number, required: true },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }, 
//     done: { type: Boolean, default: false },
//     });

 
// export default mongoose.models.Payment || model("Payment", PaymentSchema);;