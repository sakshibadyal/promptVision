import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const plans = [
  { id: 'Personal', name: 'Personal', price: 99, credits: 2, desc: 'Perfect for testing the waters.' },
  { id: 'Creator', name: 'Creator', price: 999, credits: 19, desc: 'Best for daily creators.', popular: true },
  { id: 'Business', name: 'Business', price: 3999, credits: 99, desc: 'For heavy power users and teams.' }
];

const Payment = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

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

  const confirmPayment = window.confirm(`Confirm payment for ${planId} plan?`);

  if (!confirmPayment) {
    toast.info("Payment cancelled");
    return;
  }

  setLoadingPlan(planId);

  try {
    const token = localStorage.getItem('token');

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/dummy-pay`,
      { planId },
      { headers: { token } }
    );

    if (data.success) {
      setUser({ ...user, credits: data.credits });

      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.credits = data.credits;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }

      toast.success("Boom! Payment successful. Credits added.");
      navigate('/generate');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Payment failed.");
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
                ₹{plan.price}
                <span className={`text-lg font-medium ${plan.popular ? 'text-pink-400/70' : 'text-zinc-500'}`}>
                  /pack
                </span>
              </div>

              <ul className={`space-y-4 mb-8 flex-1 ${plan.popular ? 'text-zinc-300' : 'text-zinc-400'}`}>
                <li className={`flex items-center gap-2 ${plan.popular ? 'text-pink-500' : ''}`}>
                  ✓ <span className={plan.popular ? 'text-zinc-200' : 'text-zinc-300'}>
                    <strong className="text-white">{plan.credits}</strong> Image Generations
                  </span>
                </li>

                <li className={`flex items-center gap-2 ${plan.popular ? 'text-pink-500' : ''}`}>
                  ✓ <span className={plan.popular ? 'text-zinc-200' : 'text-zinc-300'}>4K Resolution Exports</span>
                </li>

                <li className={`flex items-center gap-2 ${plan.popular ? 'text-pink-500' : ''}`}>
                  ✓ <span className={plan.popular ? 'text-zinc-200' : 'text-zinc-300'}>Commercial Usage Rights</span>
                </li>
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