import MainNode from "./MainNode.jsx";
import {onChangeInput} from "../tools/functions.js";

export default function ClickNode(props) {
    return (
        <MainNode addClass="node_click" title="Клик" {...props}>
            <textarea
                cols="30"
                rows="3"
                className="mt-10px node__textarea nodrag"
                onChange={({target}) => onChangeInput('selector', target.value, props.id)}
                placeholder='Селектор' defaultValue={props.data.selector}></textarea>
            <input
                className="mt-10px node__input nodrag"
                type="text"
                placeholder="Подсказка"
                defaultValue={props.data.hint}
                onChange={({target}) => onChangeInput('hint', target.value, props.id)}/>
        </MainNode>
    );
}