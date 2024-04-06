import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge, useReactFlow, ReactFlowProvider
} from 'reactflow';
import StartNode from "./StartNode.jsx";
import ClickNode from "./ClickNode.jsx";
import FocusNode from "./FocusNode.jsx";
import TimeoutNode from "./TimeoutNode.jsx";
import InputNode from "./InputNode.jsx";
import ScriptNode from "./ScriptNode.jsx";
import ChoiceNode from "./ChoiceNode.jsx";
import 'reactflow/dist/style.css';
import {
    getCurrentTestId,
    getId,
    getInitialStorageData,
    updateStorage,
    getTestsLocalStorage,
    modifyNodes, generate
} from "../tools/functions.js";
import Sidebar from "./Sidebar.jsx";
import FlowWithProvider from "./FlowWithProvider.jsx";

const initialNodes = getInitialStorageData('nodes');
const initialEdges = getInitialStorageData('edges');
const nodeTypes = {StartNode, ClickNode, FocusNode, TimeoutNode, InputNode, ScriptNode, ChoiceNode};

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [testId, setTestId] = useState(getCurrentTestId());

    useEffect(() => {
        window.nodes = nodes;
        window.setNodes = setNodes;
        window.setEdges = setEdges;
        window.addNode = (node) => setNodes((nds) => modifyNodes(nds.concat(node)));
        window.removeNode = (nodeId) => setNodes((nds) => nds.filter(n => n.id !== nodeId))
    }, [])

    useEffect(() => {
        if (!testId) {
            window.localStorage.removeItem('testId');
            return;
        }
        window.localStorage.setItem('testId', testId)
        setNodes(getInitialStorageData('nodes', testId));
        setEdges(getInitialStorageData('edges', testId));
    }, [testId])

    useEffect(() => {
        updateStorage({nodes, edges}, testId);
        if (!nodes.length) {
            window.addNode({
                id: getId(),
                type: 'StartNode',
                position: {x: 15, y: 15}
            })
        }

    }, [nodes, edges]);

    return (
        <div className="app">
            <Sidebar setTestId={setTestId}/>

            <div className="app__container" style={{width: '100%', height: '100vh'}}>
                {!testId ? <div>Выберите сценарий тестирования</div> :
                    <div style={{width: '100%', height: '100vh'}}>
                        <div className="app__generator node" onClick={() => generate(nodes, edges)}>Сгенерировать код</div>
                        <FlowWithProvider
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            snapToGrid={true}
                            nodeTypes={nodeTypes}/>
                    </div>
                }
            </div>
        </div>
    );
}

export default () => (
    <App/>
);