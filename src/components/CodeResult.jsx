import { useState } from "react";

export function CodeResult({ result }) {
    const [showResultCopy, setShowResultCopy] = useState(false);
    const copy = () => {
        clearInterval(window?.timeout);
        navigator.clipboard.writeText(result).then(() => {
            setShowResultCopy(true);
            window.timeout = setTimeout(() => setShowResultCopy(false), 3000);
        });
    }

    return <div className="code">
        <ol className="code__text">
            <li>Скопируйте скрипт для вставки</li>
            <li>Перейдите в консоль браузера на нужном сайте</li>
            <li>Вставьте код</li>
        </ol>

        <div className="code__result">
            {result}
        </div>
        <div className="code__copy">
            <small className={`code__copy-success ${showResultCopy ? 'code__copy-success_open' : ''}`}>Успешно</small>
            <button className="code__copy-btn" onClick={copy}>Скопировать</button>
        </div>


    </div>
}