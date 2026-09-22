import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

export class FilterFilesNode extends BaseNode {
    readonly typeId = 'fs-filter-files';
    readonly displayName = 'Filter Files';
    readonly category = { name: 'Operations', accent: 'sky-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Files', acceptsType: 'core:path-array' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Filtered Files', outputType: 'core:path-array' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'extension', label: 'Extension filter (e.g. .csv)', type: 'text' as const, defaultValue: '' },
        { name: 'onlyDirectories', label: 'Only Directories', type: 'boolean' as const, defaultValue: false }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const files = inputs['Files'];
        const extension = properties['extension'] as string;
        const onlyDirectories = properties['onlyDirectories'] as boolean;

        if (!Array.isArray(files)) return { 'Filtered Files': [] };
        if (!extension && !onlyDirectories) return { 'Filtered Files': files };

        const results = await Promise.all(files.map(async (f: string) => {
            if (extension && !f.endsWith(extension)) {
                return false;
            }
            if (onlyDirectories) {
                try {
                    const stat = await traceReactive.fs.stat(f);
                    return stat.isDirectory;
                } catch {
                    return false;
                }
            }
            return true;
        }));

        const filtered = files.filter((_, index) => results[index]);

        return { 'Filtered Files': filtered };
    }
}
