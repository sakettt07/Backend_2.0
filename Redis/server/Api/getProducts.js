export const getProducts=()=>new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve({
            products:[
                {
                    id:1,
                    name:"product 1",
                    price:100
                },
                {
                    id:2,
                    name:"product 2",
                    price:200
                },
            ]
        })
    }, 2000);
})