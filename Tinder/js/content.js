let arrProfile =[]
let indexImg = 1 
function addButtonTinderGF() {
    let buttonTinderGF = `
    <div class="container">
        <header>
            <div class="search">
                <input type="number" class="num-of-people" placeholder="Enter num of people to check">
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
    var imgURL = chrome.runtime.getURL("images/filter.png");
    document.querySelector(".filter").src = imgURL;
    document.querySelector('.btn-search').addEventListener("click", searchBtn);
}
addButtonTinderGF()
function addProfile(arrProfile) {
    for (let i =0; i < arrProfile.length;i++) {
        console.log(arrProfile[i].userName);
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
function searchBtn() {
    let num = document.querySelector('.num-of-people').value
    localStorage.setItem('num', num);
    getProfile()
    function getProfile() {
        setTimeout( async function() {
            let numPeople = localStorage.getItem('num')
            document.querySelector('.searching').innerText = 'Searching...'+(arrProfile.length+1)+'/'+numPeople
            const teasers = await fetch('https://api.gotinder.com/v2/recs/core', {
                headers: {
                    'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                    platform: 'android'
                },
            })
            .then((res) => res.json())
            .then((res) => res.data.results);
            if (typeof teasers[1].experiment_info=='undefined') {
                var interests = ''
            } else {
                interests = teasers[1].experiment_info.user_interests.selected_interests
            }
            let objectProfile = {
            userName : teasers[1].user.name,
            birthDay : teasers[1].user.birth_date.slice(0,4),
            userBio : teasers[1].user.bio,
            distance : teasers[1].distance_mi,
            userInterests :  interests,
            photos : teasers[1].user.photos,
            avatarURL : teasers[1].user.photos[0].url,
            userID : teasers[1].user._id,
            }
            arrProfile.push(objectProfile)
            if (arrProfile.length<numPeople) {
                getProfile()
            } else {
                arrProfile = arrProfile.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.userName === value.userName && t.birthDay === value.birthDay && t.userBio === value.userBio && t.distance === value.distance && t.userInterests === value.userInterests && t.photos === value.photos && t.avatarURL === value.avatarURL && t.userID === value.userID
                ))
                )
                if (arrProfile.length<numPeople) {
                    getProfile()
                } else {
                    console.log(arrProfile)
                    addProfile(arrProfile)
                }
            }
        },1000)
    }
}


function showImage(arrPhotos) {
    // document.querySelector('.profile').style.backgroundImage  = `url('teasers[1].user.photos[${indexImg}].url')`
    // if (indexImg==arrPhotos.length-1) {
    //  indexImg=0
    // } else {
    //  ++indexImg
    // }
 }


