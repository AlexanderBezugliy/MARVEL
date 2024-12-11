import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


const CharList = (props) => {

    const [charList, setCharList] = useState([]); //массив для девяти персонажей
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210); //1560
    const [charEnded, setCharEnded] = useState(false);
    const [activeChar, setActiveChar] = useState(null);//создаем стейт для выбранного персонажа(будем отслеживать по айди)

    const { loading, error, getAllCharacters } = useMarvelService();//вытягиваем нужные нам данные с хука

    useEffect(() => {
        updateCharacters();
    }, [])//если мы оставляем пустой массив то функция выполнеться только один раз при создании компонента

    //отдельный метод который отвечает за подгрузку с сервера персонажей
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        getAllCharacters(offset)
            .then(onCharactersLoaded) 
    }

    const onCharactersLoaded = (newCharList) => {
        let ended = false;
        if ( newCharList.length < 9 ) {//если загружено меньше 9 персонажей, отключаем кнопку
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);// добавляем новых персонажей к уже загруженным
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9); // обновляем offset для следующей подгрузки
        setCharEnded(charEnded => ended);
    }

    //Назначение: загружает список персонажей с API
    const updateCharacters = () => {
        getAllCharacters() //получает список персонажей
            .then(onCharactersLoaded) //в случае успеха срабатывает onCharactersLoaded,обновляя charList
    }

    // Устанавливаем активного персонажа
    const setedActiveChar = (id) => {
        setActiveChar(id)
    }
    
    //этот метод для оптимизации,чтобы не помещать такую конструкцию в метод render
    //(принимает массив персонажей и отображает каждый элемент <li> с уникальным key)
    function renderItems(arr) {
        const items = arr.map(item => {
            let imgStyle = { 'objectFit': 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }
            // Проверяем, является ли персонаж активным, и добавляем класс
            const activeClass = (activeChar === item.id) ? 'char__item_selected' : '';

            return (
                <li className={`char__item ${activeClass}`}
                    key={item.id}
                    onClick={ () => {props.onCharSelected(item.id); // Передаём id выбранного персонажа 
                                     setedActiveChar(item.id); 
                    }} >

                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

    //эта конструкция вынесена для центровки спиннера/ошибки(Возвращает сетку <ul> с элементами персонажей)
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

//------------------------------------------------------------------------------------------------------------------------------------
    const items = renderItems(charList)

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="char__list">

            {errorMessage}
            {spinner}
            {items}

            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={ () => onRequest(offset) } >

                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;