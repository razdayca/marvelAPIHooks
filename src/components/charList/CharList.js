import './charList.scss';
import React, { useState, useEffect, useRef } from 'react';
import MarvelAPI from '../../services/marvelAPI';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newCharLoading, setNewCharLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelAPI();

    useEffect(() => {
        onRequest();
    }, [])

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewCharLoading(newCharLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewCharLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    const myRef = useRef([]);

    const focusOnItem = (id) => {
        myRef.current.forEach(item => item.classList.remove('char__item_selected'));
        myRef.current[id].classList.add('char__item_selected');
        myRef.current[id].focus();
    }

    function allChars(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return (
                    <li className="char__item" ref={el => myRef.current[i] = el} key={item.id} tabIndex={0} onClick={()=> {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = allChars(charList);

    const spinner = loading ? <Spinner/> : null;
    const view = !(loading || error) ? items : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="char__list">
            <ul className="char__grid">
                {spinner}
                {view}
                {errorMessage}
            </ul>
            <button className="button button__main button__long" disabled={newCharLoading} style={{'display': charEnded ? 'none' : null}} onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;