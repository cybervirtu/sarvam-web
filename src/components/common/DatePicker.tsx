import React, { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, isValid, parse } from "date-fns";
import { cn } from "../../lib/utils";
import { Calendar } from "./Calendar";

export interface DatePickerProps {
    value?: string | null; // expected "YYYY-MM-DD" or null
    onChange: (date: string | null) => void;
    placeholder?: string;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder = "DD-MM-YYYY",
    className,
}) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Sync input value with prop value
    useEffect(() => {
        if (value) {
            try {
                const date = parseISO(value);
                if (isValid(date)) {
                    setInputValue(format(date, "dd-MM-yyyy"));
                }
            } catch (e) {
                setInputValue(value);
            }
        } else {
            setInputValue("");
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        if (!inputValue) {
            onChange(null);
            return;
        }

        // Try to parse DD-MM-YYYY
        const parsedDate = parse(inputValue, "dd-MM-yyyy", new Date());
        if (isValid(parsedDate)) {
            onChange(format(parsedDate, "yyyy-MM-dd"));
        } else {
            // Reset to current prop value if invalid
            if (value) {
                setInputValue(format(parseISO(value), "dd-MM-yyyy"));
            } else {
                setInputValue("");
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleInputBlur();
            setOpen(false);
        }
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <div className={cn("relative flex items-center group overflow-hidden border border-border/50 rounded-lg hover:border-primary/50 transition-colors bg-background/50", className)}>
                <div className="flex items-center flex-1 px-3 py-1.5 h-full">
                    <Popover.Trigger asChild>
                        <button
                            type="button"
                            className="p-1 -ml-1 mr-1 rounded-md text-primary hover:bg-primary/10 transition-colors shrink-0"
                            onClick={() => setOpen(true)}
                        >
                            <CalendarIcon className="w-3.5 h-3.5 opacity-70" />
                        </button>
                    </Popover.Trigger>

                    <Popover.Anchor asChild>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setOpen(true)}
                            onClick={() => setOpen(true)}
                            placeholder={placeholder}
                            className="bg-transparent border-none outline-none text-xs font-medium w-full placeholder:text-muted-foreground/50"
                        />
                    </Popover.Anchor>
                </div>

                {value && (
                    <div className="relative z-10 flex items-center pr-1">
                        <button
                            type="button"
                            title="Clear date"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onChange(null);
                            }}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            <Popover.Portal>
                <Popover.Content
                    className="z-[100] animate-in fade-in zoom-in-95 duration-200"
                    sideOffset={5}
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()} // Don't steal focus from input
                >
                    <Calendar
                        selected={value}
                        onSelect={(date) => {
                            onChange(date);
                            setOpen(false);
                        }}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};