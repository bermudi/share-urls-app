import { useState, useEffect } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { generateShortUrl } from '../utils/urlUtils';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bundle } from '../types';

interface PublishButtonProps {
  bundle: Partial<Bundle>;
  canPublish: boolean;
  onPublish: (shareUrl: string) => Promise<string>;
  reset?: boolean;
}

export function PublishButton({ bundle, canPublish, onPublish, reset }: PublishButtonProps) {
  const { t } = useTranslation();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Reset component state when reset prop changes
  useEffect(() => {
    if (reset) {
      setIsPublished(false);
      setShareUrl('');
      setCopied(false);
    }
  }, [reset]);

  const handlePublish = async () => {
    if (!bundle.vanityUrl && !bundle.links?.length) {
      console.error('Cannot publish: No links in bundle');
      return;
    }

    setIsPublishing(true);
    try {
      // Generate a temporary URL for immediate feedback
      const tempUrl = generateShortUrl(bundle.vanityUrl || '');
      console.log('Temporary URL for UI:', tempUrl);
      setShareUrl(tempUrl);

      // Call onPublish to handle the publishing and get the final URL
      const finalUrl = await onPublish(tempUrl);

      if (!finalUrl) {
        throw new Error('Failed to get final URL from server');
      }

      console.log('Final published URL:', finalUrl);
      setShareUrl(finalUrl);
      setIsPublished(true);
      toast.success('Bundle successfully published!');
    } catch (error) {
      console.error('Failed to publish:', error);
      // Show error to user with toast notification
      toast.error(`Failed to publish: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShareUrl('');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleVisit = () => {
    window.open(shareUrl, '_blank');
    toast.info('Opening link in new tab');
  };

  return (
    <AnimatePresence mode="wait">
      {!isPublished ? (
        <motion.button
          key="publish-button"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={handlePublish}
          disabled={!canPublish || isPublishing}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Share2 className="w-4 h-4" />
          <span>{isPublishing ? t.main.publishing : t.main.publish}</span>
        </motion.button>
      ) : (
        <motion.div
          key="success-state"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200, ease: 'easeInOut' }} // Softer spring with easing
          className="space-y-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeInOut' }} // Smoother scale-up with easing
            className="flex items-center space-x-2 text-green-600 dark:text-green-400"
          >
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.2 }} // Slower, smoother rotation
            >
              <Check className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">{t.main.publishedSuccess}</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", damping: 30 }} // Delayed, softer entrance
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.main.publishedLiveAt}</p>
            <div className="flex items-center space-x-2">
              <motion.code
                initial={{ width: "80%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.4, ease: 'easeInOut' }} // Smoother width expansion with easing
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white font-mono"
              >
                {shareUrl}
              </motion.code>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3, ease: 'easeInOut' }} // Delayed fade-in
                onClick={handleCopy}
                className="p-2 text-gray-500 hover:text-teal-500 transition-colors"
                title={t.main.copyToClipboard}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </motion.button>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3, ease: 'easeInOut' }} // Further delayed for sequencing
                onClick={handleVisit}
                className="p-2 text-gray-500 hover:text-teal-500 transition-colors"
                title={t.main.visitBundle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}