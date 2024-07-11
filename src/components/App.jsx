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
    modifyNodes
} from "../tools/functions.js";
import { generate } from '../tools/generation.js';
import Sidebar from "./Sidebar.jsx";
import FlowWithProvider from "./FlowWithProvider.jsx";
import Modal from './Modal.jsx';
import { CodeResult } from './CodeResult.jsx';
import parse from 'html-react-parser'

const initialNodes = getInitialStorageData('nodes');
const initialEdges = getInitialStorageData('edges');
const nodeTypes = { StartNode, ClickNode, FocusNode, TimeoutNode, InputNode, ScriptNode, ChoiceNode };

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [testId, setTestId] = useState(getCurrentTestId());
    const [modalCodeOpen, setModalCodeOpen] = useState(false);
    const [modalCodeResult, setModalCodeResult] = useState('');

    const generateCode = async () => {
        let code = generate(nodes, edges); // Компонент преобразует результат в промис
        let string = await code; // Получим строку
        setModalCodeResult(string);
        setModalCodeOpen(true);
    }

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
        if (nodes.length && edges.length) {
            let newNodes = nodes.map(node => {
                const findEdge = edges.find(edge => edge.source === node.id);
                if (findEdge && findEdge.target) node.next = findEdge.target;
                return node;
            })
            setNodes(newNodes);
        }
        

        updateStorage({ nodes, edges }, testId);
        if (!nodes.length) {
            window.addNode({
                id: getId(),
                type: 'StartNode',
                position: { x: 15, y: 15 }
            })
        }

    }, [nodes, edges]);

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
                            nodeTypes={nodeTypes} />
                    </div>
                }
                <Modal isOpen={modalCodeOpen} setIsOpen={setModalCodeOpen}>
                    <CodeResult result={modalCodeResult} />
                </Modal>
            </div>
        </div>
    );
}

export default App;