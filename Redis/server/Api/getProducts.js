export const getProducts = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            products: [
                {
                    id: 1,
                    name: "product 1",
                    price: 100
                },
                {
                    id: 2,
                    name: "product 2",
                    price: 200
                },
            ]
        })
    }, 2000);
})

export const getProductDetail = (id) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            products: [
                {
                    id: id,
                    name: `product ${id}`,
                    price: Math.ceil(Math.random() *100)
                },
            ]
        })
    }, 2000);
})

