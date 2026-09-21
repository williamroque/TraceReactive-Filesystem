import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

declare const traceReactive: any;

export class ZipNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-zip';
    readonly displayName = 'Zip';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Source', acceptsType: 'fs:path' },
        { name: 'Destination Zip', acceptsType: 'fs:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Success', outputType: 'core:boolean' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'overwrite', label: 'Overwrite', type: 'boolean' as const, defaultValue: false }
    ];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const source = inputs['Source'];
        const destZip = inputs['Destination Zip'] ? String(inputs['Destination Zip']) : '';
        const overwrite = properties['overwrite'] ?? false;
        
        if (!source || !destZip) return { 'Success': false };
        
        try {
            await traceReactive.fs.zip(source, destZip, overwrite);
            return { 'Success': true };
        } catch (err) {
            console.error('Zip error', err);
            return { 'Success': false };
        }
    }
}
