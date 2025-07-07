import React, { useState } from 'react';
import {
  BookOpen, Video, FileText, Code, Search, Filter, Clock,
  Star, Check, Plus, Brain, Target, Globe, BookmarkPlus, Eye
} from 'lucide-react';
import playlistData from './playlist.json';

const ResourceDashboard = () => {
  const [selectedResources, setSelectedResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSelectedPanel, setShowSelectedPanel] = useState(false);

  const resources = playlistData.map((item, idx) => ({
    id: item.id || `yt-${idx}`,
    title: item.title,
    type: 'video',
    category: item.category,
    subject: item.subject || '',
    duration: item.duration,
    difficulty: item.difficulty || 'intermediate',
    rating: item.rating || 4.5,
    views: item.views,
    description: item.description || '',
    thumbnail: item.thumbnail,
    author: item.channel,
    tags: item.tags || [],
    estimatedStudyTime: item.estimatedStudyTime || 120,
    url: item.url
  }));

  const categories = {
    all: { name: 'All Categories', icon: Globe, color: 'text-gray-600' },
    programming: { name: 'Programming', icon: Code, color: 'text-blue-600' },
    aptitude: { name: 'Aptitude', icon: BookOpen, color: 'text-green-600' },
    verbal: { name: 'Verbal', icon: BookOpen, color: 'text-purple-600' },
    dsa: { name: 'DSA', icon: Code, color: 'text-teal-600' },
    technical: { name: 'Technical', icon: Brain, color: 'text-gray-700' },
    interview: { name: 'Interview Prep', icon: Target, color: 'text-orange-600' }
  };

  const types = { all: 'All Types', video: 'Videos' };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const typeIcons = { video: Video, document: FileText, course: BookOpen };

  const toggleResourceSelection = (resource) => {
    const isSelected = selectedResources.find((r) => r.id === resource.id);
    setSelectedResources((prev) =>
      isSelected ? prev.filter((r) => r.id !== resource.id) : [...prev, resource]
    );
  };

  const filteredResources = resources.filter((resource) => {
    const query = searchQuery.toLowerCase();
    return (
      (resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)) &&
      (categoryFilter === 'all' || resource.category === categoryFilter) &&
      (typeFilter === 'all' || resource.type === typeFilter)
    );
  });

  const ResourceCard = ({ resource }) => {
    const isSelected = selectedResources.find((r) => r.id === resource.id);
    const TypeIcon = typeIcons[resource.type];
    const CatIcon = categories[resource.category]?.icon || Globe;

    return (
      <div
        className={`bg-white rounded-xl shadow-sm border transition-all duration-300 relative overflow-hidden ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:shadow-md'
        }`}
      >
        {/* Thumbnail */}
        <div className="relative h-44 overflow-hidden rounded-t-xl">
          <img src={resource.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
          {/* Difficulty Badge */}
          <span
            className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${difficultyColors[resource.difficulty]} shadow-sm z-10`}
          >
            {resource.difficulty}
          </span>
          {/* Duration Badge */}
          <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded shadow-sm z-10">
            {resource.duration}
          </span>
          {/* Select Icon */}
          <button
            className={`absolute top-2 right-2 z-10 p-1 rounded-full shadow ${
              isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
            }`}
            onClick={() => toggleResourceSelection(resource)}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center gap-1">
              <TypeIcon className="w-4 h-4" />
              <CatIcon className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4" />
              {resource.rating}
            </div>
          </div>

          <h3 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2">
            <a href={resource.url} target="_blank" rel="noreferrer" className="hover:text-blue-600">
              {resource.title}
            </a>
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{resource.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>by {resource.author}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {resource.views}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              ~{resource.estimatedStudyTime} min
            </span>
            <button
              onClick={() => toggleResourceSelection(resource)}
              className={`px-4 py-1 text-sm rounded-full ${
                isSelected
                  ? 'bg-blue-500 text-white font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SelectedResourcesPanel = () => (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Selected Resources</h2>
          <button onClick={() => setShowSelectedPanel(false)} className="text-2xl text-gray-600">
            ×
          </button>
        </div>

        {selectedResources.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <BookmarkPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            No resources selected
          </div>
        ) : (
          <>
            {selectedResources.map((r) => (
              <div
                key={r.id}
                className="bg-gray-50 border rounded-lg p-4 mb-4 shadow-sm space-y-1"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm text-gray-900">{r.title}</p>
                  <button
                    className="text-red-500 font-bold"
                    onClick={() => toggleResourceSelection(r)}
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-500">{r.subject}</p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{r.duration}</span>
                  <span>~{r.estimatedStudyTime} min</span>
                </div>
              </div>
            ))}

            {/* Study Summary */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-6">
              <h4 className="text-blue-800 font-semibold text-sm mb-2">Study Summary</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="flex justify-between">
                  <span>Total Resources:</span>
                  <span>{selectedResources.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Study Time:</span>
                  <span>
                    {Math.ceil(
                      selectedResources.reduce((acc, r) => acc + r.estimatedStudyTime, 0) / 60
                    )}{' '}
                    hours
                  </span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
              🎯 Generate Goals
            </button>
            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg">
              🎯 Generate Timetable
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Resource Hub</h1>
          {selectedResources.length > 0 && (
            <button
              onClick={() => setShowSelectedPanel(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Selected ({selectedResources.length})
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {Object.entries(categories).map(([key, val]) => (
              <option value={key} key={key}>
                {val.name}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {Object.entries(types).map(([key, val]) => (
              <option value={key} key={key}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            No resources found.
          </div>
        )}

        {/* Right Panel */}
        {showSelectedPanel && <SelectedResourcesPanel />}
      </div>
    </div>
  );
};

export default ResourceDashboard;
