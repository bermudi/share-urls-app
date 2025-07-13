import { useState } from 'react';
import { GripVertical, ExternalLink, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { decodeHtmlEntities } from '../utils/htmlUtils';
import type { LinkItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkListProps {
  links: LinkItem[];
  onReorderLinks: (links: LinkItem[]) => void;
  onRemoveLink: (id: string) => void;
}

export function LinkList({ links, onReorderLinks, onRemoveLink }: LinkListProps) {
  const { t } = useTranslation();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Handle reordering with Framer Motion
  const handleDragEnd = (linkId: string, info: any) => {
    setDraggingId(null);

    // Find the position where the item was dropped
    const draggedIndex = links.findIndex(link => link.id === linkId);
    if (draggedIndex === -1) return;

    // Calculate the new position based on the drag distance
    const dragDistance = info.offset.y;
    const itemHeight = 80; // Approximate height of each item in pixels
    const positionChange = Math.round(dragDistance / itemHeight);

    if (positionChange === 0) return; // No change in position

    const newIndex = Math.max(0, Math.min(links.length - 1, draggedIndex + positionChange));
    if (newIndex === draggedIndex) return; // No change in position

    // Create a new array with the reordered items
    const newLinks = [...links];
    const [movedItem] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(newIndex, 0, movedItem);

    onReorderLinks(newLinks);
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
        <AnimatePresence mode="popLayout">
          {links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, ease: 'easeInOut' }} // Smoother spring with easing
              layout
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2} // Slightly higher for smoother drag feel
              dragMomentum={false}
              onDragStart={() => setDraggingId(link.id)}
              onDragEnd={(_, info) => handleDragEnd(link.id, info)}
              className={`group flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${draggingId === link.id ? 'z-10 shadow-lg border-teal-500' : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'}`}
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}