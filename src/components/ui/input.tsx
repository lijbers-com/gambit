import * as React from "react"

import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { X } from 'lucide-react';
import { Button } from './button';

export interface InputDropdownOption {
  label: string;
  value: string;
}

interface InputDropdownProps {
  dropdown: true;
  options: InputDropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface InputStandardProps extends React.ComponentProps<"input"> {
  dropdown?: false;
  hint?: string;
}

type InputProps = InputDropdownProps | InputStandardProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    if (props.dropdown) {
      const { options, value, onChange, placeholder, className } = props;
      const selected = options.find(opt => opt.value === value);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
              )}
            >
              <span className={cn('flex-1 truncate flex items-center h-full', !selected && 'text-muted-foreground')}>{selected ? selected.label : placeholder}</span>
              <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-full min-w-[180px]">
            {options.map(opt => (
              <DropdownMenuItem key={opt.value} onSelect={() => onChange(opt.value)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    // Standard input
    const { dropdown, hint, ...rest } = props as InputStandardProps;
    return (
      <>
      <input
          ref={ref}
          {...rest}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            rest.className
        )}
      />
        {hint && (
          <div className="text-xs text-muted-foreground mt-1">{hint}</div>
        )}
      </>
    )
  }
)
Input.displayName = "Input"

// FileInput: file upload with preview, styled like the story
export interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  accept?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ label = 'File', hint, accept = 'image/png,image/jpeg,image/gif', onChange, ...props }) => {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    setFileName(null);
    setFileUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onChange) {
      // Create a synthetic event with empty files and fileName null
      const event = { ...new Event('change'), target: { files: [], fileName: null } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <label
        htmlFor={props.id || 'custom-file-upload'}
        className="block border border-dashed border-slate-200 rounded-lg bg-slate-50 p-6 text-slate-400 text-center text-base cursor-pointer select-none transition-colors hover:bg-slate-100"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          {fileUrl && (
            <img src={fileUrl} alt="Preview" className="max-h-40 max-w-xs rounded border mx-auto mb-2" />
          )}
          <span className="block text-[14px]">
            {fileName ? fileName : 'Drag an image here or upload a file'}
          </span>
          {fileName && (
            <div className="flex justify-center mt-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove();
                }}
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <input
          id={props.id || 'custom-file-upload'}
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={e => {
            const file = e.target.files?.[0];
            setFileName(file ? file.name : null);
            if (file && file.type.startsWith('image/')) {
              setFileUrl(URL.createObjectURL(file));
            } else {
              setFileUrl(null);
            }
            if (onChange) {
              // Attach fileName to the event for parent access
              (e.target as any).fileName = file ? file.name : null;
              onChange(e);
            }
          }}
        />
      </label>
      {hint && (
        <div className="mt-2 text-xs text-slate-500">{hint}</div>
      )}
    </div>
  );
};

export { Input }
