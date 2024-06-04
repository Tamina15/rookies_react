import { Pagination } from "antd";
import { useEffect, useState } from "react";

function App(props) {
    const { changePage, total } = props;
    const [current, setCurrent] = useState(1);
    const onChange = (page, pageSize) => {
        console.log(page, pageSize);
        setCurrent(page);
        changePage(page, pageSize);
    };
    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };
    return <Pagination /*showSizeChanger onShowSizeChange={onShowSizeChange}*/ current={current} onChange={onChange} total={total} defaultPageSize = {12} />;
}

export default App;