import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

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
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        autoFocus
        disabled={isSaving}
      />

      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={isSaving || value.trim().length === 0}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
