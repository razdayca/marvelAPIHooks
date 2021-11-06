import './charInfo.scss';
import { useState, useEffect } from 'react';
import useMarvelAPI from '../../services/marvelAPI';
import PropTypes from 'prop-types';
import setContent from '../../utils/setContent';

const CharInfo = (props) => {

    const {getCharacter, clearError, process, setProcess} = useMarvelAPI();

    const [char, setChar] = useState(null);

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return
        }
        clearError();
        getCharacter(charId)
        .then(onCharLoaded)
        .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )

}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
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