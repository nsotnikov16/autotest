import MainNode from "./MainNode.jsx";
import {onChangeInput} from "../tools/functions.js";

export default function ScriptNode(props) {
    return (
        <MainNode title="Свой скрипт" addClass="node_script" {...props}>
            <textarea
                cols="30"
                rows="10"
                className="mt-10px node__textarea nodrag"
                defaultValue={props.data.script}
                onChange={({target}) => onChangeInput('script', target.value, props.id)}
                placeholder='Скрипт (без тега <script>)'></textarea>
        </MainNode>
    );
}