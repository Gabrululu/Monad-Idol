import { modal } from '../config/reown';

export default function Header({ account }) {
    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleConnect = () => {
        if (modal) {
            modal.open();
        }
    };

    return (
        <header className="glass border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎤</span>
                    <h1 className="text-2xl font-bold gradient-text">Monad Idol</h1>
                </div>

                {account ? (
                    <div className="flex items-center gap-4">
                        <div className="glass px-4 py-2 rounded-lg">
                            <span className="text-sm text-gray-400">Connected:</span>
                            <span className="ml-2 font-mono font-semibold">{formatAddress(account)}</span>
                        </div>
                        <button onClick={handleConnect} className="btn-primary">
                            Account
                        </button>
                    </div>
                ) : (
                    <button onClick={handleConnect} className="btn-primary">
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
}
