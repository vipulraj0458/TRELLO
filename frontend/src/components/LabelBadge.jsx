import React from 'react';
import Tooltip from './Tooltip';

const LABEL_MAP = {
  red: { color: 'bg-[#ef4444]', text: 'Urgent' },
  green: { color: 'bg-[#10b981]', text: 'Working' },
  blue: { color: 'bg-[#3b82f6]', text: 'Delayed' },
  yellow: { color: 'bg-[#f59e0b]', text: 'Optional' }
};

export default function LabelBadge({ type }) {
  const labelConfig = LABEL_MAP[type];
  if (!labelConfig) return null;

  return (
    <Tooltip text={labelConfig.text}>
      <div 
        className={`h-2.5 min-w-[3rem] cursor-pointer rounded-[3px] ${labelConfig.color} hover:brightness-110 transition-all`}
        aria-label={labelConfig.text}
      />
    </Tooltip>
  );
}
