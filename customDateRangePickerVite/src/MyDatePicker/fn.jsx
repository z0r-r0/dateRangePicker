import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.css';

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

 const MyDatePicker = () => {
    const [getMonthDetails, setMonthDetails] = useState([])
    const [showDatePicker, setShowDatePicker] = useState(false)
    
    useEffect(()=> {
        window.addEventListener('click', addBackDrop);
    }, [])


    // componentWillUnmount() {
    //     window.removeEventListener('click', this.addBackDrop);
    // }

    const addBackDrop = e => {
        if(showDatePicker ) {
            setShowDatePicker(false);
        }
    }

    const showDatePickerHandler = () => {
        setShowDatePicker(true)
    }

    
        return (
            <div className='MyDatePicker'>
                <div className='mdp-input' onClick={()=> showDatePickerHandler(true)}>
                    <input type='date'/>
                </div>
                {showDatePicker ? (
                    <div className='mdp-container'> 
                    </div>
                ) : ''}
            </div>
        )
    

}

export default MyDatePicker