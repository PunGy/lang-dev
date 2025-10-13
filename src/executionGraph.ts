interface ExecutionGraphMaker {
  beginBlockOperation(name: string, meta?: NodeMeta): void;
  operation(name: string, meta?: NodeMeta): void;
  endBlockOperation(): void;

  reset(): void;
  graph(): GraphAnchorNode;
}

export type NodeMeta = Record<string, any>

export const gtOperation = Symbol('operation')
export const gtBlock = Symbol('block')
export const gtAnchor = Symbol('anchor')
export interface GraphNodeBase {
  type: Symbol,
  name: string;
  prev: GraphNode | null;
  next: GraphNode | null;
  parent: GraphNode | null;
  meta: NodeMeta;
}
export interface GraphOperationNode extends GraphNodeBase {
  type: typeof gtOperation,
}
export interface GraphBlockNode extends GraphNodeBase {
  type: typeof gtBlock
  children: GraphNode
}
export interface GraphAnchorNode extends GraphNodeBase {
  type: typeof gtAnchor
  name: '',
}

export type GraphNode = GraphOperationNode | GraphBlockNode | GraphAnchorNode

const makeOperation = (name: string, meta: NodeMeta): GraphOperationNode => ({
  type: gtOperation,
  name,
  meta,
  next: null,
  prev: null,
  parent: null,
})
const makeBlock = (name: string, meta: NodeMeta): GraphBlockNode => {
  const children = makeAnchor()
  const block: GraphBlockNode = {
    type: gtBlock,
    children,
    name,
    meta,
    next: null,
    prev: null,
    parent: null,
  }
  children.parent = block
  return block
}
const makeAnchor = (): GraphAnchorNode => ({
  type: gtAnchor,
  name: '',
  meta: {},
  next: null,
  prev: null,
  parent: null,
})

function initExecutionGraph() {
  let anchor = makeAnchor()
  let target: GraphNode = anchor;

  const maker: ExecutionGraphMaker = {
    beginBlockOperation(name, meta) {
      const node = makeBlock(name, meta ?? {})
      target.next = node
      node.prev = target
      if (target.parent) {
        node.parent = target.parent
      }

      target = node.children
    },
    operation(name, meta) {
      const node = makeOperation(name, meta ?? {})
      target.next = node
      node.prev = target
      if (target.parent) {
        node.parent = target.parent
      }

      target = node
    },
    endBlockOperation() {
      if (target.parent === null) {
        throw new Error(`Cannot end block operation: ${target.name}`)
      }

      target = target.parent
    },

    reset() {
      anchor = makeAnchor()
      target = anchor
    },
    graph() {
      return anchor;
    }
  }

  return maker
}

export const execution = initExecutionGraph()

