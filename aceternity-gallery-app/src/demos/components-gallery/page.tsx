"use client";

import React, { useState } from "react";
import { getAllItems, searchByQuery, getStats, UniversalRegistryItem } from "../../registry";

export default function ComponentsGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "component" | "section">("all");
  
  const stats = getStats();
  
  const getFilteredItems = (): UniversalRegistryItem[] => {
    let items = searchQuery ? searchByQuery(searchQuery) : getAllItems();
    
    if (filter !== "all") {
      items = items.filter(item => item.type === filter);
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Components & Sections Gallery
          </h1>
          <p className="text-lg text-gray-400 mb-6">
            מרכז שליטה מרכזי לכל הרכיבים והמקטעים במערכת
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-400">{stats.totalComponents}</div>
              <div className="text-gray-400">Base Components</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-400">{stats.totalSections}</div>
              <div className="text-gray-400">UI Sections</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-400">{stats.total}</div>
              <div className="text-gray-400">Total Items</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="חפש רכיבים או מקטעים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
          />
          
          <div className="flex gap-2">
            {["all", "component", "section"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as typeof filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
                }`}
              >
                {filterType === "all" ? "הכל" : 
                 filterType === "component" ? "רכיבים" : "מקטעים"}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={`${item.type}-${item.name}`}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  item.type === "component" 
                    ? "bg-gray-800 text-gray-400 border border-gray-700" 
                    : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}>
                  {item.type === "component" ? "Component" : "Section"}
                </div>
                <h3 className="font-semibold text-white">{item.name}</h3>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700">
                    +{item.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{item.path}</span>
                <button className="px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition-colors border border-gray-700">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">לא נמצאו תוצאות</div>
            <div className="text-gray-500 text-sm mt-2">נסה לשנות את החיפוש או הפילטר</div>
          </div>
        )}

      </div>
    </div>
  );
}