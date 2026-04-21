import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0f172a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 md:p-10 rounded-3xl glass shadow-2xl z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500/10 text-primary-500 mb-6"
          >
            <LogIn size={32} />
          </motion.div>
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent underline-offset-8 decoration-primary-500/30">
            Welcome Back
          </h1>
          <p className="text-slate-400 font-medium">Please enter your credentials to log in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) clearError();
            }}
            icon={<Mail size={20} />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) clearError();
            }}
            icon={<Lock size={20} />}
            required
          />

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <Button 
            type="submit" 
            isLoading={isSubmitting} 
            className="w-full h-14 text-base"
          >
            Start Managing <ArrowRight className="ml-2 ring-1 rounded-full p-0.5" size={18} />
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/30"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
