import './comicsList.scss';
import React, { useState, useEffect } from 'react';
import useMarvelAPI from '../../services/marvelAPI';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';


const ComicsList = () => {

    const [comicList, setComicList] = useState([]);
    const [newComicLoading, setNewComicLoading] = useState(false);
    const [offset, setOffset] = useState(10);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelAPI();

    useEffect(() => {
        onRequest(offset ,true);
    }, [])

    const onComicListLoaded = (newComicList) => {
        let ended = false;
        if(newComicList.length < 8) {
            ended = true
        }
        setComicList(comicList => [...comicList, ...newComicList]);
        setNewComicLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const onRequest = (initial) => {
        initial ? setNewComicLoading(false) : setNewComicLoading(true);
        getAllComics(offset)
            .then(onComicListLoaded)
    }


    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicList);

    const spinner = loading && !newComicLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {items}
            {errorMessage}
            <button className="button button__main button__long" disabled={newComicLoading} style={{'display': comicsEnded ? 'none' : null}} onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


export default ComicsList;