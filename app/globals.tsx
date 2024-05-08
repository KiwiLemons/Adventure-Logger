import AsyncStorage from '@react-native-async-storage/async-storage';

//let user_id = "";
//let route_id = 0;
//console.log("I'm run!")

function setUser_id(value:string){
    //user_id = value;
    storeData('user_id', value);
    //console.log(value)
}

function getUser_id(){
    //return user_id;
    return getData('user_id');
}

function setRoute_id(value:string){
    //route_id = value;
    storeData('route_id', value);
}

function getRoute_id(){
    //return route_id;
    return getData('route_id');
}

function delUser_id(){
    delData('user_id')
}

function delRoute_id(){
    delData('route_id')
}
export {getUser_id, setUser_id, setRoute_id, getRoute_id, delUser_id, delRoute_id};

async function storeData(key:string, value:string) {
    try {
        await AsyncStorage.setItem(key, value);
    }
    catch (e){
        console.log(e)
    }
}

async function getData(key:string){
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

async function delData(key:string) {
    try {
        await AsyncStorage.removeItem(key);
    }
    catch (e) {
        console.log(e);
    }
}