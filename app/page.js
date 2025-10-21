"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
<script async
  src="https://pay.google.com/gp/p/js/pay.js"
  onload="console.log('✅ Google Pay SDK Loaded')"
  onerror="console.error('❌ Failed to load Google Pay SDK')">
</script>

export default function Home() {
  useEffect(() => {
    // Load Google Pay SDK
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    script.onload = () => {
      if (window.google) {
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: "TEST", // change to "PRODUCTION" when live
        });

        const baseRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
        };

        const allowedCardNetworks = ["VISA", "MASTERCARD"];
        const allowedAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

        const tokenizationSpecification = {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example", // replace with Razorpay / Stripe / etc.
            gatewayMerchantId: "exampleMerchantId",
          },
        };

        const baseCardPaymentMethod = {
          type: "CARD",
          parameters: {
            allowedAuthMethods,
            allowedCardNetworks,
          },
        };

        const cardPaymentMethod = {
          ...baseCardPaymentMethod,
          tokenizationSpecification,
        };

        const isReadyToPayRequest = Object.assign({}, baseRequest, {
          allowedPaymentMethods: [baseCardPaymentMethod],
        });

        paymentsClient.isReadyToPay(isReadyToPayRequest).then((response) => {
          if (response.result) {
            const button = paymentsClient.createButton({
              onClick: () => onGooglePayButtonClicked(paymentsClient),
            });
            document.getElementById("gpay-container").appendChild(button);
          }
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  function onGooglePayButtonClicked(paymentsClient) {
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example", // replace with your gateway
              gatewayMerchantId: "exampleMerchantId",
            },
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: "100.00", // amount
        currencyCode: "INR",
        countryCode: "IN",
      },
      merchantInfo: {
        merchantId: "3388000000022971561", // your Google Merchant ID
        merchantName: "Buy Me a Chai",
      },
    };

    paymentsClient
      .loadPaymentData(paymentDataRequest)
      .then((paymentData) => {
        console.log("Payment success ✅", paymentData);
        alert("Payment Success!");
      })
      .catch((err) => {
        console.error("Payment failed ❌", err);
      });
  }

  return (
    <>
      <div className="flex justify-center flex-col items-center gap-4 text-white h-[44vh]">
        <div className="flex items-center justify-center gap-4 text-5xl font-bold ">
          Buy Me a Chai
          <span>
            <img className="items-center justify-center img" src="/Tea.gif" width={88} alt="" />
          </span>
        </div>
        <p>A crowdfunding platform for creators. Get funded by your fans and followers. Start Now</p>
        <p className="text-center md:text-left">
          A place where your fans can buy you a chai. Unleash the power of your fans and get your projects funded.
        </p>
        <div>
          <Link href={"/login"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Start Here
            </button>
          </Link>
          <Link href={"/about"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>

      <div className="h-1 bg-white opacity-10"></div>

      <div className="container pb-32 mx-auto text-white pt-14">
        <h1 className="text-3xl font-bold text-center mb-14">Your Fans can buy you a Chai</h1>
        <div className="flex justify-around gap-5 ">
          <div className="flex flex-col items-center justify-center space-y-3 item">
            <Image className="p-2 text-black rounded-full bg-slate-400" src="/man.gif" width={88} height={88} alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className="text-center ">Your fans are available for you to help you </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3 item">
            <Image className="p-2 text-black rounded-full bg-slate-400" src="/coin.gif" width={88} height={88} alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className="text-center ">Your fans are available for you to help you </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3 item">
            <Image className="p-2 text-black rounded-full bg-slate-400" src="/group.gif" width={88} height={88} alt="" />
            <p className="font-bold">Fans want to help</p>
            <p className="text-center ">Your fans are available for you to help you </p>
          </div>
        </div>
      </div>

      <div className="h-1 bg-white opacity-10"></div>

      <div className="container flex flex-col items-center justify-center pb-32 mx-auto text-white pt-14">
        <h2 className="text-3xl font-bold text-center mb-14">Learn More About Us</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/0bHoB32fuj0?si=0-LLJ21n8wfVv3Aq"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Google Pay button container */}
      <div className="flex items-center justify-center pb-20">
        <div id="gpay-container"></div>
      </div>
    </>
  );
}


// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <>
//     <div className="flex justify-center flex-col items-center gap-4 text-white h-[44vh]">
//       <div className="flex items-center justify-center gap-4 text-5xl font-bold ">
//         Buy Me a Chai
//          <span><img className="items-center justify-center img"  src="/Tea.gif" width={88} alt="" /></span></div>
//       <p>A crowdfunding platform for creators. Get funded by your fans and followers. Start Now</p>
//        <p className="text-center md:text-left">

//           A place where your fans can buy you a chai. Unleash the power of your fans and get your projects funded.
//         </p>
//       <div>
//         <Link href={"/login"}>
//           <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Here</button>
//         </Link>
//         <Link href={"/about"}>
//         <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button>
//         </Link>
//       </div>
//     </div>
//     <div className="h-1 bg-white opacity-10">
//       </div>
//       <div className="container pb-32 mx-auto text-white pt-14">
//         <h1 className="text-3xl font-bold text-center mb-14">Your Fans can buy you a Chai</h1>
//         <div className="flex justify-around gap-5 ">
//         <div className="flex flex-col items-center justify-center space-y-3 item">
//             <Image
//               className="p-2 text-black rounded-full bg-slate-400"
//               src="/man.gif"
//               width={88}
//               height={88}
//               alt=""
//             />
//             <p className="font-bold">Fans want to help</p>
//             <p className="text-center ">Your fans are available for you to help you </p>
//           </div>
//        <div className="flex flex-col items-center justify-center space-y-3 item">
//             <Image
//               className="p-2 text-black rounded-full bg-slate-400"
//               src="/coin.gif"
//               width={88}
//               height={88}
//               alt=""
//             />
//             <p className="font-bold">Fans want to help</p>
//             <p className="text-center ">Your fans are available for you to help you </p>
//           </div>
//           <div className="flex flex-col items-center justify-center space-y-3 item">
//             <Image
//               className="p-2 text-black rounded-full bg-slate-400"
//               src="/group.gif"
//               width={88}
//               height={88}
//               alt=""
//             />
//             <p className="font-bold">Fans want to help</p>
//             <p className="text-center ">Your fans are available for you to help you </p>
//           </div>
//         </div>
//       </div>

//        <div className="h-1 bg-white opacity-10">
//       </div>
//       <div className="container flex flex-col items-center justify-center pb-32 mx-auto text-white pt-14">
//         <h2 className="text-3xl font-bold text-center mb-14">Learn More About Us</h2>
//           <iframe width="560" height="315" src="https://www.youtube.com/embed/0bHoB32fuj0?si=0-LLJ21n8wfVv3Aq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
//       </div>
//     </>
//   );
// }
