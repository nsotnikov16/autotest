
import { nodeTypes, nodeTypesActual } from "../tools/constants"
export default function Edit({ }) {

    const onClick = (type) => {
        if (!window.editId || !window.nodes) return;
        if (typeof window.setNodes !== 'function') return;
        window.setNodes((nodes) => nodes.map(node => {
            if (node.id == window.editId) node.type = type;
            return node;
        }))
        window.setModalEditNodeOpen(false);
    }

    return <div className="edit">
        <p className="edit__text">Изменить тип блока</p>
        <div className="edit__btns">
            {nodeTypesActual.map((type, index) => {
                return <button key={index} className="edit__btn" onClick={() => onClick(type)}>{nodeTypes[type]}</button>
            })}
        </div>
    </div>
}