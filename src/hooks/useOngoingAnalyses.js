import { useState, useEffect } from 'react';
import { getOngoingAnalyses } from '../services/api';

const POLL_INTERVAL = 5000; // 5 seconds

export function useOngoingAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const fetchAnalyses = async () => {
      try {
        const data = await getOngoingAnalyses();
        if (mounted && Array.isArray(data)) {
          setAnalyses(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setAnalyses([]); // Clear analyses on error
        }
      } finally {
        if (mounted) {
          timeoutId = setTimeout(fetchAnalyses, POLL_INTERVAL);
        }
      }
    };

    fetchAnalyses();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return { analyses, error };
}
