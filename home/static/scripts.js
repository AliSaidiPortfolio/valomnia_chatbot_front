const sendChatBtn=document.querySelector(".chat-input span");
const chatInput=document.querySelector(".chat-input textarea");
const chatbox=document.querySelector(".chatbox");
const chatToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn");
const inputInitHeight=chatInput.scrollHeight;
let userMessage;
const createChatLi =(message,classeName)=>{
    // create a chat <li> element with passed message and classeNmae
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",classeName);

    let chatContent=classeName==="outgoing" ? `<p></p>` : `<span class= "material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi
}
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrfToken = getCookie('csrftoken');
console.log(csrfToken);
const  generateResponse=(incomingChatLi,csrfToken) =>{
    const messageElement=incomingChatLi.querySelector("p")



    const requestOptions={
        method:"POST",
        headers : {
            "Content-Type":"application/json",
            "X-CSRFToken": csrfToken,

        },
        body : JSON.stringify({
            message:userMessage
        })
    }

    fetch('http://127.0.0.1:8002/api/predict/',requestOptions).then(res=>res.json()).then(data=>{

        messageElement.textContent=data.answer
    }).catch((error)=>{
        messageElement.textContent=" i apologize , i don't understand you ,server porblem!!"
    })

//    console.log(requestOptions.body.messages)



}
const handleChat= () =>{
    userMessage=chatInput.value.trim();
    chatInput.value = '';
    if(!userMessage) return ;
    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage,"outgoing"))
    chatbox.scrollTo(0,chatbox.scrollHeight);
    // display thinking while waiting to the response
    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600)
}

chatInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleChat(); // Call the function when Enter key is pressed
    }
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  });

  chatToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"))
  // Add a click event listener to the button element
  sendChatBtn.addEventListener('click', handleChat);
  chatbotCloseBtn.addEventListener("click",()=>document.body.classList.remove("show-chatbot"))
