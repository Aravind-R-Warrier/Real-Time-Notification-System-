export default function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white">
      {count}
    </span>
  );
}
