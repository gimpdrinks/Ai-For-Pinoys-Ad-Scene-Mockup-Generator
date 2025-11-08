import React from 'react';

interface CreditTrackerProps {
  credits: number;
}

const CreditTracker: React.FC<CreditTrackerProps> = ({ credits }) => {
  if (credits > 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-slate-300">
          You have <span className="font-bold text-2xl text-sky-400">{credits}</span> free credit{credits !== 1 ? 's' : ''} remaining today.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 rounded-lg p-4 text-center" role="alert">
      <p className="font-bold">You are currently on a FREE PLAN.</p>
      <p>You've used your 5 free credits for today! Your 5 credits will refresh tomorrow.</p>
    </div>
  );
};

export default CreditTracker;
