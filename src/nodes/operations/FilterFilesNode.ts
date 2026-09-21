import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

export class FilterFilesNode extends BaseNode {
    readonly typeId = 'fs-filter-files';
    readonly displayName = 'Filter Files';
    readonly category = { name: 'Operations', accent: 'sky-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Files', acceptsType: 'fs:path-array' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Filtered Files', outputType: 'fs:path-array' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'extension', label: 'Extension filter (e.g. .csv)', type: 'text' as const, defaultValue: '' }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const files = inputs['Files'];
        const extension = properties['extension'] as string;
        
        if (!Array.isArray(files)) return { 'Filtered Files': [] };
        if (!extension) return { 'Filtered Files': files };
        
        const filtered = files.filter(f => String(f).endsWith(extension));
        return { 'Filtered Files': filtered };
    }
}
