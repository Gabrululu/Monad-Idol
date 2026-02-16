import { useState } from 'react';
import toastUtil from '../utils/toast';
import Spinner from './Loading/Spinner';
import { trackProjectSubmit } from '../utils/analytics';

export default function SubmitProject({ contracts, account }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        githubUrl: '',
        metadataURI: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contracts.registry) {
            toastUtil.error('Please connect your wallet first!');
            return;
        }

        try {
            setSubmitting(true);
            setSuccess(false);

            console.log('Submitting project:', formData);

            const tx = await contracts.registry.submitProject(
                formData.name,
                formData.description,
                formData.githubUrl,
                formData.metadataURI || 'ipfs://placeholder'
            );

            console.log('Transaction sent:', tx.hash);
            toastUtil.info('Transaction sent! Waiting for confirmation...');

            await tx.wait();
            console.log('Transaction confirmed!');

            setSuccess(true);
            setFormData({
                name: '',
                description: '',
                githubUrl: '',
                metadataURI: ''
            });

            toastUtil.success('🎉 Project submitted! AI evaluation starting...');

            // Track project submission
            trackProjectSubmit(formData.name);
        } catch (error) {
            console.error('Error submitting project:', error);
            toastUtil.error(error.message || 'Failed to submit project. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 gradient-text">✨ Submit Your Project</h2>

            {success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                    <p className="text-green-300">
                        ✅ Project submitted successfully! Claude AI will evaluate it shortly.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-2">Project Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="My Awesome AI Agent"
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your AI agent project, what it does, and why it's innovative..."
                        className="input-field min-h-[120px]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">GitHub URL *</label>
                    <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Metadata URI (optional)
                    </label>
                    <input
                        type="text"
                        value={formData.metadataURI}
                        onChange={(e) => setFormData({ ...formData, metadataURI: e.target.value })}
                        placeholder="ipfs://... or https://..."
                        className="input-field"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Optional: IPFS or HTTP link to additional project metadata
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                >
                    {submitting ? '⏳ Submitting...' : '🚀 Submit Project'}
                </button>
            </form>

            <div className="mt-6 p-4 glass rounded-lg">
                <h3 className="font-semibold mb-2">📊 Evaluation Criteria</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                    <li>• <strong>Innovation</strong> (30 pts): Novel approach and creativity</li>
                    <li>• <strong>Technical Viability</strong> (30 pts): Feasibility and quality</li>
                    <li>• <strong>Potential Impact</strong> (20 pts): Value to ecosystem</li>
                    <li>• <strong>Presentation Clarity</strong> (20 pts): Documentation quality</li>
                </ul>
            </div>
        </div>
    );
}
