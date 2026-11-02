'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';

type AuthInputProps = ComponentProps<typeof Input> & {
  icon: LucideIcon;
};

const AuthInput = ({
  icon: Icon,
  className,
  disabled,
  type = 'text',
  ...props
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500"
      />

      <Input
        {...props}
        disabled={disabled}
        type={isPassword && showPassword ? 'text' : type}
        className={cn(
          'h-12 border-white/10 bg-white/3 pl-11 text-white placeholder:text-zinc-500 focus-visible:border-primary focus-visible:ring-primary/20',
          isPassword && 'pr-11',
          className
        )}
      />

      {isPassword && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default AuthInput;
