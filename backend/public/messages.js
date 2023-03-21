const socket = io();
const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const group_id = params.get("chanels");

const addUser = async () => {
    const response = await fetch(
        "http://localhost:4000/api/users/login",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                nick: username,
                password: "Password1",
            }),
        }
    );

    return response.json()
};

const response = async () => {
    const resp = await addUser()
    console.log(resp)
}

response()

const title = document.getElementById("title");
title.innerText = group_id;

document
    .getElementById("message_content")
    .addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            const message = event.target.value;

            socket.emit("message", {
                group_id,
                message,
            });

            event.target.value = "";
        }
    });

document.getElementById("exit").addEventListener("click", () =>{
    window.location.href = "  index.html"
})

socket.emit(
    "select_group",
    {
        group_id
    },
    (response) => {
        response.forEach(el => createMessage(el));
    }
);

socket.on("message", (data) => {
    createMessage(data);
});

socket.on("error", (data) => {
    console.log(data);
});

socket.on("feed-update", (data) => {
    console.log(data);
});

const createMessage = (data) => {
    const container = document.getElementById("messages");

    container.innerHTML += `
        <div>
            <span id="username" style="font-weight: 700">${data.username}</span>
            <span id="text">${data.text}</span>
            <span id="date">
                ${data.created_at.slice(0, 10).replace(/"-"/, "/")}
            </span>
        </div>
    `;
};


