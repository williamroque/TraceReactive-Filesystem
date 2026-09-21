import { EventNode } from '@tracereactive/types';
import type { InputDefinition, OutputDefinition, PropertyDefinition } from '@tracereactive/types';

import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

export class FileWatcherNode extends EventNode {
    readonly typeId = 'fs-watch-file';
    readonly displayName = 'Watch File';
    readonly category = { name: 'Watch', accent: 'amber-400' as any };
    readonly visible = true;

    readonly inputs: InputDefinition[] = [];

    readonly outputs: OutputDefinition[] = [
        { name: 'Path', outputType: 'fs:path' },
        { name: 'Event Name', outputType: 'core:string' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'path', label: 'File path', type: 'filepath' as const, defaultValue: '' }
    ];

    private watchIds: Map<string, string> = new Map();
    private eventCleanup: (() => void) | null = null;

    register(nodeId: string, emit: (nodeId: string) => void): void {
        if (!this.eventCleanup) {
            this.eventCleanup = traceReactive.fs.onWatchEvent((watchId: string, eventName: string, path: string) => {
                // If this watchId belongs to this node instance, emit
                if (Array.from(this.watchIds.values()).includes(watchId)) {
                    // Update latest output data
                    // Actually, EventNode doesn't have a direct way to push data here natively without a custom cache
                    // But we can store it on the global window or a local map for `evaluate` to pick up.
                    // To keep it simple, we use a static map.
                    FileWatcherNode.latestEvents.set(nodeId, { path, eventName });
                    emit(nodeId);
                }
            });
        }
    }

    async unregister(nodeId: string): void {
        const watchId = this.watchIds.get(nodeId);
        if (watchId) {
            await traceReactive.fs.unwatch(watchId);
            this.watchIds.delete(nodeId);
        }
        FileWatcherNode.latestEvents.delete(nodeId);
    }

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        const path = properties['path'];
        const nodeId = properties['_nodeId'];

        if (!path || !nodeId) return {};

        if (!this.watchIds.has(nodeId)) {
            const watchId = await traceReactive.fs.watch(path, { depth: 0 });
            this.watchIds.set(nodeId, watchId);
        }

        const latestEvent = FileWatcherNode.latestEvents.get(nodeId);
        return {
            'Path': latestEvent ? latestEvent.path : path,
            'Event Name': latestEvent ? latestEvent.eventName : 'initial'
        };
    }

    static latestEvents: Map<string, { path: string, eventName: string }> = new Map();
}
