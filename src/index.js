import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';



const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery')
const btLoadMore = document.querySelector('.load-more')
const lightbox = new SimpleLightbox(".gallery a", {captionsData: "alt",});
let page = 1;


form.addEventListener('submit', onSubmit);
form.addEventListener('input', onInput);
btLoadMore.addEventListener('click', onCklick);



   
async function onSubmit(evt){
       
    evt.preventDefault();
    const keyWord = await form.searchQuery.value;
    
    if(keyWord === ""){
       Notiflix.Notify.failure('🧐 Fill in the search field');
        return
    }
    
 
    
    try {
        const firstFetch = await fetchWord(keyWord);
        const createCurrentPage =  createMarkup(firstFetch.data.hits);
        lightbox.refresh();
        if(firstFetch.data.totalHits > 40){
          btLoadMore.hidden = false;
        }
      
       
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    
  


}


async function fetchWord(word, page = 1){

    const URL = 'https://pixabay.com/api/';
    const res = await axios.get(`${URL}?key=35825821-f8211c879ddd9906fcf28e8e5&q=${word}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&&per_page=40`);

    return res;
}


 async function onCklick(evt){
    evt.preventDefault();
     
    try {
        const keyWord = await form.searchQuery.value;
        page += 1;
    
    const nextPage = await fetchWord(keyWord,page);
 
    if(nextPage.data.totalHits/40 <= page){
       btLoadMore.hidden = true;
       Notiflix.Notify.warning("☺️ We're sorry, but you've reached the end of search results.");
     }
    
     createMarkup(nextPage.data.hits);
     return lightbox.refresh();
    
    } catch (error) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
     }
    
}



function createMarkup(arr){
   

    
if(arr.length === 0){
    return Notiflix.Notify.failure('🤔 Sorry, the search did not find anything. Please try again');
  }

  
const card = arr.map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) =>
  
`
<div class="photo-card" style="background-color: rgba(238, 248, 241, 70%);border: 2px solid hsl(141deg 93.47% 49.62%);
padding: 10px;">
<a href="${largeImageURL}" style="text-decoration: none;">
 <img width="300px" src="${webformatURL? webformatURL :'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg'}" alt="${tags}" loading="lazy" />
 <div class="info" style="color: #b14e9e;">
   <p class="info-item" style="margin-top: 5px;
   margin-bottom: 0px;">
     <b>Likes: ${likes}</b>
   </p>
   <p class="info-item" style="margin-top: 5px;
   margin-bottom: 0px;">
     <b>Views: ${views}</b>
   </p>
   <p class="info-item" style="margin-top: 5px;
   margin-bottom: 0px;">
     <b>Comments: ${comments}</b>
   </p>
   <p class="info-item" style="margin-top: 5px;
   margin-bottom: 0px;">
     <b>Downloads: ${downloads}</b>
   </p>
 </div>
 </a>
</div>
`).join("")


 return gallery.insertAdjacentHTML('beforeend',card);
 
}


function onInput(evt){

  gallery.innerHTML = '';
  btLoadMore.hidden = true;
    
 }

