type BadgeVariant = "orange" | "black" | "gray" | "green" | "red";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  orange: "bg-[#fb923c]/15 text-[#fb923c] border border-[#fb923c]/30 backdrop-blur-sm",
  black: "bg-white/10 text-white border border-white/15 backdrop-blur-sm",
  gray: "bg-white/5 text-gray-400 border border-white/10 backdrop-blur-sm",
  green: "bg-green-500/15 text-green-400 border border-green-500/30 backdrop-blur-sm",
  red: "bg-red-500/15 text-red-400 border border-red-500/30 backdrop-blur-sm",
};

export default function Badge({
  children,
  variant = "orange",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1
        text-xs font-medium font-[var(--font-dm-mono)] uppercase tracking-wide rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

