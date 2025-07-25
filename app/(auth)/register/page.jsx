"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { Toaster, toast } from "@/components/ui/sonner";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields", {
        description: "Email and password are required"
      });
      return;
    }

    if (name.length < 3) {
      toast.error("Name must be at least 3 characters long", {
        description: "Please enter a valid name"
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address", {
        description: "Email format is invalid"
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    axios.post('/api/auth/register', {
      name,
      email,
      password
    })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Account created successfully", {
            description: "Thank you for signing up!"
          });

          signIn('credentials', {
            email,
            password,
            redirect: false
          }).then((res) => {
            if (res?.error) {
              toast.error("Fail to Login", {
                description: "Please Login manually to your account"
              });
            } else {
              toast.success("Logged in successfully", {
                description: "Welcome back!"
              });
              localStorage.setItem('user', JSON.stringify(res?.user));
              router.push('/home');
            }
          });
        } else {
          toast.error("Something went wrong", {
            description: "Please try again later"
          });
        }
      })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-blue-200 flex items-center justify-center p-4">
      <Toaster position='top-center' richColors closeButton={false} />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create an account
            </h1>
            <p className="text-sm text-gray-500">
              Enter your details to create a new account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="name"
                  placeholder="eg. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 py-6 bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-purple-500 hover:border-gray-300 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-6 bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-purple-500 hover:border-gray-300 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-6 bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-purple-500 hover:border-gray-300 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Sign up
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-4">
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
