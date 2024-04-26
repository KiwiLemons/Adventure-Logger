let user_id = "";

function setUser_id(value:string){
    user_id = value;
}

function getUser_id(){
    return user_id
}

export {getUser_id, setUser_id};