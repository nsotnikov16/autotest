import { useEffect, useState } from 'react';
import {
    useNodesState,
    useEdgesState,
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
    modifyNodes,
    getIsMobile
} from "../tools/functions.js";
import { generate } from '../tools/generation.js';
import Sidebar from "./Sidebar.jsx";
import FlowWithProvider from "./FlowWithProvider.jsx";
import Modal from './Modal.jsx';
import Edit from './Edit.jsx';
import { CodeResult } from './CodeResult.jsx';
import Mobile from './Mobile.jsx';

const initialNodes = getInitialStorageData('nodes');
const initialEdges = getInitialStorageData('edges');
const types = { StartNode, ClickNode, FocusNode, TimeoutNode, InputNode, ScriptNode, ChoiceNode };
const isMobile = getIsMobile();

function App() {
    if (isMobile) return <Mobile />

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [testId, setTestId] = useState(getCurrentTestId());
    const [modalCodeOpen, setModalCodeOpen] = useState(false);
    const [modalCodeResult, setModalCodeResult] = useState('');
    const [modalEditNodeOpen, setModalEditNodeOpen] = useState(false);

    const generateCode = async () => {
        let code = generate(nodes, edges); // Компонент преобразует результат в промис
        let string = await code; // Получим строку
        if (!string) return;
        setModalCodeResult(string);
        setModalCodeOpen(true);
    }

    useEffect(() => {
        window.nodes = nodes;
        window.setNodes = setNodes;
        window.setEdges = setEdges;
        window.addNode = (node) => setNodes((nds) => modifyNodes(nds.concat(node)));
        window.removeNode = (nodeId) => setNodes((nds) => nds.filter(n => n.id !== nodeId));
        window.setModalEditNodeOpen = setModalEditNodeOpen;
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
        window.nodes = nodes;
        if (!edges.length) return;
        let ids = [];
        nodes.forEach(node => {
            const nodeEdges = edges.filter(e => e?.target === node.id || e?.source === node.id);
            if (nodeEdges.length) nodeEdges.forEach(e => ids.push(e.id));
        })
        setEdges(edges.filter(edge => ids.includes(edge.id)));
    }, [nodes]);

    useEffect(() => {
        updateStorage({ nodes, edges }, testId);
        if (!nodes.length) {
            window.addNode({
                id: getId(),
                type: 'StartNode',
                position: { x: 15, y: 15 }
            })
        }

    }, [nodes, edges]);
    useEffect(() => {
        if (!modalEditNodeOpen) window.editId = false;
    }, [modalEditNodeOpen])

    return (
        <div className="app">
            <Sidebar setTestId={setTestId} />

            <div className="app__container" style={{ width: '100%', height: '100vh' }}>
                {!testId ? <div>Выберите сценарий тестирования</div> :
                    <div style={{ width: '100%', height: '100vh' }}>
                        <div className="app__generator node" onClick={generateCode}>Сгенерировать код</div>
                        <FlowWithProvider
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            snapToGrid={true}
                            nodeTypes={types} />
                    </div>
                }
                <Modal isOpen={modalCodeOpen} setIsOpen={setModalCodeOpen}>
                    <CodeResult result={modalCodeResult} />
                </Modal>
                <Modal isOpen={modalEditNodeOpen} setIsOpen={setModalEditNodeOpen}>
                    <Edit />
                </Modal>
            </div>
        </div>
    );
}

export default App;