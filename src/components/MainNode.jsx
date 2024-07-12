import { Handle, Position, useReactFlow } from 'reactflow';
import { useCallback } from "react";
import { getId } from "../tools/functions.js";

export default function MainNode({ addClass, title, children, id, type, data, ...props }) {
    const { screenToFlowPosition } = useReactFlow();
    const onEdit = useCallback(() => {
        window.editId = id;
        window.setModalEditNodeOpen(true);
    }, []);

    const onCopy = useCallback((event) => {
        window.addNode({
            id: getId(),
            type,
            position: screenToFlowPosition({
                x: event.clientX + 200,
                y: event.clientY + 20,
            }),
            data: {}
        });
    }, []);

    const onTrash = useCallback(() => {
        window.removeNode(id);
        setEdges(eds => eds.filter(edge => edge.target !== id));
    }, []);

    return (
        <>
            {(!data.fromStart) && <Handle type="target" position={Position.Left} />}
            <div className={`node ${addClass}`}>
                {data.fromStart && type != 'ChoiceNode' && <div className="node__start-btn">Начало</div>}
                <div className='node__title'>{title}</div>
                <div className="node__container">
                    {children}
                </div>
                {type !== 'ChoiceNode' &&
                    <div className={"node__absolute nodrag" + (data.fromStart ? ' node__absolute_start' : '')}>
                        <div className="node__absolute-container">
                            <div className="node__edit" onClick={onEdit}></div>
                            <div className="node__copy" onClick={onCopy}></div>
                            {!data.fromStart && <div className="node__trash" onClick={onTrash}></div>}
                        </div>
                    </div>
                }
            </div>
            {type !== 'ChoiceNode' && <Handle type="source" position={Position.Right} />}
        </>
    );
}