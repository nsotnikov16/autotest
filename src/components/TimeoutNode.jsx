import MainNode from "./MainNode.jsx";
import {onChangeInput} from "../tools/functions.js";
import {useCallback} from "react";
import { nodeTypes } from "../tools/constants.js";

export default function TimeoutNode(props) {
    const onChange = useCallback(({target}) => {
        target.value = target.value.replace(/[^0-9]/, "");
        onChangeInput('sec', target.value, props.id);
    }, []);
    return (
        <MainNode title={nodeTypes.TimeoutNode} addClass="node_timeout" {...props}>
            <div className="node__timeout mt-10px">
                <input
                    className="node__input nodrag"
                    defaultValue={props.data.sec}
                    type="text"
                    title="Только цифры"
                    onChange={onChange}/>
                <div>сек</div>
            </div>
        </MainNode>
    );
}