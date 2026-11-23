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

// Turbine Sensor Node
function TurbineSensorNode({ data }) {
  return (
    <div style={{
      padding: '15px',
      border: '2px solid #2585a5',
      borderRadius: '10px',
      background: '#fff',
      width: '210px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    }}>
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

// Moving Average Threshold Filter Node
function MovingAverageNode({ data }) {
  const readings = [20, 22, 24, 26, 28]

  const average =
    readings.reduce((sum, value) => sum + value, 0) /
    readings.length

  const threshold = 23
  const isAlert = average > threshold

  return (
    <div style={{
      padding: '15px',
      border: '2px solid #2585a5',
      borderRadius: '10px',
      background: '#fff',
      width: '230px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    }}>
      <Handle type="target" position={Position.Left} />

      <h3 style={{ margin: '0 0 10px', color: '#2585a5' }}>
        {data.label}
      </h3>

      <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
        <div>📊 Readings: {readings.join(', ')}</div>
        <div>📈 Moving Average: {average.toFixed(2)}</div>
        <div>🎯 Threshold: {threshold}</div>
        <div style={{
          color: isAlert ? 'red' : 'green',
          fontWeight: 'bold',
        }}>
          Status: {isAlert ? '🔴 Alert' : '🟢 Normal'}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}

const nodeTypes = {
  turbineSensor: TurbineSensorNode,
  movingAverage: MovingAverageNode,
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
        type,
        position,
        data: {
          label:
            type === 'turbineSensor'
              ? 'Turbine Sensor'
              : 'Moving Average Filter',
        },
      },
    ])
  }, [setNodes])

  const onDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h2>Nexus Flow</h2>

      <aside style={{
        padding: '10px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div
          draggable
          onDragStart={(event) => onDragStart(event, 'turbineSensor')}
          style={{
            padding: '12px',
            border: '1px solid #2585a5',
            borderRadius: '8px',
            cursor: 'grab',
            background: '#e5f5fa',
            color: '#17647d',
            fontWeight: 'bold',
          }}
        >
          + Data Source (Turbine Sensor)
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, 'movingAverage')}
          style={{
            padding: '12px',
            border: '1px solid #2585a5',
            borderRadius: '8px',
            cursor: 'grab',
            background: '#e5f5fa',
            color: '#17647d',
            fontWeight: 'bold',
          }}
        >
          + Math/Filter (Moving Average)
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