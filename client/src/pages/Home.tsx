import Calculator from '@/components/Calculator';

/**
 * Home page - displays the ProApteka bonus calculator
 * 
 * Design Philosophy: Modern Fintech Style
 * - Dark theme with purple and orange accents
 * - Glassmorphism effects for card elements
 * - Smooth animations and transitions
 * - Real-time calculations with visual feedback
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Calculator />
    </div>
  );
}
