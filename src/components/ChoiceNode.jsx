import MainNode from "./MainNode.jsx";
import {useCallback} from "react";
import {getId} from "../tools/functions.js";

export default function ChoiceNode(props) {
    const onClick = useCallback((type) => {
        window.removeNode(props.id);
        const id = getId();
        window.addNode({
            id,
            type,
            position: {x: props.xPos, y: props.yPos + 25},
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
        <MainNode title="Действие" addClass="node_action nodrag" {...props}>
            <div className="mt-10px node__action nodrag" onClick={() => onClick('ClickNode')}>Клик</div>
            <div className="mt-10px node__action nodrag" onClick={() => onClick('FocusNode')}>Фокус</div>
            <div className="mt-10px node__action nodrag" onClick={() => onClick('InputNode')}>Ввод значения</div>
            <div className="mt-10px node__action nodrag" onClick={() => onClick('TimeoutNode')}>Ожидание</div>
            <div className="mt-10px node__action nodrag" onClick={() => onClick('ScriptNode')}>Свой скрипт</div>
        </MainNode>
    );
}