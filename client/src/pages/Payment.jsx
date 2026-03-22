import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const plans = [
  { id: 'Personal', name: 'Personal', price: 1, credits: 2, desc: 'Perfect for testing the waters.' },
  { id: 'Creator', name: 'Creator', price: 999, credits: 19, desc: 'Best for daily creators.', popular: true },
  { id: 'Business', name: 'Business', price: 3999, credits: 99, desc: 'For heavy power users and teams.' }
];

const Payment = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Helper function to load the Razorpay SDK script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (planId) => {
    if (!user) {
      toast.error("Please log in to purchase a plan!");
      return;
    }

    setLoadingPlan(planId);

    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Failed to load payment gateway. Check your internet connection.");
        setLoadingPlan(null);
        return;
      }

      const token = localStorage.getItem('token');

      // 2. Ask backend to create an order
      const { data } = await axios.post(
        'http://localhost:5000/api/user/pay',
        { planId },
        { headers: { token } }
      );

      if (!data.success) {
        toast.error(data.message);
        setLoadingPlan(null);
        return;
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure you have this in your frontend .env file!
        amount: data.order.amount,
        currency: data.order.currency,
        name: "promptVision",
        description: `${planId} Plan Purchase`,
        order_id: data.order.id,
        handler: async (response) => {
          // 4. On successful payment, verify with backend
          try {
            const verifyRes = await axios.post(
              'http://localhost:5000/api/user/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                credits: data.credits // Pass the credits to add
              },
              { headers: { token } }
            );

            if (verifyRes.data.success) {
              // Update React state and Local Storage instantly!
              setUser({ ...user, credits: verifyRes.data.credits });
              
              const storedUser = JSON.parse(localStorage.getItem('user'));
              storedUser.credits = verifyRes.data.credits;
              localStorage.setItem('user', JSON.stringify(storedUser));

              toast.success("Payment successful! Credits added to your account.");
              navigate('/generate');
            } else {
              toast.error(verifyRes.data.message);
            }
          } catch (error) {
            console.error(error);
            toast.error("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#ec4899", // promptVision Pink!
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error("An error occurred during payment initiation.");
    }

    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans flex flex-col">
      <div className="flex-grow flex flex-col items-center pt-40 pb-24 px-5">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-center">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-300">Plan</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-16 text-center max-w-2xl">
          Unlock premium features, faster generation times, and commercial rights.
        </p>

        {/* Updated to 3 Columns using grid-cols-1 md:grid-cols-3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`p-8 rounded-2xl border flex flex-col transition-all duration-300 ${
                plan.popular 
                  ? 'bg-zinc-900 border-pink-500/50 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(236,72,153,0.1)]' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 bg-gradient-to-r from-pink-600 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-b-lg uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
              <p className="text-sm text-zinc-500 mb-6">{plan.desc}</p>
              
              <div className="text-4xl font-extrabold text-white mb-6">
                ₹{plan.price}<span className={`text-lg font-medium ${plan.popular ? 'text-pink-400/70' : 'text-zinc-500'}`}>/pack</span>
              </div>
              
              <ul className={`space-y-4 mb-8 flex-1 ${plan.popular ? 'text-zinc-300' : 'text-zinc-400'}`}>
                <li className={`flex items-center gap-2 ${plan.popular ? 'text-pink-500' : ''}`}>
                  ✓ <span className={plan.popular ? 'text-zinc-200' : 'text-zinc-300'}>
                    <strong className="text-white">{plan.credits}</strong> Image Generations
                  </span>
                </li>
                <li className={`flex items-center gap-2 ${plan.popular ? 'text-pink-500' : ''}`}>✓ <span className={plan.popular ? 'text-zinc-200' : 'text-zinc-300'}>4K Resolution Exports</span></li>
                <li className={`flex items-center gap-2 ${plan.popular ? 'text-pink-500' : ''}`}>✓ <span className={plan.popular ? 'text-zinc-200' : 'text-zinc-300'}>Commercial Usage Rights</span></li>
              </ul>
              
              <button 
                onClick={() => handlePayment(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-3 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white hover:from-pink-500 hover:to-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {loadingPlan === plan.id ? "Processing..." : "Subscribe Now"}
              </button>
            </div>
          ))}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;