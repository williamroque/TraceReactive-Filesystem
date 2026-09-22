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
        { name: 'Path', outputType: 'core:path' },
        { name: 'Event Name', outputType: 'core:string' }
    ];

    readonly properties: PropertyDefinition[] = [
        { name: 'path', label: 'File path', type: 'filepath' as const, defaultValue: '' }
    ];

    private watchIds: Map<string, string> = new Map();
    private emitFunctions: Map<string, (nodeId: string) => void> = new Map();
    private eventCleanup: (() => void) | null = null;

    private setupListener() {
        if (!this.eventCleanup) {
            this.eventCleanup = traceReactive.fs.onWatchEvent((watchId: string, eventName: string, path: string) => {
                let targetNodeId: string | undefined;
                for (const [id, wId] of this.watchIds.entries()) {
                    if (wId === watchId) {
                        targetNodeId = id;
                        break;
                    }
                }

                if (targetNodeId) {
                    FileWatcherNode.latestEvents.set(targetNodeId, { path, eventName });
                    if (typeof traceReactive !== 'undefined' && traceReactive.emitEvent) {
                        traceReactive.emitEvent(targetNodeId);
                    } else {
                        const targetEmit = this.emitFunctions.get(targetNodeId);
                        if (targetEmit) {
                            targetEmit(targetNodeId);
                        }
                    }
                }
            });
        }
    }

    register(nodeId: string, emit: (nodeId: string) => void): void {
        this.emitFunctions.set(nodeId, emit);
        this.setupListener();
    }

    async unregister(nodeId: string): void {
        const watchId = this.watchIds.get(nodeId);
        if (watchId) {
            await traceReactive.fs.unwatch(watchId);
            this.watchIds.delete(nodeId);
        }
        this.emitFunctions.delete(nodeId);
        FileWatcherNode.latestEvents.delete(nodeId);
        
        if (this.watchIds.size === 0 && this.eventCleanup) {
            this.eventCleanup();
            this.eventCleanup = null;
        }
    }

    async evaluate(inputs: Record<string, any>, properties: Record<string, any>): Promise<Record<string, any>> {
        this.setupListener();
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
