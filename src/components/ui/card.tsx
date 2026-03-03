"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "gradient-border" | "elevated" | "hero" | "accent-top" | "accent-left" | "glass";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    "bg-white border border-primary-200/30 shadow-warm hover:shadow-warm-md transition-all duration-300",
  "gradient-border":
    "gradient-border bg-white shadow-warm hover:shadow-warm-md transition-all duration-300",
  elevated:
    "bg-white border border-primary-200/30 shadow-warm-md hover:shadow-warm-lg transition-all duration-300",
  hero:
    "bg-gradient-hero-animated text-white border-none shadow-warm-xl overflow-hidden",
  "accent-top":
    "accent-stripe-top bg-white border border-primary-200/30 shadow-warm hover:shadow-warm-md transition-all duration-300",
  "accent-left":
    "accent-stripe-left bg-white border border-primary-200/30 shadow-warm hover:shadow-warm-md transition-all duration-300",
  glass:
    "glass shadow-warm-md",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animate = true, variant = "default", children, ...props }, ref) => {
    const content = (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );

    if (!animate) return content;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] as const }}
      >
        {content}
      </motion.div>
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-heading text-lg text-text-deep", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-text-secondary mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 flex items-center gap-2", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
