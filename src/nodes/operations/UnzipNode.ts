import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

export class UnzipNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-unzip';
    readonly displayName = 'Unzip';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Zip File', acceptsType: 'fs:path' },
        { name: 'Destination Directory', acceptsType: 'fs:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Success', outputType: 'core:boolean' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'overwrite', label: 'Overwrite', type: 'boolean' as const, defaultValue: false }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const zipFile = inputs['Zip File'] ? String(inputs['Zip File']) : '';
        const destDir = inputs['Destination Directory'] ? String(inputs['Destination Directory']) : '';
        const overwrite = properties['overwrite'] ?? false;
        
        if (!zipFile || !destDir) return { 'Success': false };
        
        try {
            await traceReactive.fs.unzip(zipFile, destDir, overwrite);
            return { 'Success': true };
        } catch (err) {
            console.error('Unzip error', err);
            return { 'Success': false };
        }
    }
}
