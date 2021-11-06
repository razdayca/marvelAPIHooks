import Spinner from '../components/spinner/Spinner';
import Skeleton from '../components/skeleton/Skeleton';
import ErrorMessage from '../components/errorMessage/ErrorMessage';


const setContent = (process, Compoment, data) => {
    switch (process) {
        case 'waiting':
            return <Skeleton/>
        case 'loading':
            return <Spinner/>
        case 'confirmed':
            return <Compoment data={data}/>
        case 'error':
            return <ErrorMessage/>
        default: 
            throw new Error('Unexpected process state')
    }
}

export default setContent;