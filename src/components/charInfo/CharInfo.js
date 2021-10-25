import './charInfo.scss';
import { useState, useEffect } from 'react';
import MarvelAPI from '../../services/marvelAPI';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import PropTypes from 'prop-types';

const CharInfo = (props) => {

    const marvelService = new MarvelAPI();

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        updateChar();
    }, [])

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return
        }
        onCharLoading();
        marvelService.getCharacter(charId)
        .then(onCharLoaded)
        .catch(onError)
    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>
    const spinner = loading ? <Spinner/> : null;
    const view = !(loading || error || !char) ? <View char={char}/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="char__info">
            {spinner}
            {view}
            {errorMessage}
            {skeleton}
        </div>
    )

}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
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
                {comics.length > 0 ? null : 'There is no comics with this Hero'}
                {
                    comics.map((item, i) => {
                        // eslint-disable-next-line
                        if( i > 9 ) return;
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        )
                    })
                }
               
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;