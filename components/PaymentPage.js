"use client";
import React, { useEffect, useState } from "react";
import { fetchuser, fetchpayments } from "@/actions/useractions";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import Image from "next/image";

const PaymentPage = ({ username }) => {
  const [paymentform, setPaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const [currentUser, setcurrentUser] = useState({});
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (searchParams.get("paymentdone") === "true") {
      toast("Thanks for your donation!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    }
    router.push(`/${username}`);
  }, []);

  const handleChange = (e) => {
    setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    let u = await fetchuser(username);
    setcurrentUser(u);
    let dbpayments = await fetchpayments(username);
    setPayments(dbpayments);
  };

  /** Google Pay flow */
  const pay = async (amount) => {
    if (!window.google) {
      toast.error("Google Pay SDK not loaded");
      return;
    }

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
            gatewayMerchantId: currentUser.gatewayMerchantId,
          },
        },
      },
    ];

    const paymentDataRequest = {
      ...baseRequest,
      allowedPaymentMethods,
      merchantInfo: {
        merchantId: "3388000000022971561", // your Google Pay merchant ID
        merchantName: "Get Me A Chai",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: (amount / 100).toFixed(2), // convert paise → rupees
        currencyCode: "INR",
        countryCode: "IN",
      },
    };

    paymentsClient
      .loadPaymentData(paymentDataRequest)
      .then((paymentData) => {
        // Send to backend to verify
        fetch("/api/verify-googlepay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentData,
            donation: paymentform,
            username,
          }),
        }).then((res) => {
          if (res.ok) {
            router.push(`/${username}?paymentdone=true`);
          } else {
            toast.error("Payment verification failed");
          }
        });
      })
      .catch((err) => console.error("Payment error:", err));
  };

  return (
    <>
      <ToastContainer theme="light" />

      <div className="relative w-full cover bg-red-50">
        {/* Cover Image */}
        <Image
          src={currentUser.coverpic || "/default-cover.jpg"}
          alt="Cover"
          width={1200}
          height={350}
          className="object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm"
        />

        {/* Profile Pic */}
        <div className="absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36">
          <Image
            src={currentUser.profilepic || "/avatar.gif"}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover rounded-full size-36"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 my-24 mb-32 info">
        <div className="text-lg font-bold">@{username}</div>
        <div className="text-slate-400">Lets help {username} get a chai!</div>
        <div className="text-slate-400">
          {payments.length} Payments · ₹
          {payments.reduce((a, b) => a + b.amount, 0)} raised
        </div>

        <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
          {/* Supporters List */}
          <div className="w-full px-2 text-white rounded-lg supporters md:w-1/2 bg-slate-900 md:p-10">
            <h2 className="my-5 text-2xl font-bold">Top 10 Supporters</h2>
            <ul className="mx-5 text-lg">
              {payments.length === 0 && <li>No payments yet</li>}
              {payments.map((p, i) => (
                <li key={i} className="flex items-center gap-2 my-4">
                  <Image
                    src="/avatar.gif"
                    alt="user avatar"
                    width={33}
                    height={33}
                  />
                  <span>
                    {p.name} donated{" "}
                    <span className="font-bold">₹{p.amount}</span> with a
                    message &quot;{p.message}&quot;
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Make Payment Form */}
          <div className="w-full px-2 text-white rounded-lg makePayment md:w-1/2 bg-slate-900 md:p-10">
            <h2 className="my-5 text-2xl font-bold">Make a Payment</h2>
            <div className="flex flex-col gap-2">
              <input
                onChange={handleChange}
                value={paymentform.name}
                name="name"
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Name"
              />
              <input
                onChange={handleChange}
                value={paymentform.message}
                name="message"
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Message"
              />
              <input
                onChange={handleChange}
                value={paymentform.amount}
                name="amount"
                type="text"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Amount"
              />

              <button
                onClick={() =>
                  pay(Number.parseInt(paymentform.amount || "0") * 100)
                }
                type="button"
                className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4 ||
                  paymentform.amount?.length < 1
                }
              >
                Pay with Google Pay
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-5 md:flex-row">
              <button
                className="p-3 rounded-lg bg-slate-800"
                onClick={() => pay(1000)}
              >
                Pay ₹10
              </button>
              <button
                className="p-3 rounded-lg bg-slate-800"
                onClick={() => pay(2000)}
              >
                Pay ₹20
              </button>
              <button
                className="p-3 rounded-lg bg-slate-800"
                onClick={() => pay(3000)}
              >
                Pay ₹30
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;


// "use client";
// import React, { useEffect, useState } from "react";
// import Script from "next/script";
// import { fetchuser, fetchpayments, initiate } from "@/actions/useractions";
// import { useSearchParams, useRouter, notFound } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Bounce } from "react-toastify";
// import Image from "next/image";

// const PaymentPage = ({ username }) => {
//   const [paymentform, setPaymentform] = useState({
//     name: "",
//     message: "",
//     amount: "",
//   });
//   const [currentUser, setcurrentUser] = useState({});
//   const [payments, setPayments] = useState([]);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     if (searchParams.get("paymentdone") === "true") {
//       toast("Thanks for your donation!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//         transition: Bounce,
//       });
//     }
//     router.push(`/${username}`);
//   }, []);

//   const handleChange = (e) => {
//     setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
//   };

//   const getData = async () => {
//     let u = await fetchuser(username);
//     setcurrentUser(u);
//     let dbpayments = await fetchpayments(username);
//     setPayments(dbpayments);
//   };

//   const pay = async (amount) => {
//     let a = await initiate(amount, username, paymentform);
//     let orderId = a.id;

//     var options = {
//       key: currentUser.razorpayid,
//       amount: amount,
//       currency: "INR",
//       name: "Get Me A Chai",
//       description: "Test Transaction",
//       image: "/avatar.gif", // your logo in public folder
//       order_id: orderId,
//       callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
//       prefill: {
//         name: "Hayat Ali",
//         email: "hayatali123786@gmail.com",
//         contact: "9079728844",
//       },
//       notes: {
//         address: "Razorpay Corporate Office",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     var rzp1 = new Razorpay(options);
//     rzp1.open();
//   };

//   return (
//     <>
//       <ToastContainer theme="light" />
//       <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

//       <div className="relative w-full cover bg-red-50">
//         {/* Cover Image */}
//         <Image
//           src={currentUser.coverpic || "/default-cover.jpg"}
//           alt="Cover"
//           width={1200}
//           height={350}
//           className="object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm"
//         />

//         {/* Profile Pic */}
//         <div className="absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36">
//           <Image
//             src={currentUser.profilepic || "/avatar.gif"}
//             alt="Profile"
//             width={128}
//             height={128}
//             className="object-cover rounded-full size-36"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col items-center justify-center gap-2 my-24 mb-32 info">
//         <div className="text-lg font-bold">@{username}</div>
//         <div className="text-slate-400">Lets help {username} get a chai!</div>
//         <div className="text-slate-400">
//           {payments.length} Payments · ₹
//           {payments.reduce((a, b) => a + b.amount, 0)} raised
//         </div>

//         <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
//           {/* Supporters List */}
//           <div className="w-full px-2 text-white rounded-lg supporters md:w-1/2 bg-slate-900 md:p-10">
//             <h2 className="my-5 text-2xl font-bold">Top 10 Supporters</h2>
//             <ul className="mx-5 text-lg">
//               {payments.length === 0 && <li>No payments yet</li>}
//               {payments.map((p, i) => (
//                 <li key={i} className="flex items-center gap-2 my-4">
//                   <Image
//                     src="/avatar.gif"
//                     alt="user avatar"
//                     width={33}
//                     height={33}
//                   />
//                   <span>
//                     {p.name} donated{" "}
//                     <span className="font-bold">₹{p.amount}</span> with a
//                     message &quot;{p.message}&quot;
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Make Payment Form */}
//           <div className="w-full px-2 text-white rounded-lg makePayment md:w-1/2 bg-slate-900 md:p-10">
//             <h2 className="my-5 text-2xl font-bold">Make a Payment</h2>
//             <div className="flex flex-col gap-2">
//               <input
//                 onChange={handleChange}
//                 value={paymentform.name}
//                 name="name"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Name"
//               />
//               <input
//                 onChange={handleChange}
//                 value={paymentform.message}
//                 name="message"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Message"
//               />
//               <input
//                 onChange={handleChange}
//                 value={paymentform.amount}
//                 name="amount"
//                 type="text"
//                 className="w-full p-3 rounded-lg bg-slate-800"
//                 placeholder="Enter Amount"
//               />

//               <button
//                 onClick={() =>
//                   pay(Number.parseInt(paymentform.amount || "0") * 100)
//                 }
//                 type="button"
//                 className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100"
//                 disabled={
//                   paymentform.name?.length < 3 ||
//                   paymentform.message?.length < 4 ||
//                   paymentform.amount?.length < 1
//                 }
//               >
//                 Pay
//               </button>
//             </div>

//             <div className="flex flex-col gap-2 mt-5 md:flex-row">
//               <button className="p-3 rounded-lg bg-slate-800" onClick={() => pay(1000)}>Pay ₹10</button>
//               <button className="p-3 rounded-lg bg-slate-800" onClick={() => pay(2000)}>Pay ₹20</button>
//               <button className="p-3 rounded-lg bg-slate-800" onClick={() => pay(3000)}>Pay ₹30</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentPage;


// "use client"
// import React, { useEffect, useState } from 'react'
// import Script from 'next/script'
// import { useSession } from 'next-auth/react'
// import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
// import { useSearchParams } from 'next/navigation'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Bounce } from 'react-toastify';
// import { useRouter } from 'next/navigation'
// import { notFound } from "next/navigation"
// import Image from "next/image";
// const PaymentPage = ({ username }) => {
//     // const { data: session } = useSession()

//     const [paymentform, setPaymentform] = useState({name: "", message: "", amount: ""})
//     const [currentUser, setcurrentUser] = useState({})
//     const [payments, setPayments] = useState([])
//     const searchParams = useSearchParams()
//     const router = useRouter()

//     useEffect(() => {
//         getData()
//     }, [])

//     useEffect(() => {
//         if(searchParams.get("paymentdone") == "true"){
//         toast('Thanks for your donation!', {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//             transition: Bounce,
//             });
//         }
//         router.push(`/${username}`)
     
//     }, [])
    

//     const handleChange = (e) => {
//         setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
//     }

//     const getData = async () => {
//         let u = await fetchuser(username)
//         setcurrentUser(u)
//         let dbpayments = await fetchpayments(username)
//         setPayments(dbpayments) 
//     }


//     const pay = async (amount) => {
//         // Get the order Id 
//         let a = await initiate(amount, username, paymentform)
//         let orderId = a.id
//         var options = {
//             "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
//             "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//             "currency": "INR",
//             "name": "Get Me A Chai", //your business name
//             "description": "Test Transaction",
//             "image": "https://example.com/your_logo",
//             "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//             "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
//             "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
//                 "name": "Hayat Ali", //your customer's name
//                 "email": "hayatali123786@gmail.com",
//                 "contact": "9079728844" //Provide the customer's phone number for better conversion rates 
//             },
//             "notes": {
//                 "address": "Razorpay Corporate Office"
//             },
//             "theme": {
//                 "color": "#3399cc"
//             }
//         }

//         var rzp1 = new Razorpay(options);
//         rzp1.open();
//     }
    
//     return (
//         <>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light" />
//             {/* Same as */}
//             <ToastContainer />
//             <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>


//             <div className='relative w-full cover bg-red-50'>
//                 {/* <img className='object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm' src={currentUser.coverpic} alt="" /> */}
//                  <Image
//                     src={currentUser.coverpic || "/default-cover.jpg"} 
//                     alt="Cover"
//                     width={1200}
//                     height={350}
//                     className="object-cover w-full h-48 md:h-[350px] shadow-blue-700 shadow-sm"
//                   />
//                 <div className='absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36'>
//                     {/* <img className='object-cover rounded-full size-36' width={128} height={128} src={currentUser.profilepic} alt="" /> */}
                    


//                     <Image
//                       src={currentUser.profilepic || "/public/avatar.gif"}
//                       alt="Profile"
//                       width={128}
//                       height={128}
//                       className="object-cover rounded-full size-36"
//                     />
//                 </div>
//             </div>
//             <div className="flex flex-col items-center justify-center gap-2 my-24 mb-32 info">
//                 <div className='text-lg font-bold'>

//                     @{username}
//                 </div>
//                 <div className='text-slate-400'>
//                     Lets help {username} get a chai!

//                 </div>
//                 <div className='text-slate-400'>
//                   {payments.length} Payments .   ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
//                 </div>

//                 <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">
//                     <div className="w-full px-2 text-white rounded-lg supporters md:w-1/2 bg-slate-900 md:p-10">
//                         {/* Show list of all the supporters as a leaderboard  */}
//                         <h2 className='my-5 text-2xl font-bold'> Top 10 Supporters</h2>
//                         <ul className='mx-5 text-lg'>
//                             {payments.length == 0 && <li>No payments yet</li>}
//                             {payments.map((p, i) => {
//                                 return <li key={i} className='flex items-center gap-2 my-4'>
//                                     {/* <img width={33} src="avatar.gif" alt="user avatar" /> */}
//                                     <Image 
//                                         src="/public/avatar.gif"
//                                         alt="user avatar" 
//                                         width={33} 
//                                         height={33} 
//                                     />
//                                     <span>
//                                         {p.name} donated <span className='font-bold'>₹{p.amount}</span> with a message &quot;{p.message}&quot;
//                                     </span>
//                                 </li>
//                             })}

//                         </ul>
//                     </div>

//                     <div className="w-full px-2 text-white rounded-lg makePayment md:w-1/2 bg-slate-900 md:p-10">
//                         <h2 className='my-5 text-2xl font-bold'>Make a Payment</h2>
//                         <div className='flex flex-col gap-2'>
//                             {/* input for name and message   */}
//                             <div>

//                                 <input onChange={handleChange} value={paymentform.name} name='name' type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Name' />
//                             </div>
//                             <input onChange={handleChange} value={paymentform.message} name='message' type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Message' />


//                             <input onChange={handleChange} value={paymentform.amount} name="amount" type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Amount' />


//                             <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} type="button" className="text-white bg-gradient-to-br from-purple-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-100" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length<1}>Pay</button>

//                         </div>
//                         {/* Or choose from these amounts  */}
//                         <div className='flex flex-col gap-2 mt-5 md:flex-row'>
//                             <button className='p-3 rounded-lg bg-slate-800' onClick={() => pay(1000)}>Pay ₹10</button>
//                             <button className='p-3 rounded-lg bg-slate-800' onClick={() => pay(2000)}>Pay ₹20</button>
//                             <button className='p-3 rounded-lg bg-slate-800' onClick={() => pay(3000)}>Pay ₹30</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default PaymentPage