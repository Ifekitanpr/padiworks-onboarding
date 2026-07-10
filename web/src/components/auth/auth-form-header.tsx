export function AuthFormHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-4 text-center">
      <h1 className="text-[32px] leading-[1.2] font-bold tracking-tight text-brand-grey-900">
        {title}
      </h1>
      {description && (
        <p className="text-sm leading-relaxed text-brand-grey-500">
          {description}
        </p>
      )}
    </div>
  );
}
