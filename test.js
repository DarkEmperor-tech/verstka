const questions = [
    {
        text:"1)А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
        options: [
            {text:"a)Пол деревни, за раз", correct: false},
            {
                text:"b)Полдеревни, зараз",
             correct: true,
             explanation:"Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом."
            },
            {text:"c)Пол-деревни, за раз", correct: false}
        ]
    },
    {
        text:"2)А эти слова как пишутся?",
        options:[
            {text:"a)Капуччино и эспрессо", correct: false},
            {text:"b)Каппуччино и экспресо", correct: false},
            {
                text:"c)Капучино и эспрессо",
             correct: true,
             explanation:"Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо»."
            }
        ]
    },
    {
        text:"3)Как нужно писать?",
        options:[
            {text:"a)Черезчур", correct: false},
            {text:"b)Черес-чур", correct: false},
            {
                text:"c)Чересчур",
             correct: true,
             explanation:"Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур»."
            }
        ]
    },
    {
        text:"4)Где допущена ошибка?",
        options:[
            {text:"a)Аккордеон", correct: false},
            {text:"b)Белиберда", correct: false},
            {
                text:"c)Эпелепсия",
                correct: true,
                explanation:"Верно! Это слово пишется так: «эпИлепсия»."
            }
        ]
    }
];

let Qindex = 0;
let countTrue = 0;
let Qcount = 0;

function random(r){
    return r.sort(()=>Math.random()-0.5)
}

function QBlock(){
    const a = document.getElementById("questions-container");
    a.innerHTML = "";
    random(questions);
    questions.forEach((question, index)=>{
        const b = document.createElement("div");
        b.className = "question-block";
        b.dataset.index=index;

        const t = document.createElement("div");
        t.className="question-text";
        t.textContent = question.text;

        b.appendChild(t);

        const q = document.createElement("div");
        q.className = "options";
        random(question.options);

        question.options.forEach(option=>{
            const d = document.createElement("div");
            d.className = "option"
            d.textContent = option.text;
            d.addEventListener("click", (c)=>{
                c.stopPropagation();
                selectOption(b,question,option,d,t,q);
            });
            q.appendChild(d);
        });

        const g = document.createElement("div");
        g.className="correct-answer";
        g.textContent="правильный ответ: "+question.options.find(o=>o.correct).text;
        b.appendChild(q);
        b.appendChild(g);
        b.addEventListener("click", ()=>{
            if (!question.answered && Qindex === index){ 
                q.style.display = "block";
            }
            else if (Qcount===questions.length){
                const all = document.querySelectorAll(".question-block");
                all.forEach(qb=>{
                    if (qb !== b){
                       qb.classList.remove("show-answer"); 
                    }
                });
                b.classList.toggle("show-answer");
            }
        });
        if (index!==0){
            b.style.display = "none";
        }
        a.appendChild(b);
    });
}


function selectOption(b,question,option,d,t,q) {
    if (question.answered) return;
    question.answered = true;

    d.classList.add('selected');

    if (option.correct) {
        countTrue++;
        t.classList.add('correct');
        d.classList.add('correct');

        
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.textContent = option.explanation;
        q.appendChild(explanation);
       
        [...q.children].forEach(child => {
            if (!child.classList.contains('selected') && child.classList.contains('option')) {
                child.classList.add('slide-down'); 
            }
        });
    } else {t.classList.add('incorrect');
        d.classList.add('incorrect');


        [...q.children].forEach(child => {
            if (child.classList.contains('option')) {
                child.classList.add('slide-down');
            }
        });
        
    }

    Qcount++;  
    update();

    setTimeout(() => {
        q.style.display = 'none';
        b.style.cursor = 'default';


        const nextQuestionBlock = document.querySelector(`.question-block[data-index='${Qindex + 1}']`);
        if (nextQuestionBlock) {
            nextQuestionBlock.style.display = 'block';
            Qindex++;
        }
    }, 2000);  // Задержка в 2 секунды перед переходом к следующему вопросу
}
// function selectOption (b,question,option,d,t,q){
//     if (question.answered) return;
//     question.answered = true;
//     d.classList.add("selected");
//     if (option.correct) {
//         countTrue++;
//         t.classList.add("correct");
//         d.classList.add("correct");
//         const explanation = document.createElement("div");
//         explanation.className = "explanation";
//         explanation.textContent = option.explanation;
//         q.appendChild(explanation);
//         [...q.children].forEach(child=>{
//             if (!child.classList.contains("selected") && child.classList.contains("option")){
//                 child.classList.add("slide-down");
//             }
//         });
//     }
//     else {
//         t.classList.add("incorrect");
//         d.classList.add("incorrect");
//         [...q.children].forEach(child=>{
//             if (child.classList.contains("option")){
//                 child.classList.add("slide-down");
//             }
//         });
//     }
//   Qcount++;
//   update();  
//   setTimeout(()=>{
//     q.style.display = "none";
//     b.style.cursor = "default";
//     const nextQ = document.querySelector(`.question-block[data-index="${Qindex+1}"]`);
//     if(nextQ){
//         nextQ.style.display = "block";
//         Qindex++;
//     }
//   }, 2000);
// }

function update(){
    const statisticsDiv = document.getElementById ("statistics");
    statisticsDiv.textContent = `правильных ответов: ${countTrue} из ${questions.length}`;
    if (Qcount === questions.length){
        statisticsDiv.textContent += " вопросы закончились."
    }
}

document.addEventListener("DOMContentLoaded", ()=> {
    QBlock();
    update();
});