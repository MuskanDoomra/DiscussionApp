var arrOfData = [];

var selected_div, new_div = [];

var query_box= document.getElementById("query_box");
var display_response = document.getElementById("display_response");
var response_heading = document.getElementById("response_heading");
var show1 = document.getElementById("show1");
var show2 = document.getElementById("show2");
var new_ques_btn = document.getElementById("new_ques_btn");
var resolve_btn = document.getElementById("resolve_btn");
var display_ques = document.getElementById("display_ques");
var search_box = document.getElementById("search_box");
var error = document.getElementById("error");
var submit_btn = document.getElementById("submit_btn");
var submit_response = document.getElementById("submit_response");

function displayQuestion(class_name,heading_name,para_name,parent_name) {

    var div = document.createElement("div");
    div.setAttribute("class",class_name);

    var heading = document.createElement("H1");
    heading.innerHTML = heading_name;

    var para = document.createElement("P");
    if(class_name === "ques")
        para.setAttribute("id","additional");
    para.innerHTML = para_name;

    div.appendChild(heading);
    div.appendChild(para);

    parent_name.appendChild(div);

    if(class_name === "ques")
        new_div.push(div);
}

function displayResponses(data) {

    if(data.response_arr.length === 0) {

        display_response.style.display = "none";
        response_heading.style.display = "none";
    }
    else {

        display_response.style.display = "block";
        response_heading.style.display = "block";
        display_response.innerHTML = "";

        data.response_arr.map(val => {
            displayQuestion("response",val.name,val.comment,display_response);
        })
    }
}

function handleClick(selected_div) {

    if(new_div.length !== 0) {
        
        show1.style.display = "none";
        show2.style.display = "block";
        
        display_ques.innerHTML = selected_div.innerHTML;

        var subject_name = selected_div.firstChild.innerHTML;
        var ques_name = selected_div.lastChild.innerHTML;
        
        arrOfData.map(data => {
            if(data.subject === subject_name && data.question === ques_name)
                displayResponses(data);
        })
    }
}

function handleKey() {

    var inp = search_box.value.toUpperCase();

    var display_arr = [];

    for(var i = 0; i < new_div.length; i++) {
        var c = new_div[i].firstChild.innerHTML;
        if(c.toUpperCase().indexOf(inp) <= -1)
            new_div[i].style.display = "none";
        else {
            new_div[i].style.display = "";
            display_arr.push(c);
        }
    }

    if(display_arr.length === 0 && new_div.length !== 0)
        error.style.display = "block";
    
    else
        error.style.display = "none";
}

var json_string = localStorage.getItem("data");

if(json_string !== null) {

    var obj = JSON.parse(json_string);

    arrOfData = obj;

    arrOfData.map(data => {
        displayQuestion("ques",data.subject,data.question,query_box);
        displayResponses(data);
    })
}

query_box.addEventListener("click", function(event) {

    if(new_div.includes(event.target))
        selected_div = event.target;

    else if(new_div.includes(event.target.parentNode))
        selected_div = event.target.parentNode;

    handleClick(selected_div);
})

submit_btn.addEventListener("click", function() {

    var subject_input = document.getElementById("subject_input");
    var ques_input = document.getElementById("ques_input");
    
    if(subject_input.value === "" || ques_input.value === "")
        alert("The input fields should not be empty");
    
    else {

        displayQuestion("ques",subject_input.value,ques_input.value,query_box);

        arrOfData.push({"subject" : subject_input.value,"question" : ques_input.value, "response_arr" : []});

        var jsonStr = JSON.stringify(arrOfData);
        localStorage.setItem("data",jsonStr);

        document.getElementById("subject_input").value = "";
        document.getElementById("ques_input").value = "";
    }
})

submit_response.addEventListener("click", function() {

    var name_input = document.getElementById("name_input");
    var comment_input = document.getElementById("comment_input");

    if(name_input.value === "" || comment_input.value === "")
        alert("Please do not leave any field empty");

    else {
        
        response_heading.style.display = "block";

        var subject_name = selected_div.firstChild.innerHTML;
        var ques_name = selected_div.lastChild.innerHTML;

        arrOfData.map((data,key) => {
            if(data.subject === subject_name && data.question === ques_name) {
                data.response_arr.push({"name" : name_input.value, "comment" : comment_input.value});

                display_response.innerHTML = "";

                data.response_arr.map(val => {
                    displayQuestion("response",val.name,val.comment,display_response);
                })
            }
        })

        var jsonStr = JSON.stringify(arrOfData);
        localStorage.setItem("data",jsonStr);

        display_response.style.display = "block";

        document.getElementById("name_input").value = "";
        document.getElementById("comment_input").value = "";
    }   
})

resolve_btn.addEventListener("click", function() {

    query_box.removeChild(selected_div);

    var index = new_div.indexOf(selected_div);

    new_div.splice(index,1);

    var json_string = localStorage.getItem("data");
    var obj = JSON.parse(json_string);

    obj.splice(index,1);

    var str = JSON.stringify(obj);
    localStorage.setItem("data",str);

    show1.style.display = "block";
    show2.style.display = "none";
})

new_ques_btn.addEventListener("click", function() {

    show1.style.display = "block";
    show2.style.display = "none";
})
