import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comicsList, setСomicsList] = useState([]); ////массив для 8 comics
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);


    const { loading, error, getAllComics } = useMarvelService();//вытягиваем нужные нам данные с хука

    useEffect(() => {
        updateComics();
    }, [])//если мы оставляем пустой массив то функция выполнеться только один раз при создании компонента

    //отдельный метод который отвечает за подгрузку с сервера комиксов
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        getAllComics(offset)
            .then(onComicsLoaded) 
    }

    const onComicsLoaded = (newComicsList) => {
        let ended = false;
        if ( newComicsList.length < 8 ) {//если загружено меньше 8 комиксов, отключаем кнопку
            ended = true
        }

        setСomicsList(comicsList => [...comicsList, ...newComicsList]);// добавляем новые комиксы к уже загруженным
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8); // обновляем offset для следующей подгрузки
        setComicsEnded(comicsEnded => ended);
    }

    //Назначение: загружает список комиксов с API
    const updateComics = () => {
        getAllComics() //получает список комиксов
            .then(onComicsLoaded) //в случае успеха срабатывает onCharactersLoaded,обновляя charList
    }

    //этот метод для оптимизации,чтобы не помещать такую конструкцию в метод render
    //(принимает массив комиксов и отображает каждый элемент <li> с уникальным key)
    function renderItems(arr) {
        const items = arr.map((item, i)=> {
            return (
                <li className="comics__item" key={i} >
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

    //эта конструкция вынесена для центровки спиннера/ошибки(Возвращает сетку <ul> с элементами персонажей)
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

//------------------------------------------------------------------------------------------------------------------------------------
    const items = renderItems(comicsList)

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;



    return (
        <div className="comics__list">

            {errorMessage}
            {spinner}
            {items}

            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': comicsEnded ? 'none' : 'block'}}
                    onClick={ () => onRequest(offset) }  >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;