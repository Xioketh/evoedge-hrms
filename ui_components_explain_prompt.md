<!-- ui components explain -->
here are my HRM application base ui components:

src\components\ui\select.tsx::
"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "@/src/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex h-[35px] w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-[14px] text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}




src\components\ui\text.tsx:

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



=========

src\components\ui\input.tsx::

import * as React from "react"

import { cn } from "@/src/lib/utils"



export interface InputProps

  extends React.InputHTMLAttributes<HTMLInputElement> {}



const Input = React.forwardRef<HTMLInputElement, InputProps>(

  ({ className, type, ...props }, ref) => {

    return (

      <input

        type={type}

        className={cn(

          "flex h-[35px] w-full rounded-lg border border-input px-4 py-[14px] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",

          className

        )}

        ref={ref}

        {...props}

      />

    )

  }

)

Input.displayName = "Input"



export { Input }



===

src\components\ui\button.tsx::

import * as React from "react"

import { Slot } from "@radix-ui/react-slot"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"



const buttonVariants = cva(

  "inline-flex items-center justify-center rounded-lg whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",

  {

    variants: {

      variant: {

        default: "bg-secondary text-primary-foreground hover:bg-primary/90",

      },

      size: {

        // Matched to Figma: 40px height, 14px top/bottom, 16px left/right

        default: "h-[40px] px-4 py-[14px] text-text-2", 

        sm: "h-9 px-3",

        lg: "h-11 px-8",

        icon: "h-10 w-10",

      },

    },

    defaultVariants: {

      variant: "default",

      size: "default",

    },

  }

)



export interface ButtonProps

  extends React.ButtonHTMLAttributes<HTMLButtonElement>,

    VariantProps<typeof buttonVariants> {

  asChild?: boolean

}



const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(

  ({ className, variant, size, asChild = false, ...props }, ref) => {

    const Comp = asChild ? Slot : "button"

    return (

      <Comp

        className={cn(buttonVariants({ variant, size, className }))}

        ref={ref}

        {...props}

      />

    )

  }

)

Button.displayName = "Button"



export { Button, buttonVariants }

===

src\components\ui\card.tsx::

import * as React from "react"

import { cn } from "@/src/lib/utils"



const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div

      ref={ref}

      // Replaced standard shadow-sm with shadow-md to hit the exact Figma drop shadow

      className={cn("rounded-xl border bg-card text-card-foreground shadow-md", className)}

      {...props}

    />

  )

)

Card.displayName = "Card"



const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div

      ref={ref}

      className={cn("flex flex-col space-y-1.5 p-6", className)}

      {...props}

    />

  )

)

CardHeader.displayName = "CardHeader"



const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(

  ({ className, ...props }, ref) => (

    <h3

      ref={ref}

      className={cn("font-semibold leading-none tracking-tight text-text-3", className)}

      {...props}

    />

  )

)

CardTitle.displayName = "CardTitle"



const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(

  ({ className, ...props }, ref) => (

    <p

      ref={ref}

      className={cn("text-text-1 text-muted-foreground", className)}

      {...props}

    />

  )

)

CardDescription.displayName = "CardDescription"



const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />

  )

)

CardContent.displayName = "CardContent"



const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(

  ({ className, ...props }, ref) => (

    <div

      ref={ref}

      className={cn("flex items-center p-6 pt-0", className)}

      {...props}

    />

  )

)

CardFooter.displayName = "CardFooter"



export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }



