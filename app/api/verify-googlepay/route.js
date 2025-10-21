// import { NextResponse } from "next/server";

// export const POST = async (req) => {
//   try {
//     const body = await req.json();

//     // body.paymentMethodData.tokenizationData.token has the encrypted payment token
//     const token = body.paymentMethodData.tokenizationData.token;

//     // Send this token to your payment gateway (Stripe/Razorpay/PayU)
//     // Example with Stripe:
//     // const paymentIntent = await stripe.paymentIntents.create({ ... })

//     return NextResponse.json({ success: true, token });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message });
//   }
// };
import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { paymentData, username, name, message, amount } = body;

    // Connect to database
    await connectDb();

    // Verify the user exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Extract payment token from Google Pay response
    const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    
    // Generate a unique order ID
    const orderId = `gp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In a real application, you would:
    // 1. Verify the payment token with Google Pay API
    // 2. Process the payment with your payment gateway
    // 3. Only mark as done after successful processing

    // For demo purposes, we'll simulate successful payment
    const paymentRecord = await Payment.create({
      oid: orderId,
      amount: amount / 100, // Convert paise to rupees
      to_user: username,
      name: name,
      message: message,
      done: true, // In production, set this only after payment verification
      paymentMethod: "googlepay",
      paymentToken: paymentToken,
      createdAt: new Date(),
    });

    console.log("Payment created:", paymentRecord);

    // Return success response
    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: "Payment processed successfully" 
    });

  } catch (error) {
    console.error("Google Pay payment error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Payment processing failed" 
    }, { status: 500 });
  }
}
