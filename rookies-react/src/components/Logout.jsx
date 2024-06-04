import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Logout() {
    let navigate = useNavigate();
    useEffect(() => {

        if (sessionStorage.user) {
            sessionStorage.removeItem('user');
        }
        navigate('/')
    })
}

export default Logout;