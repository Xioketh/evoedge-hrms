import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const textVariants = cva(
  "text-foreground m-0", // Base styles: default color, remove default margins
  {
    variants: {
      size: {
        "1": "text-text-1", // 14px, Medium
        "2": "text-text-2", // 16px, Regular
        "3": "text-text-3", // 24px, Semi Bold
        "4": "text-text-4", // 32px, Semi Bold
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "1",
      color: "default"
    },
  },
);

export interface TextProps
  extends
    Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, color, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "p";

    return (
      <Comp
        className={cn(textVariants({ size, color, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, textVariants };
