import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

declare const traceReactive: any;

export class ReadFileNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-read-file';
    readonly displayName = 'Read File';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path', acceptsType: 'fs:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Content', outputType: 'core:string' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p = inputs['Path'] ? String(inputs['Path']) : '';
        if (!p) return { 'Content': '' };
        
        try {
            const data = await traceReactive.fs.readFile(p);
            return { 'Content': data };
        } catch (err) {
            console.error('ReadFile error', err);
            return { 'Content': '' };
        }
    }
}
