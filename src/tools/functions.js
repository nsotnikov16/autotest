import {useCallback} from "react";

export const updateStorage = (data, testId) => {
    if (!testId) return;
    window.localStorage.setItem(`test-${testId}-data`, JSON.stringify(data));
}

export function getId() {
    return new Date().getTime() + Math.ceil(Math.random() * 1000000).toString()
}

export const getInitialStorageData = (type, testId) => {
    try {
        const data = JSON.parse(window.localStorage.getItem(`test-${testId}-data`));
        if (Array.isArray(data[type]) && data[type].length) return data[type];
    } catch (e) {

    }
    let defaultArray = [];
    if (type === 'nodes') defaultArray = [
        {id: getId(), type: 'StartNode', position: {x: 15, y: 15}},
    ]
    return defaultArray;
}

export const getCurrentTestId = () => {
    return window.localStorage.getItem('testId');
}

export const getIdForTest = () => {
    let randomString = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    for (let i = 0; i < 5; i++) {
        randomString += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return randomString;
}

export const modifyNodes = (nodes) => {
    nodes.forEach((node, index) => {
        if (index === 0) node.data = {...node.data, fromStart: true};
    });

    return nodes;
}

export const getTestsLocalStorage = () => {
    const storage = window.localStorage;
    let tests = [];
    if (storage.getItem('tests-itrinity')) {
        try {
            const result = JSON.parse(storage.getItem('tests-itrinity'));
            if (Array.isArray(result)) tests = result;
        } catch (e) {

        }
    }
    return tests;
}

export const onChangeInput = (key, value, nodeId) => {
    window.setNodes(nodes => nodes.map(node => {
        if (!node.data) node.data = {};
        if (node.id === nodeId) node.data[key] = value;
        return node;
    }))
}

export const generate = async (nodes, edges) => {

}