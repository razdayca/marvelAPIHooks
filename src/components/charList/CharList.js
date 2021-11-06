import './charList.scss';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import useMarvelAPI from '../../services/marvelAPI';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

const setContent = (process, Compoment, newCharLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>
        case 'loading':
            return newCharLoading ? <Compoment/> : <Spinner/>
        case 'confirmed':
            return <Compoment/>
        case 'error':
            return <ErrorMessage/>
        default: 
            throw new Error('Unexpected process state')
    }
}


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newCharLoading, setNewCharLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelAPI();

    useEffect(() => {
        onRequest(offset ,true);
        // eslint-disable-next-line
    }, [])

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }
        setCharList(charList => [...charList, ...newCharList]);
        setNewCharLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)
    }

    const onRequest = (offset, initial) => {
        initial ? setNewCharLoading(false) : setNewCharLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
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

    const elems = useMemo(() => {
        return setContent(process, () => allChars(charList), newCharLoading);
        // eslint-disable-next-line
    }, [process])

    return (
        <div className="char__list">
            <ul className="char__grid">
                {elems}
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