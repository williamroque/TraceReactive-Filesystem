import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { resolve } from '../../utils/PathUtils';

export class PathResolveNode extends BaseNode {
    readonly typeId = 'fs-path-resolve';
    readonly displayName = 'Path Resolve';
    readonly category = { name: 'Path', accent: 'indigo-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path 1', acceptsType: 'core:path' },
        { name: 'Path 2', acceptsType: 'core:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Path', outputType: 'core:path' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p1 = inputs['Path 1'] ? String(inputs['Path 1']) : '';
        const p2 = inputs['Path 2'] ? String(inputs['Path 2']) : '';
        return {
            'Path': resolve(p1, p2)
        };
    }
}
