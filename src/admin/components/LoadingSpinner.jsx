import { LoaderCircle } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="grid h-[200px] place-items-center text-zinc-600">
      <span className="animate-spin">
        <LoaderCircle size="50" />
      </span>
    </div>
  );
}

export default LoadingSpinner;
