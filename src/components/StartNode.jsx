import {useCallback} from 'react';
import {Handle, Position} from 'reactflow';
import {getId} from "../tools/functions.js";

export default function StartNode(props) {
    const onClick = useCallback(() => {
        window.removeNode(props.id);
        window.addNode({
            id: getId(),
            type: 'ChoiceNode',
            position: {x: 15, y: 15},
            data: {fromStart: true}
        })
    }, []);
    return (
        <>
            <div className="node node_start nodrag" onClick={onClick}>
                <div className="node__title">Нажмите, чтобы начать</div>
            </div>
        </>
    );
}