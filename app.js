// canvas và đếm số
var canvas = document.querySelector('.container .boxGame #game')
var ctx = canvas.getContext('2d')
var scoreShow1 = document.querySelector('.container .boxGame #score1')
var scoreShow2 = document.querySelector('.container .playAgain #score2')

// bắt đầu và chơi lại
var startGame = document.querySelector('.container .startGame')
var playAgain = document.querySelector('.container .playAgain')

// nhạc
var audio = document.querySelector('.container .myAudio')

// các thành phần game
var fireflyimg = new Image()
var MainBGR = new Image()
var upperTube = new Image()
var underTube = new Image()
// gán ảnh cho từng thành phần
fireflyimg.src = "https://i.postimg.cc/FsLSGws1/Flappy-Jack.png"
MainBGR.src = "https://i.postimg.cc/QMSLwXJb/pngtree-painted-jungle-firefly-background-design-image-952900.jpg"
underTube.src = "https://i.postimg.cc/hPsJ4MQM/Tube-Under.png"
upperTube.src = "https://i.postimg.cc/bNyJ5bVn/Tube-Upper.png"



var socre = 0
var KhoangCachHaiOng = 560
var KhoangCachTrenDuoi

// đóm với toạ độ trục x y
var firefly = {
    x: MainBGR.width/4,
    y:MainBGR.height/2,

    velocity: 0, // Vận tốc rơi
    gravity: 0.4, // trọng lực (sẽ được tăng dần và gán ngược cho velocity tạo hiệu ứng kéo xuống)
    lift: -8, // Lực nhảy lên (phải lớn hơn tốc độ rơi tối đa và trừ thẳng vào velocity để tạo hiệu ứng bay lên)
    maxVelocity: 6 // Giới hạn tốc độ rơi tối đa (velocity không được vượt quá giới hạn này)
}

// mảng các ống di chuyển
var Tube = []
// ống đầu tiên
Tube[0] = {
    x:canvas.width,
    y:0 // ống đầu tiên nằm ngoài cùng bên phải tương đương y = 0
}

// khởi tạo trước ảnh và đóm trước khi bắt đầu game
ctx.drawImage(MainBGR, 0, 0, 490,660)
ctx.drawImage(fireflyimg, firefly.x, firefly.y, 65, 70)

// bắt đầu game khi
startGame.addEventListener('touchstart', function () {
    startGame.style.display = 'none'
    playAudio(true)
    run()
})
startGame.addEventListener('click', function () {
    startGame.style.display = 'none'
    playAudio(true)
    run()
})


// fun khởi chạy game
function run() {

    // tải ảnh lên mỗi lần thay đổi toạ độ các phần tử
    ctx.drawImage(MainBGR, 0, 0, 490,660)
    ctx.drawImage(fireflyimg, firefly.x, firefly.y, 65, 70)


    for (var i = 0; i < Tube.length; i++) {
        KhoangCachTrenDuoi = upperTube.height + KhoangCachHaiOng
        ctx.drawImage(upperTube, Tube[i].x, Tube[i].y, 80, 320)
        ctx.drawImage(underTube, Tube[i].x, Tube[i].y + KhoangCachHaiOng, 73, 450)

        // cho ống chạy bằng trục x cấp số cộng với công sai là -3
        Tube[i].x -= 3

        // thêm ống khi ống cũ di chuyển đến giữa
        if(Tube[i].x == 172) {
            Tube.push({
                x:canvas.width,
                y:Math.floor(Math.random()*upperTube.height) - upperTube.height
            })
        }
        // xoá ống cũ nếu nó tràn ra ngoài màn hình (ống đầu tiên được khởi tạo)
        if(Tube[i].x == -1) {
            Tube.splice(0, 1);
        }

        // nếu toạ độ ống = 58
        if(Tube[i].x == 58) {
            socre ++
            scoreShow1.innerText = `${socre}`
        }
    }

    // Kiểm tra thua
    if (checkGameOver()) {
        setTimeout(function() {
            GameOver()
        }, 1000)
        return
    }




    // áp dụng trọng lực để đóm rơi xuống
    firefly.velocity += firefly.gravity // tăng dần velocity với cấp số cộng và công sai bằng 0.3
    // nếu velocity vượt quá maxVelocity thì gán velocity = maxVelocity
    if (firefly.velocity > firefly.maxVelocity) {
        firefly.velocity = firefly.maxVelocity
    }

    // gán trục y của đóm trên canvas = velocity để mỗi lần velocity tăng là đóm rơi xuống
    firefly.y += firefly.velocity

    // đảm bảo không bay ra khỏi màn hình
    if (firefly.y <= 0) {
        firefly.y = 0
    } 
    
    requestAnimationFrame(run)
}

// phát nhạc khi chạy
function playAudio(bool) {

    // thời gian nhạc bằng 0 trước khi chạy
    audio.currentTime = 0
    if (bool) {
        audio.play()
    } else {
        audio.pause()
    }
}

// kiểm tra chết
function checkGameOver() {
    // 1. rơi xuống đất
    if (firefly.y + 70 >= canvas.height) {
        return true;
    }

    // 2. va chạm với ống
    for (var i = 0; i < Tube.length; i++) {
        let tubeX = Tube[i].x;
        let tubeY = Tube[i].y;

        // va vào ống trên hoặc ống dưới
        if (
            firefly.x + 65 >= tubeX && firefly.x <= tubeX + 80 &&
            (firefly.y <= tubeY + 320 || firefly.y + 70 >= tubeY + KhoangCachHaiOng)
        ) {
            return true;
        }
    }

    return false; // không có va chạm, tiếp tục game
}

// nếu chết
function GameOver() {
    playAudio(false)
    playAgain.style.display = 'flex'
    scoreShow2.innerText = `Anh hứa sẽ chu cấp trong ${socre} tháng`
}

// chơi lại
playAgain.addEventListener("click", restartGame);
playAgain.addEventListener("touchstart", restartGame);
function restartGame() {
    playAgain.style.display = 'none'; // ẩn playAgain
    socre = 0; // reset điểm số
    scoreShow1.innerText = `${0}` // hiển thị lại điểm lên màn hình
    firefly.y = MainBGR.height / 2; // reset toạ độ đóm
    firefly.velocity = 0; // reset vận tốc
    Tube = [{ x: canvas.width, y: 0 }]; // reset danh sách ống
    playAudio(true) // bật lại nhạc
    run(); // chạy lại game
}


// bay
function fly() {
    firefly.velocity = firefly.lift
}
document.addEventListener("keydown", function() {
    fly()
})
document.addEventListener("touchstart", function() {
    fly()
})
document.addEventListener("click", function() {
    fly()
})
