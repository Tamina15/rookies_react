import { useEffect, useState } from "react";
import { Button, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { default as Pagination } from './Pagination'

const tableHeader = ['ID', 'Email', 'Username', "Block", "Roles"]


function Users(props) {
    const { baseUrl, loggedIn, token } = props;
    let [users, setUsers] = useState([]);

    let [total, setTotal] = useState(0);
    let [error, setError] = useState(false);
    let [loading, setLoading] = useState(true);

    let navigate = useNavigate();

    const getUsers = async (url) => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            if (response.status === 401 || response.status === 403) { return navigate('/login') }
            if (response.status > 500) {
                { console.error(e.status); setError(true); }
            }
            let data = await response.json();
            setUsers(data.users);
            setTotal(data.count);
            setLoading(false)
        }).catch((e) => { console.error(e.status); setError(true); });
    };

    useEffect(() => {
        if(!loggedIn){
            return navigate('/login')
        }
        getUsers(baseUrl + 'users?sortBy=id');
    }, []);

    if (error) {
        navigate('/error')
    }

    function changePage(page, pageSize) {
        console.log(page, pageSize);
        getUsers(baseUrl + "users?" + "page=" + (page - 1) + "&" + "limit=" + (pageSize) + "&" + "sortBy=" + "id").catch((e) => { console.error(e); setError(true); });
    }

    async function blockUser(e, block) {
        const id = e.target.value;
        const result = await fetch(baseUrl + 'users/' + id + "/" + block, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(async response => {
            if (response.status >= 500) {
                return window.alert("Failed to Block USer");
            }
            if (response.status === 401 || response.status === 403) { window.alert("Failed to Block USer"); return navigate('/login') }
            if (response.status >= 400) {
                throw Error(response.statusText)
            }
            let user = await response.json();
            users = users.map(u => u.id !== user.id ? u : user);
            setUsers(u => [...users])
        }).catch((e) => { console.error("error", e); });
    }

    async function restoreUser(e) {
        setLoading(true)
        const result = await fetch(baseUrl + "users/" + e.target.value, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token,
            },
        }).then(response => {
            setLoading(false)
            if (response.status >= 500) {
                return window.alert("Failed to Restore User");
            }
            if (response.status === 401 || response.status === 403) { window.alert("Failed to Restore User"); return navigate('/login') }
            if (response.status >= 400)
                throw Error(response.statusText)

            const index = users.find(i => i.id == e.target.value)
            if (index != undefined) {
                index.deleted = false;
            }
            setUsers(u => [...users])
            window.alert("Restore User Successfully")
        }).catch((e) => { window.alert("Failed to Restore User"); });
        return setLoading(false)
    }

    async function deleteUser(e, hard) {
        e.preventDefault();
        setLoading(true)
        let user_id = e.target.value;
        let text = "Delete User. Press Comfirm to Proceed";
        if (confirm(text) == true) {
            let body = { user_id: user_id, hard: hard };
            const result = await fetch(baseUrl + "users", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(body),
            }).then(response => {
                setLoading(false)
                if (response.status >= 500) {
                    return window.alert("Failed to Delete Image. Code 500");
                }
                if (response.status === 401 || response.status === 403) { window.alert("Failed to Delete Image"); return navigate('/login') }
                if (response.status >= 400) {
                    throw Error(response.statusText)
                }
                let index = users.find(i => i.id == user_id)
                if (index != undefined) {
                    if (hard) {
                        users.splice(index, 1);
                    }
                    else {
                        index.deleted = true
                    }
                }
                setUsers(u => [...users])
                window.alert("Delete Successfully")
            }).catch((e) => { window.alert("Failed to Delete Image"); console.log(e) });
        } else {
            return setLoading(false)
        }
    }



    return (<>
        {loading ? (<h5 className="m-5"> Loading ... </h5>) : ""}
        <Container className="m-3">
            <Button>New Admin</Button>
        </Container>
        <Table striped bordered hover size="sm" className="mt-3">
            <thead>
                <tr>
                    {tableHeader.map((header) => (
                        <th key={header} >{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody key={"table_body"}>
                {users && users.map((user, index) => (
                    <tr key={"table_row_" + index} style={{ height: "100px" }}>
                        <td key={user.id}> {user.id}</td>
                        <td> {user.email}</td>
                        <td > {user.username}</td>
                        <td defaultValue={user.isBlock ? "Blocked" : ""}> {user.isBlock ? "Blocked" : ""}</td>
                        <td> {user.roles && user.roles.map(role => { return role })}</td>
                        <td style={{ width: "400px" }}><Container className="justify-content-center d-flex flex-row">
                            {/* <Button className="m-3 btn-warning" key={"edit_" + user.id} as={Link} to={"/users/" + user.id}>Edit</Button> */}
                            {
                                user.isBlock ?
                                    <Button className="m-3 btn-warning" key={"unblock_" + user.id} value={user.id} onClick={(e) => blockUser(e, false)}>Unblock</Button>
                                    :
                                    <Button className="m-3 btn-warning" key={"block_" + user.id} value={user.id} onClick={(e) => blockUser(e, true)}>Block</Button>
                            }
                            {
                                user.deleted ?
                                    <>
                                        {/* <Button className="m-3 btn-danger" key={"delete_" + user.id} value={user.id} onClick={(e) => deleteUser(e, true)}>Hard Delete</Button> */}
                                        <Button className="m-3 btn-success" key={"restore_" + user.id} value={user.id} onClick={(e) => restoreUser(e)}>Restore</Button>
                                    </>
                                    :

                                    <Button className="m-3 btn-danger" key={"delete_" + user.id} value={user.id} onClick={(e) => deleteUser(e, false)}>Soft Delete</Button>
                            }
                        </Container>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>

        <Row className='mt-4 justify-content-center'>
            <Pagination changePage={changePage} total={total}></Pagination>
        </Row>
    </>);
}

export default Users;