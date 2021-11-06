import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelAPI from '../../services/marvelAPI';
import AppBanner from '../appBanner/AppBanner';
import setContent from '../../utils/setContent';

import './singleComic.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const {process, setProcess, getComic, clearError} = useMarvelAPI();

    useEffect(() => {
        updateComic()
    }, [comicId])

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, View, comic)}
        </>
       
    )
}

const View = ({data}) => {
    const {title, description, pageCount, thumbnail, language, price} = data;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}


export default SingleComicPage;