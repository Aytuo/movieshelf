type CommentEditFormProps = {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSaving: boolean;
};

export function CommentEditForm({
  value,
  onChange,
  onCancel,
  onSubmit,
  isSaving,
}: CommentEditFormProps) {
  return (
    <div className="mt-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        autoFocus
        disabled={isSaving}
        className="w-full resize-none rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 text-foreground transition-colors outline-none focus:border-primary/50 disabled:opacity-60"
      />

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSaving || value.trim().length === 0}
          className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
