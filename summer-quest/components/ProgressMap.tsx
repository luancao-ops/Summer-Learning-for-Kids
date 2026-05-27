type ProgressMapProps = {
  items: {
    label: string;
    completed: number;
    total: number;
    percent: number;
  }[];
};

export function ProgressMap({ items }: ProgressMapProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-sm font-black">
            <span>{item.label}</span>
            <span>
              {item.completed}/{item.total}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
