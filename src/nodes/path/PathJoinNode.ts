import { BaseNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';
import { join } from '../../utils/PathUtils';

export class PathJoinNode extends BaseNode {
    readonly typeId = 'fs-path-join';
    readonly displayName = 'Path Join';
    readonly category = { name: 'Path', accent: 'indigo-500' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [
        { name: 'Path 1', acceptsType: 'fs:path' },
        { name: 'Path 2', acceptsType: 'fs:path' }
    ];

    readonly outputs: OutputDefinition[] = [
        { name: 'Path', outputType: 'fs:path' }
    ];

    readonly properties: PropertyDefinition[] = [];

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const p1 = inputs['Path 1'] ? String(inputs['Path 1']) : '';
        const p2 = inputs['Path 2'] ? String(inputs['Path 2']) : '';
        return {
            'Path': join(p1, p2)
        };
    }
}
