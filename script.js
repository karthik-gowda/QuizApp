//Getting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const option_list = document.querySelector(".option_list");
const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const formElement = document.querySelector(".container.loginForm");
const errorMessage = document.querySelector("#errorMessage");

//Login Authentication
let userDetails = [
    {
        userName: "karthik@indegene.com",
        password: "karthik123",
        score: [],
    },
    {
        userName: "user2@indegene.com",
        password: "user2",
        score: [],
    },
    {
        userName: "user3@indegene.com",
        password: "user3",
        score: [],
    },
    {
        userName: "user4@gmail.com",
        password: "user4",
        score: [],
    },
];

//Onclick function to login using email and password
document.getElementById("submit").onclick = function () {
    var email = document.getElementById("exampleInputEmail1").value;
    var password = document.getElementById("exampleInputPassword1").value;

    for (var i = 0; i < userDetails.length; i++) {
        if (email == userDetails[i].userName && userDetails[i].userName.slice(userDetails[i].userName.length - 13, 26) == "@indegene.com") {
            if (password == userDetails[i].password) {
                window.localStorage.setItem("user", userDetails[i].userName);
                start_btn.style.display = "block";
                formElement.style.display = "none";

                return;
            } else {
                alert("Wrong Password");
            }
        }
        errorMessage.style.display = "block";
    }
};

//If start button clicked
start_btn.onclick = () => {
    info_box.classList.add("activeInfo");
};

//If exit button clicked
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
};

//If continue button clicked
function newQuiz() {
    // continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuestions(0);
    startTimer(59);
    startTimerLine(0);
    // };
}
continue_btn.onclick = () => {
    newQuiz();
};

let que_count = 0;
let counter;
let timeValue = 60;
let widthValue = 0;
let userScore = 0;

if (timeValue === 0) {
    option_list.style.pointerEvents = "none";
}

const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const quit_quiz = result_box.querySelector(".buttons .quit");
const restart_quiz = result_box.querySelector(".startAgain");

//If user clicks on quit quiz then he/she will be redirected back
quit_quiz.onclick = () => {
    window.location.reload();
    window.localStorage.clear();
};
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); //show quiz box
    result_box.classList.remove("activeResult"); //hide result box
    timeValue = 60;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count); //calling showQestions function
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(timeValue); //calling startTimer function
    startTimerLine(widthValue); //calling startTimerLine function
};

//If next button clicked
function nextBtn() {
    if (que_count < questions.length - 1) {
        que_count++;
        showQuestions(que_count);
        clearInterval(counter);
        startTimer(timeValue);
        clearInterval(counterLine);
        startTimerLine(widthValue);
    } else {
        console.log("Questions Completed");
        showResultBox();
    }
}
next_btn.onclick = () => {
    nextBtn();
};

//Getting questions from array in different file it can also be json data from database

function showQuestions(index) {
    const que_text = document.querySelector(".que_text");

    let que_tag = "<span>" + questions[index].numb + "." + questions[index].question + "</span>";
    let option_tag =
        '<div class="option"><span>' +
        questions[index].options[0] +
        "</span></div>" +
        '<div class="option"><span>' +
        questions[index].options[1] +
        "</span></div>" +
        '<div class="option"><span>' +
        questions[index].options[2] +
        "</span></div>" +
        '<div class="option"><span>' +
        questions[index].options[3] +
        "</span></div>";
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;

    //This is to show the question number at the bottom
    const next_question_num = quiz_box.querySelector(".total_que");
    let next_question = "<span><p>" + questions[index].numb + "</p>of<p>5</p>Questions</span>";
    next_question_num.innerHTML = next_question;

    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

//This function is for counting the correct answer
function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);

    let userAns = answer.textContent;
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;
    if (userAns == correctAns) {
        userScore += 1;
        console.log(userScore);
        answer.classList.add("correct");
        console.log("Answer is correct");
    } else {
        answer.classList.add("incorrect");
        console.log("Answer is wrong");

        //If user selects wrong answer then show what is right
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correctAns) {
                option_list.children[i].setAttribute("class", "option correct");
            }
        }
    }

    //Once user selected answer disable all other options
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }
}

//To display the result dashboard
function showResultBox() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const userEmail = result_box.querySelector(".userName");
    const scoreText1 = result_box.querySelector(".score_text1");
    const scoreText2 = result_box.querySelector(".score_text2");
    const scoreText3 = result_box.querySelector(".score_text3");
    const currentUser = window.localStorage.getItem("user"); //Get the current user from local storage

    for (let i = 0; i < userDetails.length; i++) {
        console.log(userDetails[i].score);

        if (currentUser == userDetails[i].userName) {
            userDetails[i].score.push(userScore);
            userEmailTag = "Hi " + userDetails[i].userName;
            scoreTag1 = " Your Score in 1st Attempt is " + userDetails[i].score[0];
            if (userDetails[i].score[1] == undefined) {
                scoreTag2 = "You have not attempted yet ";
            } else {
                scoreTag2 = "Your score in second attempt is " + userDetails[i].score[1];
            }
            if (userDetails[i].score[2] == undefined) {
                scoreTag3 = "You have not attempted yet ";
            } else {
                scoreTag3 = "Your score in Third attempt is " + userDetails[i].score[2];
            }

            userEmail.innerHTML = userEmailTag;
            scoreText1.innerHTML = scoreTag1;
            scoreText2.innerHTML = scoreTag2;
            scoreText3.innerHTML = scoreTag3;
        }
    }

    // if (userScore > 3) {
    //     let scoreTag = "<span>and great, You got<p>" + userScore + "</p>out of<p>" + questions.length + "</p></span";
    //     scoreText.innerHTML = scoreTag;
    // } else if (userScore <= 3) {
    //     let scoreTag = "<span>and sorry, You got only<p>" + userScore + "</p>out of<p>" + questions.length + "</p></span";
    //     scoreText.innerHTML = scoreTag;
    // }
}

//This function is for timer
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 0) {
            const allOptions = option_list.children.length;
            clearInterval(counter);
            timeCount.textContent = "00";
            for (i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
        }
    }
}

//this function is For timer line

function startTimerLine(time) {
    counterLine = setInterval(timer, 82);
    function timer() {
        time += 1;
        timeLine.style.width = time + "px";
        if (time > 750) {
            clearInterval(counterLine);
        }
    }
}
