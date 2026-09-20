type CommentDeleteConfirmationProps = {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CommentDeleteConfirmation({
  isDeleting,
  onCancel,
  onConfirm,
}: CommentDeleteConfirmationProps) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-surface-hover/30 px-3 py-2">
      <span className="mr-auto text-xs text-muted-foreground">
        Delete this comment?
      </span>

      <button
        type="button"
        onClick={onCancel}
        disabled={isDeleting}
        className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onConfirm}
        disabled={isDeleting}
        className="text-xs font-semibold text-destructive transition-colors hover:text-destructive/80 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  );
}
