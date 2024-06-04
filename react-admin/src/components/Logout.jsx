import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Logout() {
    let navigate = useNavigate();
    useEffect(() => {

        if (sessionStorage.admin) {
            sessionStorage.removeItem('admin');
        }
        navigate('/login')
    })
}

export default Logout;