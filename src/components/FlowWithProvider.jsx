import ReactFlow, {addEdge, Background, Controls, ReactFlowProvider, useReactFlow} from 'reactflow';
import 'reactflow/dist/style.css';
import React, {useCallback, useRef} from "react";
import {getId, modifyNodes} from "../tools/functions.js";

function Flow(props) {
    const connectingNodeId = useRef(null);
    const {screenToFlowPosition} = useReactFlow();
    const onConnectEnd = useCallback(
        (event) => {
            if (!connectingNodeId || !connectingNodeId.current) return;

            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (targetIsPane) {
                const id = getId();
                // we need to remove the wrapper bounds, in order to get the correct position
                const newNode = {
                    id,
                    type: 'ChoiceNode',
                    position: screenToFlowPosition({
                        x: event.clientX,
                        y: event.clientY,
                    }),
                    data: {},
                    origin: [0.5, 0.0],
                };

                window.setNodes((nds) => modifyNodes(nds.concat(newNode)));
                window.setEdges((eds) => eds.concat({id, source: connectingNodeId.current, target: id}));
            }
        },
        [screenToFlowPosition],
    );

    const onConnect = useCallback(
        (params) => {
            if (params.source === params.target) return;
            connectingNodeId.current = null;
            window.setEdges((eds) => addEdge(params, eds))
        },
        [],
    );

    const onConnectStart = useCallback((_, {nodeId}) => connectingNodeId.current = nodeId, []);

    return <ReactFlow {...props} onConnectEnd={onConnectEnd} onConnect={onConnect} onConnectStart={onConnectStart} >
        <Controls/>
        <Background variant="" gap={12} size={1}/>
    </ReactFlow>;
}

// wrapping with ReactFlowProvider is done outside of the component
function FlowWithProvider(props) {
    return (
        <ReactFlowProvider>
            <Flow {...props} />
        </ReactFlowProvider>
    );
}

export default FlowWithProvider;