const userName =document.querySelector('#userName');
const userPass =document.querySelector('#userPass');
const logInBtn = document.querySelector('#logInBtn');

logInBtn.addEventListener('click',logIn);


// 取得token 將token存到cookie
function logIn(){
    const username = userName.value;
    const password = userPass.value;
    const data ={
        username,
        password
    };
    axios.post(`${url}/admin/signin`, data)
    .then(res=>{
        console.log(res);
        if(res.data.success){
            const token = res.data.token;
            const expired = res.data.expired;
            console.log(expired);
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
            window.location = '/index.html';
        }
    });
}
