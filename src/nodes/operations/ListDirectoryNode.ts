import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

import { join } from '../../utils/PathUtils';

export class ListDirectoryNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-list-dir';
    readonly displayName = 'List Directory';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path', acceptsType: 'fs:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Files', outputType: 'fs:path-array' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p = inputs['Path'] ? String(inputs['Path']) : '';
        if (!p) return { 'Files': [] };
        
        try {
            const files = await traceReactive.fs.listDir(p);
            const absoluteFiles = files.map((f: string) => join(p, f));
            return { 'Files': absoluteFiles };
        } catch (err) {
            console.error('ListDirectory error', err);
            return { 'Files': [] };
        }
    }
}
