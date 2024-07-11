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

function awaitElementFunctionChunk() {
    return `
    async function awaitElement(selector) {
        let el = false;
        return new Promise((r) => {
            const timeout = setTimeout(() => {
                clearInterval(interval);
                if (!el) r(false);
            }, 3000);
            const interval = setInterval(() => {
                if (el = document.querySelector(selector)) {
                    clearInterval(interval);
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
        if (!element) element = await awaitElement('${selector}');
        if (element) {
            ${action(selector)}
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

function sort(nodes) {
    nodes.sort((a, b) => a.next - b.next);
}

function filter(nodes) {
    return nodes.filter(node => {
        if (!node.data.fromStart && !node.next) return false;
        return true;
    })
}

export const generate = async (nodes) => {
    sort(nodes);
    nodes = filter(nodes);
    console.log(nodes);
    let chunk = `(async function test(){`;
    try {
        if (!nodes.length) throw new Error('Отсутствуют элементы в конструкторе');
        if (nodes.some(node => node.type === 'StartNode')) throw new Error('Сценарий не начат');
        chunk += getClickFunctionChunk();
        chunk += awaitElementFunctionChunk();

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