import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './App.css'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 100 },
    data: { label: 'Start Node' },
  },
]

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event) => {
    event.preventDefault()

    const type = event.dataTransfer.getData('application/reactflow')
    if (!type) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    }

    setNodes((nds) => [
      ...nds,
      {
        id: `${Date.now()}`,
        type: 'default',
        position,
        data: { label: 'New Node' },
      },
    ])
  }, [setNodes])

  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', 'default')
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h2>Nexus Flow</h2>

      <aside style={{ padding: '10px' }}>
        <div
          draggable
          onDragStart={onDragStart}
          style={{
            padding: '12px',
            border: '1px solid gray',
            width: '120px',
            cursor: 'grab',
            background: '#eee',
          }}
        >
          Drag New Node
        </div>
      </aside>

      <div style={{ width: '100%', height: '80vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default App