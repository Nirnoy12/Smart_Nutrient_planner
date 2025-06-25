import React, { useCallback, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Webcam from 'react-webcam';
import { Camera, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useStore } from '@/lib/store';
import { analyzeFoodImage } from '@/lib/ai';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CameraModal({ isOpen, onClose }: CameraModalProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addMeal } = useStore();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageData(imageSrc);
    }
  }, [webcamRef]);

  const handleAnalyze = async () => {
    if (!imageData) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodImage(imageData);
      if (result) {
        await addMeal({
          id: crypto.randomUUID(),
          userId: 'user-id',
          name: result.items.map(item => item.name).join(', '),
          calories: result.totalCalories,
          imageUrl: imageData,
          createdAt: new Date().toISOString(),
          items: result.items,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl glass-card p-6">
          <Dialog.Title className="text-xl font-semibold text-emerald-800 mb-4">
            Take a photo of your meal
          </Dialog.Title>
          <Dialog.Close className="absolute right-4 top-4 text-emerald-600 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </Dialog.Close>

          <div className="mt-4">
            {!imageData ? (
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <img
                  src={imageData}
                  alt="Captured meal"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 flex justify-center space-x-4">
              {!imageData ? (
                <Button 
                  onClick={capture}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              ) : (
                <>
                  <Button onClick={() => setImageData(null)} variant="outline">
                    Retake
                  </Button>
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}