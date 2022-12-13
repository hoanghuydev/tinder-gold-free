let arrProfile = []
let slideIndex = 1
let n = 1
let indexImg = 1
try {
    arrProfile = JSON.parse(localStorage.getItem("arrProfile") || "[]")

} catch (error) {

}
addButtonTinderGF()
createArrProfile()
function updateUserCount() {
    document.querySelector('.searching').innerText = '   ' + arrProfile.length + ' users'
}
function createArrProfile() {
    if (!(arrProfile.length == 0)) {
        alert('Automatically reload to avoid error 429\nEnter the number of people and continue searching\nIf it cant continue searching, then no one likes you in the list anymore')
        updateUserCount()
        addArrProfile(arrProfile)
        document.querySelector('.searching').classList.ad
    }
}

function addProfile(objectProfile) {
    let distance = parseInt(objectProfile.distance) * 1.6
    distance = Math.round(distance*100)/100
    let profileLikeYou = `
    <div class="profile id${objectProfile.userID}">
        <div class="pass-like-profile">
            <p class="pass-profile pass-${objectProfile.userID}">✖</p>
            <p class="like-profile like-${objectProfile.userID}">❤</p>
        </div>
        <div class="distance-mi">${distance} kilometers</div>
        <div class="user-bio">${objectProfile.userBio}</div>
        <div class="user">
            <div class="user-name user-name-of-${objectProfile.userID}" title="Open profile of ${objectProfile.userName}">${objectProfile.userName}</div>
            <div class="user-birthday">${objectProfile.birthDay}</div>
        </div>
    </div>
    `
    document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileLikeYou, 'text/html').body.firstElementChild)
    document.querySelector(`.pass-${objectProfile.userID}`).addEventListener('click', function () {
        passProfileButton(objectProfile.userID)
        removeAllProfile()
        addArrProfile(arrProfile)
    })
    document.querySelector(`.like-${objectProfile.userID}`).addEventListener('click', function () {
        likeProfileButton(objectProfile.userID)
        removeAllProfile()
        addArrProfile(arrProfile)
    })
    document.querySelector(`.user-name-of-${objectProfile.userID}`).addEventListener('click', function () {
        removeAllProfile()
        showProfile(objectProfile.userID)
    })
    document.querySelector(`.id${objectProfile.userID}`).style.backgroundImage = `url(${objectProfile.avatarURL})`
    document.querySelector('.profile').addEventListener('click', showImage(objectProfile.photos))
    updateNumOfPeopleInput()
}
function addArrProfile(arrProfile) {
    for (let i = 0; i < arrProfile.length; i++) {
        
        let distance = parseInt(arrProfile[i].distance) * 1.6
        let profileLikeYou = `
        <div class="profile id${arrProfile[i].userID}">
            <div class="pass-like-profile">
                <p class="pass-profile pass-${arrProfile[i].userID}">✖</p>
                <p class="like-profile like-${arrProfile[i].userID}">❤</p>
            </div>
            <div class="distance-mi">${distance} kilometers</div>
            <div class="user-bio">${arrProfile[i].userBio}</div>
            <div class="user">
                <div class="user-name user-name-of-${arrProfile[i].userID}" title="Open profile of ${arrProfile[i].userName}">${arrProfile[i].userName}</div>
                <div class="user-birthday">${arrProfile[i].birthDay}</div>
            </div>
        </div>
        `
        document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileLikeYou, 'text/html').body.firstElementChild)
        document.querySelector(`.id${arrProfile[i].userID}`).style.backgroundImage = `url(${arrProfile[i].avatarURL})`
        document.querySelector(`.user-name-of-${arrProfile[i].userID}`).addEventListener('click', function () {
            removeAllProfile()
            showProfile(arrProfile[i].userID)
        })
        document.querySelector('.profile').addEventListener('click', showImage(arrProfile[i].photos))
        updateNumOfPeopleInput()
        document.querySelector(`.pass-${arrProfile[i].userID}`).addEventListener('click',async function () {
            await passProfileButton(arrProfile[i].userID)
            removeAllProfile()
            addArrProfile(arrProfile)
        })
        document.querySelector(`.like-${arrProfile[i].userID}`).addEventListener('click', async function () {
            await likeProfileButton(arrProfile[i].userID)
            removeAllProfile()
            addArrProfile(arrProfile)
        })
       
    }
}
function removeAllProfile() {
    let allProfile = document.querySelectorAll(`.profile`)
    allProfile.forEach(element => {
        element.remove()
    })
}
async function passProfileButton(userID) {
    const passProfile = await fetch(`https://api.gotinder.com/pass/${userID}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
    for (let i = 0; i < arrProfile.length; i++) {
        if (arrProfile[i].userID == userID) {
            arrProfile.splice(i, 1);
            localStorage.setItem("arrProfile", JSON.stringify(arrProfile))
        }
    }
    updateUserCount()
    updateNumOfPeopleInput()
}
async function likeProfileButton(userID) {
    const likeProfile = await fetch(`https://api.gotinder.com/like/${userID}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
    for (let i = 0; i < arrProfile.length; i++) {
        if (arrProfile[i].userID == userID) {
            arrProfile.splice(i, 1);
            localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
        }
    }
    updateUserCount()
    updateNumOfPeopleInput()
}
function updateNumOfPeopleInput() {
    document.querySelector('.num-of-people').placeholder = `Enter num between ${arrProfile.length+1}-20`
}
function showProfile(userID) {
    slideIndex = 1
    let indexOfProfile = 0
    for (let i = 0; i < arrProfile.length; i++) {
        if (arrProfile[i].userID == userID) {
            indexOfProfile = i
        }
    }
    let distance = parseInt(arrProfile[indexOfProfile].distance) * 1.6
    distance = Math.round(distance*100)/100
    let profileString = `
    <div class="profile-info">
    <div class="profile__img--slide">
    <div class="rectangle__silde-count">
        
    </div>
    <div class="prev">&#10094;</div>
    <div class="next">&#10095;</div>
    </div>
    <div class="profile__text">
        <div class="profile__btn-hide">&#8744;</div>
        <div class="profile__user">
        <div class="profile__user-name">${arrProfile[indexOfProfile].userName}</div>
        <div class="profile__user-birthday">${arrProfile[indexOfProfile].birthDay}</div>
        </div>
        <div class="profile__user-dis">${distance} kilometers</div>
        <div class="separator"></div>
        <div class="profile__user-bio">${arrProfile[indexOfProfile].userBio}</div>
        <div class="interests">
        </div>
        <div class="separator"></div>
        <div class="pass-like-profile of-profile-show">
                            <p class="pass-profile of-profile-show pass-${arrProfile[indexOfProfile].userID}">✖</p>
                            <p class="like-profile of-profile-show like-${arrProfile[indexOfProfile].userID}">❤</p>
        </div>
    </div>
    </div>
    `
    document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileString, 'text/html').body.firstElementChild)
    arrProfile[indexOfProfile].photos.forEach(photo => {
        document.querySelector('.rectangle__silde-count').innerHTML += `<div class="rectangle"></div>`
        document.querySelector('.profile__img--slide').innerHTML += `<img class="slide-img" src="${photo.url}"></img>`
    })
    if (!arrProfile[indexOfProfile].userInterests=="") {
        arrProfile[indexOfProfile].userInterests.forEach(element => {
            document.querySelector('.interests').innerHTML+=`<div class="interest__item">${element.name}</div>`
        })
    }
    document.querySelectorAll('.rectangle').forEach((element, index) => {
        element.addEventListener('click', function() {
            currentSlide(index+1)
        })

    })
    let prev = document.querySelector('.prev')
    let next = document.querySelector('.next')
    prev.addEventListener('click',function() {plusSlides(-1)})
    next.addEventListener('click', function() {plusSlides(1)})
    document.querySelector(`.pass-${arrProfile[indexOfProfile].userID}`).addEventListener('click', async function () {
        await passProfileButton(arrProfile[indexOfProfile].userID)
        hideProfile()
    })
    document.querySelector(`.like-${arrProfile[indexOfProfile].userID}`).addEventListener('click', async function () {
        await likeProfileButton(arrProfile[indexOfProfile].userID)
        setTimeout(hideProfile(),1000)
    })
    document.querySelector('.profile__btn-hide').addEventListener('click',function() {hideProfile()})
    showSlides(slideIndex)
}
function hideProfile() {
    document.querySelector('.profile-info').remove()
    addArrProfile(arrProfile)
    
    
}
function plusSlides(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
    showSlides(slideIndex = n);
}
function showSlides(n) {
    let i=0;
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
    rectangles[slideIndex -1].className += " active";
}

