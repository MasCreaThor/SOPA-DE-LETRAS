
// src/hooks/useRealtime.ts
import { useState, useEffect } from 'react';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '@/lib/firebase';

interface UseRealtimeOptions {
  onError?: (error: Error) => void;
  transform?: (data: any) => any;
}

export function useRealtime<T>(
  path: string | null, 
  options: UseRealtimeOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const dataRef = ref(database, path);
      
      const handleData = (snapshot: DataSnapshot) => {
        try {
          const rawData = snapshot.val();
          
          if (rawData === null || rawData === undefined) {
            setData(null);
          } else if (options.transform) {
            setData(options.transform(rawData));
          } else {
            setData(rawData as T);
          }
        } catch (transformError) {
          const error = transformError instanceof Error 
            ? transformError 
            : new Error('Error al transformar datos');
          
          setError(error);
          
          if (options.onError) {
            options.onError(error);
          }
        } finally {
          setLoading(false);
        }
      };
      
      const handleError = (error: Error) => {
        setError(error);
        setLoading(false);
        
        if (options.onError) {
          options.onError(error);
        }
      };
      
      onValue(dataRef, handleData, handleError);
      
      // Limpiar la suscripción al desmontar
      return () => {
        off(dataRef, 'value', handleData);
      };
    } catch (setupError) {
      const error = setupError instanceof Error 
        ? setupError 
        : new Error('Error al configurar suscripción');
      
      setError(error);
      setLoading(false);
      
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [path, options.transform, options.onError]);
  
  return { data, loading, error };
}