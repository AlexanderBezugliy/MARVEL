import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const { loading, error, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    //отвечает за загрузку данных персонажа
    const updateChar = () => {
        const { charId } = props;

        if (!charId) {
            return;
        }

        clearError();// вдруг мы выберем персонажа который даст ошибку
        getCharacter(charId)//загружаем данные персонажа
            .then(onCharLoaded)//если успешно, вызываем onCharLoaded
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

//------------------------------------------------------------------------------------------------------------------------------------
    const skeleton = char || loading || error ? null : <Skeleton />
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

//View-отображает данные о персонаже. Используется для структурирования и переиспользования кода
const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    //что бы картинка с ошибкой имела style(object-fit: unset;)
    let imgStyle = { 'objectFit': 'cover' }
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit' : 'unset' }
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {/* условие если у персонажа нет не одного комикса */}
                { comics.length > 0 ? null : 'There is no comics with this character...' }

                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if (i > 9) return;

                        // Извлекаем comicId из resourceURI(для каждого item берём его resourceURI,
                        //разбиваем строку на массив с помощью .split('/'),и получаем последний элемент с помощью .pop().Это и есть comicId)
                        const comicId = item.resourceURI.split('/').pop();

                        return (
                            <li key={i} className="char__comics-item">
                                {/* Создаём ссылку на страницу комикса с его ID */}
                                <Link to={`/comics/${comicId}`}>
                                    {item.name}
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;