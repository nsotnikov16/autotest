import MainNode from "./MainNode.jsx";
import { useCallback } from "react";
import { getId } from "../tools/functions.js";
import { nodeTypes, nodeTypesActual } from "../tools/constants.js";

export default function ChoiceNode(props) {
    const onClick = useCallback((type) => {
        window.removeNode(props.id);
        const id = getId();
        window.addNode({
            id,
            type,
            position: { x: props.xPos, y: props.yPos + 25 },
            data: {}
        });

        window.setEdges(eds => {
            return eds.map(edge => {
                if (edge.target === props.id) edge.target = id;
                return edge;
            });
        });
    }, []);
    return (
        <MainNode title={nodeTypes.ChoiceNode} addClass="node_action nodrag" {...props}>
            {nodeTypesActual.map((type, index) => {
                return <div key={index} className="mt-10px node__action nodrag" onClick={() => onClick(type)}>{nodeTypes[type]}</div>
            })}
        </MainNode>
    );
}