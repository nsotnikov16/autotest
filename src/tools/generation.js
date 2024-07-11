function getClickFunctionChunk() {
    return `
    function click(x, y)
    {
        var ev = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            screenX: x,
            screenY: y
        });
    
        var el = document.elementFromPoint(x, y);
        while (el.firstElementChild) {
            el = el.firstElementChild;
        };
        el.dispatchEvent(ev);
    };
    `;
}

function findElementFunctionChunk() {
    return `
    function findElement(selector) {
    console.log('tut');
        return new Promise((r) => {
            let el = false;
            const timeout = setTimeout(() => {
                clearInterval(interval);
                r(el);
            }, 3000);
            const interval = setInterval(() => {
                el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    console.log(selector);
                    return r(el);
                }
            }, 100);
        });
    };
    `
}

function getChunkForAction(selector, action, error) {
    return `   
        var element = document.querySelector('${selector}');
        if (!element) element = await findElement('${selector}');
        console.log(element);
        if (element) {
            ${typeof action === 'function' ? action(selector): ''}
        } else {
            ${typeof error === 'function' ? error(selector) : ''}
            alert('Элемент ${selector} не найден');
            throw new Error();
        };
    `
}

function genClickAction() {
    return `element.click();`;
}

function genFocusAction() {
    return `
        const obj = element.getBoundingClientRect();
        element.dispatchEvent(new Event('focus'));
        click(obj.x, obj.y);
    `;
}

function genInputAction(value) {
    return `element.value = '${value}';`;
}

function genTimeoutAction(timeout) {
    return `await new Promise((r) => { setTimeout(() => {r(true)}, ${timeout} * 1000);});`;
}

function genScriptAction(script) {
    return `try {${script}} catch (e) {};`;
}

function modify(nodes, edges) {
    let newNodes = nodes;
    if (nodes.length && edges.length) {
        // Установим следующие элементы
        nodes.forEach(node => {
            const findEdgeNext = edges.find(edge => edge.source === node.id);
            if (findEdgeNext) node.next = findEdgeNext?.target;
        })

        // Отсортируем по возрастающей
        nodes.sort((a, b) => a.next - b.next);
        newNodes = [];
        let nextNode = nodes.find(node => node.data?.fromStart) ?? nodes[0];
        while (nextNode) {
            if (nextNode) newNodes.push(nextNode);
            nextNode = nodes.find(node => node.id === nextNode.next)
        };
    }

    return newNodes;
}


export const generate = async (nodes, edges) => {
    nodes = modify(nodes, edges);
    console.log(nodes, edges);
    let chunk = `(async function test(){`;
    try {
        if (!nodes.length) throw new Error('Отсутствуют элементы в конструкторе');
        if (nodes.some(node => node.type === 'StartNode')) throw new Error('Сценарий не начат');
        chunk += getClickFunctionChunk();
        chunk += findElementFunctionChunk();

        nodes.forEach(({ data, type }) => {
            if (!data) return;
            switch (type) {
                case "TimeoutNode":
                    if (data?.sec) chunk += genTimeoutAction(data.sec);
                    break;
                case "ClickNode":
                    if (data?.selector) chunk += getChunkForAction(data.selector, genClickAction);
                    break;
                case "FocusNode":
                    if (data?.selector) chunk += getChunkForAction(data.selector, genFocusAction);
                    break;
                case "InputNode":
                    if (data?.selector) {
                        chunk += getChunkForAction(data.selector, genFocusAction);
                        chunk += getChunkForAction(data.selector, () => genInputAction(data.value));
                    }
                    break;
                case "ScriptNode":
                    if (data?.script) chunk += genScriptAction(data.script);
                    break;
            }
        });
    } catch (error) {
        alert(error.message);
        return '';
    }

    chunk += `})()`;
    chunk = chunk.replace(/\s+/g, ' ').trim();
    return chunk;
}