const app ={
    data:{
        products:[],
    },
    getData(){
        axios.get(`${url}/api/${path}/products?page=:page`)
        .then(res=>{
            if(res.data.success){
                this.data.products = res.data.products;
                this.render();
            }
        })
    },
    render(){
        const productsList = document.querySelector("#productList");
        let str="";
        this.data.products.forEach((item)=>{
            str+=`
            <tr>
                <td>${item.title}</td>
                <td>${item.origin_price}</td>
                <td>${item.price}</td>
                <td><input class="form-check-input" type="checkbox" id="is_enabled" ${item.is_enabled ? 'checked' : ''} data-action="status" data-id="${item.id}">
                <label class="form-check-label" for="is_enabled">${item.is_enabled ? '啟用' : '未啟用'}</label>
              </div></td>
                <td><button type="button" data-id="${item.id}" class="delBtn">刪除</button></td>
            </tr>
            `
        });
        productList.innerHTML = str;

        const delBtn = document.querySelectorAll('.delBtn');
        delBtn.forEach((item)=>{
            item.addEventListener('click',this.delProduct);
        })
    },
    delProduct(e){
        const id = e.target.dataset.id;
        axios.delete(`${url}/api/${path}/admin/product/${id}`)
        .then(res=>{
            app.getData();
        });
    },
    init(){
        // 取出cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;
        // 針對同一個站點
        axios.post(`${url}/api/user/check`)
        .then(res=>{
            console.log(res);
        });
        app.getData();
    }
}
window.onload=app.init;