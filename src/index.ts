import { PathJoinNode } from './nodes/path/PathJoinNode';
import { PathResolveNode } from './nodes/path/PathResolveNode';
import { PathBasenameNode } from './nodes/path/PathBasenameNode';
import { PathDirnameNode } from './nodes/path/PathDirnameNode';
import { PathExtnameNode } from './nodes/path/PathExtnameNode';
import { FileWatcherNode } from './nodes/watch/FileWatcherNode';
import { DirectoryWatcherNode } from './nodes/watch/DirectoryWatcherNode';
import { ListDirectoryNode } from './nodes/operations/ListDirectoryNode';
import { FilterFilesNode } from './nodes/operations/FilterFilesNode';
import { FileStatNode } from './nodes/operations/FileStatNode';
import { MakeDirectoryNode } from './nodes/operations/MakeDirectoryNode';
import { ReadFileNode } from './nodes/io/ReadFileNode';
import { WriteFileNode } from './nodes/io/WriteFileNode';
import { CopyFileNode } from './nodes/io/CopyFileNode';
import { MoveFileNode } from './nodes/io/MoveFileNode';
import { MoveToTrashNode } from './nodes/io/MoveToTrashNode';
import { ZipNode } from './nodes/operations/ZipNode';
import { UnzipNode } from './nodes/operations/UnzipNode';

import { ChoosePathNode } from './nodes/io/ChoosePathNode';

import type { TraceReactiveAPI } from '@tracereactive/types';

declare const traceReactive: TraceReactiveAPI;

// 1. Instantiate the nodes
const nodes = [
    new PathJoinNode(),
    new PathResolveNode(),
    new PathBasenameNode(),
    new PathDirnameNode(),
    new PathExtnameNode(),
    new FileWatcherNode(),
    new DirectoryWatcherNode(),
    new ListDirectoryNode(),
    new FilterFilesNode(),
    new FileStatNode(),
    new MakeDirectoryNode(),
    new ReadFileNode(),
    new WriteFileNode(),
    new CopyFileNode(),
    new MoveFileNode(),
    new MoveToTrashNode(),
    new ZipNode(),
    new UnzipNode(),
    new ChoosePathNode()
];

// 2. Register with the host app
const serializableNodes = nodes.map(n => ({
    typeId: n.typeId,
    displayName: n.displayName,
    category: n.category,
    nodeInterface: n.nodeInterface,
    visible: n.visible,
    inputs: n.inputs,
    outputs: n.outputs,
    properties: n.properties,
    dynamicInputs: n.dynamicInputs,
    dynamicOutputs: n.dynamicOutputs
}));

traceReactive.registerNodes(serializableNodes);

// 3. Listen for evaluation requests
traceReactive.onEvaluateNode(async ({ typeId, inputs, properties }: any) => {
    const node = nodes.find(n => n.typeId === typeId);
    if (!node) {
        throw new Error(`Unknown node type: ${typeId}`);
    }
    return await node.evaluate(inputs, properties);
});