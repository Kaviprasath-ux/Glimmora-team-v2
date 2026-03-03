"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gradient-to-r from-primary to-primary-dark text-text-inverse shadow-warm-sm hover:from-primary-dark hover:to-primary active:shadow-warm-sm",
  secondary:
    "bg-gradient-to-r from-secondary to-[#6E7F5A] text-text-inverse shadow-warm-sm hover:from-[#6E7F5A] hover:to-secondary",
  outline:
    "border border-primary/25 text-primary hover:bg-gradient-warm-subtle",
  ghost: "text-primary active:bg-primary/8 hover:bg-primary/5",
  danger: "bg-gradient-to-r from-error to-[#D4705F] text-text-inverse hover:from-[#D4705F] hover:to-error",
};

const sizes = {
  sm: "h-8 px-3 text-sm rounded-[var(--radius-sm)]",
  md: "h-10 px-5 text-sm rounded-[var(--radius)]",
  lg: "h-12 px-7 text-base rounded-[var(--radius-md)]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
        <Comp
          className={cn(
            "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
            variants[variant],
            sizes[size],
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  },
);
Button.displayName = "Button";

export { Button };
