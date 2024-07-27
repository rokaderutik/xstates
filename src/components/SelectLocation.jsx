import "./SelectLocation.css";
import { useState, useEffect, useRef } from "react";

export default function SelectLocation() {
    const countryRef = useRef(null);
    const stateRef = useRef(null);
    const cityRef = useRef(null);

    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const [country, setCountry] = useState("");
    const [countryDropDown, setCountryDropDown] = useState(false);

    const [state, setState] = useState("");
    const [stateDropDown, setStateDropDown] = useState(false);

    const [city, setCity] = useState("");
    const [cityDropDown, setCityDropDown] = useState(false);
    

    useEffect(() => {
        function fetchCountries() {
            fetch("https://crio-location-selector.onrender.com/countries")
            .then(res => res.json())
            .then(data => setCountryList(data))
            .catch(e => console.error('Failed to fetch countries: ', e.messege));
        }

        fetchCountries();

        document.addEventListener("click", toogleCountry);
        document.addEventListener("click", toogleState);
        document.addEventListener("click", toogleCity);

        return () => { 
            document.removeEventListener("click", toogleCountry);
            document.removeEventListener("click", toogleState);
            document.removeEventListener("click", toogleCity);
        }
    }, []);

    useEffect(() => {
        function fetchState() {
            fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
            .then(res => res.json())
            .then(data => setStateList(data))
            .catch(e => console.error('Failed to fetch states: ', e.messege));
        }

        if(country !== '') {
            fetchState();
        }
    }, [country]);

    useEffect(() => {
        function fetchCity() {
            fetch(` https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`)
            .then(res => res.json())
            .then(data => setCityList(data))
            .catch(e => console.error('Failed to fetch cities: ', e.messege));
        }

        if(state !== '') {
            fetchCity();
        }
    }, [state]);

    function toogleCountry(e) {
        setCountryDropDown(e && e.target === countryRef.current);
    }

    function toogleState(e) {
        setStateDropDown(e && e.target === stateRef.current);
    }

    function toogleCity(e) {
        setCityDropDown(e && e.target === cityRef.current);
    }

    function handleCountryChange(countryName) {
        if(state !== '') {
            setState('');
        }
        if(city !== '') {
            setCity('');
        }

        setCountry(countryName);
    }

    function handleStateChange(stateName) {
        if(city !== '') {
            setCity('');
        }

        setState(stateName);
    }

    return (
        <div className="wrapper">
            <h1>Select Location</h1>
            <div className="select_wrapper">
                <div 
                    className="input" 
                    style={{width: "200px"}}
                    ref={countryRef}
                    onClick={toogleCountry}
                >
                    {country ? country : "Select Country"}
                    <div className={`dropdown ${countryDropDown ? "dropdown-open" : ""}`}>
                        <div className="dropdown-item">Select Country</div>
                            {
                                countryList.map((countryName) => {
                                    return (
                                        <div 
                                            key={countryName}
                                            className={`dropdown-item ${countryName === country ? 'dropdown-item-selected' : ""}`}
                                            onClick={() => handleCountryChange(countryName)}
                                        >
                                            {countryName}
                                        </div>
                                    );
                                })
                            }
                    </div>
                </div>

                <div 
                    className="input" 
                    ref={stateRef}
                    onClick={toogleState}
                >
                    {state ? state : "Select State"}
                    {
                        country &&
                        <div className={`dropdown ${stateDropDown ? "dropdown-open" : ""}`}>
                            <div className="dropdown-item">Select State</div>
                                {
                                    stateList.map((stateName) => {
                                        return (
                                            <div 
                                                key={stateName}
                                                className={`dropdown-item ${stateName === state ? 'dropdown-item-selected' : ""}`}
                                                onClick={() => handleStateChange(stateName)}
                                            >
                                                {stateName}
                                            </div>
                                        );
                                    })
                                }
                        </div>
                    }
                </div>

                <div 
                    className="input" 
                    ref={cityRef}
                    onClick={toogleCity}
                >
                    {city ? city : "Select City"}
                    {
                        state &&
                        <div className={`dropdown ${cityDropDown ? "dropdown-open" : ""}`}>
                            <div className="dropdown-item">Select City</div>
                                {
                                    cityList.map((cityName) => {
                                        return (
                                            <div 
                                                key={cityName}
                                                className={`dropdown-item ${cityName === city ? 'dropdown-item-selected' : ""}`}
                                                onClick={() => setCity(cityName)}
                                            >
                                                {cityName}
                                            </div>
                                        );
                                    })
                                }
                        </div>
                    }   
                </div>
            </div>

            {
                city &&
                <h2>You Selected {city}, {state}, {country}</h2>
            }
        </div>
    );
}