let arrProfile = []
let indexImg = 1 
try {
    arrProfile = JSON.parse(localStorage.getItem("arrProfile") || "[]")
    
} catch (error) {
    
}
addButtonTinderGF()
createArrProfile()

function createArrProfile() {
    if (!(arrProfile.length==0)) {
        alert('Automatically reload to avoid error 429. Enter the number of people and continue searching')
        document.querySelector('.searching').innerText = '   '+arrProfile.length + ' users'
        addArrProfile(arrProfile)
    } 
}
function addArrProfile(arrProfile) {
    for (let i = 0; i < arrProfile.length; i++) {
        let distance = parseInt(arrProfile[i].distance)*1.6
        let profileLikeYou = `
        <div class="profile id${arrProfile[i].userID}">
        <div class="distance-mi">${distance} kilometers</div>
        <div class="user-bio">${arrProfile[i].userBio}</div>
        <div class="user">
            <div class="user-name">${arrProfile[i].userName}</div>
            <div class="user-birthday">${arrProfile[i].birthDay}</div>
        </div>
        </div>
        `
        document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileLikeYou, 'text/html').body.firstElementChild)
        document.querySelector(`.id${arrProfile[i].userID}`).style.backgroundImage  = `url(${arrProfile[i].avatarURL})`
        document.querySelector('.profile').addEventListener('click',showImage(arrProfile[i].photos))
    }
}
function addButtonTinderGF() {
    let buttonTinderGF = `
    <div class="container">
        <header>
            <div class="search">
                <input type="number" class="num-of-people" placeholder="Enter number people to check">
                <div class="btn-search btn">Search</div>
            </div>
        </header>
        <img alt="Filter" class="filter"></img>
        <div class="searching"></div>
        <div class="content">
            <div class="all-profile">
            </div>
        </div> 
    </div>`
    let body = document.querySelector('body')
    body.appendChild(new DOMParser().parseFromString(buttonTinderGF, 'text/html').body.firstElementChild)
    // var imgURL = chrome.runtime.getURL("images/filter.png")
    // document.querySelector(".filter").src = imgURL
    document.querySelector('.btn-search').addEventListener("click", searchBtn)
}
function addProfile(objectProfile) {
    let distance = parseInt(objectProfile.distance)*1.6
    let profileLikeYou = `
    <div class="profile id${objectProfile.userID}">
    <div class="distance-mi">${distance} kilometers</div>
    <div class="user-bio">${objectProfile.userBio}</div>
    <div class="user">
        <div class="user-name">${objectProfile.userName}</div>
        <div class="user-birthday">${objectProfile.birthDay}</div>
    </div>
    </div>
    `
    document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileLikeYou, 'text/html').body.firstElementChild)
    document.querySelector(`.id${objectProfile.userID}`).style.backgroundImage  = `url(${objectProfile.avatarURL})`
    document.querySelector('.profile').addEventListener('click',showImage(objectProfile.photos))
}
function searchBtn() {
    let num = document.querySelector('.num-of-people').value
    localStorage.setItem('num', num);
    let countLoop = 1
    getProfile()
    function getProfile() {
        setTimeout( async function() {
            let numPeople = localStorage.getItem('num')
            document.querySelector('.searching').innerText = 'Searching...'+(arrProfile.length+1)+'/'+numPeople
            const userLikeU = await fetch('https://api.gotinder.com/v2/recs/core', {
                headers: {
                    'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                    platform: 'android'
                },
            })
            .then((res) => res.json())
            .then((res) => res.data.results);
            if (typeof userLikeU[1].experiment_info=='undefined') {
                var interests = ''
            } else {
                interests = userLikeU[1].experiment_info.user_interests.selected_interests
            }
            let objectProfile = {
            userName : userLikeU[1].user.name,
            birthDay : userLikeU[1].user.birth_date.slice(0,4),
            userBio : userLikeU[1].user.bio,
            distance : userLikeU[1].distance_mi,
            // userInterests :  interests,
            // photos : userLikeU[1].user.photos,
            avatarURL : userLikeU[1].user.photos[0].url,
            userID : userLikeU[1].user._id,
            }
            console.log(objectProfile);
            
            let hasContain = false
            for (let i=0; i < arrProfile.length;i++) {
                if(arrProfile[i].userID==objectProfile.userID) {
                    countLoop++
                    console.log('contain');
                    hasContain=true
                    i=arrProfile.length
                } 
            }  
            if (!hasContain) {
                arrProfile.push(objectProfile)
                addProfile(objectProfile)
            }
            if (countLoop%20==0) {
                localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
                window.location.reload();
            }
            if (arrProfile.length<numPeople) {
                getProfile()
            }
        },2000)
        
    }
}


function showImage(arrPhotos) {
    // document.querySelector('.profile').style.backgroundImage  = `url('userLikeU[1].user.photos[${indexImg}].url')`
    // if (indexImg==arrPhotos.length-1) {
    //  indexImg=0
    // } else {
    //  ++indexImg
    // }
 }


