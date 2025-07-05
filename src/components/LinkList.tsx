import React, { useState } from 'react';
import { GripVertical, ExternalLink, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import type { LinkItem } from '../types';

interface LinkListProps {
  links: LinkItem[];
  onReorderLinks: (links: LinkItem[]) => void;
  onRemoveLink: (id: string) => void;
}

export function LinkList({ links, onReorderLinks, onRemoveLink }: LinkListProps) {
  const { t } = useTranslation();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDraggedItem(linkId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(linkId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = links.findIndex(link => link.id === draggedItem);
    const targetIndex = links.findIndex(link => link.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...links];
    const [movedItem] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, movedItem);

    onReorderLinks(newLinks);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleImageError = (linkId: string) => {
    setImageErrors(prev => new Set([...prev, linkId]));
  };

  const getImageSrc = (link: LinkItem) => {
    if (imageErrors.has(link.id)) {
      // Fallback to Google favicon service
      return `https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`;
    }
    return link.favicon;
  };

  const isLargeImage = (link: LinkItem) => {
    // Check if this looks like an OG image (typically larger)
    return link.ogImage && link.favicon === link.ogImage && !imageErrors.has(link.id);
  };

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string) => {
    if (!text) return text;
    
    // First try the textarea method for comprehensive decoding
    try {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
    } catch {
      // Fallback to manual decoding if textarea method fails
      return text
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#x3C;/g, '<')
        .replace(/&#x3E;/g, '>')
        .replace(/&#x26;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec)))
        .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    }
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <ExternalLink className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">{t.links.noLinksYet}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t.links.addFirstLink}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-teal-500">{t.links.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.links.dragToReorder}</p>
      </div>
      
      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => handleDragStart(e, link.id)}
            onDragOver={(e) => handleDragOver(e, link.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, link.id)}
            onDragEnd={handleDragEnd}
            className={`group flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
              draggedItem === link.id ? 'opacity-50 scale-95' : ''
            } ${
              dragOverItem === link.id ? 'border-teal-500 shadow-lg' : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Drag Handle */}
            <button className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <GripVertical className="w-4 h-4" />
            </button>

            {/* Image/Favicon */}
            <div className="flex-shrink-0">
              {isLargeImage(link) ? (
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <img
                    src={getImageSrc(link)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(link.id)}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <img
                    src={getImageSrc(link)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(link.id)}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {decodeHtmlEntities(link.title)}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {decodeHtmlEntities(link.description || link.url)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                {link.url}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-teal-500 transition-colors"
                title={t.links.openLink}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => onRemoveLink(link.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title={t.links.removeLink}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}