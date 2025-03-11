type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

export default function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="group relative inline-block">
      <span className="inline-flex items-center">
        {children}
        <svg
          className="ml-1 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z"
          />
        </svg>
      </span>
      <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50">
        {text}
        <span className="absolute left-0 top-full w-3 h-3 -mt-1.5 ml-3 bg-gray-800 transform rotate-45"></span>
      </span>
    </span>
  );
}
