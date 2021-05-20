// api相關
const url = 'https://vue3-course-api.hexschool.io';
const path = 'teach';

// dom
const adminInput = document.querySelector('.adminInput');
const adminOutput = document.querySelector('.adminOutput');
const inputName = document.querySelector('#inputName');
const inputPassword = document.querySelector('#inputPassword');

const loginBtn = document.querySelector('#loginBtn');
const logoutBtn = document.querySelector('#logoutBtn');

loginBtn.addEventListener('click', login);
logoutBtn.addEventListener('click', logout);

//登入
function login() {
    const username = inputName.value;
    const password = inputPassword.value;
    const admin = {
        username,
        password
    }
    axios.post(`${url}/admin/signin`, admin)
        .then(res => {
            const token = res.data.token;
            const expired = res.data.expired;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;
            console.log(token);
            checkLogin();
        })
};
// 登出
function logout() {
    axios.post(`${url}/logout`)
        .then(res => {
            if (res.data.success) {
                console.log(res);
                adminInput.classList.remove('d-none');
                adminOutput.classList.add('d-none');
                const productList = document.querySelector('#productList');
                productList.innerHTML = '';
            }
        });
};
// 檢查登入是否成功(切換畫面)
function checkLogin() {
    const myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = myCookie;

    // 確認是否登入
    axios.post(`${url}/api/user/check`)
        .then(res => {
            if (res.data.success) {
                adminInput.classList.add('d-none');
                adminOutput.classList.remove('d-none');
                app.getData();
            }
        })
}

const app = {
    data: {
        products: [],
    },
    getData() {
        axios.get(`${url}/api/${path}/admin/products`)
            .then(res => {
                if (res.data.success) {
                    this.data.products = res.data.products;
                    this.render();
                }
            });
    },
    render() {
        const productList= document.querySelector('#productList');
        let str="";
        this.data.products.forEach((item) =>{
            str+=`<tr>
            <td>${item.title}</td>
            <td>${item.origin_price}</td>
            <td>${item.price}</td>
            <td><img src="${item.imagesUrl}" alt="" style="width:100px"></td>
            <td><button class="btn btn-danger del" type="button" data-id="${item.id}">刪除</button></td>
          </tr>`
        });
        productList.innerHTML = str;

        const deleteBtns = document.querySelectorAll('.del');
        deleteBtns.forEach(item => {
          item.addEventListener('click', app.deleteProduct);
        })
    },
    deleteProduct(e) {
        // 事件物件
        const id = e.target.dataset.id;
        axios.delete(`${url}/api/${path}/admin/product/${id}`)
          .then(res => {
            app.getData();
          })

      }
}


