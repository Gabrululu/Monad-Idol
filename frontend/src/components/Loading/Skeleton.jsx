export default function Skeleton({ variant = 'card', count = 1 }) {
    const variants = {
        card: (
            <div className="glass p-6 rounded-xl animate-pulse">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg" />
                    <div className="flex-1">
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-700 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-700 rounded w-5/6" />
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <div className="h-8 bg-gray-700 rounded w-20" />
                    <div className="h-8 bg-gray-700 rounded w-24" />
                </div>
            </div>
        ),
        text: (
            <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-700 rounded w-4/6" />
            </div>
        ),
        avatar: (
            <div className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-700 rounded-full" />
                <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-24" />
                </div>
            </div>
        ),
    };

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>{variants[variant]}</div>
            ))}
        </div>
    );
}
