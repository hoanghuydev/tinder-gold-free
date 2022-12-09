let arrProfile = []
let indexImg = 1
try {
    arrProfile = JSON.parse(localStorage.getItem("arrProfile") || "[]")

} catch (error) {

}
addButtonTinderGF()
createArrProfile()

function createArrProfile() {
    if (!(arrProfile.length == 0)) {
        alert('Automatically reload to avoid error 429\nEnter the number of people and continue searching\nIf it cant continue searching, then no one likes you in the list anymore')
        document.querySelector('.searching').innerText = '   ' + arrProfile.length + ' users'
        addArrProfile(arrProfile)
        document.querySelector('.searching').classList.ad
    }
}

function addProfile(objectProfile) {
    let distance = parseInt(objectProfile.distance) * 1.6
    let profileLikeYou = `
    <div class="profile id${objectProfile.userID}">
        <p class="pass-profile pass-${objectProfile.userID}">X</p>
        <div class="distance-mi">${distance} kilometers</div>
        <div class="user-bio">${objectProfile.userBio}</div>
        <div class="user">
            <div class="user-name">${objectProfile.userName}</div>
            <div class="user-birthday">${objectProfile.birthDay}</div>
        </div>
    </div>
    `
    document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileLikeYou, 'text/html').body.firstElementChild)
    document.querySelector(`.pass-${objectProfile.userID}`).addEventListener('click', function () {
        passProfileButton(objectProfile.userID, objectProfile.sNumber)
    })
    document.querySelector(`.id${objectProfile.userID}`).style.backgroundImage = `url(${objectProfile.avatarURL})`
    document.querySelector('.profile').addEventListener('click', showImage(objectProfile.photos))
}
function addArrProfile(arrProfile) {
    for (let i = 0; i < arrProfile.length; i++) {
        let distance = parseInt(arrProfile[i].distance) * 1.6
        let profileLikeYou = `
        <div class="profile id${arrProfile[i].userID}">
            <p class="pass-profile pass-${arrProfile[i].userID}">X</p>
            <div class="distance-mi">${distance} kilometers</div>
            <div class="user-bio">${arrProfile[i].userBio}</div>
            <div class="user">
                <div class="user-name">${arrProfile[i].userName}</div>
                <div class="user-birthday">${arrProfile[i].birthDay}</div>
            </div>
        </div>
        `

        document.querySelector('.all-profile').appendChild(new DOMParser().parseFromString(profileLikeYou, 'text/html').body.firstElementChild)
        document.querySelector(`.pass-${arrProfile[i].userID}`).addEventListener('click', function () {
            passProfileButton(arrProfile[i].userID, arrProfile[i].sNumber)
        })
        document.querySelector(`.id${arrProfile[i].userID}`).style.backgroundImage = `url(${arrProfile[i].avatarURL})`
        document.querySelector('.profile').addEventListener('click', showImage(arrProfile[i].photos))
    }
}
async function passProfileButton(userID, sNumber) {
    const generate = await fetch(`https://api.gotinder.com/pass/${userID}?locale=en&s_number=${sNumber}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android'
        },
    })
        .then((res) => res.json())
    for (let i = 0; i < arrProfile.length; i++) {
        if (arrProfile[i].userID == userID) {
            document.querySelector(`.id${arrProfile[i].userID}`).remove()
            arrProfile.splice(i, 1);
            localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
        }
    }
    document.querySelector('.searching').innerText = '   ' + arrProfile.length + ' users'
}
function addButtonTinderGF() {
    let buttonTinderGF = `
    <div class="container">
    <div class="background-filter backgr-filter-hide">
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
    let backgroundFilter = document.querySelector('.background-filter')
    let imgURL = chrome.runtime.getURL("images/filter.png")
    let filter = document.querySelector(".filter")
    filter.src = imgURL
    filter.addEventListener('click',showFilterForm)
    document.querySelector('.close-filter').addEventListener('click',function() {

        showFilterForm()
        let inputName = document.querySelector('#name').value
        let inputYear = document.querySelector('#year').value
        try {
            let allProfile = document.querySelectorAll(`.profile`)
            allProfile.forEach(element => {
                element.remove()
            });
            setTimeout(filterProfile(inputName,inputYear),1000)
            
        } catch (error) {
            console.log('No profile to filter')
        }
        
    })
    document.querySelector('.btn-search').addEventListener("click", searchBtn)
}
function filterProfile(name,year) {
    let arrProfileFilter = []
    switch (true) {
        case (name==''&&year=='') :
            addArrProfile(arrProfile)
            break;
        case (name==''):
            for (let i =0; i < arrProfile.length;i++) {
                if (arrProfile[i].birthDay.toLowerCase().includes(year.toLowerCase())) {
                    arrProfileFilter.push(arrProfile[i])
                }
            }
            addArrProfile(arrProfileFilter)
            break;
        case (year=='') :
            for (let i =0; i < arrProfile.length;i++) {
                if (arrProfile[i].userName.toLowerCase().includes(name.toLowerCase())) {
                    arrProfileFilter.push(arrProfile[i])
                }
            }
            addArrProfile(arrProfileFilter)
            break;
        case (!(name=='')&&!(year=='')) :
            for (let i =0; i < arrProfile.length;i++) {
                if (arrProfile[i].userName.toLowerCase().includes(name.toLowerCase())&arrProfile[i].birthDay.toLowerCase().includes(year.toLowerCase())) {
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
    let num = document.querySelector('.num-of-people').value
    localStorage.setItem('num', num);
    let countLoop = 1
    getProfile()
    function getProfile() {
        setTimeout(async function () {
            let numPeople = localStorage.getItem('num')
            document.querySelector('.searching').innerText = 'Searching...' + (arrProfile.length + 1) + '/' + numPeople
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
                // userInterests :  interests,
                // photos : userLikeU[1].user.photos,
                avatarURL: userLikeU[1].user.photos[0].url,
                userID: userLikeU[1].user._id,
            }
            let hasContain = false
            for (let i = 0; i < arrProfile.length; i++) {
                if (arrProfile[i].userID == objectProfile.userID) {
                    countLoop++
                    console.log('Has been duplicate ' + countLoop);
                    (countLoop == 15) ? console.log('MAYBE no one likes you') :
                        hasContain = true
                    i = arrProfile.length
                }
            }
            if (!hasContain) {
                arrProfile.push(objectProfile)
                addProfile(objectProfile)
            }
            if (countLoop == 20) {
                localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
                window.location.reload();
            }
            if (arrProfile.length < numPeople) {
                getProfile()
            } else {
                localStorage.setItem("arrProfile", JSON.stringify(arrProfile));
            }
        }, 2000)
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


