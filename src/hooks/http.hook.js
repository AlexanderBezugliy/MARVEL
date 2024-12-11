import { useState, useCallback } from "react";

const useHttp = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback( async (url, method = 'GET', body = null, headers = { 'Content-type' : 'application/json'}) => {

        setLoading(true);//как и было в запросе после запроса идет сразу загрузка(как в класовых комп.)
        try {
            //                         сам url, {обьект с  настройками}  
            const response = await fetch(url, {method, body, headers});
            //добавляем проверку:
            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status ${response.status}`);
            }
            // получаем ответ зная что это прийдет ПРОМИС
            const data = await response.json();
            setLoading(false);// выключаем закгрузку 

            return data;//если все впорядке то наш метод request вернет данные c сервера(data)
        } catch(e) {
            setLoading(false);//если получилась какая то ошибка нам нужно выключить загрузку
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, []);


    return {
        loading,
        error,
        request,
        clearError
    }
}

export default useHttp;