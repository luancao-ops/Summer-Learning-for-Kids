type BadgeListProps = {
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
};

export function BadgeList({ badges }: BadgeListProps) {
  if (badges.length === 0) {
    return (
      <p className="rounded-[8px] p-4 text-sm font-bold text-slate-500" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
        Chưa có huy hiệu. Hoàn thành một bài học để mở huy hiệu đầu tiên nhé.
      </p>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {badges.map((badge) => (
        <div key={badge.id} className="rounded-[8px] p-4 shadow-sm" style={{ backgroundColor: "#ffffff", color: "#1e1b4b" }}>
          <div className="text-3xl">{badge.icon}</div>
          <h3 className="mt-2 font-black">{badge.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
