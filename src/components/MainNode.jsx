import {Handle, Position, useReactFlow} from 'reactflow';
import {useCallback} from "react";
import {getId} from "../tools/functions.js";

export default function MainNode({addClass, title, children, id, type, ...props}) {
    const {screenToFlowPosition} = useReactFlow();
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
            {(!props.data.fromStart) && <Handle type="target" position={Position.Left}/>}
            <div className={`node ${addClass}`}>
                <div className='node__title'>{title}</div>
                <div className="node__container">
                    {children}
                </div>
                {type !== 'ChoiceNode' &&
                    <div className="node__absolute nodrag">
                        <div className="node__absolute-container">
                            <div className="node__copy" onClick={onCopy}></div>
                            <div className="node__trash" onClick={onTrash}></div>
                        </div>
                    </div>
                }
            </div>
            {type !== 'ChoiceNode' && <Handle type="source" position={Position.Right}/>}
        </>
    );
}