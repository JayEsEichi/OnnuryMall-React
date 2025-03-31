import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GalleryContent = {
    'galleryId' : Number,
    'title' : String,
    'contentDetail' : String,
    'thumbImgUrl' : String,
    'detailImgUrl' : String,
    'createAt' : String,
    'updateAt' : String
}

function GalleryDetail(){
    const [GalleryContent, setContent] = useState(null);
    const { contentId } = useParams();

    useEffect(() => {
        fetchContent();
        console.log("effect 호출 확인");
    }, [contentId]);

    console.log(contentId);

    async function fetchContent(){
        const res = await fetch(`http://localhost:8080/gallery/content/detail?gci=` + contentId);
        console.log(res);

        const content = await res.json();
        console.log(content);

        setContent(content.responseData);
    }

    console.log(GalleryContent);

    const responseData = GalleryContent;

    return (
        <div>
            <h3>{responseData.title}</h3>
            <p>{responseData.contentDetail}</p>
            <p>{responseData.thumbImgUrl}</p>
            <p>{responseData.detailImgUrl}</p>
            <p>{responseData.createAt}</p>
            <p>{responseData.updateAt}</p>
        </div>
    );
}

export default GalleryDetail;