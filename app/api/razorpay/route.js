"use client";
import { useEffect } from "react";

export default function GooglePayButton() {
  useEffect(() => {
    if (!window.google) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: "TEST", // change to "PRODUCTION" when live
    });

    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
    };

    const allowedPaymentMethods = [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["VISA", "MASTERCARD"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "razorpay", // or stripe, payu, etc.
            gatewayMerchantId: "your_gateway_merchant_id", // from Razorpay/Stripe
          },
        },
      },
    ];

    const paymentDataRequest = {
      ...baseRequest,
      allowedPaymentMethods,
      merchantInfo: {
        merchantId: "3388000000022971561", // <-- Your Google Merchant ID
        merchantName: "Your Business",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: "100.00", // must be a string
        currencyCode: "INR",
        countryCode: "IN",
      },
    };

    // Check if ready to pay
    paymentsClient
      .isReadyToPay(baseRequest)
      .then((response) => {
        if (response.result) {
          const button = paymentsClient.createButton({
            onClick: () => {
              paymentsClient
                .loadPaymentData(paymentDataRequest)
                .then((paymentData) => {
                  // Send to backend for verification
                  fetch("/api/verify-googlepay", {
                    method: "POST",
                    body: JSON.stringify(paymentData),
                    headers: { "Content-Type": "application/json" },
                  });
                })
                .catch((err) => console.error("Payment error:", err));
            },
          });
          document.getElementById("container").appendChild(button);
        }
      })
      .catch((err) => console.error("isReadyToPay error:", err));
  }, []);

  return <div id="container"></div>;
}


// "use client";
// import { useEffect } from "react";

// export default function GooglePayButton() {
//   useEffect(() => {
//     const paymentsClient = new window.google.payments.api.PaymentsClient({
//       environment: "TEST", // use "PRODUCTION" later
//     });

//     const paymentDataRequest = {
//       apiVersion: 2,
//       apiVersionMinor: 0,
//       allowedPaymentMethods: [
//         {
//           type: "CARD",
//           parameters: {
//             allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
//             allowedCardNetworks: ["VISA", "MASTERCARD"],
//           },
//           tokenizationSpecification: {
//             type: "PAYMENT_GATEWAY",
//             parameters: {
//               gateway: "example", // e.g. "razorpay" / "stripe"
//               gatewayMerchantId: "your_merchant_id",
//             },
//           },
//         },
//       ],
//       merchantInfo: {
//         merchantId: "3388000000022971561", // your Issuer ID
//         merchantName: "Your Business",
//       },
//       transactionInfo: {
//         totalPriceStatus: "FINAL",
//         totalPrice: "100.00",
//         currencyCode: "INR",
//         countryCode: "IN",
//       },
//     };

//     paymentsClient.isReadyToPay({ apiVersion: 2, apiVersionMinor: 0 }).then(() => {
//       const button = paymentsClient.createButton({
//         onClick: () => {
//           paymentsClient.loadPaymentData(paymentDataRequest).then(paymentData => {
//             fetch("/api/verify-googlepay", {
//               method: "POST",
//               body: JSON.stringify(paymentData),
//               headers: { "Content-Type": "application/json" }
//             });
//           });
//         },
//       });
//       document.getElementById("container").appendChild(button);
//     });
//   }, []);

//   return <div id="container"></div>;
// }


// import { NextResponse } from "next/server";
// import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
// import Payment from "@/models/Payment";
// import Razorpay from "razorpay";
// import connectDb from "@/db/connectDb";
// import User from "@/models/User";

// export const POST = async (req) => {
//     await connectDb()
//     let body = await req.formData()
//     body = Object.fromEntries(body)

//     // Check if razorpayOrderId is present on the server
//     let p = await Payment.findOne({oid: body.razorpay_order_id})
//     if(!p){
//         return NextResponse.json({success: false, message:"Order Id not found"})
//     }

//     // fetch the secret of the user who is getting the payment 
//     let user = await User.findOne({username: p.to_user})
//     const secret = user.razorpaysecret

//     // Verify the payment
//     let xx = validatePaymentVerification({"order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id}, body.razorpay_signature, secret)

//     if(xx){
//         // Update the payment status
//         const updatedPayment = await Payment.findOneAndUpdate({oid: body.razorpay_order_id}, {done: "true"}, {new: true})
//         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/${updatedPayment.to_user}?paymentdone=true`)  
//     }

//     else{
//         return NextResponse.json({success: false, message:"Payment Verification Failed"})
//     }

// }