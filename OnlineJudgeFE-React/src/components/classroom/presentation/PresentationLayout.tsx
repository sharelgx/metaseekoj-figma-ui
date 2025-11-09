import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid, Clock, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PresentationLayoutProps {
  children: React.ReactNode;
  totalSlides: number;
  currentSlide: number;
  onNavigate: (index: number) => void;
  slides: Array<{ title: string; thumbnail?: string }>;
}

export function PresentationLayout({
  children,
  totalSlides,
  currentSlide,
  onNavigate,
  slides
}: PresentationLayoutProps) {
  const [showOverview, setShowOverview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentSlide + 1) / totalSlides) * 100;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      onNavigate(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      onNavigate(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'g') {
        setShowOverview(!showOverview);
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, showOverview]);

  return (
    <div className="h-screen w-screen bg-slate-950 relative overflow-hidden">
      {/* Main Slide Area */}
      <div className="h-full w-full flex items-center justify-center p-8">
        {children}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1">
        <Progress value={progress} className="h-full rounded-none" />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 transition-opacity hover:opacity-100 opacity-60">
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <span className="text-white text-sm font-medium min-w-[80px] text-center">
          {currentSlide + 1} / {totalSlides}
        </span>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="text-white hover:bg-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowOverview(!showOverview)}
          className="text-white hover:bg-white/20"
        >
          <Grid className="w-5 h-5" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          className="text-white hover:bg-white/20"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>

        <div className="flex items-center gap-2 text-white/70 text-sm ml-2">
          <Clock className="w-4 h-4" />
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* Slide Number Indicator */}
      <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white/70 text-sm">
        {slides[currentSlide]?.title || `Slide ${currentSlide + 1}`}
      </div>

      {/* Overview Grid */}
      {showOverview && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl text-white">All Slides</h2>
              <Button
                onClick={() => setShowOverview(false)}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                Close (G)
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onNavigate(index);
                    setShowOverview(false);
                  }}
                  className={`aspect-video bg-slate-800 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    index === currentSlide
                      ? 'border-blue-500 ring-4 ring-blue-500/30'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-white/50 text-xs mb-2">#{index + 1}</span>
                    <span className="text-white text-sm">{slide.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white/50 text-xs space-y-1">
        <div>← → Navigate</div>
        <div>G Overview</div>
        <div>F Fullscreen</div>
      </div>
    </div>
  );
}
