let slideIndex = 1
let n = 1
let indexImg = 1
let arrIDPassed = []
let countAutoTimes = 0
let currentIndexPassed
let countUserAuto = 0
let stopAuto = false
let mode = 'home'
let indexTeaser = 0
try {
    arrIDPassed = localStorage.getItem('arrIDPassed').split(",")
} catch (error) { }
if (arrIDPassed[0] == '') {
    arrIDPassed.splice(0, 1)
}
renderButtonGF()
renderLobby()
try {
    mode = localStorage.getItem('mode')
    if (mode == 'auto-like') {
        getListUser()
        countUserAuto = localStorage.getItem('countUserAuto')
    } else {
        localStorage.setItem('countAutoTimes', 0)
        countUserAuto = 0
    }
} catch (error) {

}

function actionClick(element) {
    element.style.transform = 'scale(0.93)'
    setTimeout(() => {
        element.style.transform = 'scale(1)'
    }, 150)
}
function renderButtonGF() {
    let buttonTinderGF = `
    <div class="btn btn-tinder-gf"> Tinder GF</div>
    `

    let mainView = document.querySelector('body')
    mainView.appendChild(new DOMParser().parseFromString(buttonTinderGF, 'text/html').body.firstElementChild)
   
    let btnTinderGF = document.querySelector('.btn-tinder-gf')
    btnTinderGF.addEventListener('click', function () {
        actionClick(btnTinderGF)
        document.querySelector(".container-GF").classList.toggle('hide')
        setTimeout(function () {
            document.querySelector(".container-GF").classList.toggle('display-none')
        }, 300)
    })
}
function renderLobby() {
    let containerTinderGF = `
    <div class="container-GF">
    <div class="home">
    <div class="btn btn-home btn-like-u">Likes You</div>
    <div class="btn btn-home auto-match">Fix Error</div>
    <div class="btn btn-home btn-rewind">Rewind</div>
    <div class="btn btn-home btn-auto-like">Auto Like (Beta)</div>
    <div class="btn btn-home btn-unblur">Unblur Image</div>
</div>
    </div>
    `
    let body = document.querySelector('body')
    body.appendChild(new DOMParser().parseFromString(containerTinderGF, 'text/html').body.firstElementChild)
    document.querySelectorAll('.btn-home').forEach(element => {
        element.addEventListener('click', function () {
            actionClick(element)
        })
    })

    let containerGF= document.querySelector(".container-GF")
    let btnLikesYou = document.querySelector('.btn-like-u')
    let btnRewind = document.querySelector('.btn-rewind')
    let btnUnblur = document.querySelector('.btn-unblur')
    let bntUnlimitedLike = document.querySelector('.btn-auto-like')
    let homeDiv = document.querySelector('.home')
    let autoMatch = document.querySelector('.auto-match')
    btnLikesYou.addEventListener('click', function () {
        mode = 'like-u'
        setTimeout(() => {
            homeDiv.remove()
            getProfile()
        }, 200);
    })
    btnRewind.addEventListener('click', function () {
        mode = 'rewind'
        setTimeout(() => {
            homeDiv.remove()
            if (arrIDPassed.length == 0 || arrIDPassed[0] == '') {
                renderRewindNonUser()
            } else {
                currentIndexPassed = arrIDPassed.length - 1
                getUserPassed(arrIDPassed[currentIndexPassed])
            }
        }, 200);
    })
    autoMatch.addEventListener('click',function() {
        document.querySelector('body > div').style.width = '100%'
        // mode = 'auto-match'
        // setTimeout(() => {
        //     getProfileAutoMatch()
        // }, 200);
    })
    bntUnlimitedLike.addEventListener('click', function () {
        stopAuto = false
        mode = 'auto-like'
        localStorage.setItem('mode', mode)
        getListUser()

    })
    btnUnblur.addEventListener('click', function () {
        unblurTeasers()
    })
}
async function getProfileAutoMatch() {
    indexTeaser = (indexTeaser==10)? 0 : indexTeaser
    const teasers = await fetch('https://api.gotinder.com/v2/fast-match/teasers', {
            headers: {
                'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                platform: 'android'
            },
        })
            .then((res) => res.json())
            .then((res) => res.data.results);
        try {
            let _id = teasers[indexTeaser].user.photos[0].url.replace('https://images-ssl.gotinder.com/', '').split('/')[0]
            console.log(isContainArrPassed(_id));
            console.log(_id);
            if (isContainArrPassed(_id) == false) {
                console.log('false');
                if (_id != 'https:') {
                    console.log('get user');
                    const userLikeYou = await fetch(`https://api.gotinder.com/user/${_id}`, {
                        headers: {
                            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                            platform: 'android'
                        },
                    })
                        .then((res) => res.json())
                        .then((res) => res.results);
                    let interests
                    let birthDayUser
                    let distanceUser
                    try {
                        interests = userLikeYou.user_interests.selected_interests
                    } catch (error) {
                        interests = []
                    }
                    try {
                        birthDayUser = userLikeYou.user.birth_date.slice(0, 4)
                    } catch (error) {
                        birthDayUser = ''
                    }
                    try {
                        distanceUser = userLikeYou.distance_mi
                    } catch (error) {
                        distanceUser = '0'
                    }
                    let objectProfile = {
                        sNumber: userLikeYou.s_number,
                        userName: userLikeYou.name,
                        birthDay: birthDayUser,
                        userBio: userLikeYou.bio,
                        distance: distanceUser,
                        userInterests: interests,
                        photos: userLikeYou.photos,
                        avatarURL: userLikeYou.photos[0].url,
                        userID: userLikeYou._id,
                    }
                    renderProfile(objectProfile)
                } else {
                    indexTeaser++
                    getProfile()
                }
            } else {
                indexTeaser++
                getProfile()
            }
        } catch (error) { }
}
function renderRewindNonUser() {
    document.querySelector(".container-GF").innerHTML = `
                <div class="rewind">
                    <div class="non-user-passed">EMPTY</div>
                    <div class="back-to-home">BACK</div>
                </div>`
    document.querySelector('.back-to-home').addEventListener('click', function () {
        document.querySelector(".container-GF").remove()
        renderLobby()
    })
}
async function getProfile() {

    renderLoader()
    console.log(indexTeaser);
    console.log('run');
    if (indexTeaser < 10) {
        const teasers = await fetch('https://api.gotinder.com/v2/fast-match/teasers', {
            headers: {
                'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                platform: 'android'
            },
        })
            .then((res) => res.json())
            .then((res) => res.data.results);
            if (indexTeaser > teasers.length-1) {
                indexTeaser = 10
                getProfile()
                console.log('getProfile1');
            } 
        try {
            let _id = teasers[indexTeaser].user.photos[0].url.replace('https://images-ssl.gotinder.com/', '').split('/')[0]
            console.log(isContainArrPassed(_id));
            console.log(_id);
            console.log(indexTeaser);
            if (isContainArrPassed(_id) == false) {
                console.log('false');
                if (_id != 'https:') {
                    console.log('get user');
                    const userLikeYou = await fetch(`https://api.gotinder.com/user/${_id}`, {
                        headers: {
                            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                            platform: 'android'
                        },
                    })
                        .then((res) => res.json())
                        .then((res) => res.results);
                    let interests
                    let birthDayUser
                    let distanceUser
                    try {
                        interests = userLikeYou.user_interests.selected_interests
                    } catch (error) {
                        interests = []
                    }
                    try {
                        birthDayUser = userLikeYou.user.birth_date.slice(0, 4)
                    } catch (error) {
                        birthDayUser = ''
                    }
                    try {
                        distanceUser = userLikeYou.distance_mi
                    } catch (error) {
                        distanceUser = '0'
                    }
                    let objectProfile = {
                        sNumber: userLikeYou.s_number,
                        userName: userLikeYou.name,
                        birthDay: birthDayUser,
                        userBio: userLikeYou.bio,
                        distance: distanceUser,
                        userInterests: interests,
                        photos: userLikeYou.photos,
                        avatarURL: userLikeYou.photos[0].url,
                        userID: userLikeYou._id,
                    }
                    renderProfile(objectProfile)
                } else {
                    indexTeaser++
                    getProfile()
                }
            } else {
                indexTeaser++
                console.log("getProfile");
                getProfile()
            }
        } catch (error) { }
    } else {
        console.log('core');
        const userLikeU = await fetch('https://api.gotinder.com/v2/recs/core', {
            headers: {
                'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                platform: 'android'
            },
        })
            .then((res) => res.json())
            .then((res) => res.data.results);
        if (userLikeU.length > 1) {
            if (typeof userLikeU[1].experiment_info == 'undefined') {
                var interests = ''
            } else {
                interests = userLikeU[1].experiment_info.user_interests.selected_interests
            }
            let birthDayUser
            let distanceUser
            try {
                birthDayUser = userLikeU[1].user.birth_date.slice(0, 4)
            } catch (error) {
                birthDayUser = ''
            }
            try {
                distanceUser = userLikeU[1].distance_mi
            } catch (error) {
                distanceUser = '0'
            }
            let objectProfile = {
                sNumber: userLikeU[1].s_number,
                userName: userLikeU[1].user.name,
                birthDay: birthDayUser,
                userBio: userLikeU[1].user.bio,
                distance: distanceUser,
                userInterests: interests,
                photos: userLikeU[1].user.photos,
                avatarURL: userLikeU[1].user.photos[0].url,
                userID: userLikeU[1].user._id,
            }
            renderProfile(objectProfile)
        } else {
            getProfile()
        }
    }

}
async function getUserPassed(userID) {
    const IDPassed = await fetch(`https://api.gotinder.com/user/${userID}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
        .then((res) => res.results);
    let interests
    let birthDayUser
    let distanceUser
    try {
        interests = IDPassed.user_interests.selected_interests
    } catch (error) {
        interests = []
    }
    try {
        birthDayUser = IDPassed.user.birth_date.slice(0, 4)
    } catch (error) {
        birthDayUser = ''
    }
    try {
        distanceUser = IDPassed.distance_mi
    } catch (error) {
        distanceUser = '0'
    }
    let objectProfile = {
        sNumber: IDPassed.s_number,
        userName: IDPassed.name,
        birthDay: birthDayUser,
        userBio: IDPassed.bio,
        distance: distanceUser,
        userInterests: interests,
        photos: IDPassed.photos,
        avatarURL: IDPassed.photos[0].url,
        userID: IDPassed._id,
    }
    renderProfile(objectProfile)
}
function renderProfile(profile) {
    slideIndex = 1
    let distance = parseInt(profile.distance) * 1.6
    distance = Math.round(distance * 100) / 100
    let profileString = `
    <div class="profile-info">
        <div class="profile__img--slide">
            <div class="rectangle__silde-count"></div>
            <div class="prev">&#10094;</div>
            <div class="next">&#10095;</div>
        </div>
        <div class="profile__text">
            <div class="profile__btn-hide">&#8744;</div>
            <div class="profile__user">
            <div class="profile__user-name">${profile.userName}</div>
            <div class="profile__user-birthday">${profile.birthDay}</div>
            </div>
            <div class="profile__user-dis">${distance} kilometers</div>
            <div class="separator"></div>
            <div class="profile__user-bio">${profile.userBio}</div>
            <div class="separator"></div>
            <div class="interrst-title">Sở thích</div>
            <div class="interests">
            </div>
            <div class="pass-like-profile of-profile-show">
                <p class="pass-profile of-profile-show pass-${profile.userID}">✖</p>
                <p class="like-profile of-profile-show like-${profile.userID}">❤</p>
            </div>
        </div>
    </div>
    `
    document.querySelector(".container-GF").innerHTML = profileString
    profile.photos.forEach(photo => {
        document.querySelector('.rectangle__silde-count').innerHTML += `<div class="rectangle"></div>`
        document.querySelector('.profile__img--slide').innerHTML += `<img class="slide-img" src="${photo.url}"></img>`
    })
    if (!profile.userInterests == "") {
        profile.userInterests.forEach(element => {
            document.querySelector('.interests').innerHTML += `<div class="interest__item">${element.name}</div>`
        })
    }
    document.querySelectorAll('.rectangle').forEach((element, index) => {
        element.addEventListener('click', function () {
            currentSlide(index + 1)
        })

    })
    let prev = document.querySelector('.prev')
    let next = document.querySelector('.next')
    prev.addEventListener('click', function () { plusSlides(-1) })
    next.addEventListener('click', function () { plusSlides(1) })
    document.querySelector(`.pass-${profile.userID}`).addEventListener('click', async function () {
        actionClick(document.querySelector(`.pass-${profile.userID}`))
        await passProfileButton(profile.userID)
        checkMode()

    })
    document.querySelector(`.like-${profile.userID}`).addEventListener('click', async function () {
        actionClick(document.querySelector(`.like-${profile.userID}`))
        await likeProfileButton(profile.userID)
        checkMode()
    })
    document.querySelector('.profile__btn-hide').addEventListener('click', function () {
        actionClick(document.querySelector('.profile__btn-hide'))
        setTimeout(function () {
            document.querySelector(".container-GF").remove()
            renderLobby()
        }, 150)
    })
    showSlides(slideIndex)
}
function checkMode() {
    if (mode == 'like-u') {
        getProfile()
    } else if (mode == 'rewind') {
        if (currentIndexPassed < 0) {
            renderRewindNonUser()
        } else {
            getUserPassed(arrIDPassed[currentIndexPassed])
        }
    } else {

    }
}
async function passProfileButton(userID) {
    const passProfile = await fetch(`https://api.gotinder.com/pass/${userID}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
    if (isContainArrPassed(userID) == false) {
        arrIDPassed.push(userID)
        localStorage.setItem('arrIDPassed', arrIDPassed)
    }
    if (mode == 'rewind') {
        currentIndexPassed--
    }


}
async function likeProfileButton(userID) {
    const likeProfile = await fetch(`https://api.gotinder.com/like/${userID}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
    if (mode == 'like-u') {
        if (likeProfile.match == false) {
            alert('Có lẽ bạn đã hết người thích hoặc hết lượt thích (Chuyển sang rewind thích hết tất cả các user trong đó và thử lại)')
        }
    } else if (mode == 'rewind') {
        if (isContainArrPassed(userID) == true) {
            arrIDPassed.splice(currentIndexPassed, 1)
            localStorage.setItem('arrIDPassed', arrIDPassed)
        }
        currentIndexPassed--
    }
}
function isContainArrPassed(userID) {
    for (let index = 0; index < arrIDPassed.length; index++) {
        if (arrIDPassed[index] == userID) {
            return true
        }
    }
    return false
}
function showProfile(userID) {
    if (isSearch) {
        showProfileIsSearch(userID, arrProfile)
    } else {
        showProfileIsSearch(userID, userUnlimitedLike)
    }
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let i = 0;
    let slides = document.getElementsByClassName("slide-img");
    let rectangles = document.getElementsByClassName("rectangle");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < rectangles.length; i++) {
        rectangles[i].className = rectangles[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    rectangles[slideIndex - 1].className += " active";
}
async function renderAutoLike() {
    document.querySelector(".container-GF").innerHTML = `
    <div class="auto-like">
        <div class="liked-text">Liked ${countUserAuto} User</div>
        <div class="btn btn-stop-auto">Exit</div>
    </div>
    `
    document.querySelector('.btn-stop-auto').addEventListener('click', function () {
        stopAuto = true
        document.querySelector(".container-GF").remove()
        renderLobby()
        mode = 'home'
        localStorage.setItem('mode', mode)
    })
}
async function getListUser() {
    renderAutoLike()
    if (stopAuto == false) {
        const userLikeU = await fetch('https://api.gotinder.com/v2/recs/core', {
            headers: {
                'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                platform: 'android'
            },
        })
            .then((res) => res.json())
            .then((res) => res.data.results);
        autoLike(userLikeU)
    }
}
function autoLike(userLikeU) {
    
    if (stopAuto == false) {
        setTimeout(async function () {
            await likeProfileButton(userLikeU[0].user._id)
            countUserAuto++
            countAutoTimes++
            localStorage.setItem('countUserAuto', countUserAuto)
            localStorage.setItem('countAutoTimes', countAutoTimes)
            userLikeU.splice(0, 1)
            if (countAutoTimes == 40) {
                window.location.reload()
            }
            if (userLikeU.length == 0) {
                getListUser()
            } else {
                if (stopAuto == false) {
                    renderAutoLike()
                    autoLike(userLikeU)
                }
            }
        }, 2000)
    }
}
async function unblurTeasers() {
    const teasers = await fetch('https://api.gotinder.com/v2/fast-match/teasers', {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
        .then((res) => res.data.results);
    const teaserDivs = document.querySelectorAll('.Expand.enterAnimationContainer > div:nth-child(1)');
    for (let i = 0; i < teaserDivs.length; ++i) {
        const teaser = teasers[i];
        const teaserDiv = teaserDivs[i];
        const teaserImage = `https://preview.gotinder.com/${teaser.user._id}/original_${teaser.user.photos[0].id}.jpeg`;
        teaserDiv.style.backgroundImage = `url(${teaserImage})`;
    }
}
function renderLoader() {
    document.querySelector(".container-GF").innerHTML = `
    <div class="box-loader">
  <div class="container-loader">
    <span class="circle-loader"></span>
    <span class="circle-loader"></span>
    <span class="circle-loader"></span>
    <span class="circle-loader"></span>
  </div>
</div>
    `
}