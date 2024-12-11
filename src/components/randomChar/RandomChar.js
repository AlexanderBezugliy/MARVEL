import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';

const RandomChar = () => {
    const [char, setChar] = useState(null);

    const { loading, error, getCharacter, clearError } = useMarvelService();//вытягиваем нужные нам данные с хука
    
    useEffect(() => {
        updateChar();
    }, [])

    //обновляет state.char данными нового персонажа
    const onCharLoaded = (char) => {
        setChar(char);
    }

    //метод который обращается к серверу, получает данные и записывает их в state
    //Назначение: загружает нового случайного персонажа.
    const updateChar = () => {
        clearError();//когда попадается персонаж с ошибкой то мы должны отчистить форму ошибки(автоматически это сделаться не может)

        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

        getCharacter(id) //запрашивает данные персонажа по его ID
            .then(onCharLoaded);
    }
//------------------------------------------------------------------------------------------------------------------------------------
    
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View char={char} /> : null


    return (
        <div className="randomchar">

            {errorMessage}
            {spinner}
            {content}

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
}

//View - отображает данные персонажа(имя, описание, изображение, ссылки на homepage и wiki)как отдельный компонент для удобства
const View = ( {char} ) => {
    if (!char) return null; // Возвращаем null, если char отсутствует

    const { name, description, thumbnail, homepage, wiki } = char;

    //что бы картинка с ошибкой имела style(object-fit: unset;)
    let imgStyle = { 'objectFit': 'cover' }
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit' : 'unset' }
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;
