import styles from '../styles/Footer.css';
import logoImage from '../assets/onnury_logo.png';

function Footer(){
    return (
        <footer>
            <div id='footer-content' className='footer-content'>
                <div id='footer-detail-content-1' className='footer-container'>
                    <div><a href='/notice'>공지사항</a></div>
                    <div><a href='/inquiry'>문의하기</a></div>
                    <div><a href='/faq'>FAQ</a></div>
                    <div><a href='/policy'>이용약관</a></div>
                    <div><a href='/policy'>개인정보처리방침</a></div>
                </div>
                <div id='footer-detail-content-2' className='footer-container'>
                    <img src={logoImage} alt='이미지 로고'></img>
                </div>
                <div id='footer-detail-content-3' className='footer-container'>
                    <p>상호명 : 주식회사 디앤티 | 경기도 김포시 김포한강10로 133번길 107, 7층 772호 (구래동,디원시티시그니쳐)</p>
                    <p>사업자등록번호 : 820-86-00989 | 통신판매업신고번호 : 2019-경기김포-1396호</p>
                    <p>대표이사 : 유창용 | 전화번호 : 1670-2024 | 이메일 : dntinfo@naver.com</p>
                </div>
                <div id='footer-detail-content-4' className='footer-container'>
                    <p>(주)디앤티는 통신판매중개자이며, 통신판매의 당사자가 아닙니다. 상품, 상품정보, 거래에 관한 의무와 책임은 판매자에게 있습니다.</p>
                    <p>본 사이트의 컨텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.</p>
                </div>
                <div id='footer-detail-content-5' className='footer-container'>
                    <p>COPYRIGHT © DNT LTD.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;