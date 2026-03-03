import { Priority } from '../../types';

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
    { value: 1, label: 'Priority 1', color: 'text-red-500' },
    { value: 2, label: 'Priority 2', color: 'text-orange-500' },
    { value: 3, label: 'Priority 3', color: 'text-blue-500' },
    { value: 4, label: 'Priority 4', color: 'text-muted-foreground/40' },
];

export const PRIORITY_BADGE_COLORS: Record<number, string> = {
    1: 'text-red-600 bg-red-500/10',
    2: 'text-orange-500 bg-orange-500/10',
    3: 'text-blue-500 bg-blue-500/10',
    4: 'text-muted-foreground/50 bg-muted/50',
};

export const AVAILABLE_LABELS = [
    { id: 'l1', name: 'Work' },
    { id: 'l2', name: 'Personal' },
    { id: 'l3', name: 'Urgent' }
];

export const resolveLabelName = (labelId: string) => {
    const label = AVAILABLE_LABELS.find(l => l.id === labelId);
    return label ? label.name : 'Label';
};
