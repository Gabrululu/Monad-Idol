import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import ProjectCard from './ProjectCard';
import Skeleton from './Loading/Skeleton';
import SearchBar from './Filters/SearchBar';
import SortSelector from './Filters/SortSelector';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';
import { trackSearch, trackFilterChange, trackSortChange } from '../utils/analytics';

export default function ProjectList({ contracts, account }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, scored, unscored
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('score'); // score, newest, staked

    // Event handlers with analytics
    const handleSearch = (term) => {
        setSearchTerm(term);
        trackSearch(term);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        trackFilterChange('status', newFilter);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        trackSortChange(newSort);
    };

    useEffect(() => {
        loadProjects();
    }, [contracts.registry]);

    const loadProjects = async () => {
        if (!contracts.registry) return;

        try {
            setLoading(true);
            const allProjects = await contracts.registry.getAllProjects();

            // Convert BigInt to regular numbers for display
            const formatted = allProjects.map(p => ({
                id: Number(p.id),
                creator: p.creator,
                name: p.name,
                description: p.description,
                githubUrl: p.githubUrl,
                metadataURI: p.metadataURI,
                aiScore: Number(p.aiScore),
                totalStaked: ethers.formatEther(p.totalStaked),
                createdAt: Number(p.createdAt),
                funded: p.funded,
                active: p.active
            }));

            setProjects(formatted);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter, search, and sort projects
    const processedProjects = useMemo(() => {
        let result = [...projects];

        // Apply status filter
        if (filter === 'scored') {
            result = result.filter(p => p.aiScore > 0);
        } else if (filter === 'unscored') {
            result = result.filter(p => p.aiScore === 0);
        }

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term) ||
                p.creator.toLowerCase().includes(term)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.aiScore - a.aiScore;
                case 'newest':
                    return b.createdAt - a.createdAt;
                case 'staked':
                    return parseFloat(b.totalStaked) - parseFloat(a.totalStaked);
                default:
                    return 0;
            }
        });

        return result;
    }, [projects, filter, searchTerm, sortBy]);

    // Pagination
    const pagination = usePagination(processedProjects, 10);

    const sortOptions = [
        { value: 'score', label: '🏆 Highest Score' },
        { value: 'newest', label: '🆕 Newest First' },
        { value: 'staked', label: '💰 Most Staked' },
    ];

    if (loading) {
        return (
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-6">📋 All Projects</h2>
                <Skeleton variant="card" count={3} />
            </div>
        );
    }

    return (
        <div>
            {/* Header with filters */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold gradient-text mb-4">📋 All Projects</h2>

                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <SearchBar
                            onSearch={setSearchTerm}
                            placeholder="Search by name, description, or creator..."
                        />
                    </div>
                    <SortSelector
                        value={sortBy}
                        onChange={setSortBy}
                        options={sortOptions}
                    />
                </div>

                {/* Status filters */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-monad-purple' : 'glass hover:bg-white/20'
                            }`}
                    >
                        All ({projects.length})
                    </button>
                    <button
                        onClick={() => setFilter('scored')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'scored' ? 'bg-monad-purple' : 'glass hover:bg-white/20'
                            }`}
                    >
                        Scored ({projects.filter(p => p.aiScore > 0).length})
                    </button>
                    <button
                        onClick={() => setFilter('unscored')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'unscored' ? 'bg-monad-purple' : 'glass hover:bg-white/20'
                            }`}
                    >
                        Pending ({projects.filter(p => p.aiScore === 0).length})
                    </button>
                </div>
            </div>

            {/* Results info */}
            {searchTerm && (
                <div className="mb-4 text-sm text-gray-400">
                    Found <span className="font-semibold text-white">{processedProjects.length}</span> results for "{searchTerm}"
                </div>
            )}

            {/* Project list */}
            {pagination.currentItems.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-xl text-gray-300">
                        {searchTerm ? 'No projects found matching your search' : 'No projects found'}
                    </p>
                    <p className="text-gray-400 mt-2">
                        {searchTerm ? 'Try a different search term' : 'Be the first to submit a project!'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pagination.currentItems.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                contracts={contracts}
                                account={account}
                                onUpdate={loadProjects}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        pageSize={pagination.pageSize}
                        totalItems={pagination.totalItems}
                        startIndex={pagination.startIndex}
                        endIndex={pagination.endIndex}
                        onPageChange={pagination.goToPage}
                        onPageSizeChange={pagination.changePageSize}
                        hasNextPage={pagination.hasNextPage}
                        hasPreviousPage={pagination.hasPreviousPage}
                    />
                </>
            )}
        </div>
    );
}
