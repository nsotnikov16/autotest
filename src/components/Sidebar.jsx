import MainNode from "./MainNode.jsx";
import React, {useCallback, useEffect, useState} from "react";
import {getCurrentTestId, getIdForTest, getTestsLocalStorage} from "../tools/functions.js";
import logo from '../assets/images/logo.svg';

export default function Sidebar({setTestId}) {
    const [tests, setTests] = useState(getTestsLocalStorage() ?? []);
    const [isOpenSidebar, setIsOpenSidebar] = useState(Boolean(Number(window.localStorage.getItem('sidebar-open'))));

    const toggleSidebar = () => {
        setIsOpenSidebar(!isOpenSidebar);
        window.localStorage.setItem('sidebar-open', Number(!isOpenSidebar));
    }

    const addTest = () => {
        setTests((array) => array.concat({id: getIdForTest(), name: '', on: false}))
    }

    const onChange = ({target}, id) => {
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
                <div className="sidebar__arrow" onClick={toggleSidebar}>
                    <svg width="26px" height="26px" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12H20M4 12L8 8M4 12L8 16" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </div>
                {/*<a className="sidebar__logo" target="_blank" href='/'><img src={logo} alt="logo"/></a>*/}
            </div>
            <div className="sidebar__content">
                <button className="sidebar__add" onClick={addTest}>Добавить сценарий</button>
                {tests.length > 0 &&
                    <div className="sidebar__tests">
                        {tests.map((test) => {
                            return <div className="sidebar__test" key={test.id}>
                                <input className="sidebar__test-name" type="text" placeholder="Название теста"
                                       defaultValue={test.name} onChange={(e) => onChange(e, test.id)}/>
                                <div className={`sidebar__test-switch ${test.on ? 'active' : ''}`} onClick={() => handleSwitch(test.id)}></div>
                                <div className="node__trash sidebar__test-trash" onClick={() => handleTrash(test.id)}></div>
                            </div>
                        })}
                    </div>}
            </div>
        </div>
    </aside>;
}