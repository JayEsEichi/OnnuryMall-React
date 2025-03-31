import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '../../components/header';

// 헤더의 내용과 구조 레이아웃 설정
function CommonHeaderLayout(){
    return (
        <>
            <Header />
            <Outlet />
            <ScrollRestoration />
        </>
    );
}

export default CommonHeaderLayout;