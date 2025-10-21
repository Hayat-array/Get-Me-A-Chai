"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchuser, updateProfile } from "@/actions/useractions";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      getData();
    }
  }, [status]);

  const getData = async () => {
    try {
      if (session?.user?.email) {
        const u = await fetchuser(session.user.email);
        setForm(u || {});
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form, session.user.name);
      toast.success("Profile Updated!", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  if (status === "loading") {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="container px-6 py-5 mx-auto">
        <h1 className="my-5 text-3xl font-bold text-center">
          Welcome to your Dashboard
        </h1>

        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Username", name: "username", type: "text" },
            { label: "Profile Picture", name: "profilepic", type: "text" },
            { label: "Cover Picture", name: "coverpic", type: "text" },
            { label: "Razorpay ID", name: "razorpayid", type: "text" },
            { label: "Razorpay Secret", name: "razorpaysecret", type: "text" },
          ].map((field) => (
            <div key={field.name} className="my-2">
              <label
                htmlFor={field.name}
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                {field.label}
              </label>
              <input
                value={form[field.name] || ""}
                onChange={handleChange}
                type={field.type}
                name={field.name}
                id={field.name}
                className="block w-full p-2 border rounded-lg"
              />
            </div>
          ))}

          <div className="my-6">
            <button
              type="submit"
              className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Dashboard;


// "use client"
// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation"; // use next/navigation in app router
// // import { fetchuser, updateProfile } from "@action/useraction";
// import { ToastContainer, toast, Bounce } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchuser, updateProfile } from "@/actions/useraction";
// const Dashboard = () => {
//   const { data: session, update } = useSession();
//   const router = useRouter();
//   const [form, setForm] = useState({});

//   useEffect(() => {
//     if (!session) {
//       router.push("/login");
//     } else {
//       getData();
//     }
//   }, [session]);

//   const getData = async () => {
//     if (session?.user?.email) {
//       let u = await fetchuser(session.user.email);
//       setForm(u); // assuming `u` is user data
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await updateProfile(form, session.user.name);
//     toast("Profile Updated", {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//       transition: Bounce,
//     });
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="container px-6 py-5 mx-auto">
//         <h1 className="my-5 text-3xl font-bold text-center">
//           Welcome to your Dashboard
//         </h1>

//         <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
//           {/* Name */}
//           <div className="my-2">
//             <label
//               htmlFor="name"
//               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             >
//               Name
//             </label>
//             <input
//               value={form.name || ""}
//               onChange={handleChange}
//               type="text"
//               name="name"
//               id="name"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Email */}
//           <div className="my-2">
//             <label htmlFor="email">Email</label>
//             <input
//               value={form.email || ""}
//               onChange={handleChange}
//               type="email"
//               name="email"
//               id="email"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Username */}
//           <div className="my-2">
//             <label htmlFor="username">Username</label>
//             <input
//               value={form.username || ""}
//               onChange={handleChange}
//               type="text"
//               name="username"
//               id="username"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Profile Picture */}
//           <div className="my-2">
//             <label htmlFor="profilepic">Profile Picture</label>
//             <input
//               value={form.profilepic || ""}
//               onChange={handleChange}
//               type="text"
//               name="profilepic"
//               id="profilepic"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Cover Picture */}
//           <div className="my-2">
//             <label htmlFor="coverpic">Cover Picture</label>
//             <input
//               value={form.coverpic || ""}
//               onChange={handleChange}
//               type="text"
//               name="coverpic"
//               id="coverpic"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Razorpay ID */}
//           <div className="my-2">
//             <label htmlFor="razorpayid">Razorpay ID</label>
//             <input
//               value={form.razorpayid || ""}
//               onChange={handleChange}
//               type="text"
//               name="razorpayid"
//               id="razorpayid"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Razorpay Secret */}
//           <div className="my-2">
//             <label htmlFor="razorpaysecret">Razorpay Secret</label>
//             <input
//               value={form.razorpaysecret || ""}
//               onChange={handleChange}
//               type="text"
//               name="razorpaysecret"
//               id="razorpaysecret"
//               className="block w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Submit */}
//           <div className="my-6">
//             <button
//               type="submit"
//               className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Dashboard;


// "use client"
// import React,{ useState , useEffect} from 'react'
// import { useSession, signIn, signOut } from 'next-auth/react'
// import { useRouter } from 'next/router';
// import {fetchuser, updateProfile} from '@action/useraction';
// import {ToastConatainer, toast } from   'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Bounce } from 'react-toastify';

// const Dashboard = () => {
//     const {data: session, update } = useSession;
//     const router = useRouter;
//     const [form, setForm] = useState({})
//     const useEffect(() => {
//          console.log(session)
//            if (!session) {
//             router.push('/login')
//         }
//         else {
//             getData()
//         }
//     }, [])
    
//     const getData = async () => {
//         let u = await fetchuser(session.user.email);

//     const handleChange = (e) => {
//         setForm({...form,[e.target.name]: e.target.value})
//     }
//     const handleSubmit = async (e) => {
    
//         let a = await updateProfile(e,session.user.name);
//         toast('Profile Updated',{
//              position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "light",
//             transition: Bounce,
//     })
//     }

//   return (
//     <>
//         <ToastConatainer
//             position="top-right"
//             autoClose={5000}
//             hideProgressBar={false}
//             newOnTop={false}
//             closeOnClick
//             pauseOnHover
//             pauseOnFocusLoss
//             rt1 = {false}
//             draggable
//             progress={undefined}
//             theme="light"
//             transition={Bounce}
//         />
//         <ToastContainer />
//         <div className='container px-6 py-5 mx-auto '>
//                 <h1 className='my-5 text-3xl font-bold text-center'>Welcome to your Dashboard</h1>

//                 <form className="max-w-2xl mx-auto" action={handleSubmit}>

//                     <div className='my-2'>
//                         <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
//                         <input value={form.name ? form.name : ""} onChange={handleChange} type="text" name='name' id="name" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>
//                     {/* input for email */}
//                     <div className="my-2">
//                         <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
//                         <input value={form.email ? form.email : ""} onChange={handleChange} type="email" name='email' id="email" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>
//                     {/* input forusername */}
//                     <div className='my-2'>
//                         <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
//                         <input value={form.username ? form.username : ""} onChange={handleChange} type="text" name='username' id="username" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>
//                     {/* input for profile picture of input type text */}
//                     <div className="my-2">
//                         <label htmlFor="profilepic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Picture</label>
//                         <input value={form.profilepic ? form.profilepic : ""} onChange={handleChange} type="text" name='profilepic' id="profilepic" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>

//                     {/* input for cover pic  */}
//                     <div className="my-2">
//                         <label htmlFor="coverpic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cover Picture</label>
//                         <input value={form.coverpic ? form.coverpic : ""} onChange={handleChange} type="text" name='coverpic' id="coverpic" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>
//                     {/* input razorpay id */}
//                     <div className="my-2">
//                         <label htmlFor="razorpayid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Id</label>
//                         <input value={form.razorpayid ? form.razorpayid : ""} onChange={handleChange} type="text" name='razorpayid' id="razorpayid" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>
//                     {/* input razorpay secret */}
//                     <div className="my-2">
//                         <label htmlFor="razorpaysecret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razorpay Secret</label>
//                         <input value={form.razorpaysecret ? form.razorpaysecret : ""} onChange={handleChange} type="text" name='razorpaysecret' id="razorpaysecret" className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
//                     </div>

//                     {/* Submit Button  */}
//                     <div className="my-6">
//                         <button type="submit" className="block w-full p-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none dark:focus:ring-blue-800">Save</button>
//                     </div>
//                 </form>


//             </div>
//     </>
//   )
// }
// }
// export default Dashboard;