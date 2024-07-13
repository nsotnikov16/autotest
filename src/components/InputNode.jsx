import MainNode from "./MainNode.jsx";
import { onChangeInput } from "../tools/functions.js";
import { nodeTypes } from "../tools/constants.js";
import ExcludeViewport from "./ExcludeViewport.jsx";

export default function InputNode(props) {
    return (
        <MainNode title={nodeTypes.InputNode} addClass="node_input" {...props}>
            <textarea
                cols="30"
                rows="3"
                className="mt-10px node__textarea"
                defaultValue={props.data.selector}
                onChange={({ target }) => onChangeInput('selector', target.value, props.id)}
                placeholder='Селектор'>
            </textarea>
            <input
                className="mt-10px node__input nodrag"
                type="text"
                defaultValue={props.data.value}
                onChange={({ target }) => onChangeInput('value', target.value, props.id)}
                placeholder="Значение" />
            <input
                className="mt-10px node__input nodrag"
                type="text"
                defaultValue={props.data.hint}
                onChange={({ target }) => onChangeInput('hint', target.value, props.id)}
                placeholder="Подсказка" />
            <ExcludeViewport id={props.id} data={props.data} />
        </MainNode>
    );
}