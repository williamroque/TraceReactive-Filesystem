import { ExecuteNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

declare const traceReactive: any;

export class MoveToTrashNode extends ExecuteNode {
    readonly category = { name: 'Filesystem', accent: 'blue-500' } as any;
    readonly typeId = 'fs-move-to-trash';
    readonly displayName = 'Move to Trash';
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path', acceptsType: 'fs:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Success', outputType: 'core:boolean' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const pathInput = inputs['Path'];
        if (!pathInput) return { 'Success': false };
        
        const paths: string[] = Array.isArray(pathInput) ? pathInput : [String(pathInput)];

        try {
            for (const p of paths) {
                await traceReactive.fs.trash(String(p));
            }
            return { 'Success': true };
        } catch (err) {
            console.error('MoveToTrash error', err);
            return { 'Success': false };
        }
    }
}
