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
    function findElements(selector) {
        return new Promise((r) => {
            let els = false;
            const timeout = setTimeout(() => {
                clearInterval(interval);
                r(els.length ? els : false);
            }, 3000);
            const interval = setInterval(() => {
                els = document.querySelectorAll(selector);
                if (els.length) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    return r(els);
                }
            }, 100);
        });
    };
    `
}

function getShowElementFunctionChunk() {
    return `
    function getShowElement(element) {
        return new Promise((r) => {
            let result = false;
            const timeout = setTimeout(() => {
                clearInterval(interval);
                r(result);
            }, 3000);
            const interval = setInterval(() => {
                const {x, y} = element.getBoundingClientRect();
                if (x && y) {
                    result = true;
                    clearInterval(interval);
                    r(result);
                }
            }, 100)
        })
    }
    `
}

function getChunkForAction(selector, action, excludeViewport) {
    return `   
        var elements = document.querySelectorAll('${selector}');
        if (!elements.length) elements = await findElements('${selector}');
        if (!elements.length) {
            alert('Элементы с селектором ${selector} не найдены в DOM дереве');
            throw new Error();
        }

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            var show = ${excludeViewport ? 'true;' : 'await getShowElement(element);'}
            if (show) {
                ${typeof action === 'function' ? action(selector) : ''}
            } else {
                console.warn('Автотест: Элемент ${selector} с индексом '+ index + ' не появился в зоне видимости');
            };
        }
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
    let chunk = `(async function test(){`;
    try {
        if (!nodes.length) throw new Error('Отсутствуют элементы в конструкторе');
        if (nodes.some(node => node.type === 'StartNode')) throw new Error('Сценарий не начат');
        chunk += getClickFunctionChunk();
        chunk += findElementFunctionChunk();
        chunk += getShowElementFunctionChunk();

        nodes.forEach(({ data, type }) => {
            if (!data) return;
            const excludeViewport = data?.excludeViewport;
            switch (type) {
                case "TimeoutNode":
                    if (data?.sec) chunk += genTimeoutAction(data.sec);
                    break;
                case "ClickNode":
                    if (data?.selector) chunk += getChunkForAction(data.selector, genClickAction, excludeViewport);
                    break;
                case "FocusNode":
                    if (data?.selector) chunk += getChunkForAction(data.selector, genFocusAction, excludeViewport);
                    break;
                case "InputNode":
                    if (data?.selector) chunk += getChunkForAction(data.selector, () => genInputAction(data.value), excludeViewport);
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