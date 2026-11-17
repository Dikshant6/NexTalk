
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatListSkeleton() {
    return (
        <div className="space-y-1 px-3 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl p-3"
                >
                    {/* Avatar placeholder */}
                    <Skeleton className="size-11 shrink-0 rounded-full bg-[#EAE6DC]" />

                    {/* Name and message placeholders */}
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <Skeleton className="h-3 w-24 bg-[#EAE6DC]" />
                            <Skeleton className="h-2 w-8 bg-[#EAE6DC]" />
                        </div>

                        <Skeleton className="h-2.5 w-3/4 bg-[#EAE6DC]" />
                    </div>
                </div>
            ))}
        </div>
    );
}
