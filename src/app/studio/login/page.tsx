"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function StudioLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setAuthError("Invalid email or password. Please try again.");
      return;
    }
    router.push("/studio/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD400]/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 backdrop-blur-xl">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="absolute inset-0 bg-[#FFD400] rounded-2xl rotate-45" />
              <div className="absolute inset-1.5 bg-[#0A0A0A] rounded-lg rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-xl z-10">N</span>
            </div>
            <h1 className="text-2xl font-black text-white">NUUN Studio</h1>
            <p className="text-white/40 text-sm mt-1">Content Management System</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@nuun.so"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/70">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-12 px-4 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 transition-all text-sm"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {authError}
              </div>
            )}

            <Button type="submit" loading={isSubmitting} size="lg" className="w-full gap-2">
              <LogIn size={16} />
              Sign In to Studio
            </Button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            Secure access for authorized team members only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
