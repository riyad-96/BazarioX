import { Bug, MessageCircleMore, Telescope } from 'lucide-react';

function GetSvg({ name, size = '16' }) {
  if (name === 'feedback') return <MessageCircleMore size={size} />;
  if (name === 'feature') return <Telescope size={size} />;
  if (name === 'report') return <Bug size={size} />;
  return <span className="text-xs">not found</span>;
}

export default GetSvg;
