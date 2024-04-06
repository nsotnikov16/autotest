import MainNode from "./MainNode.jsx";
import {onChangeInput} from "../tools/functions.js";

export default function FocusNode(props) {
    return (
        <MainNode title="Фокус" addClass="node_focus" {...props}>
            <textarea
                cols="30"
                rows="3"
                className="mt-10px node__textarea nodrag"
                placeholder='Селектор'
                defaultValue={props.data.selector}
                onChange={({target}) => onChangeInput('selector', target.value, props.id)}>
            </textarea>
            <input
                className="mt-10px node__input nodrag"
                type="text"
                onChange={({target}) => onChangeInput('hint', target.value, props.id)}
                defaultValue={props.data.hint}
                placeholder="Подсказка"/>
        </MainNode>
    );
}