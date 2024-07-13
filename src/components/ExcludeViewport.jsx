import { onChangeInput } from "../tools/functions.js";
export default function ExcludeViewport({ id, data }) {
    return <label className="mt-10px nodrag node__viewport">
        <input type="checkbox" defaultChecked={Boolean(data.excludeViewport)}
            onChange={({ target }) => onChangeInput('excludeViewport', target.checked, id)} />
        <span>Исключить проверку видимости</span>
    </label>
}