'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';

const palettes = [
    { id: 'default', name: 'Default', className: '' },
    { id: 'red', name: 'Red', className: 'theme-red' },
    { id: 'green', name: 'Green', className: 'theme-green' },
    { id: 'blue', name: 'Blue', className: 'theme-blue' },
];

export function PalettePicker() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove(...palettes.map((p) => p.className).filter(Boolean));

        if (theme !== 'default') {
            root.classList.add(`theme-${theme}`);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
            {palettes.map((p) => (
                <div key={p.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                        value={p.id}
                        id={p.id}
                        className="border-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 relative flex h-6 w-10 items-center justify-center rounded-md border"
                    >
                        <span className="bg-primary absolute block h-3 w-3 rounded-full opacity-0 transition data-[state=checked]:opacity-100" />
                    </RadioGroupItem>
                    <Label htmlFor={p.id}>{p.name}</Label>
                </div>
            ))}
        </RadioGroup>
    );
}
