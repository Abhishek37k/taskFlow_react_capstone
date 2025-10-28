import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white text-gray-900 shadow-sm p-4",
        className
      )}
      {...props}
    />
  );
}

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("mb-2", className)} {...props} />
);
export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold", className)} {...props} />
);
export const CardContent = ({ className, ...props }) => (
  <div className={cn("text-sm", className)} {...props} />
);
export const CardFooter = ({ className, ...props }) => (
  <div className={cn("mt-4", className)} {...props} />
);
