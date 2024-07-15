import { useEffect, useState } from "react";
import { getIdForTest, getTestsLocalStorage } from "../tools/functions.js";
import logo from '../assets/images/logo.svg';

export default function Sidebar({ setTestId }) {
    const [tests, setTests] = useState(getTestsLocalStorage() ?? []);
    const sidebarLocal = localStorage.getItem('sidebar-open') == null ? true : Boolean(Number(window.localStorage.getItem('sidebar-open')));
    const [isOpenSidebar, setIsOpenSidebar] = useState(sidebarLocal);

    const toggleSidebar = () => {
        setIsOpenSidebar(!isOpenSidebar);
        window.localStorage.setItem('sidebar-open', Number(!isOpenSidebar));
    }

    const addTest = () => {
        setTests((array) => array.concat({ id: getIdForTest(), name: '', on: false }))
    }

    const onChange = ({ target }, id) => {
        setTests((array) => array.map(item => {
            if (item.id === id) item.name = target.value;
            return item;
        }))
    }

    const handleSwitch = (id) => {
        setTests((array) => array.map(item => {
            if (item.id === id) {
                item.on = !item.on;
                setTestId(id);
            } else {
                item.on = false
            };
            return item;
        }))
    }

    const handleTrash = (id) => {
        if (confirm('Вы уверены, что хотите удалить?')) {
            setTests(array => array.filter(item => item.id !== id));
            window.localStorage.removeItem(`test-${id}-data`);
        }
    }

    useEffect(() => {
        window.localStorage.setItem('tests-itrinity', JSON.stringify(tests));
        if (tests.every(test => !test.on)) setTestId(null);
    }, [tests]);

    return <aside className={`sidebar ${!isOpenSidebar ? 'sidebar_hide' : ''}`}>
        <div className="sidebar__container">
            <div className="sidebar__header">
                <a className="sidebar__logo" target="_blank" href='/'><img src={logo} alt="logo" /></a>
                <div className="sidebar__icons">
                    <a href="/autotest/" target="_blank" className="sidebar__help">
                        <svg fill="#000000" width="25px" height="25px" viewBox="0 0 31.925 31.925" xmlns="http://www.w3.org/2000/svg">
                            <g transform="translate(-673.321 -514.099)">
                                <path fill="white" d="M689.284,516.1a13.962,13.962,0,1,1-13.963,13.962A13.977,13.977,0,0,1,689.284,516.1m0-2a15.962,15.962,0,1,0,15.962,15.962A15.962,15.962,0,0,0,689.284,514.1Z" />
                                <path fill="white" d="M687.65,531.612a2.374,2.374,0,0,1,.49-1.433,9.248,9.248,0,0,1,1.443-1.483,10.084,10.084,0,0,0,1.321-1.371,1.993,1.993,0,0,0,.367-1.2,1.953,1.953,0,0,0-1.982-2,2.073,2.073,0,0,0-1.419.543,3.56,3.56,0,0,0-.954,1.582l-2.152-.939a5.027,5.027,0,0,1,1.724-2.657,4.632,4.632,0,0,1,2.9-.926,4.959,4.959,0,0,1,2.287.531,4.154,4.154,0,0,1,1.651,1.5,3.979,3.979,0,0,1,.611,2.175,3.681,3.681,0,0,1-.538,1.965,8.76,8.76,0,0,1-1.638,1.865,13.792,13.792,0,0,0-1.359,1.322,1.536,1.536,0,0,0-.379,1,2.868,2.868,0,0,0,.1.667h-2.2A2.74,2.74,0,0,1,687.65,531.612Zm1.468,6.969a1.855,1.855,0,0,1-1.357-.543,1.831,1.831,0,0,1-.551-1.359,1.875,1.875,0,0,1,.551-1.372,1.835,1.835,0,0,1,1.357-.556,1.868,1.868,0,0,1,1.908,1.928,1.833,1.833,0,0,1-.549,1.359A1.863,1.863,0,0,1,689.118,538.581Z" />
                            </g>
                        </svg>
                    </a>
                    <div className="sidebar__arrow" onClick={toggleSidebar}>
                        <svg width="26px" height="26px" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M4 12L8 8M4 12L8 16" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="sidebar__content">
                <button className="sidebar__add" onClick={addTest}>Добавить сценарий</button>
                {tests.length > 0 &&
                    <div className="sidebar__tests">
                        {tests.map((test) => {
                            return <div className="sidebar__test" key={test.id}>
                                <input className="sidebar__test-name" type="text" placeholder="Название сценария"
                                    defaultValue={test.name} onChange={(e) => onChange(e, test.id)} />
                                <div className={`sidebar__test-switch ${test.on ? 'active' : ''}`} onClick={() => handleSwitch(test.id)}></div>
                                <div className="node__trash sidebar__test-trash" onClick={() => handleTrash(test.id)}></div>
                            </div>
                        })}
                    </div>}
            </div>
        </div>
    </aside>;
}