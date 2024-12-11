import img from './error.gif';
import './errorMessage.scss';

const ErrorMessage = () => {

    return (
        <img className='error-mesage'
             src={img} 
             alt="Error"  />
    )
}

export default ErrorMessage;