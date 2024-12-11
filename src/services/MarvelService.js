import useHttp from "../hooks/http.hook";

const useMarvelService = () => {

    const {loading, error, request, clearError} = useHttp();

    //выносим части URL в отдельные переменные:
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=f55b2898f2deb959f89d9f8262aadbb0';
    const _baseOffset = 210;


    //если нам нужен определенный персонаж,можем это сдлеать через интерполяцию
    const getCharacter = async (id) => {  //(его можно найти по айдишнику)
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

        return _transformCharacter(res.data.results[0])
    }

    // так же мы можем вытащить какое то определенное значение(например имя персонажа)
    const getAllCharacters = async (offset = _baseOffset) => { // подгрузит обьект с 9 персонажами 
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);

        return res.data.results.map(_transformCharacter);
    }

    //получение одного КОМИКСА
    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);

		return _transformComics(res.data.results[0]);
	};

    //получение КОМИКСОВ 
    const getAllComics = async ( offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);

    	return res.data.results.map(_transformComics);
	};

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'No description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || "There is no description",
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : "No information about the number of pages",
            thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price ? `${comics.prices[0].price}` : "not available"
        }
    }

    return {
        loading,
        error,
        getAllCharacters,
        getCharacter,
        clearError,
        getComic,
        getAllComics
    }
}

export default useMarvelService;