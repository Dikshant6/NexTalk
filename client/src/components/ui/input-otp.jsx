import * as React from "react"
import { cn } from "cn"
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp"
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-12 w-11 sm:h-14 sm:w-12 items-center justify-center rounded-md border border-[#DCD7CC] bg-transparent text-lg sm:text-xl font-medium text-[#22231F] transition-all outline-none",
        "data-[active=true]:border-[#22231F] data-[active=true]:ring-2 data-[active=true]:ring-[#777A62]/30",
        "aria-invalid:border-red-600 data-[active=true]:aria-invalid:border-red-600 data-[active=true]:aria-invalid:ring-red-600/20",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-[#22231F] duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({
  className,
  ...props
}) {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn("flex items-center px-1 text-[#777A62]", className)}
      role="separator"
      {...props}
    >
      <MinusIcon className="size-4" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, REGEXP_ONLY_DIGITS }

