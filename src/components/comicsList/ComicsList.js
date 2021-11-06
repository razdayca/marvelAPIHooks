import './comicsList.scss';
import React, { useState, useEffect } from 'react';
import useMarvelAPI from '../../services/marvelAPI';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';

const setContent = (process, Component, newComicLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newComicLoading ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>
        default: 
            throw new Error('Unexpected process state')
    }
}

const ComicsList = () => {

    const [comicList, setComicList] = useState([]);
    const [newComicLoading, setNewComicLoading] = useState(false);
    const [offset, setOffset] = useState(10);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, process, setProcess} = useMarvelAPI();

    useEffect(() => {
        onRequest(offset ,true);
        // eslint-disable-next-line
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

    const onRequest = (offset, initial) => {
        initial ? setNewComicLoading(false) : setNewComicLoading(true);
        getAllComics(offset)
            .then(onComicListLoaded)
            .then(() => setProcess('confirmed'))
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

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicList), newComicLoading)}
            <button className="button button__main button__long" disabled={newComicLoading} style={{'display': comicsEnded ? 'none' : null}} onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


export default ComicsList;