function addButtonTinderGF() {
    let num = 1
    try {
        num = localStorage.getItem('num') 
    } catch (error) {
        num = 1
    }
    
    let buttonTinderGF = `
    <div class="btn btn-tinder-gf"> Tinder GF</div>
    `
    let containerTinderGF = `
    <div class="container">
    <div class="background-show background-filter backgr-filter-hide">
        <div class="filter-table filter-hide">
            <p class="filter-title">Filter</p>
            <div class="separator"></div>
            <label for="name">Enter name</label>
            <input type="text" id="name">
            <div class="separator"></div>
            <label for="year">Enter year of birth</label>
            <input type="text" id="year">
            <div class="separator"></div>
            <p class="close-filter">OK</p>
        </div>
    </div>
        <header>
            <div class="search">
                <input type="number" class="num-of-people" placeholder='Enter num beetween ${arrProfile.length+1}-20'>
                <div class="btn-search btn">Search</div>
            </div>
            <div class="btn btn-unblur">Unblur</div>
        </header>
        <img alt="Filter" class="filter"></img>
        <div class="searching"></div>
        <div class="content">
            <div class="all-profile">
            </div>
        </div> 
    </div>
    </div>
    `
    let body = document.querySelector('body')
    body.appendChild(new DOMParser().parseFromString(buttonTinderGF, 'text/html').body.firstElementChild)
    body.appendChild(new DOMParser().parseFromString(containerTinderGF, 'text/html').body.firstElementChild)
    let btnTinderGF = document.querySelector('.btn-tinder-gf')
    let container = document.querySelector('.container')
    let backgroundFilter = document.querySelector('.background-filter')
    let imgURL = chrome.runtime.getURL("images/filter.png")
    let filter = document.querySelector(".filter")
    let unblur = document.querySelector('.btn-unblur')
    let inputNumber = document.querySelector('.num-of-people')
    btnTinderGF.addEventListener('click',function() {
        container.classList.toggle('hide')
        setTimeout(function() {
            container.classList.toggle('display-none')
        },300)
    })
    inputNumber.addEventListener('keydown', function (e) {
        document.querySelector('.search').style.border = '0.5px solid black'
        if (e.keyCode == 13) {
            if (inputNumber.value > 20 || inputNumber.value < arrProfile.length+1) {
                document.querySelector('.search').style.border = '2.5px solid red'
                inputNumber.value = ''
            } else {
                searchBtn()
            }
        }
    })
    unblur.addEventListener('click', function () {
        unblurTeasers()
    })
    filter.src = imgURL
    filter.addEventListener('click', showFilterForm)
    document.querySelector('.close-filter').addEventListener('click', function () {
        showFilterForm()
        let inputName = document.querySelector('#name').value
        let inputYear = document.querySelector('#year').value
        try {
            removeAllProfile()
            setTimeout(filterProfile(inputName, inputYear), 1000)

        } catch (error) {
            console.log('No profile to filter')
        }

    })
    document.querySelector('.btn-search').addEventListener("click", function () {
        if (inputNumber.value > 20 || inputNumber.value < 1) {
            document.querySelector('.search').style.border = '0.5px solid red'
            inputNumber.value = ''
        } else {
            searchBtn()
        }
    })
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
function filterProfile(name, year) {
    let arrProfileFilter = []
    switch (true) {
        case (name == '' && year == ''):
            addArrProfile(arrProfile)
            break;
        case (name == ''):
            for (let i = 0; i < arrProfile.length; i++) {
                if (arrProfile[i].birthDay.toLowerCase().includes(year.toLowerCase())) {
                    arrProfileFilter.push(arrProfile[i])
                }
            }
            addArrProfile(arrProfileFilter)
            break;
        case (year == ''):
            for (let i = 0; i < arrProfile.length; i++) {
                if (arrProfile[i].userName.toLowerCase().includes(name.toLowerCase())) {
                    arrProfileFilter.push(arrProfile[i])
                }
            }
            addArrProfile(arrProfileFilter)
            break;
        case (!(name == '') && !(year == '')):
            for (let i = 0; i < arrProfile.length; i++) {
                if (arrProfile[i].userName.toLowerCase().includes(name.toLowerCase()) & arrProfile[i].birthDay.toLowerCase().includes(year.toLowerCase())) {
                    arrProfileFilter.push(arrProfile[i])
                }
            }
            addArrProfile(arrProfileFilter)
            break;
    }
}
function showFilterForm() {
    let backgroundFilter = document.querySelector('.background-filter')
    let filterTable = document.querySelector('.filter-table')
    if (backgroundFilter.classList.contains('backgr-filter-hide')) {
        backgroundFilter.style.display = 'flex'
        filterTable.style.display = 'flex'
        backgroundFilter.classList.remove('backgr-filter-hide')
        backgroundFilter.classList.add('backgr-filter-show')
        filterTable.classList.remove('filter-hide')
        filterTable.classList.add('filter-show')
    } else {
        backgroundFilter.classList.add('backgr-filter-hide')
        backgroundFilter.classList.remove('backgr-filter-show')
        filterTable.classList.add('filter-hide')
        filterTable.classList.remove('filter-show')
        setTimeout(function () {
            backgroundFilter.style.display = 'none'
            filterTable.style.display = 'none'
        }, 300)

    }
}
function searchBtn() {
    removeAllProfile()
    let num = document.querySelector('.num-of-people').value
    localStorage.setItem('num', num);
    let countLoop = 1
    getProfile()
    function getProfile() {
        setTimeout(async function () {
            document.querySelector('.searching').innerText = 'Searching...' + (arrProfile.length + 1) + '/' +num
            const userLikeU = await fetch('https://api.gotinder.com/v2/recs/core', {
                headers: {
                    'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
                    platform: 'android'
                },
            })
                .then((res) => res.json())
                .then((res) => res.data.results);
            if (typeof userLikeU[1].experiment_info == 'undefined') {
                var interests = ''
            } else {
                interests = userLikeU[1].experiment_info.user_interests.selected_interests
            }
            let objectProfile = {
                sNumber: userLikeU[1].s_number,
                userName: userLikeU[1].user.name,
                birthDay: userLikeU[1].user.birth_date.slice(0, 4),
                userBio: userLikeU[1].user.bio,
                distance: userLikeU[1].distance_mi,
                userInterests: interests,
                photos: userLikeU[1].user.photos,
                avatarURL: userLikeU[1].user.photos[0].url,
                userID: userLikeU[1].user._id,
            }
            let hasContain = false
            let loopNum
            loopNum = (num==1)? (arrProfile.length+1) : (arrProfile.length) 
            for (let i = 0; i < loopNum; i++) {
                console.log('run');
                try {
                    if (arrProfile[i].userID == objectProfile.userID) {
                        countLoop++
                        console.log('Has been duplicate ' + countLoop);
                        (countLoop == 15) ? console.log('MAYBE no one likes you') :
                            hasContain = true
                        i = arrProfile.length
                    }
                } catch (error) {
                    
                }
                
            }
            if (!hasContain) {
                arrProfile.push(objectProfile)
                console.log(arrProfile);
            }
            if (countLoop == 18) {
                localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
                window.location.reload();
            }
            if (arrProfile.length < num) {
                getProfile()
            } else {
                document.querySelector('.searching').innerText = `Done`
                addArrProfile(arrProfile)
                localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
            }
        }, 1500)
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


