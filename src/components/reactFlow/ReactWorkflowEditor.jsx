import React, { useCallback, useState } from "react";
import  {ReactFlow, addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState, Handle, Position, MarkerType} from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import { Star } from "lucide-react";

const BasicNode = ({ data }) => (
  <div className="workflow-node m-2 bg-card border border-border rounded-lg p-2 text-center shadow-sm flex">
    <Handle type="target" position={Position.Top} className="!size-2" />
    <div className="flex items-center gap-2">
        <Star className="bg-emerald-400 rounded text-black p-0.5"/>
    <div className="font-semibold text-xs">{data.label || "Basic Node"}</div>
    </div>
    
    <Handle type="source" position={Position.Bottom} className="!size-2  " />
  </div>
);

const ConditionNode = ({ data }) => (
  <div className="bg-blue-50 border border-blue-400 rounded-lg p-3 text-center shadow-sm">
    <Handle type="target" position={Position.Top} />
    <div className="font-semibold text-blue-800">
      {data.label || "Condition Node"}
    </div>
    <div className="flex justify-around mt-2">
      <Handle
        type="source"
        id="success"
        position={Position.Bottom}
        style={{ background: "green",left:"20px" }}
      />
      <Handle
        type="source"
        id="failure"
        position={Position.Bottom}
        style={{ background: "red",left:"50px" }}
      />
    </div>
  </div>
);

const nodeTypes = {
  basic: BasicNode,
  condition: ConditionNode,
};

const initialNodes = [
  {
    id: "1",
    type: "basic",
    position: { x: 100, y: 100 },
    data: { label: "Start", next: null },
  },
];

const ReactWorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => {
      const { source, target, sourceHandle } = params;

      // Edge styling based on handle
      let edgeStyle = {};
      let label = "";
      if (sourceHandle === "failure") {
        edgeStyle = {
          stroke: "red",
          strokeDasharray: "5,5",
        };
        label = "Failure";
      } else {
        edgeStyle = {
          stroke: "green",
        };
        label = "Success";
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed, },
            style:{strokeWidth:2}
            
            // label,
            // labelBgPadding: [6, 3],
            // labelBgBorderRadius: 4,
            // labelBgStyle: { fill: "#fff" },
          },
          eds
        )
      );

      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === source) {
            if (node.type === "condition") {
              if (sourceHandle === "failure") {
                return { ...node, data: { ...node.data, onError: target } };
              } else {
                return { ...node, data: { ...node.data, next: target } };
              }
            } else {
              return { ...node, data: { ...node.data, next: target } };
            }
          }
          return node;
        })
      );
    },
    [setEdges, setNodes]
  );

  const addBasicNode = () => {
    const id = (nodes.length + 1).toString();
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "basic",
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `Basic ${id}`, next: null },
      },
    ]);
  };

  const addConditionNode = () => {
    const id = (nodes.length + 1).toString();
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "condition",
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { label: `Condition ${id}`, next: null, onError: null },
      },
    ]);
  };

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <div className="absolute z-10 flex gap-2 p-2">
        <button onClick={addBasicNode} className="button-filled" > + Basic Node </button>
        <button onClick={addConditionNode} className="button-filled" > + Condition Node </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        
        colorMode="dark"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default ReactWorkflowEditor;
