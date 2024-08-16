import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => {
    // Ensure value is within the range
    const progressValue = Math.max(0, Math.min(value, max));
    const progressPercent = (progressValue / max) * 100;

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn("relative h-1 w-full overflow-hidden rounded-full bg-secondary", className)}
            {...props}>
            <ProgressPrimitive.Indicator
                className="h-full bg-fuchsia-600 transition-all"
                style={{ width: `${progressPercent}%` }} />
        </ProgressPrimitive.Root>
    );
});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
