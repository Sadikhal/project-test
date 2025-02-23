
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
import { BsChevronRight } from "react-icons/bs"


const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("bg-bgColor data-[state=open]:bg-bgColor data-[state=open]:border-none  rounded-lg py-1 cursor-pointer", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex  py-2 w-full  justify-between transition-all [&[data-state=open]>svg]:rotate-90 cursor-pointer",
        className
      )}
      {...props}>
      {children}
<BsChevronRight  className='font-medium text-xl  shrink-0 text-[#292D32] transition-transform duration-200'/>
     
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className=" text-sm  data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down cursor-pointer "
    {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
