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

// Turbine Sensor Custom Node
function TurbineSensorNode({ data }) {
  return (
    <div
      style={{
        padding: '15px',
        border: '2px solid #2585a5',
        borderRadius: '10px',
        background: '#ffffff',
        width: '210px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Handle type="target" position={Position.Left} />

      <h3 style={{ margin: '0 0 10px', color: '#2585a5' }}>
        {data.label}
      </h3>

      <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
        <div>🌡 Temperature: 75°C</div>
        <div>⚙ RPM: 1500</div>
        <div>📊 Vibration: 2.1 mm/s</div>
        <div>🔵 Pressure: 5 bar</div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = {
  turbineSensor: TurbineSensorNode,
}

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
        type: type === 'turbineSensor' ? 'turbineSensor' : 'default',
        position,
        data: {
          label: type === 'turbineSensor'
            ? 'Turbine Sensor'
            : 'New Node',
        },
      },
    ])
  }, [setNodes])

  const onDragStart = (event) => {
    event.dataTransfer.setData(
      'application/reactflow',
      'turbineSensor'
    )
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
            border: '1px solid #2585a5',
            borderRadius: '8px',
            width: '190px',
            cursor: 'grab',
            background: '#e5f5fa',
            color: '#17647d',
            fontWeight: 'bold',
          }}
        >
          + Data Source (Turbine Sensor)
        </div>
      </aside>

      <div style={{ width: '100%', height: '80vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
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