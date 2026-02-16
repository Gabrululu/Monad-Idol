import Spinner from './Spinner';

export default function LoadingOverlay({ message = 'Loading...', show = false }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="glass p-8 rounded-2xl text-center max-w-sm">
                <Spinner size="xl" />
                <p className="mt-4 text-lg font-semibold text-white">{message}</p>
            </div>
        </div>
    );
}
